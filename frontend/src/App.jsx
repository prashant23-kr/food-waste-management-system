import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import AuthLayout from "./components/layout/AuthLayout";
import DonorLayout from "./components/layout/DonorLayout";
import NGOLayout from "./components/layout/NGOLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Donations from "./pages/Donations";
import Donors from "./pages/Donors";
import NGOs from "./pages/NGOs";
import FoodWaste from "./pages/FoodWaste";
import Impact from "./pages/Impact";
import About from "./pages/About";
import DonorLogin from "./pages/auth/DonorLogin";
import DonorRegister from "./pages/auth/DonorRegister";
import NGOLogin from "./pages/auth/NGOLogin";
import NGORegister from "./pages/auth/NGORegister";
import DonorDashboard from "./pages/donor/DonorDashboard";
import DonorDonations from "./pages/donor/DonorDonations";
import DonorDonationNew from "./pages/donor/DonorDonationNew";
import DonorDonationDetail from "./pages/donor/DonorDonationDetail";
import DonorProfile from "./pages/donor/DonorProfile";
import DonorImpact from "./pages/donor/DonorImpact";
import NGODashboard from "./pages/ngo/NGODashboard";
import NGODonations from "./pages/ngo/NGODonations";
import NGOProfile from "./pages/ngo/NGOProfile";
import NGOImpact from "./pages/ngo/NGOImpact";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="donations" element={<Donations />} />
            <Route path="donors" element={<Donors />} />
            <Route path="ngos" element={<NGOs />} />
            <Route path="food-waste" element={<FoodWaste />} />
            <Route path="impact" element={<Impact />} />
            <Route path="about" element={<About />} />
          </Route>

          {/* Auth routes */}
          <Route path="/donor/login" element={<AuthLayout />}>
            <Route index element={<DonorLogin />} />
          </Route>
          <Route path="/donor/register" element={<AuthLayout />}>
            <Route index element={<DonorRegister />} />
          </Route>
          <Route path="/ngo/login" element={<AuthLayout />}>
            <Route index element={<NGOLogin />} />
          </Route>
          <Route path="/ngo/register" element={<AuthLayout />}>
            <Route index element={<NGORegister />} />
          </Route>

          {/* Donor protected routes */}
          <Route
            path="/donor"
            element={
              <ProtectedRoute allowedRoles={["donor"]}>
                <DonorLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DonorDashboard />} />
            <Route path="donations" element={<DonorDonations />} />
            <Route path="donations/new" element={<DonorDonationNew />} />
            <Route path="donations/:id" element={<DonorDonationDetail />} />
            <Route path="profile" element={<DonorProfile />} />
            <Route path="impact" element={<DonorImpact />} />
            <Route path="settings" element={<DonorDashboard />} />
          </Route>

          {/* NGO protected routes */}
          <Route
            path="/ngo"
            element={
              <ProtectedRoute allowedRoles={["ngo"]}>
                <NGOLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<NGODashboard />} />
            <Route path="donations" element={<NGODonations />} />
            <Route path="my-donations" element={<NGODonations />} />
            <Route path="profile" element={<NGOProfile />} />
            <Route path="impact" element={<NGOImpact />} />
            <Route path="settings" element={<NGODashboard />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
