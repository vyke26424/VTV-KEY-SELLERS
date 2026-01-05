# test_bot.py
import asyncio
from src.services.rag_service import RAGService
from src.services.rag_service import get_rag_service



async def main():
    rag = get_rag_service()
    
    # Test câu hỏi 1
    print("--- Câu 1 ---")
    q1 = "Bên bạn có nhân viên nào tên Thảo Quyên không ?"
    res1 = await rag.ask_bot(q1, history=[])
    print(f"Bot: {res1['answer']}")
    print(f"Bot : {res1['product_ids']}")
    
    # Test câu hỏi 2 (Có ngữ cảnh)
    print("\n--- Câu 2 (Context) ---")
    history = [
        {"role": "user", "content": q1},
        {"role": "model", "content": res1['answer']}
    ]
    q2 = "Giá của nó là bao nhiêu?" 
    res2 = await rag.ask_bot(q2, history=history)
    print(f"Bot: {res2['answer']}")

    c = rag.checklen()
    print(c)
if __name__ == "__main__":
    asyncio.run(main())