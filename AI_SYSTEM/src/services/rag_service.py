import google.generativeai as genai
import chromadb
from chromadb.utils import embedding_functions
import logging
from src.config import settings
import glob
import os
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from langchain_text_splitters import RecursiveCharacterTextSplitter
from src.database.models import Product
from sqlalchemy.orm import selectinload

logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

logger = logging.getLogger(__name__)
class RAGService : 
    def __init__(self):
        logger.info('Đang tiến hành khởi tạo embedding')
        try : 
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.llm = genai.GenerativeModel(model_name='gemma-3-27b-it')
            self.chroma_client = chromadb.PersistentClient(path='./chroma_db_data')
            self.embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="paraphrase-multilingual-MiniLM-L12-v2"
        )   
            self.text_splitters = RecursiveCharacterTextSplitter(
                chunk_size = 500,
                chunk_overlap=50,
                separators=["\n\n", "\n", " ", ""]
            )
            self.collection_name = 'vtv_key_sellers'
            self._init_collection()
        except Exception as e : 
            logger.error(f'Có lỗi xảy ra khi khởi tạo chromadb {e}', exc_info=True)



    def _init_collection (self) : 
        reset = settings.RESET_CHROMA_DB
        if reset : 
            try : 
                logger.warning(f'Đang tiến hành xóa collection {self.collection_name}')
                self.chroma_client.delete_collection(name=self.collection_name)
                logger.info(f'Đã xóa thành công {self.collection_name}')
            except Exception : 
                logger.info(f'Collection {self.collection_name} không tồn tại')

        self.collection = self.chroma_client.get_or_create_collection(
            name=self.collection_name,
            embedding_function=self.embedding_fn
        )
        logger.info (f'Đã tạo thành công {self.collection_name} ')


    def _process_batches(self, documents, metadatas, ids, batch_size = 100) : 
        total = len(documents)
        for i in range (0, total, batch_size) : 
            end = min(i+batch_size, total)
            try : 
                self.collection.upsert(
                    documents=documents[i : end],
                    metadatas=metadatas[i : end],
                    ids=ids[i : end]
                )
                logger.info(f'Đã nhúng thành công {end}/{total}')
            except Exception as e : 
                logger.warning(f'Lỗi nhúng dữ liệu {i} : {e}')


    def _load_policies_file(self) : 
        ids = []
        metadatas = []
        documents = []

        folder_path = 'data/policies'
        if not os.path.exists(folder_path) : 
            logger.warning(f'Không tìm thấy {folder_path}')
            return [], [], []
        files = glob.glob(f'{folder_path}/*.md')

        for file in files : 
            file_name = os.path.basename(file)
            try :  
                with open(file, "r", encoding="utf-8") as f : 
                    content = f.read()
                    if not content.strip() : continue

                    chunks = self.text_splitters.split_text(content)
                for i, chunk in enumerate(chunks) : 
                    documents.append(chunk)
                    metadatas.append({
                        "type" : "policy",
                        "source" : file_name,
                        "chunk_index" : i
                    })
                    ids.append(f"policy_{file_name}_part_{i}")
            except Exception as e : 
                logger.error(f"Lỗi đọc file {file_name} : {e}")
        return documents, metadatas, ids
        
    async def load_all_data(self, db : AsyncSession) : 
        logger.info('Bắt đầu quy trình nhúng dữ liệu')
        all_documents = []
        all_metadatas = []
        all_ids = []

        try : 
            stmt = (select(Product)
                .options(selectinload(Product.variants),
                selectinload(Product.keywords))
                .where(Product.isDeleted == False)
                .where(Product.isActive == True))
            retsult = await db.execute(stmt)
            products = retsult.scalars().all()
            for product in products : 
                variants_str= "Liên hệ để biết giá"
                if(product.variants and len(product.variants) > 0) :
                    lines = []
                    for v in product.variants : 
                        format_price = f"{v.price : ,.0f}"
                        lines.append(f"-{v.name} : {format_price}")
                    variants_str = "\n".join(lines)
                        
                p_keyword = product.keywords or ""
                p_description = product.description or ""
                p_meta = product.aiMetadata or ""
                rawtext = (
                    f"Sản phẩm : {product.name}\n"
                    f"Mã sản phẩm (Slug) : {product.slug}\n"
                    f"Mô tả chi tiết : {p_description}\n"
                    f"Từ khóa tìm kiếm: {p_keyword}\n"
                    f"Bảng giá và các gói đăng ký \n"
                    f"f{variants_str}\n"
                    f"Thông tin kỹ thuật (AI Metadata) : {p_meta}"
                )
                chunks = self.text_splitters.split_text(rawtext)
                for i, chunk in enumerate(chunks) : 
                    all_documents.append(chunk)
                    all_metadatas.append({
                        "type" : "Product",
                        "source" : "Database",
                        "name" : product.name,
                        "product_id" : str(product.id)
                    })
                    all_ids.append(
                        f"prod_{product.id}_chunk_{i}"
                    )
        except Exception as e : 
            logger.error(f'Load dữ liệu từ db thất bại : {e} ', exc_info=True)
            return  
        
        logger.info('Đang tiến hành đồng bộ tất cả dữ liệu')
        try : 
            docs,meta, ids = self._load_policies_file()
            all_documents.extend(docs)
            all_metadatas.extend(meta)
            all_ids.extend(ids)

            if all_documents : 
                logger.info(f'Đang tiến hành nhúng {len(all_documents)} documents')
                self._process_batches(all_documents, all_metadatas, all_ids, batch_size=100)  
                logger.info('Hoàn tất đồng bộ dữ liệu')
            else : 
                logger.warning('Không có dữ liệu nào để đồng bộ')
        except Exception as e : 
            logger.warning(f"Đồng bộ dữ liệu thất bại {e}")

    def _needs_rewrite(self, text : str) -> bool : 
        pronouns = ["nó", "đó", "này", "kia", "ấy", "cái gì", "bao nhiêu", "ở đâu", "trên", "dưới"]
        for word in pronouns :
            if word in text : 
                return True
        if len(text.split()) < 4 : 
            return True
        return False
    
    async def rewrite_query(self, user_question : str, history : list) : 
        if not history : return user_question 
        history_context = "\n".join([
            f"{msg['role']} : {msg['content']}" for msg in history[-5:]]
        )

        prompt = f"""
        Nhiệm vụ: Viết lại câu hỏi cuối cùng của người dùng cho rõ nghĩa để tìm kiếm trong Database.
        Thay thế các từ "nó", "cái này", "giá bao nhiêu" bằng tên sản phẩm cụ thể đã nhắc đến trước đó.
        Chỉ trả về câu hỏi đã viết lại. Không giải thích.
        
        Lịch sử chat:
        {history_context}
        
        Câu hỏi hiện tại: {user_question}
        """
        try : 
            response = self.llm.generate_content(prompt)
            return response.text.strip()
        except Exception : 
            return user_question
        
    async def ask_bot(self, user_question : str, history : list = [], intent : str = None ) :
        final_query = user_question 
        if history and self._needs_rewrite(user_question) : 
            logger.info(f"Phát hiện câu hỏi thiếu ngữ cảnh : {user_question}")
            final_query = await self.rewrite_query(user_question, history)
            logger.info(f"Câu hỏi mới {final_query}")
        else : 
            logger.info(f"Câu hỏi đã rõ ràng {user_question}")
        context_text = ""
        related_product_ids = []

        where_filter = {}
        if intent == "SUPPORT_RAG" : 
            where_filter = {"type" : "policy"}
        elif intent == "RECOMMENDATION"  :
            where_filter = {"type" : "Product"}
        
        try : 
            results = self.collection.query(
                query_texts=[final_query],
                n_results=5,
                where=where_filter
            )

            valid_docs  = []
            
            if results["documents"] and results["distances"] : 
                num_results = len(results["documents"][0])

                for i in range(num_results) : 
                    distance = results['distances'][0][i]
                    doc = results["documents"][0][i]
                    meta = results["metadatas"][0][i]
                    

                    logger.info(f"Tìm thấy: '{doc[:50]}...' - Distance: {distance}")

                    if distance < 0.8 : 
                        valid_docs.append(doc)
                        
                        if meta.get("type") == "Product" and "product_id" in meta : 
                            p_id = int(meta["product_id"])
                            if p_id not in related_product_ids : 
                                related_product_ids.append(p_id)
            else : 
                logger.info(f'Loại bỏ kết quả do distance cao : {distance}')
            if valid_docs : 
                context_text = "\n\n---\n\n".join(valid_docs)
            else : 
                context_text = "Không tìm thấy thông tin phù hợp"
        except Exception as e : 
            logger.error(f'Lỗi tìm kiếm vector : {e}')
            context_text = ''
        
        prompt = f"""
        Bạn là trợ lý ảo Vituvu.
        Dữ liệu tham khảo:
        {context_text}
        
        Yêu cầu:
        1. Trả lời câu hỏi dựa trên dữ liệu trên.
        2. Nếu không có dữ liệu phù hợp (context rỗng hoặc không liên quan), hãy nói khéo là bạn chưa có thông tin.
        3. Ngắn gọn, thân thiện.
        4. Không gửi kèm các kí tự xuống dòng 
        
        Câu hỏi: {user_question}
        Trả lời:
        """

        try : 
            response = self.llm.generate_content(prompt)
            bot_answer =  response.text
        except  Exception : 
            bot_answer = 'Xin lỗi hệ thống đang bận quá, hãy thử lại sau nhé!'

        return {
            "answer" : bot_answer,
            "product_ids" : related_product_ids[:3]
        }
        
rag_service_instance = None 

def get_rag_service() : 
    global rag_service_instance 
    if rag_service_instance is None : 
        rag_service_instance = RAGService()
    
    return rag_service_instance
if __name__ == "__main__" : 
    import asyncio 
    from src.database.database import SessionLocal, engine
    
    async def seed_data():
        print("--- BẮT ĐẦU QUÁ TRÌNH NHÚNG DỮ LIỆU ---")
        
        rag_service = RAGService()
        async with SessionLocal() as db:
            await rag_service.load_all_data(db)
            
        await engine.dispose()
        print("--- ĐÃ HOÀN TẤT ---")

    asyncio.run(seed_data())