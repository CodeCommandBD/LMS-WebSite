import React from "react";
import { Link } from "react-router";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white border-t border-white/20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 py-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm border border-white/30 shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">EduHub</h1>
          </div>
          <p className="text-white/80 leading-relaxed">
            Empowering learners worldwide with quality education. Join thousands
            of students on their journey to success.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="text-white/80 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
              >
                → Home
              </Link>
            </li>
            <li>
              <Link
                to="/courses"
                className="text-white/80 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
              >
                → Courses
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-white/80 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
              >
                → About Us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-white/80 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
              >
                → Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Contact Us</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-300">
              <MapPin className="w-5 h-5" />
              <p>Dhaka, Bangladesh</p>
            </div>
            <div className="flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-300">
              <Mail className="w-5 h-5" />
              <p>info@eduhub.com</p>
            </div>
            <div className="flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-300">
              <Phone className="w-5 h-5" />
              <p>+880 1234-567890</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/20 py-6">
        <p className="text-center text-white/70 text-sm">
          Copyright © {new Date().getFullYear()} EduHub. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
