import React from "react";

const NGOImpact = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
          Your Impact
        </h2>
        <p className="text-secondary-500 mb-8">
          Track the difference your organization is making in the community.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-6 text-center">
            <p className="text-4xl font-bold text-primary-600 mb-2">0</p>
            <p className="text-secondary-500">Meals Served</p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-4xl font-bold text-green-600 mb-2">0 kg</p>
            <p className="text-secondary-500">Food Distributed</p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">0</p>
            <p className="text-secondary-500">Lives Impacted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGOImpact;
