import axios from "axios";

const isDev = import.meta.env.DEV;
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (isDev ? "/api" : "http://localhost:5000/api");

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/donor/login";
    }
    return Promise.reject(error);
  }
);

export const getHealth = async () => {
  const response = await api.get("/health");
  return response.data;
};

export const getDonations = async () => {
  const response = await api.get("/donations");
  return response.data;
};

export const getTrends = async () => {
  const response = await api.get("/trends");
  return response.data;
};

export const getStatusSummary = async () => {
  const response = await api.get("/status-summary");
  return response.data;
};

export const getAnalytics = async () => {
  const response = await api.get("/analytics");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.patch("/auth/me", profileData);
  return response.data;
};

export const donorRegister = async (userData) => {
  const response = await api.post("/auth/donor/register", userData);
  return response.data;
};

export const ngoRegister = async (userData) => {
  const response = await api.post("/auth/ngo/register", userData);
  return response.data;
};

export const donorLogin = async (credentials) => {
  const response = await api.post("/auth/donor/login", credentials);
  return response.data;
};

export const ngoLogin = async (credentials) => {
  const response = await api.post("/auth/ngo/login", credentials);
  return response.data;
};

export const getMyDonations = async () => {
  const response = await api.get("/donations/my");
  return response.data;
};

export const createDonation = async (donationData) => {
  const response = await api.post("/donations", donationData);
  return response.data;
};

export const getDonationById = async (id) => {
  const response = await api.get(`/donations/${id}`);
  return response.data;
};

export const updateDonationStatus = async (id, status) => {
  const response = await api.patch(`/donations/${id}/status`, { status });
  return response.data;
};

export const acceptDonation = async (id) => {
  const response = await api.patch(`/donations/${id}/accept`);
  return response.data;
};

export const getNGODonations = async () => {
  const response = await api.get("/ngo/donations");
  return response.data;
};

export default api;
