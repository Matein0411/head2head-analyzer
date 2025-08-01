import React from "react";

const AnimatedFeature = ({ icon, title, description, delay = 0 }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}) => (
  <div
    className="bg-card rounded-xl p-8 shadow-lg flex flex-col items-center animate-fade-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="mb-4 animate-bounce-slow">{icon}</div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-300 text-center">{description}</p>
  </div>
);

export default AnimatedFeature;
