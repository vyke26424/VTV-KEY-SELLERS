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
        
    async def get_recommendations_for_user(self, db: AsyncSession, user_id: str, limit: int = 5):
        """
        Lấy danh sách sản phẩm được gợi ý từ bảng UserRecommendation
        """
        if not user_id:
            return []
            
        # Sử dụng Raw SQL để Join bảng UserRecommendation với Product
        # Lấy ra tên và slug để Chatbot có tư liệu chém gió
        stmt = text("""
            SELECT p.id, p.name, p.slug
            FROM UserRecommendation ur
            JOIN Product p ON ur.productId = p.id
            WHERE ur.userId = :user_id
            ORDER BY ur.score DESC
            LIMIT :limit
        """)
        
        try:
            # Thực thi query bất đồng bộ
            result = await db.execute(stmt, {"user_id": user_id, "limit": limit})
            rows = result.fetchall()
            
            # Chuyển đổi kết quả từ Row Tuple sang List Dictionary
            products = []
            for row in rows:
                products.append({
                    "id": row.id,   # Truy cập theo tên cột
                    "name": row.name,
                    "slug": row.slug
                })
            
            return products
            
        except Exception as e:
            print(f"❌ Lỗi lấy recommendation: {e}")
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