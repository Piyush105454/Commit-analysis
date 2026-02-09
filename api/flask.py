import sys
import os

# Add the project root to sys.path so we can import from python.main
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from python.main import app

# Vercel expects 'app' to be the entry point
# Since python/main.py already defines 'app = FastAPI()', we can just expose it here.
# For standard Vercel Python runtime, this works out of the box with FastAPI.
