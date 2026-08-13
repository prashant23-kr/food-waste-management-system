import React from "react";
import { Outlet } from "react-router-dom";
import { Leaf, Heart, Users } from "lucide-react";

const AuthLayout = ({ brandColor = "primary", illustration }) => {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 text-white p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">FoodLoop</h1>
              <p className="text-sm text-primary-100">Turning Waste Into Impact</p>
            </div>
          </div>
          <div className="mt-12">
            {illustration}
          </div>
        </div>
        <div>
          <p className="text-primary-100 text-sm">
            Connecting food donors with NGOs to reduce waste and feed communities.
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 bg-secondary-50 dark:bg-secondary-900">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
