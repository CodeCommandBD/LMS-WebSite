import { HeroImage, HeroImageMov } from "@/assets/image";
import { Award, User } from "lucide-react";
import React from "react";
import CountUp from "react-countup";

const Hero = () => {
  return (
    <div className="bg-gray-300 h-auto md:h-[700px] mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full p-4 flex flex-col md:flex-row items-center justify-between">
        {/* Left Side */}
        <div className="w-full md:w-1/2">
          <h1 className="text-4xl mt-10 md:mt-0 md:text-6xl font-extrabold text-gray-700">
            Explore Our <span className="text-blue-500">14000+</span>
            <br />
            Online Courses For All
          </h1>
          <p className="text-gray-600 mt-4 text-lg ">
            Find the perfect course for your needs and goals. Expert
            instructors, flexible learning, and real-world results.
          </p>
          <div className="flex items-center justify-between gap-4 mt-4 border border-gray-700 rounded-lg w-full lg:w-[450px]">
            <input
              type="text"
              placeholder="Search courses"
              className="w-full px-4 py-2 focus:outline-none "
            />
            <button className="px-6 py-3 bg-blue-500 text-white  hover:bg-blue-600">
              Search
            </button>
          </div>
        </div>
        {/* Right Side */}
        <div className="flex items-end relative px-4 md:px-0 w-full md:w-1/2">
          <img
            src={HeroImage}
            alt="heroBanner"
            className="w-full max-w-[600px] h-auto shadow-blue-500/50 drop-shadow-lg hidden lg:block"
          />
          <img
            src={HeroImageMov}
            alt="heroBanner"
            className="w-full max-w-[600px] h-auto shadow-blue-500/50 drop-shadow-lg lg:hidden"
          />
          <div className="hidden md:flex gap-3 items-center rounded-md lg:top-[35%] lg:right-[0%] top-[70%] right-[0%] absolute bg-gray-600 backdrop-blur-sm p-4 shadow-lg">
            <div className="rounded-full bg-blue-400 p-2 text-white">
              <User className="text-2xl" />
            </div>
            <div>
              <h2 className="font-bold text-2xl text-white italic">
                <CountUp end={1000} duration={2} />+
              </h2>
              <p className="text-gray-200 text-sm italic">Active Students</p>
            </div>
          </div>
          <div className="hidden md:flex gap-3 items-center rounded-md top-[40%] left-[0%] lg:top-[25%] lg:left-[5%] absolute bg-gray-600 backdrop-blur-sm p-4 shadow-lg">
            <div className="rounded-full bg-blue-400 p-2 text-white">
              <Award className="text-2xl" />
            </div>
            <div>
              <h2 className="font-bold text-2xl text-white italic">
                <CountUp end={200} duration={2} />+
              </h2>
              <p className="text-gray-200 text-sm italic">Certified Instructors</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
