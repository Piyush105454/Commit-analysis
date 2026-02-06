import { useState, useEffect } from 'react';
import { youtubeAPI, authAPI } from '@/services/api';

interface UserChannelData {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    youtubeChannel?: string;
    channelData?: {
      channelId?: string;
      subscriberCount?: number;
      videoCount?: number;
      viewCount?: number;
      thumbnail?: string;
      lastAnalyzed?: string;
    };
  };
  channelAnalysis: any;
  loading: boolean;
  error: string | null;
}

export const useUserChannel = () => {
  const [data, setData] = useState<UserChannelData>({
    user: {} as any,
    channelAnalysis: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchUserChannelData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        // Get current user data
        const userResponse = await authAPI.getCurrentUser();
        
        if (!userResponse.success) {
          throw new Error('Failed to get user data');
        }

        const user = userResponse.user;
        setData(prev => ({ ...prev, user }));

        // If user has a YouTube channel, analyze it
        if (user.youtubeChannel) {
          try {
            const channelResponse = await youtubeAPI.analyzeChannel({
              channelName: user.youtubeChannel,
              maxVideos: 50
            });

            if (channelResponse.success) {
              // Update user's channel data in database
              const channelInfo = channelResponse.channel_info;
              const analysisData = channelResponse.analysis_summary;
              
              await authAPI.updateChannelData({
                channelId: channelInfo.channel_id,
                subscriberCount: analysisData.total_views, // Using views as subscriber proxy
                videoCount: analysisData.total_videos,
                viewCount: analysisData.total_views,
                thumbnail: channelInfo.thumbnail
              });

              setData(prev => ({
                ...prev,
                channelAnalysis: channelResponse,
                loading: false
              }));
            } else {
              setData(prev => ({
                ...prev,
                error: `Could not analyze channel: ${user.youtubeChannel}`,
                loading: false
              }));
            }
          } catch (channelError: any) {
            const errorMessage = channelError.response?.data?.message || channelError.message;
            setData(prev => ({
              ...prev,
              error: `Failed to analyze channel: ${user.youtubeChannel}`,
              loading: false
            }));
          }
        } else {
          // User has no YouTube channel
          setData(prev => ({
            ...prev,
            error: 'No YouTube channel configured. Please update your profile.',
            loading: false
          }));
        }

      } catch (error: any) {
        console.error('User channel data fetch error:', error);
        setData(prev => ({
          ...prev,
          error: error.message || 'Failed to fetch user data',
          loading: false
        }));
      }
    };

    // Only fetch if user is logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchUserChannelData();
    } else {
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Please log in to see your channel analytics'
      }));
    }
  }, []);

  const refreshChannelData = async () => {
    const token = localStorage.getItem('authToken');
    if (token && data.user.youtubeChannel) {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const channelResponse = await youtubeAPI.analyzeChannel({
          channelName: data.user.youtubeChannel,
          maxVideos: 50
        });

        if (channelResponse.success) {
          setData(prev => ({
            ...prev,
            channelAnalysis: channelResponse,
            loading: false
          }));
        }
      } catch (error) {
        setData(prev => ({
          ...prev,
          error: 'Failed to refresh channel data',
          loading: false
        }));
      }
    }
  };

  return {
    ...data,
    refreshChannelData
  };
};