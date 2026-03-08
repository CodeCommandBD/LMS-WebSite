import { HeroImage, HeroImageMov } from "@/assets/image";
import {
  Award,
  User,
  Search,
  Sparkles,
  BookOpen,
  Users,
  GraduationCap,
} from "lucide-react";
import React from "react";
import CountUp from "react-countup";
import { Link, useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const scrollRef = React.useRef(null);

  return (
    <div className="relative min-h-[700px] md:h-[85vh] flex items-center overflow-hidden bg-slate-50 dark:bg-slate-950 pt-20">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-pink-500/10 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content Column */}
        <div className="flex flex-col space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tight">
              Master New Skills <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600">
                Without Limits
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed font-medium">
              Join the world's most advanced learning platform. Expert-led
              courses designed to help you succeed in the digital age.
            </p>
          </div>

          {/* Redesigned Search Bar */}
          <form
            onSubmit={handleSearch}
            className="relative group w-full lg:max-w-[500px]"
          >
            <div className="absolute -inset-1.5 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-2xl transition-all duration-300 group-focus-within:border-indigo-300">
              <div className="pl-4 pr-2">
                <Search className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to learn today?"
                className="flex-1 bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 py-4 text-sm font-semibold focus:outline-none w-full"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-sm font-black rounded-xl hover:scale-[1.03] active:scale-95 transition-all shadow-xl hover:shadow-indigo-500/30"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex flex-wrap items-center gap-6 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm"
                >
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                </div>
              ))}
              <div className="h-10 w-10 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                10k+
              </div>
            </div>
            <p className="text-sm font-bold text-slate-500">
              Trusted by over{" "}
              <span className="text-slate-900 dark:text-slate-200">
                10,000+
              </span>{" "}
              happy students
            </p>
          </div>
        </div>

        {/* Right Media Column */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center">
            {/* Main Image with decorative ring */}
            <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative z-10 w-[85%] h-[85%] rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] group">
              <img
                src={HeroImage}
                alt="Learning platform"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 hidden lg:block"
              />
              <img
                src={HeroImageMov}
                alt="Learning platform"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 lg:hidden"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent"></div>
            </div>

            {/* Floating Stats Card 1 */}
            <div className="absolute top-[15%] -right-4 md:right-0 z-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white/50 animate-bounce-slow max-w-[180px]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-2xl text-slate-900 dark:text-white leading-none">
                    <CountUp end={10} suffix="k+" duration={3} />
                  </h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                    Active Students
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Stats Card 2 */}
            <div className="absolute bottom-[20%] -left-4 md:-left-8 z-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white/50 animate-bounce-slow delay-700 max-w-[180px]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-500 rounded-2xl text-white shadow-lg shadow-pink-500/20">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-2xl text-slate-900 dark:text-white leading-none">
                    <CountUp end={200} suffix="+" duration={3} />
                  </h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                    Certified Tutors
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Stats Card 3 */}
            <div className="absolute bottom-8 right-8 z-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/50 animate-pulse hidden md:block">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Live Lectures Now
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-10px); }
          50% { transform: translateY(10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        .delay-700 { animation-delay: 0.7s; }
      `,
        }}
      />
    </div>
  );
};

export default Hero;
