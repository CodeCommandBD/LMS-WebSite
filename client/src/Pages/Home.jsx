import React from "react";
import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import Features from "@/components/Features";
import CourseSection from "@/components/CourseSection";
import SEO from "@/components/SEO";

const Home = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 overflow-x-hidden">
      <SEO
        title="Home"
        description="Welcome to EduHub - Your premium destination for online learning and skill development."
      />
      <Hero />
      <StatsSection />
      <CourseSection />
      <Features />
    </div>
  );
};

export default Home;
