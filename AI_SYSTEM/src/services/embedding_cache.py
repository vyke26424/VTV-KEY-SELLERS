
from sentence_transformers import SentenceTransformer
import logging

logger = logging.getLogger(__name__)

class EmbeddingModelCache:
    _instance = None
    _model = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def get_model(self, model_name: str = 'AITeamVN/Vietnamese_Embedding'):
        if self._model is None:
            logger.info(f'🔄 Loading embedding model: {model_name}...')
            self._model = SentenceTransformer(model_name)
            logger.info('✅ Model loaded successfully')
        return self._model

# Global instance
embedding_cache = EmbeddingModelCache()