# FILE: AI_SYSTEM/src/services/recommendation_job.py
import sys
import pandas as pd
import numpy as np
from sqlalchemy import create_engine, text
from pathlib import Path
from sklearn.metrics.pairwise import cosine_similarity

# --- SETUP ĐƯỜNG DẪN CONFIG ---
current_file = Path(__file__).resolve()
project_root = current_file.parent.parent.parent
sys.path.append(str(project_root))

try:
    from src.config import settings
except ImportError:
    print("Không tìm thấy config. Chạy từ root AI_SYSTEM.")
    sys.exit(1)

def run_collaborative_filtering():
    print("--- BẮT ĐẦU CHẠY COLLABORATIVE FILTERING ---")
    
    # 1. KẾT NỐI DB
    db_url = settings.DATABASE_URL.replace("mysql+aiomysql", "mysql+pymysql")
    try:
        engine = create_engine(db_url)
        print(f"🔌 Connected to DB: {settings.PROJECT_NAME}")
    except Exception as e:
        print(f"DB Connection Error: {e}")
        return

    # 2. LẤY DỮ LIỆU TƯƠNG TÁC
    # Lấy tổng điểm của user với mỗi sản phẩm
    query = """
        SELECT userId, productId, SUM(score) as rating 
        FROM UserInteraction 
        GROUP BY userId, productId
    """
    df = pd.read_sql(query, engine)

    if df.empty:
        print("Chưa có đủ dữ liệu để chạy AI.")
        return

    print(f"Dữ liệu thô: {len(df)} dòng tương tác.")

    # ---------------------------------------------------------
    # 3. THUẬT TOÁN COLLABORATIVE FILTERING (User-Based)
    # ---------------------------------------------------------
    
    # Bước 3.1: Tạo Ma trận User-Item (Hàng là User, Cột là Product)
    # Giá trị là điểm rating (Nếu chưa tương tác thì là 0)
    user_item_matrix = df.pivot_table(index='userId', columns='productId', values='rating').fillna(0)
    
    print(f"Kích thước ma trận: {user_item_matrix.shape} (Users x Products)")

    # Nếu chỉ có 1 user thì không tìm được người giống, fallback về gợi ý Top Trending
    if user_item_matrix.shape[0] < 2:
        print("Cần ít nhất 2 User để so sánh sở thích. Đang chạy fallback...")
        return

    # Bước 3.2: Tính độ tương đồng giữa các User (Cosine Similarity)
    # Kết quả là ma trận User x User (User A giống User B bao nhiêu điểm trên thang 0-1)
    user_similarity = cosine_similarity(user_item_matrix)
    user_sim_df = pd.DataFrame(user_similarity, index=user_item_matrix.index, columns=user_item_matrix.index)

    # Bước 3.3: Dự đoán điểm số cho các sản phẩm mà User CHƯA MUA
    recommendations_list = []
    
    # Duyệt qua từng User để tìm gợi ý
    for user_id in user_item_matrix.index:
        # Lấy các user khác (bỏ qua chính mình) và độ giống nhau
        similar_users = user_sim_df[user_id].drop(user_id).sort_values(ascending=False)
        
        # Lấy Top 5 user giống nhất (Hàng xóm)
        top_similar_users = similar_users.head(5)
        
        # Xem "Hàng xóm" đã mua gì mà mình chưa mua
        # Logic: Điểm gợi ý = Tổng (Điểm của hàng xóm * Độ giống nhau)
        
        # Lấy lịch sử mua của các hàng xóm
        neighbor_ratings = user_item_matrix.loc[top_similar_users.index]
        
        # Tính điểm dự đoán trọng số (Weighted Score)
        # (Sản phẩm nào nhiều hàng xóm mua + hàng xóm đó rất giống mình => Điểm cao)
        weighted_scores = neighbor_ratings.T.dot(top_similar_users)
        
        # Chuẩn hóa điểm (Chia cho tổng độ giống) - Optional
        sum_similarity = top_similar_users.sum()
        if sum_similarity > 0:
            predicted_scores = weighted_scores / sum_similarity
        else:
            predicted_scores = weighted_scores # Không có ai giống thì điểm = 0
            
        # Loại bỏ những sản phẩm User này ĐÃ mua/xem rồi (Vì gợi ý cái mới mà)
        # (Nếu bạn muốn gợi ý mua lại thì bỏ dòng này đi)
        user_interacted_products = user_item_matrix.loc[user_id]
        products_already_seen = user_interacted_products[user_interacted_products > 0].index
        
        final_recommendations = predicted_scores.drop(products_already_seen, errors='ignore').sort_values(ascending=False)
        
        # Lấy Top 10 sản phẩm điểm cao nhất
        top_10 = final_recommendations.head(10)
        
        import datetime
        now = datetime.datetime.now()
        
        for product_id, score in top_10.items():
            if score > 0: # Chỉ lấy cái nào có điểm > 0
                recommendations_list.append({
                    'userId': user_id,
                    'productId': int(product_id), # Ép kiểu về int cho chắc
                    'score': float(score),        # Ép kiểu float
                    'updatedAt': now
                })

    # ---------------------------------------------------------
    # 4. LƯU VÀO DATABASE
    # ---------------------------------------------------------
    if not recommendations_list:
        print("Không tìm thấy gợi ý nào mới (Do dữ liệu quá ít hoặc user đã mua hết rồi).")
        return

    result_df = pd.DataFrame(recommendations_list)
    
    try:
        with engine.connect() as con:
            print("🧹 Dọn dẹp bảng UserRecommendation cũ...")
            con.execute(text("TRUNCATE TABLE UserRecommendation;"))
            con.commit()
        
        print(f"Đang lưu {len(result_df)} gợi ý thông minh...")
        result_df.to_sql('UserRecommendation', engine, if_exists='append', index=False)
        print("HOÀN THÀNH: Đã kết nối những tâm hồn đồng điệu!")
        
    except Exception as e:
        print(f"Lỗi lưu DB: {e}")

if __name__ == "__main__":
    run_collaborative_filtering()