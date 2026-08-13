import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, ChevronDown } from "lucide-react";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import ErrorState from "../../components/common/ErrorState";
import { getMyDonations } from "../../services/api";

const DonorDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await getMyDonations();
      setDonations(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = donations.filter((d) => {
    const matchesSearch = d.foodCategory?.toLowerCase().includes(search.toLowerCase()) ||
      d.location?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <Loading text="Loading donations..." />;
  if (error) return <ErrorState message={error} onRetry={fetchDonations} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            My Donations
          </h2>
          <p className="text-secondary-500 dark:text-secondary-400 mt-1">
            Manage and track your food donations.
          </p>
        </div>
        <Link to="/donor/donations/new">
          <Button icon={Plus}>New Donation</Button>
        </Link>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Package className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
            No donations yet
          </h3>
          <p className="text-secondary-500 mb-6 max-w-md mx-auto">
            Your first donation can help reduce food waste and support someone in need.
          </p>
          <Link to="/donor/donations/new">
            <Button>Donate Food</Button>
          </Link>
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
                <option value="Rejected">Rejected</option>
                <option value="Wasted">Wasted</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
              <thead className="bg-secondary-50 dark:bg-secondary-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase">NGO</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
                {filtered.map((donation) => (
                  <tr key={donation._id} className="hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors">
                    <td className="px-4 py-4 text-sm font-medium text-secondary-900 dark:text-secondary-100">
                      #{donation._id.slice(-8)}
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
                    <td className="px-4 py-4 text-sm text-secondary-600 dark:text-secondary-300">
                      {donation.ngoName || "Not assigned"}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        donation.status === "Delivered" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                        donation.status === "Pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                        donation.status === "Accepted" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                        donation.status === "Rejected" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                      }`}>
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-secondary-500 dark:text-secondary-400">
                      {new Date(donation.createdAt).toLocaleDateString()}
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

export default DonorDonations;
