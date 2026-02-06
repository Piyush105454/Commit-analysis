import { useState, useEffect } from 'react';
// Using direct import from axios until dashboardAPI is implemented
import axios from 'axios';

interface DashboardStats {
  totalFollowers: number;
  engagement: number;
  reach: number;
  impressions: number;
  platforms: Array<{
    name: string;
    followers: number;
    growth: number;
  }>;
}

interface AnalyticsData {
  performance: Array<{
    date: string;
    views: number;
    engagement: number;
    reach: number;
  }>;
  revenue: Array<{
    month: string;
    amount: number;
  }>;
}

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, analyticsData] = await Promise.all([
          dashboardAPI.getStats(),
          analyticsAPI.getAnalytics()
        ]);
        
        setStats(statsData);
        setAnalytics(analyticsData);
        setError(null);
      } catch (err: any) {
        console.error('Dashboard data fetch error:', err);
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, analytics, loading, error };
};