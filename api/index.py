import sys
import os

# Ensure root directory is in sys.path so 'backend' package resolves cleanly in Vercel Serverless environment
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from backend.main import app

# Export app object for Vercel Serverless Function runner
__all__ = ["app"]
