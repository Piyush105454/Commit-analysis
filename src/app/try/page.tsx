"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

interface VideoData {
  title: string;
  channel: string;
  views: number;
  likes: number;
  duration: number;
  url: string;
}

export default function TryPage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  // Auto sign-in when email & password provided as query params:
  // /try?email=demo@example.com&password=demo123
  useEffect(() => {
    const email = searchParams.get("email");
    const password = searchParams.get("password");
    const router = useRouter();

    if (email === "demo@example.com") {
      // Demo shortcut: accept demo email and redirect to dashboard
      const demoUser = { id: "demo-user", name: "Demo User", email };
      localStorage.setItem("authToken", "demo-token");
      localStorage.setItem("user", JSON.stringify(demoUser));
      router.push("/dashboard");
      return;
    }

    if (email && password) {
      // Use NextAuth Credentials provider to sign in and redirect to /dashboard
      signIn("credentials", {
        redirect: true,
        email,
        password,
        callbackUrl: "/dashboard",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchVideoData = async () => {
    if (!videoUrl) return alert("Please enter a YouTube URL");

    setLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/youtube?url=${encodeURIComponent(videoUrl)}`
      );
      const data = await res.json();
      setVideoData(data);
    } catch (error) {
      console.error("Error fetching video data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>YouTube Video Info (FastAPI + Next.js)</h1>

      <input
        type="text"
        placeholder="Enter YouTube video URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        style={{ width: "60%", padding: "10px", marginTop: "20px" }}
      />
      <br />
      <button
        onClick={fetchVideoData}
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
      >
        {loading ? "Fetching..." : "Get Video Info"}
      </button>

      {videoData && (
        <div style={{ marginTop: "30px" }}>
          <h2>{videoData.title}</h2>
          <p><b>Channel:</b> {videoData.channel}</p>
          <p><b>Views:</b> {videoData.views?.toLocaleString()}</p>
          <p><b>Likes:</b> {videoData.likes?.toLocaleString()}</p>
          <p><b>Duration:</b> {videoData.duration} seconds</p>
          <a href={videoData.url} target="_blank" rel="noreferrer">Watch on YouTube</a>
        </div>
      )}
    </div>
  );
}