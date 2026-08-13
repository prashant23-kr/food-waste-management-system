import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import ErrorState from "../../components/common/ErrorState";
import { createDonation } from "../../services/api";

const DonorDonationNew = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    foodCategory: "Cooked Food",
    foodDescription: "",
    foodQuantity: "",
    unit: "kg",
    location: "",
    pickupDate: "",
    pickupTime: "",
    expiryDate: "",
    additionalNotes: "",
    ngoName: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createDonation({
        ...formData,
        foodQuantity: parseFloat(formData.foodQuantity) || 0,
      });
      navigate("/donor/donations");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create donation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/donor/donations")}
          className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-secondary-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            Donate Food
          </h2>
          <p className="text-secondary-500 dark:text-secondary-400">
            Fill in the details about your food donation.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Food Category *
            </label>
            <select
              required
              value={formData.foodCategory}
              onChange={(e) => setFormData({ ...formData, foodCategory: e.target.value })}
              className="w-full px-4 py-2.5 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option>Fruits</option>
              <option>Vegetables</option>
              <option>Grains</option>
              <option>Dairy</option>
              <option>Cooked Food</option>
              <option>Bakery</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Quantity (kg) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.1"
              value={formData.foodQuantity}
              onChange={(e) => setFormData({ ...formData, foodQuantity: e.target.value })}
              className="w-full px-4 py-2.5 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="0"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Food Description
            </label>
            <textarea
              value={formData.foodDescription}
              onChange={(e) => setFormData({ ...formData, foodDescription: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Describe the food items..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Pickup Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2.5 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter pickup location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              NGO Name
            </label>
            <input
              type="text"
              value={formData.ngoName}
              onChange={(e) => setFormData({ ...formData, ngoName: e.target.value })}
              className="w-full px-4 py-2.5 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Optional: Preferred NGO"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Pickup Date
            </label>
            <input
              type="date"
              value={formData.pickupDate}
              onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
              className="w-full px-4 py-2.5 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Pickup Time
            </label>
            <input
              type="time"
              value={formData.pickupTime}
              onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
              className="w-full px-4 py-2.5 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-4 py-2.5 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Additional Notes
            </label>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Any special instructions..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-secondary-200 dark:border-secondary-700">
          <button
            type="button"
            onClick={() => navigate("/donor/donations")}
            className="px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
          >
            Cancel
          </button>
          <Button type="submit" loading={loading}>
            Create Donation
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DonorDonationNew;
