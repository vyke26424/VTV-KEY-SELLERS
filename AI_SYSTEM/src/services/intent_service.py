import google.generativeai as genai
from src.config import settings
import json
import re
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
        self.safety_settings = [
                {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        ]
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
            Bạn là AI phân loại ý định cho shop bán key tài khoản (Netflix_premium, Youtube advance, ...).
            Hãy cố gắng trả về đúng tên sản phẩm nếu đó là tên của một sản phẩm, còn không thì không cần trả về tên.
            Nếu tên sản phẩm là các từ mà người dùng hay nhầm lẫn như dutube, diu túp, ytb, nét phờ líc,... thì hãy chuẩn hóa
            lại thành tên chuẩn như youtube, netflix,...
            Trả về JSON thuần theo định dạng sau.
            
            DANH SÁCH INTENT:
            1. SEARCH_PRODUCT: Tìm mua, hỏi giá (VD : "Acc netflix giá sao").
            LƯU Ý : Nếu user hỏi chung chung "có gì bán không", "danh sách sản phẩm" -> gán là RECOMENDATION để RAG xử lý
            2. SUPPORT_RAG: Hỏi cách dùng, báo lỗi (VD : "Không đăng nhập được").
            3. ORDER_TRACKING: Hỏi đơn hàng (VD : "Đơn ORD123 chưa có key").
            4. RECOMMENDATION: Nhờ tư vấn (VD : "Nên dùng gói nào").
            5. GREETING: Chào hỏi.

            VÍ DỤ MẪU:
            - "Acc netflix giá sao" -> {{"intent": "SEARCH_PRODUCT", "entities": {{"product": "netflix", "duration": null, "order_id": null}}}}
            - "Đơn #ORD123 xong chưa" -> {{"intent": "ORDER_TRACKING", "entities": {{"product": null, "duration": null, "order_id": "#ORD123"}}}}
            
            YÊU CẦU: Chỉ trả về JSON.
            User Input: "{user_text}"
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
    