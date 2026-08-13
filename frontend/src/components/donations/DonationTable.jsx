import React, { useState, useMemo } from "react";
import { Search, Filter, ChevronDown, Download } from "lucide-react";
import Button from "../common/Button";

const DonationTable = ({ donations, loading }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    if (!donations) return [];
    return donations.filter((donation) => {
      const matchesSearch =
        donation.donorName?.toLowerCase().includes(search.toLowerCase()) ||
        donation.ngoName?.toLowerCase().includes(search.toLowerCase()) ||
        donation._id?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || donation.status === statusFilter;
      const matchesCategory =
        categoryFilter === "All" || donation.foodCategory === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [donations, search, statusFilter, categoryFilter]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleExport = () => {
    const headers = [
      "Donation ID",
      "Donor",
      "Category",
      "Quantity",
      "Location",
      "NGO",
      "Status",
      "Date",
    ];
    const rows = filteredData.map((d) => [
      d._id?.slice(-8) || "",
      d.donorName || "",
      d.foodCategory || "",
      `${d.foodQuantity || 0} ${d.unit || "kg"}`,
      d.location || "",
      d.ngoName || "",
      d.status || "",
      new Date(d.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "donations.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status) => {
    const styles = {
      Delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      "Picked Up": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      Wasted: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          styles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Search donations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-secondary-800 border border-secondary-300 dark:border-secondary-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-white dark:bg-secondary-800 border border-secondary-300 dark:border-secondary-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="All">All Status</option>
              <option value="Delivered">Delivered</option>
              <option value="Pending">Pending</option>
              <option value="Picked Up">Picked Up</option>
              <option value="Wasted">Wasted</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-white dark:bg-secondary-800 border border-secondary-300 dark:border-secondary-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="All">All Categories</option>
              <option value="Fruits">Fruits</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Grains">Grains</option>
              <option value="Dairy">Dairy</option>
              <option value="Cooked Food">Cooked Food</option>
              <option value="Bakery">Bakery</option>
              <option value="Other">Other</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
          </div>
          <Button variant="secondary" icon={Download} onClick={handleExport}>
            Export
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-secondary-200 dark:border-secondary-700">
        <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
          <thead className="bg-secondary-50 dark:bg-secondary-700/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Donation ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Donor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                NGO
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-secondary-500"
                >
                  No donations found
                </td>
              </tr>
            ) : (
              paginatedData.map((donation, idx) => (
                <tr
                  key={donation._id || idx}
                  className="hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-secondary-900 dark:text-secondary-100">
                    #{donation._id?.slice(-8) || idx + 1}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-300">
                    {donation.donorName}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-300">
                    {donation.foodCategory}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-300">
                    {donation.foodQuantity} {donation.unit || "kg"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-300">
                    {donation.location}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-300">
                    {donation.ngoName}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getStatusBadge(donation.status)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-500 dark:text-secondary-400">
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-secondary-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length} results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm border border-secondary-300 dark:border-secondary-600 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm border border-secondary-300 dark:border-secondary-600 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationTable;
