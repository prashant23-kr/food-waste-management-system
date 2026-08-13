import React, { useState } from "react";
import { Plus } from "lucide-react";
import DonationTable from "../components/donations/DonationTable";
import DonationModal from "../components/donations/DonationModal";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import ErrorState from "../components/common/ErrorState";
import { useDashboardData } from "../hooks/useDashboardData";
import { createDonation } from "../services/api";

const Donations = () => {
  const { donations, loading, error, refetch } = useDashboardData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCreateDonation = async (donationData) => {
    try {
      setSubmitting(true);
      await createDonation(donationData);
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      console.error("Failed to create donation:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading text="Loading donations..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  const donationList = donations?.data || donations || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            Donation Management
          </h2>
          <p className="text-secondary-500 dark:text-secondary-400 mt-1">
            Manage and track all food donations.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
          New Donation
        </Button>
      </div>

      <div className="card p-6">
        <DonationTable donations={donationList} loading={loading} />
      </div>

      <DonationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateDonation}
        loading={submitting}
      />
    </div>
  );
};

export default Donations;
