import os
from typing import List

class Settings:
    PROJECT_NAME: str = "SAFEGUARD AI"
    TAGLINE: str = "Detect. Understand. Stay Safe."
    VERSION: str = "2.1.0"
    API_PREFIX: str = "/api/py"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")
    
    # CORS Origins (allow production domain and localhost in development)
    ALLOWED_ORIGINS_RAW: str = os.getenv("ALLOWED_ORIGINS", "*")
    
    @property
    def CORS_ORIGINS(self) -> List[str]:
        if self.ALLOWED_ORIGINS_RAW.strip() == "*":
            return ["*"]
        return [o.strip() for o in self.ALLOWED_ORIGINS_RAW.split(",") if o.strip()]

    # Security & Networking
    REQUEST_TIMEOUT_SECONDS: float = float(os.getenv("REQUEST_TIMEOUT_SECONDS", "8.0"))
    MAX_UPLOAD_SIZE_BYTES: int = int(os.getenv("MAX_UPLOAD_SIZE_BYTES", "10485760"))  # 10 MB limit
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))

    # Optional External Security & Threat Intel API keys (loaded safely from env)
    VIRUSTOTAL_API_KEY: str = os.getenv("VIRUSTOTAL_API_KEY", "")
    GOOGLE_SAFE_BROWSING_KEY: str = os.getenv("GOOGLE_SAFE_BROWSING_KEY", "")
    AI_PROVIDER_API_KEY: str = os.getenv("AI_PROVIDER_API_KEY", "")

settings = Settings()
