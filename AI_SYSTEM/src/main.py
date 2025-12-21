
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from sqlalchemy.orm import selectinload

from src.schemas.chat_schema import ChatRequest, ChatResponse
from src.config import settings
from src.database.database import engine, get_db
from src.database.models import Product

from src.services import chat_orchestrator

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 AI Service is starting up...")
    yield
    print("🛑 AI Service is shutting down...")
    await engine.dispose() 

# 2. KHỞI TẠO APP
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Microservice AI cho Chatbot bán hàng (RAG + Recommendation)",
    version="1.0.0",
    docs_url="/docs",      
    lifespan=lifespan      
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(f"{settings.API_PREFIX}/health")
async def health_check():
    return {
        "status": "active",
        "service": settings.PROJECT_NAME,
        #"database_url": settings.DATABASE_URL.split("@")[1] 
    }


@app.get(f"{settings.API_PREFIX}/test-db-products")
async def test_database_connection(db: AsyncSession = Depends(get_db)):
    try:
        # Query thử 5 sản phẩm đầu tiên
        stmt = select(Product).options(selectinload(Product.variants)).limit(5)
        result = await db.execute(stmt)
        products = result.scalars().all()
        
        return {
            "message": "✅ Kết nối Database thành công!",
            "count": len(products),
            "data": [
                {"id": p.id, "name": p.name, "price": p.variants[0].price if p.variants else "N/A"} 
                for p in products
            ]
        }
    except Exception as e:
        return {"message": "❌ Lỗi kết nối Database rồi!", "error": str(e)}

@app.post(f"{settings.API_PREFIX}/ask", response_model=ChatResponse)
async def ask(request : ChatRequest, db : AsyncSession = Depends(get_db)) : 
    result = await chat_orchestrator.chat_orchestrator.handle_request(
        user_question=request.question,
        history=request.history,
        db=db
    )
    return result 


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="127.0.0.1", port=8000, reload=True)