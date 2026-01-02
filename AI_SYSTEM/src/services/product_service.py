from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from src.database.models import Product
from sqlalchemy.orm import selectinload

class ProductService: 
    async def search_product(self, db: AsyncSession, keywords: str):
        if not keywords: 
            return []
        try: 
            stmt = (select(Product)
                    .options(selectinload(Product.variants))
                    .where(or_(
                        Product.name.ilike(f"%{keywords}%"),
                        Product.slug.ilike(f"%{keywords}%"),
                        Product.keywords.any(name=keywords)

                    ))
                    .where(Product.isDeleted == False)
                    .where(Product.isActive == True)
                    .limit(3))
            result = await db.execute(stmt)
            product = result.scalars().all()
            return list(product)

        except Exception as e:
            print(f"Lỗi truy vấn python : {e} ")
            return [] 
        
    async def get_best_sellers(self, db : AsyncSession, limit : int  =5) :
        stmt = (select(Product.id,)
                .where(Product.isDeleted == False)
                .where(Product.isActive == True)
                .where(Product.isHot == True)
                .limit(limit))
        result = await db.execute(stmt)
        products = result.scalars().all()
        return list(products) 


product_service = ProductService()

if __name__ == "__main__": 
    import asyncio 
    from src.database.database import SessionLocal, engine
    async def main():
        async with SessionLocal() as db: 
            keywords = "netflix"
            print(f'Đang tìm kiếm kết quả cho {keywords}')
            result = await product_service.search_product(db, keywords)
            print(f'Kết quả ID tìm thấy: {result}')
        await engine.dispose()
    asyncio.run(main())