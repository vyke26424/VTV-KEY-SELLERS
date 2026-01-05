from src.services.intent_service import IntentService
from src.services.product_service import ProductService
from src.services.rag_service import RAGService
from sqlalchemy.ext.asyncio import AsyncSession
import logging
import google.generativeai as genai
from src.config import settings


from src.database.database import SessionLocal, engine

#   DANH SÁCH INTENT:
#             1. SEARCH_PRODUCT: Tìm mua, hỏi giá (VD : "Acc netflix giá sao").
#             LƯU Ý : Nếu user hỏi chung chung "có gì bán không", "danh sách sản phẩm" -> gán là RECOMENDATION để RAG xử lý
#             2. SUPPORT_RAG: Hỏi cách dùng, báo lỗi (VD : "Không đăng nhập được").
#             3. ORDER_TRACKING: Hỏi đơn hàng (VD : "Đơn ORD123 chưa có key").
#             4. RECOMMENDATION: Nhờ tư vấn (VD : "Nên dùng gói nào").
#             5. GREETING: Chào hỏi.



logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

logger = logging.getLogger(__name__)

class ChatOrchestrator : 
    def __init__(self,):
        self.intent_service = IntentService()
        self.product_service = ProductService()
        self.rag_service = RAGService()

        self.search_prod = 'SEARCH_PRODUCT'
        self.support = "SUPPORT_RAG"
        self.track_order = 'ORDER_TRACKING'
        self.recommendation = 'RECOMMENDATION'
        self.best_sellers = "GET_BEST_SELLER"
        self.greeting = 'GREETING'
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(model_name='gemma-3-27b-it')
        #self.model = genai.GenerativeModel(model_name='gemini-2.5-flash')
        

    async def handle_request(self, user_question : str, history : list, db : AsyncSession) : 
        final_question = user_question

        if history and self.rag_service._needs_rewrite(user_question) :
            final_question = await self.rag_service.rewrite_query(user_question, history)
            logger.info(f'Câu hỏi gốc : {user_question}- Câu hỏi được viết lại : {final_question}')
        intent_result = await self.intent_service.detectIntent(final_question)

        intent = intent_result.get("intent") or "SUPPORT_RAG"
        entities = intent_result.get("entities", {})
        product_name = entities.get("product")

        logger.info(f"Intent : {intent} | Product : {product_name}")

        response = {
            "intent" : self.support,
            "answer" : "Xin lỗi, mình chưa hiểu ý bạn",
            "product_ids" : [],
            
        }

        if intent == self.search_prod : 
            products = await self.product_service.search_product(db, product_name) 
            if products  : 
                product_info_context = ""
                product_ids = []

                for p in products : 
                    product_ids.append(p.id)
                    variants_str = "Liên hệ để biết giá"
                    if p.variants : 
                        v_list = []
                        for v in p.variants :
                            v_list.append(f"{v.name} Giá : {v.price:,.0f}vnđ")
                            variants_str = ", ".join(v_list)
                        product_info_context = f"- Sản phẩm: {p.name}\n  Các gói: {variants_str}\n  Mô tả: {p.description or 'Không có mô tả'}\n\n"

                prompt_answer = f"""
                    Bạn là nhân viên tư vấn VTV_KEY.
                    Khách hàng hỏi: "{final_question}"
                    
                    Dữ liệu hệ thống tìm thấy:
                    {product_info_context}
                    
                    YÊU CẦU:
                    - Trả lời câu hỏi của khách dựa trên dữ liệu trên.
                    - Nếu khách hỏi giá, hãy báo giá cụ thể các gói.
                    - Giọng điệu thân thiện, mời chào mua hàng.
                    
                    """
                ai_response = await self.model.generate_content_async(prompt_answer)
                response['intent'] = self.search_prod
                response['answer'] = ai_response.text.strip()
                response['product_ids'] = product_ids
            else : 
                logger.info('Tìm kiếm từ database thất bại, chuyển qua rag')
                result = await self.rag_service.ask_bot(user_question, history, intent='RECOMMENDATION')
                response['intent'] = self.recommendation
                response['answer'] = result['answer']
                response['product_ids'] = result['product_ids']

        elif intent == self.best_sellers : 
            product_ids = await self.product_service.get_best_sellers(db)
            response['intent'] = self.best_sellers
            response['answer'] = 'Dưới đây là những sản phẩm đang làm mưa làm gió tại shop của mình nè, bạn tham khảo thử nha '
            response['product_ids'] = product_ids
        elif intent == self.support or intent == self.recommendation : 
            result = await self.rag_service.ask_bot(user_question, history,intent=intent)
            product_ids = result['product_ids'] 
            if intent == self.recommendation : 
                if len(product_ids) > 0 : 
                    response['intent'] = intent
                    response['answer'] = result['answer']
                    response['product_ids'] = result['product_ids']
                else : 
                    response['intent'] = self.support 
                    response['answer'] = result['answer']
            else : 
                response['intent'] = self.support
                response['answer'] = result['answer']
                response['product_ids'] = []
        elif intent == self.track_order : 
            response['intent'] = self.track_order
            response['answer'] = 'Hiện tại tính năng này sẽ được tụi mình phát triển sau, mong bạn thông cảm nha, yêu yêu'
            

        else : 
            prompt = f""" Bạn là một AI cho chatbox vituvu, khi người dùng hỏi những câu không liên quan
            như chào hỏi, hoặc hỏi kiến thức bên ngoài thì nếu có thể hãy gợi ý về sản phẩm của shop hoặc shop cho hợp
            lí. Tên shop là "VTV_KEY". Nhớ hãy thật hợp lí chứ không phải bất chấp.
             Đây là gợi ý cho bạn : "
             user : "bạn biết Bùi Anh Tuấn không",
             model : "Bùi Anh Tuấn là một ca sĩ nổi tiếng ở Việt Nam, được biết đến với nhiều hit và giọng hát ấm áp.
             Bạn có thích nghe nhạc của anh ấy không? Nếu bạn có thì bên mình có bán key của youtube và netflix bản plus
             để giúp bạn nghe nhạc của anh ấy một cách thật trọn vẹn và thoải mái nhất đấy!"
             " 
             Yêu cầu : "Không gửi kèm theo ký tự xuống dòng nhé"
             Câu hỏi người dùng : {user_question}
             """
            answer = await self.model.generate_content_async(prompt)
            result = answer.text.strip()

            response['intent'] = self.greeting
            response['answer'] = result
        return response
    

chat_orchestrator = ChatOrchestrator()


async def main() : 
    async with SessionLocal() as db : 
        or_service = ChatOrchestrator()

        user_question = ' chính sách bảo hành như nào vậy?'

        history = []
        result  = await or_service.handle_request(user_question, history, db)
        print(result)
    await engine.dispose()
if __name__ =="__main__" : 
    import asyncio 
    asyncio.run(main())
