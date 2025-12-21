from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float, DateTime, Table, Text, DECIMAL, JSON
from sqlalchemy.orm import relationship
from .database import Base


product_keywords_association = Table(
    '_ProductTokeywords', Base.metadata,
    Column('A', Integer, ForeignKey('Product.id'), primary_key=True), # A trỏ về Product
    Column('B', Integer, ForeignKey('keywords.id'), primary_key=True) # B trỏ về keywords
)

class User(Base) : 
    __tablename__ = "User"
    id = Column(String, primary_key=True)

class Category(Base) : 
    __tablename__ = "Category"
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    slug = Column(String(255))

    products = relationship("Product", back_populates="category")

class Keywords(Base):
    __tablename__ = "keywords" # Tên khớp với model Prisma (lưu ý bạn đặt lowercase)
    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True)
    
    # Thiết lập quan hệ ngược lại (optional)
    products = relationship("Product", secondary=product_keywords_association, back_populates="keywords")


class Product(Base) : 
    __tablename__ = "Product"
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    slug = Column(String(255))
    description = Column(Text)
    thumbnail = Column(String(255))

    aiMetadata = Column(JSON)
    avgRating = Column(Float)

    categoryId = Column(Integer, ForeignKey("Category.id"))
    category = relationship("Category", back_populates="products")
    variants = relationship("ProductVariant", back_populates="product")

    keywords = relationship("Keywords", secondary=product_keywords_association, back_populates="products")

    isActive = Column(Boolean)
    isDeleted = Column(Boolean)

class ProductVariant(Base) : 
    __tablename__ = "ProductVariant"
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    price = Column(DECIMAL(10,2))

    productId = Column(Integer, ForeignKey("Product.id"))
    product = relationship("Product", back_populates="variants")
    
    def __repr__(self) : 
        return f"Variant : {self.name}-{self.price}"

class OrderItem(Base):
    __tablename__ = "OrderItem"
    id = Column(Integer, primary_key=True)
    quantity = Column(Integer)
    variantId = Column(Integer, ForeignKey("ProductVariant.id"))
    # OrderId nếu cần join ngược
    orderId = Column(Integer, ForeignKey("Order.id"))

class Order(Base):
    __tablename__ = "Order"
    id = Column(Integer, primary_key=True)
    status = Column(String(50)) # PENDING, COMPLETED...
    createdAt = Column(DateTime)
    
    items = relationship("OrderItem")

# 6. USER INTERACTION (Để gợi ý thông minh)
class UserInteraction(Base):
    __tablename__ = "UserInteraction"
    id = Column(Integer, primary_key=True)
    userId = Column(String(255), ForeignKey("User.id"))
    productId = Column(Integer, ForeignKey("Product.id"))
    
    type = Column(String(50)) # VIEW, PURCHASE, LIKE
    duration = Column(Integer)
    meta = Column(JSON)
    createdAt = Column(DateTime)

# 7. REVIEW (Để Bot chém gió về chất lượng sản phẩm)
class Review(Base):
    __tablename__ = "Review"
    id = Column(Integer, primary_key=True)
    rating = Column(Integer)
    comment = Column(Text)
    productId = Column(Integer, ForeignKey("Product.id"))