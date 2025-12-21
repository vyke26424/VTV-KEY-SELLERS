import sys
import os

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

from src.config import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    # in câu lệnh sql ra terminal 
    #echo=settings.DEBUG,
    
    pool_pre_ping=True, # kiểm tra kết nối còn sống trước khi dùng
    pool_recycle=3600, # tái tạo kết nối sau mỗi một giờ
    pool_size=10, # giữ sẵn 10 kết nối
    max_overflow=20 # tối đa 20 kết nối khi quá tải

)

SessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False
)

Base = declarative_base()

async def get_db() :
    async with SessionLocal() as session : 
        try : 
            yield session # cấp session cho API dùng
        except : 
            await session.rollback() # lỗi thì hoàn tác
            raise 
        finally : 
            await session.close() # dùng xong thì đóng