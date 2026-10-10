import threading
from typing import List, Optional
from backend.schemas.analysis import AnalysisResponse

class HistoryStore:
    def __init__(self, max_items: int = 200):
        self._lock = threading.Lock()
        self._items: List[AnalysisResponse] = []
        self._max_items = max_items

    def add(self, item: AnalysisResponse):
        with self._lock:
            # Prepend newest first
            self._items.insert(0, item)
            if len(self._items) > self._max_items:
                self._items.pop()

    def get_all(self, filter_type: Optional[str] = None, limit: int = 50) -> List[AnalysisResponse]:
        with self._lock:
            if not filter_type or filter_type.lower() == "all":
                return list(self._items[:limit])
            return [i for i in self._items if i.type == filter_type or i.threatCategory == filter_type][:limit]

    def clear(self):
        with self._lock:
            self._items.clear()

history_store = HistoryStore()
