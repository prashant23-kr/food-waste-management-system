import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Clock, User, Package } from "lucide-react";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import ErrorState from "../../components/common/ErrorState";
import { getDonationById, updateDonationStatus } from "../../services/api";

const DonorDonationDetail = () => {
  const { id } = useParams();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchDonation();
  }, [id]);

  const fetchDonation = async () => {
    try {
      setLoading(true);
      const response = await getDonationById(id);
      setDonation(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
      setUpdating(true);
      await updateDonationStatus(id, status);
      fetchDonation();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loading text="Loading donation details..." />;
  if (error) return <ErrorState message={error} onRetry={fetchDonation} />;
  if (!donation) return <div className="text-center py-12">Donation not found</div>;

  const stages = ["Pending", "Accepted", "Scheduled", "Picked Up", "Delivered"];
  const currentStageIndex = stages.indexOf(donation.status);

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      Accepted: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      Scheduled: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      "Picked Up": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      Delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      Rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      Wasted: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400",
    };
    return colors[donation.status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/donor/donations">
          <button className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors">
            <ArrowLeft className="w-5 h-5 text-secondary-600" />
          </button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            Donation #{donation._id.slice(-8)}
          </h2>
          <p className="text-secondary-500">Created on {new Date(donation.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
            Status Timeline
          </h3>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(donation.status)}`}>
            {donation.status}
          </span>
        </div>
        <div className="flex items-center justify-between mb-8">
          {stages.map((stage, index) => (
            <div key={stage} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                index <= currentStageIndex ? "bg-primary-600 text-white" : "bg-secondary-200 dark:bg-secondary-700 text-secondary-500"
              }`}>
                {index + 1}
              </div>
              <p className={`text-xs mt-2 ${index <= currentStageIndex ? "text-primary-600 font-medium" : "text-secondary-400"}`}>
                {stage}
              </p>
            </div>
          ))}
        </div>
        <div className="relative">
          <div className="absolute top-4 left-0 right-0 h-1 bg-secondary-200 dark:bg-secondary-700">
            <div
              className="h-full bg-primary-600 transition-all duration-500"
              style={{ width: currentStageIndex >= 0 ? `${(currentStageIndex / (stages.length - 1)) * 100}%` : "0%" }}
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">Donation Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-secondary-400" />
              <div>
                <p className="text-xs text-secondary-500">Food Category</p>
                <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">{donation.foodCategory}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-secondary-400" />
              <div>
                <p className="text-xs text-secondary-500">Quantity</p>
                <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">{donation.foodQuantity} {donation.unit || "kg"}</p>
              </div>
            </div>
            {donation.foodDescription && (
              <div>
                <p className="text-xs text-secondary-500 mb-1">Description</p>
                <p className="text-sm text-secondary-700 dark:text-secondary-300">{donation.foodDescription}</p>
              </div>
            )}
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">Logistics</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-secondary-400" />
              <div>
                <p className="text-xs text-secondary-500">Pickup Location</p>
                <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">{donation.location}</p>
              </div>
            </div>
            {donation.pickupDate && (
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-secondary-400" />
                <div>
                  <p className="text-xs text-secondary-500">Pickup Date</p>
                  <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                    {new Date(donation.pickupDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
            {donation.expiryDate && (
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-secondary-400" />
                <div>
                  <p className="text-xs text-secondary-500">Expiry Date</p>
                  <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                    {new Date(donation.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
            {donation.ngoName && (
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-secondary-400" />
                <div>
                  <p className="text-xs text-secondary-500">Assigned NGO</p>
                  <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">{donation.ngoName}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDonationDetail;
