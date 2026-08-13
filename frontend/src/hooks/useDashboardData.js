import { useState, useEffect, useCallback } from "react";
import { getAnalytics, getDonations, getTrends, getStatusSummary } from "../services/api";

export const useDashboardData = () => {
  const [data, setData] = useState(null);
  const [donations, setDonations] = useState(null);
  const [trends, setTrends] = useState(null);
  const [statusSummary, setStatusSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [analyticsRes, donationsRes, trendsRes, statusRes] =
        await Promise.all([
          getAnalytics(),
          getDonations(),
          getTrends(),
          getStatusSummary(),
        ]);
      setData(analyticsRes.data || analyticsRes);
      setDonations(donationsRes.data || donationsRes);
      setTrends(trendsRes.data || trendsRes);
      setStatusSummary(statusRes.data || statusRes);
    } catch (err) {
      setError(err.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    donations,
    trends,
    statusSummary,
    loading,
    error,
    refetch: fetchData,
  };
};
