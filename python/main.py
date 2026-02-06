from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from yt_dlp import YoutubeDL
import os
import pickle

app = FastAPI()

# Allow your frontend (Next.js) to access the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Load ML artifacts if available ---
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
VECTORIZER = None
MODEL = None
LABEL_ENCODER = None

def load_models():
    global VECTORIZER, MODEL, LABEL_ENCODER
    try:
        vec_path = os.path.join(MODEL_DIR, "tfidf_vectorizer.pkl")
        model_path = os.path.join(MODEL_DIR, "Random Forest.pkl")
        le_path = os.path.join(MODEL_DIR, "label_encoder.pkl")

        if os.path.exists(vec_path):
            with open(vec_path, "rb") as f:
                VECTORIZER = pickle.load(f)
        if os.path.exists(model_path):
            with open(model_path, "rb") as f:
                MODEL = pickle.load(f)
        if os.path.exists(le_path):
            with open(le_path, "rb") as f:
                LABEL_ENCODER = pickle.load(f)
    except Exception as e:
        # keep failures silent; endpoints will report missing models
        print("Model load error:", e)

load_models()

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/youtube")
def youtube_data(url: str = Query(..., description="YouTube video URL")):
    try:
        with YoutubeDL({'quiet': True, 'skip_download': True}) as ydl:
            info = ydl.extract_info(url, download=False)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "title": info.get("title"),
        "channel": info.get("uploader"),
        "views": info.get("view_count"),
        "likes": info.get("like_count"),
        "duration": info.get("duration"),
        "url": info.get("webpage_url")
    }

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI backend!"}

@app.get("/api/data")
def get_data():
    return {"data": "This is coming from FastAPI"}


# -------------------------
# Analysis endpoints (use models if present)
# -------------------------
class AnalyzeVideoRequest(BaseModel):
    video_url: str
    analyze_comments: Optional[bool] = False
    max_comments: Optional[int] = 100

class TextRequest(BaseModel):
    text: str

class BatchCommentsRequest(BaseModel):
    comments: List[str]


def predict_comments(comments: List[str]) -> Dict[str, Any]:
    """
    Use loaded vectorizer/model/label encoder to predict sentiment for comments.
    Returns structure with per-comment sentiment + confidence and summary.
    """
    if VECTORIZER is None or MODEL is None:
        raise RuntimeError("Models not loaded on server")

    X = VECTORIZER.transform(comments)
    # predict labels
    preds = MODEL.predict(X)
    # predict probabilities if available
    probs = None
    try:
        probs = MODEL.predict_proba(X)
    except Exception:
        probs = None

    results = []
    for i, text in enumerate(comments):
        label = preds[i]
        confidence = 0.0
        if probs is not None:
            # take max probability for predicted class
            confidence = float(max(probs[i]))
        else:
            confidence = 0.0

        # if label encoder present, try to inverse transform
        try:
            if LABEL_ENCODER is not None:
                sentiment = LABEL_ENCODER.inverse_transform([label])[0]
            else:
                sentiment = str(label)
        except Exception:
            sentiment = str(label)

        results.append({
            "comment": text,
            "sentiment": sentiment,
            "confidence": confidence
        })

    # basic distribution summary
    dist_counts: Dict[str, int] = {}
    for r in results:
        dist_counts[r["sentiment"]] = dist_counts.get(r["sentiment"], 0) + 1
    total = len(results)
    dist_percent = {k: round(v / total * 100, 1) for k, v in dist_counts.items()}

    avg_conf = sum(r["confidence"] for r in results) / total if total else 0.0

    return {
        "count": total,
        "results": results,
        "distribution": {"counts": dist_counts, "percentages": dist_percent},
        "average_confidence": avg_conf,
        "model": MODEL.__class__.__name__ if MODEL is not None else None,
    }


@app.post("/analyze/comments/batch")
def analyze_comments_batch(payload: BatchCommentsRequest):
    # Real model-based analysis for a batch of comments
    try:
        if not payload.comments:
            return {"count": 0, "results": []}
        out = predict_comments(payload.comments)
        return out
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze/video")
def analyze_video(payload: AnalyzeVideoRequest):
    try:
        with YoutubeDL({'quiet': True, 'skip_download': True}) as ydl:
            info = ydl.extract_info(payload.video_url, download=False)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    result = {
        "title": info.get("title"),
        "channel": info.get("uploader"),
        "views": info.get("view_count"),
        "likes": info.get("like_count"),
        "duration": info.get("duration"),
        "url": info.get("webpage_url"),
        "analysis": {
            "sentiment": "neutral",
            "keywords": []
        }
    }

    # Try to fetch comments using yt_dlp if requested
    if payload.analyze_comments:
        comments_texts: List[str] = []
        # yt_dlp may expose comments under 'comments' key depending on extractor
        raw_comments = info.get("comments") or []
        # raw_comments items may be dicts with 'text' or strings
        for c in raw_comments[: payload.max_comments]:
            if isinstance(c, dict):
                text = c.get("text") or c.get("content") or c.get("comment") or ""
            else:
                text = str(c)
            if text:
                comments_texts.append(text)

        # If no comments from yt_dlp, inform user (frontend can send comments directly)
        if not comments_texts:
            result["comments_analysis"] = {
                "analyzed": 0,
                "summary": "Could not fetch comments from yt_dlp extractor. You can POST comments to /analyze/comments/batch for model analysis.",
            }
            return result

        # If model loaded, run predictions
        try:
            analysis_out = predict_comments(comments_texts)
            result["comments_analysis"] = {
                "analyzed": analysis_out["count"],
                "summary": "Comments analyzed using server ML model",
                "distribution": analysis_out["distribution"],
                "average_confidence": analysis_out["average_confidence"],
                "sample_results": analysis_out["results"][:20],
                "model_used": analysis_out["model"],
            }
        except RuntimeError as e:
            result["comments_analysis"] = {
                "analyzed": 0,
                "summary": f"Model not available on server: {str(e)}. You can POST comments to /analyze/comments/batch to analyze using a remote model service.",
            }

    return result


@app.post("/analyze/text")
def analyze_text(payload: TextRequest):
    # Simple heuristic stub for sentiment
    text = (payload.text or "").lower()
    sentiment = "neutral"
    if any(w in text for w in ["good", "great", "awesome", "love"]):
        sentiment = "positive"
    elif any(w in text for w in ["bad", "terrible", "hate", "awful"]):
        sentiment = "negative"
    return {"text": payload.text, "sentiment": sentiment}


@app.post("/analyze/channel")
def analyze_channel(payload: AnalyzeVideoRequest):
    # Stub: Return basic echo info. Full channel crawling requires YouTube Data API or scraping.
    return {
        "channel_name": payload.video_url,
        "max_videos": payload.max_comments,
        "summary": "Channel analysis endpoint is a stub. Integrate YouTube Data API for full data."
    }


@app.get("/search/channels")
def search_channels(q: str = Query(...), max_results: int = Query(10)):
    # Stubbed response. For real search integrate YouTube Data API.
    return {"query": q, "max_results": max_results, "channels": []}