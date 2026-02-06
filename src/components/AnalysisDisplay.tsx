import React, { useState } from 'react';
import { pythonYouTubeAPI } from '../services/pythonAPI';

interface AnalysisDisplayProps {
  className?: string;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ className }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analysisType, setAnalysisType] = useState<'video' | 'channel' | 'text'>('video');
  const [channelName, setChannelName] = useState('');
  const [textContent, setTextContent] = useState('');
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  // Check API connection on component mount
  React.useEffect(() => {
    checkApiConnection();
  }, []);

  const checkApiConnection = async () => {
    try {
      setApiStatus('checking');
      const response = await pythonYouTubeAPI.checkHealth();
      setApiStatus('connected');
    } catch (err) {
      console.error('Failed to connect to Python API:', err);
      setApiStatus('disconnected');
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    
    try {
      let response;
      
      switch (analysisType) {
        case 'video':
          if (!videoUrl) {
            throw new Error('Please enter a YouTube video URL');
          }
          response = await pythonYouTubeAPI.analyzeVideo({
            video_url: videoUrl,
            analyze_comments: true,
            max_comments: 100
          });
          break;
          
        case 'channel':
          if (!channelName) {
            throw new Error('Please enter a channel name or ID');
          }
          response = await pythonYouTubeAPI.analyzeChannel({
            channel_name: channelName,
            max_videos: 50
          });
          break;
          
        case 'text':
          if (!textContent) {
            throw new Error('Please enter text to analyze');
          }
          response = await pythonYouTubeAPI.analyzeText(textContent);
          break;
      }
      
      setAnalysisResult(response.data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-4 bg-white rounded-lg shadow ${className}`}>
      <h2 className="text-2xl font-bold mb-4">YouTube Analysis Dashboard</h2>
      
      {/* API Status Indicator */}
      <div className="mb-4 flex items-center">
        <span className="mr-2">API Status:</span>
        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
          apiStatus === 'connected' ? 'bg-green-500' : 
          apiStatus === 'checking' ? 'bg-yellow-500' : 'bg-red-500'
        }`}></span>
        <span>{apiStatus === 'connected' ? 'Connected' : 
               apiStatus === 'checking' ? 'Checking...' : 'Disconnected'}</span>
        <button 
          onClick={checkApiConnection}
          className="ml-2 text-sm text-blue-500 hover:underline"
        >
          Refresh
        </button>
      </div>
      
      {/* Analysis Type Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Analysis Type</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="video"
              checked={analysisType === 'video'}
              onChange={() => setAnalysisType('video')}
              className="mr-2"
            />
            Video Analysis
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="channel"
              checked={analysisType === 'channel'}
              onChange={() => setAnalysisType('channel')}
              className="mr-2"
            />
            Channel Analysis
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="text"
              checked={analysisType === 'text'}
              onChange={() => setAnalysisType('text')}
              className="mr-2"
            />
            Text Analysis
          </label>
        </div>
      </div>
      
      {/* Input Fields based on Analysis Type */}
      {analysisType === 'video' && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">YouTube Video URL</label>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full p-2 border rounded"
          />
        </div>
      )}
      
      {analysisType === 'channel' && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Channel Name or ID</label>
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Channel name or ID"
            className="w-full p-2 border rounded"
          />
        </div>
      )}
      
      {analysisType === 'text' && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Text to Analyze</label>
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Enter text for sentiment analysis..."
            className="w-full p-2 border rounded h-24"
          />
        </div>
      )}
      
      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={loading || apiStatus !== 'connected'}
        className={`px-4 py-2 rounded ${
          loading || apiStatus !== 'connected'
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
      
      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* Results Display */}
      {analysisResult && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">Analysis Results</h3>
          <div className="bg-gray-50 p-4 rounded overflow-auto max-h-96">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(analysisResult, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisDisplay;