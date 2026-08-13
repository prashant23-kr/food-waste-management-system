import React, { useState } from "react";
import { X } from "lucide-react";
import Button from "../common/Button";

const DonationModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    donorName: "",
    foodCategory: "Fruits",
    foodQuantity: "",
    unit: "kg",
    location: "",
    ngoName: "",
    pickupTime: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.donorName.trim()) newErrors.donorName = "Donor name is required";
    if (!formData.foodQuantity || parseFloat(formData.foodQuantity) <= 0)
      newErrors.foodQuantity = "Valid quantity is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.ngoName.trim()) newErrors.ngoName = "NGO name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        foodQuantity: parseFloat(formData.foodQuantity),
        pickupTime: parseFloat(formData.pickupTime) || 0,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-secondary-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
            New Donation
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
          >
            <X className="w-5 h-5 text-secondary-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Donor Name
            </label>
            <input
              type="text"
              name="donorName"
              value={formData.donorName}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-white dark:bg-secondary-700 border ${
                errors.donorName
                  ? "border-danger-500"
                  : "border-secondary-300 dark:border-secondary-600"
              } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500`}
              placeholder="Enter donor name"
            />
            {errors.donorName && (
              <p className="mt-1 text-xs text-danger-600">{errors.donorName}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                Food Category
              </label>
              <select
                name="foodCategory"
                value={formData.foodCategory}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                Quantity (kg)
              </label>
              <input
                type="number"
                name="foodQuantity"
                value={formData.foodQuantity}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-white dark:bg-secondary-700 border ${
                  errors.foodQuantity
                    ? "border-danger-500"
                    : "border-secondary-300 dark:border-secondary-600"
                } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500`}
                placeholder="0"
                min="0"
                step="0.1"
              />
              {errors.foodQuantity && (
                <p className="mt-1 text-xs text-danger-600">
                  {errors.foodQuantity}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-white dark:bg-secondary-700 border ${
                errors.location
                  ? "border-danger-500"
                  : "border-secondary-300 dark:border-secondary-600"
              } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500`}
              placeholder="Enter pickup location"
            />
            {errors.location && (
              <p className="mt-1 text-xs text-danger-600">{errors.location}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              NGO Name
            </label>
            <input
              type="text"
              name="ngoName"
              value={formData.ngoName}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-white dark:bg-secondary-700 border ${
                errors.ngoName
                  ? "border-danger-500"
                  : "border-secondary-300 dark:border-secondary-600"
              } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500`}
              placeholder="Enter NGO name"
            />
            {errors.ngoName && (
              <p className="mt-1 text-xs text-danger-600">{errors.ngoName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Pickup Time (hours)
            </label>
            <input
              type="number"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Additional details..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create Donation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationModal;
