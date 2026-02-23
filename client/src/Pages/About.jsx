import React from "react";
import { Link } from "react-router-dom";
import { Info, Home, ChevronRight, GraduationCap } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-blue-600 tracking-tight uppercase text-[10px] font-black">
          About Us
        </span>
      </div>

      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="bg-blue-600/10 p-4 rounded-3xl w-fit mx-auto border border-blue-600/20">
            <GraduationCap className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic">
            Revolutionizing <span className="text-blue-600">Learning</span>
          </h1>
          <p className="text-gray-400 text-lg font-medium leading-relaxed">
            EduHub is a next-generation learning platform dedicated to providing
            high-quality, accessible education to everyone, everywhere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#1e293b]/20 border border-gray-800 p-8 rounded-[32px] space-y-4">
            <h3 className="text-xl font-black text-white">Our Mission</h3>
            <p className="text-gray-400 font-medium">
              To democratize education by connecting world-class instructors
              with passionate learners through immersive technology.
            </p>
          </div>
          <div className="bg-[#1e293b]/20 border border-gray-800 p-8 rounded-[32px] space-y-4">
            <h3 className="text-xl font-black text-white">Our Vision</h3>
            <p className="text-gray-400 font-medium">
              A world where financial or geographical barriers never prevent
              someone from achieving their full potential.
            </p>
          </div>
        </div>

        <div className="text-center pt-8">
          <Link to="/courses">
            <button className="px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-2xl shadow-blue-600/20 transition-all active:scale-95">
              Explore Our Courses
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
