import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, ChevronDown, CheckCircle, XCircle, Clock } from "lucide-react";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import ErrorState from "../../components/common/ErrorState";
import { getNGODonations, acceptDonation, updateDonationStatus } from "../../services/api";

const NGODonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await getNGODonations();
      setDonations(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      setActionLoading(id);
      await acceptDonation(id);
      fetchDonations();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept donation");
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      setActionLoading(id);
      await updateDonationStatus(id, status);
      fetchDonations();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = donations.filter((d) => {
    const matchesSearch = d.foodCategory?.toLowerCase().includes(search.toLowerCase()) ||
      d.donorName?.toLowerCase().includes(search.toLowerCase()) ||
      d.location?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <Loading text="Loading donations..." />;
  if (error) return <ErrorState message={error} onRetry={fetchDonations} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          Available Donations
        </h2>
        <p className="text-secondary-500 dark:text-secondary-400 mt-1">
          View and manage food donations available for pickup.
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Package className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
            No donations available
          </h3>
          <p className="text-secondary-500">There are no donations available at the moment.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-secondary-200 dark:border-secondary-700 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search donations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Picked Up">Picked Up</option>
                <option value="Delivered">Delivered</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
              <thead className="bg-secondary-50 dark:bg-secondary-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase">Donor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
                {filtered.map((donation) => (
                  <tr key={donation._id} className="hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors">
                    <td className="px-4 py-4 text-sm font-medium text-secondary-900 dark:text-secondary-100">
                      #{donation._id.slice(-8)}
                    </td>
                    <td className="px-4 py-4 text-sm text-secondary-600 dark:text-secondary-300">
                      {donation.donorName}
                    </td>
                    <td className="px-4 py-4 text-sm text-secondary-600 dark:text-secondary-300">
                      {donation.foodCategory}
                    </td>
                    <td className="px-4 py-4 text-sm text-secondary-600 dark:text-secondary-300">
                      {donation.foodQuantity} {donation.unit || "kg"}
                    </td>
                    <td className="px-4 py-4 text-sm text-secondary-600 dark:text-secondary-300">
                      {donation.location}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        donation.status === "Delivered" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                        donation.status === "Pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                        donation.status === "Accepted" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                      }`}>
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {donation.status === "Pending" && (
                          <Button
                            size="sm"
                            onClick={() => handleAccept(donation._id)}
                            loading={actionLoading === donation._id}
                          >
                            Accept
                          </Button>
                        )}
                        {donation.status === "Accepted" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleStatusUpdate(donation._id, "Scheduled")}
                          >
                            Schedule
                          </Button>
                        )}
                        {donation.status === "Scheduled" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleStatusUpdate(donation._id, "Picked Up")}
                          >
                            Mark Picked Up
                          </Button>
                        )}
                        {donation.status === "Picked Up" && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(donation._id, "Delivered")}
                          >
                            Mark Delivered
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default NGODonations;
