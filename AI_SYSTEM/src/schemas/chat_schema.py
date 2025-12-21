from pydantic import BaseModel
from typing import List, Optional, Any

class ChatRequest (BaseModel) : 
    question : str
    history : list[dict[str, Any]] = []

class ChatResponse(BaseModel) : 
    intent : str
    answer : str
    product_ids : list[int] = []