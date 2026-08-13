import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, Heart, Users } from "lucide-react";
import Button from "../../components/common/Button";
import { ngoLogin } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const NGOLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await ngoLogin(formData);
      login(response.token, response.user);
      navigate("/ngo/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">FoodLoop</h1>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
          NGO Login
        </h2>
        <p className="text-secondary-500 dark:text-secondary-400 mt-2">
          Sign in to manage food donations and maximize impact
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2.5 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="ngo@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2.5 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500" />
            <span className="text-secondary-600 dark:text-secondary-400">Remember me</span>
          </label>
          <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
            Forgot password?
          </a>
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-secondary-500">
        Don't have an account?{" "}
        <Link to="/ngo/register" className="text-primary-600 hover:text-primary-700 font-medium">
          Register NGO
        </Link>
      </p>
    </div>
  );
};

export default NGOLogin;
