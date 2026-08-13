import React from "react";
import { Leaf, Github, Mail, Heart } from "lucide-react";

const About = () => {
  const team = [
    { name: "Team FoodLoop", role: "Hackathon Project", description: "Built with passion for reducing food waste and feeding communities." },
  ];

  const techStack = [
    "React 18",
    "Vite",
    "Tailwind CSS",
    "Recharts",
    "React Router",
    "Framer Motion",
    "Express.js",
    "MongoDB",
    "Node.js",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto">
          <Leaf className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
          FoodLoop
        </h1>
        <p className="text-lg text-secondary-600 dark:text-secondary-300">
          Turning Waste Into Impact
        </p>
      </div>

      <div className="card p-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
            About This Project
          </h2>
          <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed">
            FoodLoop is a hackathon project designed to address the critical issue of food waste and food insecurity.
            Our platform connects food donors (restaurants, hotels, individuals) with NGOs to ensure surplus food
            reaches people in need instead of ending up in landfills.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
            Mission
          </h3>
          <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed">
            To create a sustainable ecosystem where no edible food goes to waste while communities facing
            food insecurity receive the nourishment they need. We believe technology can bridge the gap
            between surplus and scarcity.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
            Technology Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
            Data Source
          </h3>
          <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed">
            This project uses the P2 Hackathon dataset, which contains comprehensive records of food donations,
            donors, NGOs, and claims. The data is processed using Python (pandas) and served through a
            REST API built with Express.js and MongoDB.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
            Contact
          </h3>
          <div className="flex gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-100 dark:bg-secondary-700 rounded-lg hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-100 dark:bg-secondary-700 rounded-lg hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Email
            </a>
          </div>
        </div>
      </div>

      <div className="text-center py-8">
        <p className="text-secondary-500 dark:text-secondary-400 flex items-center justify-center gap-2">
          Made with <Heart className="w-4 h-4 text-red-500" /> for a better tomorrow
        </p>
      </div>
    </div>
  );
};

export default About;
