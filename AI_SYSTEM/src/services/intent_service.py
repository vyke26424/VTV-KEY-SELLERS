import google.generativeai as genai
from src.config import settings
import json
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from typing import Dict, Any, Optional
from src.services.embedding_cache import embedding_cache
import numpy as np
import os
import hashlib
from sentence_transformers import SentenceTransformer
import redis
from redis.commands.search.field import TextField, VectorField

from redis.commands.search.index_definition import IndexDefinition, IndexType

from redis.commands.search.query import Query


REDIS_HOST = "localhost"
REDIS_PORT = int(6379)

EMBEDDING_MODEL_NAME = 'AITeamVN/Vietnamese_Embedding'
VECTOR_DIM = 1024
INDEX_NAME = 'intent_cache_1024_idx'

class SemanticCache :
    def __init__(self):
        try : 
            self.r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=False)
            self.r.ping()
            print('Kết nối Redis thành công')
        except Exception as e : 
            print(f'Kết nối Redis thất bại {e}')
            raise e
        print(f'Cache loading model {EMBEDDING_MODEL_NAME}')
        self.model =embedding_cache.get_model('AITeamVN/Vietnamese_Embedding')
        real_dim = self.model.get_sentence_embedding_dimension()
        if real_dim != VECTOR_DIM : 
            print(f"⚠️ [WARNING] Config là {VECTOR_DIM} nhưng model là {real_dim}. Đang tự động fix...")
            self.vector_dim = real_dim
        else : 
            self.vector_dim = VECTOR_DIM
        print ('Load cache model thành công')

        self._create_index()

    def _create_index (self) : 
        try : 
            info = self.r.ft(INDEX_NAME).info()
            print(f'Redis index {INDEX_NAME} đã tồn tại')
        except  : 
            print('Đang tạo một index mới ')
            schema = (
                TextField("original_query"),
                TextField("response_json"),
                VectorField("embedding",
                        "FLAT", {
                            "TYPE" : "FLOAT32",
                            "DIM" : self.vector_dim,
                            "DISTANCE_METRIC" : "COSINE"
                        }
                            )
            )
            definition = IndexDefinition(prefix=["intent:"], index_type=IndexType.HASH)
            self.r.ft(INDEX_NAME).create_index(schema, definition=definition)
    
    def get_embedding(self, text : str) -> bytes : 
        vector = self.model.encode(text)
        vector_np = np.array(vector)
        return vector_np.astype(np.float32).tobytes()
    
    def check_cache(self, user_query : str, thresold : float = 0.15) -> Optional[Dict] : 
        try : 
            query_vector = self.get_embedding(user_query)
            q = Query(f"*=>[KNN 1 @embedding $vec AS score]")\
                .return_fields("response_json", "score", "original_query")\
                .sort_by("score")\
                .dialect(2)
            params = {"vec" : query_vector}
            results = self.r.ft(INDEX_NAME).search(q, query_params=params)
            if results.docs : 
                doc = results.docs[0]
                score = float(doc.score)
                print(f"   🔎 [Cache Check] '{user_query}' ~= '{doc.original_query}' (Score: {score:.4f})")
                if score < thresold : 
                    return json.loads(doc.response_json)
            return None
        except Exception as e : 
            print(f'Cache ERROR {e}')
            return None
    def set_cache(self, user_query : str, response_data : Dict, ttl : int = 3600) : 
        try : 
            vector = self.get_embedding(user_query)
            query_hash = hashlib.md5(user_query.encode('utf-8')).hexdigest()
            key = f"intent:{query_hash}"
            pipe = self.r.pipeline()
            pipe.hset(key, mapping={
            "original_query": user_query,
            "response_json": json.dumps(response_data, ensure_ascii=False),
            "embedding": vector
            })
            pipe.expire(key, ttl)
            pipe.execute()

            print(f"✅ [Cache Saved] Đã lưu cache cho: '{user_query}' (TTL: {ttl}s)")
        except Exception as e:
            print(f"⚠️ [Cache Save Error] {e}")

class IntentService : 
    def __init__(self, model : str =None) : 
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.cache = SemanticCache()
        self.generation_config = {
               # "temperature": 0.1,        # bớt sáng tạo
               # "top_p": 0.8,
               # "top_k": 20,
                "max_output_tokens": 512,
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
               -...v.v

            3. GET_BEST_SELLER:
               - Chỉ dùng khi user hỏi về DOANH SỐ, ĐỘ PHỔ BIẾN, HOT TREND,....
               - Keywords: "bán chạy nhất", "nhiều người mua", "hot nhất", "phổ biến".
               - LƯU Ý: "Đắt nhất" hay "Rẻ nhất" KHÔNG PHẢI là Best Seller.

            4. SUPPORT_RAG:
               - Hỏi quy trình: Cách thanh toán, bảo hành, hoàn tiền, lỗi đăng nhập, thông tin về web,....
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
            - Nếu user hỏi "Sản phẩm này, web này,.. do ai viết ra" -> SUPPORT_RAG (Hỏi về thông tin của web)
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

            defult_result = {
                "intent" : "GREETING",
                "entities" : {
                    "product" : None,
                    "duration" : None,
                    "order_id" : None
                }
            }

            cached = self.cache.check_cache(user_text)
            if cached : 
                print(f'[Cached] {user_text}')
                return defult_result | cached
            
            print(f"🐢 [CACHE MISS] '{user_text}' -> Calling AI...")

            respone = await self.model.generate_content_async(prompt)
            raw_text = respone.text.strip()
            clean_text = raw_text.replace("```json", "").replace("```", "").strip()
            result = json.loads(clean_text)
            
            final_result = defult_result | result
            if final_result.get("intent") : 
                self.cache.set_cache(user_text, final_result)
 
            return final_result 
        except Exception as e : 
            print(f"Có lỗi xảy ra {e} | Raw : {raw_text if 'raw_text' in locals() else None} ")
            return { 
                "intent" : None,
                "entities" : {}
            }
    
#intent_service = IntentService()
if __name__ == "__main__" : 
    import asyncio
    async def main() : 
        #intent_service = IntentService()
        prompt = "Nên dùng gói nào giá rẻ nhỉ ?"
       # result =  await intent_service.detectIntent(prompt)
        #print(result)
    asyncio.run(main())
    