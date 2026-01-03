import google.generativeai as genai
from src.config import settings
import json
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from typing import Dict, Any

class IntentService : 
    def __init__(self, model : str =None) : 
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.generation_config = {
               # "temperature": 0.1,        # bớt sáng tạo
               # "top_p": 0.8,
               # "top_k": 20,
                "max_output_tokens": 256,
              #  "response_mime_type": "application/json", 
        }
        self.safety_settings = {
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE, 
}
        if(model is None) : 
            
            self.model = genai.GenerativeModel(model_name='gemma-3-27b-it', 
                                               generation_config=self.generation_config,
                                                safety_settings= self.safety_settings)
        else : 
            self.model = genai.GenerativeModel(model_name=model, 
                                               generation_config=self.generation_config,
                                               safety_settings= self.safety_settings)
    async def detectIntent(self, user_text : str) -> dict :
        try : 
            prompt = f"""
            Bạn là chuyên gia phân loại ý định (NLU) cho hệ thống bán tài khoản số VTV_KEY.
            
            NHIỆM VỤ CỦA BẠN:
            Phân tích câu nói của người dùng và trả về JSON duy nhất.

            QUY TRÌNH SUY LUẬN (Làm ngầm, không in ra):
            1. Xác định đối tượng được nhắc đến: Là "Bot/AI" (danh tính) hay là "Sản phẩm" (hàng hóa).
            2. Nếu là hàng hóa: Người dùng đã gọi ĐÚNG TÊN (Netflix, ChatGPT) hay chỉ gọi DANH MỤC (App xem phim, AI)?
            3. Chọn Intent phù hợp nhất từ danh sách dưới đây.

            DANH SÁCH INTENT :
            
            1. SEARCH_PRODUCT:
               - Khi người dùng muốn MUA, HỎI GIÁ, HỎI THÔNG TIN của một SẢN PHẨM CỤ THỂ.
               - Dấu hiệu: Có tên sản phẩm rõ ràng (Netflix, Youtube, Spotify, ChatGPT, Key Win...).
               - VD: "Giá Netflix", "Mua acc ChatGPT", "Youtube Premium bao tiền".

            2. RECOMMENDATION:
               - Hỏi tư vấn chung ("Nên mua gì", "Shop có gì").
               - Hỏi theo DANH MỤC ("Có phần mềm AI không").
               - Hỏi SO SÁNH GIÁ / TÍNH CHẤT ("Cái nào đắt nhất", "Cái nào rẻ nhất", "Sản phẩm nào giá cao nhất").

            3. GET_BEST_SELLER:
               - Chỉ dùng khi user hỏi về DOANH SỐ, ĐỘ PHỔ BIẾN, HOT TREND.
               - Keywords: "bán chạy nhất", "nhiều người mua", "hot nhất", "phổ biến".
               - LƯU Ý: "Đắt nhất" hay "Rẻ nhất" KHÔNG PHẢI là Best Seller.

            4. SUPPORT_RAG:
               - Hỏi quy trình: Cách thanh toán, bảo hành, hoàn tiền, lỗi đăng nhập.
               - VD: "Thanh toán qua momo được không", "Làm sao để nhập key".

            5. ORDER_TRACKING:
               - Hỏi trạng thái đơn hàng (thường kèm mã đơn).
               - VD: "Đơn #123 xong chưa".

            6. GREETING:
               - Chào hỏi xã giao.
               - Hỏi về DANH TÍNH CỦA BOT.
               - VD: "Hi shop", "Bạn là ai", "Bạn có phải ChatGPT không", "Ai tạo ra bạn".

            LUẬT ĐẶC BIỆT (Tránh Hallucination):
            - Nếu user hỏi "Bạn là ChatGPT à?" -> GREETING (Hỏi danh tính).
            - Nếu user hỏi "Bán acc ChatGPT không?" -> SEARCH_PRODUCT (Hỏi mua hàng).
            - Nếu user nhắc "Google" (VD: Acc Google Drive) -> Trả về product: "google drive". KHÔNG được tự sửa thành "youtube".
            - Chuẩn hóa tên sản phẩm: "nét flix" -> "netflix", "ytb" -> "youtube", "chat gpt" -> "chatgpt".

            INPUT NGƯỜI DÙNG: "{user_text}"

            OUTPUT JSON FORMAT (Bắt buộc):
            {{
                "intent": "TÊN_INTENT_VIẾT_HOA",
                "entities": {{
                    "product": "tên_sản_phẩm_chuẩn_hóa_hoặc_null",
                    "order_id": "mã_đơn_hàng_hoặc_null"
                }}
            }}
            """
            respone = self.model.generate_content(prompt)
            raw_text = respone.text.strip()
            clean_text = raw_text.replace("```json", "").replace("```", "").strip()
            result = json.loads(clean_text)
            defult_result = {
                "intent" : "GREETING",
                "entities" : {
                    "product" : None,
                    "duration" : None,
                    "order_id" : None
                }
            }
            final_result = defult_result | result
            return final_result 
        except Exception as e : 
            print(f"Có lỗi xảy ra {e} | Raw : {raw_text if 'raw_text' in locals() else None} ")
            return { 
                "intent" : None,
                "entities" : {}
            }
    
intent_service = IntentService()
if __name__ == "__main__" : 
    import asyncio
    async def main() : 
        intent_service = IntentService()
        prompt = "Nên dùng gói nào giá rẻ nhỉ ?"
        result =  await intent_service.detectIntent(prompt)
        print(result)
    asyncio.run(main())
    