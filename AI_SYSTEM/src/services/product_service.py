from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload
from src.database.models import Product, ProductVariant



class ProductService : 
    async def search_product(self, db : AsyncSession, keywords : str) :
        if not keywords : 
            return []
        try : 
            stmt = (select(Product.id) 
                    .where(or_(
                        Product.name.ilike(f"%{keywords}%"),
                        Product.slug.ilike(f"%{keywords}%")
                    ))
                    .where(
                        Product.isDeleted == False
                    )
                    .where(Product.isActive == True)
                    .limit(5))
            result = await db.execute(stmt)
            product_ids = result.scalars().all()
            return list(product_ids)

        except Exception as e :
            print(f"Lỗi truy vấn python : {e} ")
            return [] 

product_service = ProductService()

if __name__ == "__main__" : 
    import asyncio 
    from src.database.database import SessionLocal, engine
    async def main() :
        async with SessionLocal() as db : 
            keywords = "netflix"
            print(f'Đang tìm kiếm kết quả cho {keywords}')
            result = await product_service.search_product(db, keywords)
            print('Kết quả tìm thấy')
            for p in result : 
                print(f"ID : {p['id']} | Name : {p['name']} | Price : {p['price']}")
        await engine.dispose()
    asyncio.run(main())