import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Package, Heart, TrendingUp, Leaf, Globe } from "lucide-react";
import Button from "../components/common/Button";

const Home = () => {
  const stats = [
    { label: "Total Donations", value: "12,540 kg", icon: Package },
    { label: "Food Distributed", value: "10,200 kg", icon: Heart },
    { label: "Food Saved", value: "8,450 kg", icon: Leaf },
    { label: "Active NGOs", value: "45+", icon: Users },
  ];

  const steps = [
    { step: 1, title: "Donor registers food", desc: "Restaurants, hotels, or individuals list surplus food with details" },
    { step: 2, title: "NGO accepts donation", desc: "Nearby NGOs are notified and can accept the donation" },
    { step: 3, title: "Pickup is scheduled", desc: "Logistics are coordinated for timely food collection" },
    { step: 4, title: "Food is delivered", desc: "Food reaches people in need safely and efficiently" },
    { step: 5, title: "Impact is recorded", desc: "Every donation contributes to measurable social impact" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 text-white px-6 py-16 lg:px-12 lg:py-24">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Turning Surplus Food Into{" "}
              <span className="text-primary-200">Social Impact</span>
            </h1>
            <p className="text-lg lg:text-xl text-primary-100 max-w-xl">
              Connect food donors with NGOs, reduce food waste, and make every donation count.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="bg-white text-primary-700 hover:bg-primary-50">
                  View Dashboard <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/donations">
                <Button size="lg" variant="secondary" className="border-white text-white hover:bg-white/10">
                  Donate Food
                </Button>
              </Link>
              <Link to="/impact">
                <Button size="lg" variant="secondary" className="border-white text-white hover:bg-white/10">
                  Explore Impact
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Leaf className="w-32 h-32 text-white/80" />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Heart className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Globe className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="card card-hover p-6 text-center"
          >
            <stat.icon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <p className="text-2xl lg:text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              {stat.value}
            </p>
            <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </section>

      <section className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100">
            The Problem
          </h2>
          <p className="text-lg text-secondary-600 dark:text-secondary-300">
            Every year, millions of tons of food are wasted while millions of people go hungry. Restaurants, hotels, and individuals discard perfectly edible food that could nourish those in need.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-danger-50 dark:bg-danger-900/20 rounded-xl">
              <p className="text-3xl font-bold text-danger-600">1.3B</p>
              <p className="text-sm text-secondary-600 dark:text-secondary-300">tons of food wasted annually</p>
            </div>
            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
              <p className="text-3xl font-bold text-primary-600">828M</p>
              <p className="text-sm text-secondary-600 dark:text-secondary-300">people affected by hunger</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square bg-gradient-to-br from-danger-100 to-danger-50 dark:from-danger-900/20 dark:to-danger-800/20 rounded-3xl flex items-center justify-center">
            <TrendingUp className="w-32 h-32 text-danger-400" />
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100">
            Our Solution
          </h2>
          <p className="text-lg text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto">
            We bridge the gap between food surplus and food scarcity with a smart, efficient platform.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
          {["Restaurant / Hotel / Donor", "Food Donation Platform", "NGO", "People in Need"].map(
            (item, index, arr) => (
              <React.Fragment key={item}>
                <div className="card p-4 text-center min-w-[160px]">
                  <p className="font-semibold text-secondary-900 dark:text-secondary-100">
                    {item}
                  </p>
                </div>
                {index < arr.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-secondary-400 rotate-90 lg:rotate-0" />
                )}
              </React.Fragment>
            )
          )}
        </div>
      </section>

      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100">
            How It Works
          </h2>
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative"
            >
              <div className="card p-6 text-center h-full">
                <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  {item.desc}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-secondary-300" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <section className="text-center space-y-6 py-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100">
          Ready to Make an Impact?
        </h2>
        <p className="text-lg text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto">
          Join thousands of donors and NGOs working together to eliminate food waste and feed communities.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/donations">
            <Button size="lg">Start Donating</Button>
          </Link>
          <Link to="/dashboard">
            <Button size="lg" variant="secondary">
              View Dashboard
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
