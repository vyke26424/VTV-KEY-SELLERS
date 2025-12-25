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
        self.greeting = 'GREETING'
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(model_name='gemma-3-27b-it')
        

    async def handle_request(self, user_question : str, history : list, db : AsyncSession) : 
        intent_result = await self.intent_service.detectIntent(user_question)

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
            product_ids = await self.product_service.search_product(db, product_name) 
            if product_ids : 
                response['intent'] = self.search_prod
                response['answer'] = 'Bên mình có một số sản phẩm tương tự như tìm kiếm của bạn nè'
                response['product_ids'] = product_ids
        elif intent == self.support or intent == self.recommendation : 
            result = await self.rag_service.ask_bot(user_question, history,)
            product_ids = result['product_ids'] 
            if len(product_ids) > 0 : 
                response['intent'] = intent
                response['answer'] = result['answer']
                response['product_ids'] = result['product_ids']
            else : 
                response['intent'] = self.support 
                response['answer'] = result['answer']
            
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
        user_question = 'shop có phần mềm chỉnh sửa ảnh không'
        history = []
        result  = await or_service.handle_request(user_question, history, db)
        print(result)
    await engine.dispose()
if __name__ =="__main__" : 
    import asyncio 
    asyncio.run(main())
