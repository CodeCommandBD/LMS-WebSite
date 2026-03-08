import React from "react";
import {
  Zap,
  ShieldCheck,
  Globe,
  Infinity,
  Headphones,
  Rocket,
} from "lucide-react";

const features = [
  {
    title: "Lifetime Access",
    desc: "Learn at your own pace with unrestricted access to your courses forever.",
    icon: <Infinity className="w-7 h-7" />,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Expert Tutors",
    desc: "Learn from industry professionals with real-world experience and passion.",
    icon: <Zap className="w-7 h-7" />,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    title: "Global Community",
    desc: "Connect with thousands of students worldwide and share your journey.",
    icon: <Globe className="w-7 h-7" />,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Verified Certificates",
    desc: "Earn industry-recognized certificates to boost your professional profile.",
    icon: <ShieldCheck className="w-7 h-7" />,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    title: "24/7 Support",
    desc: "Our dedicated support team is always here to help you throughout your path.",
    icon: <Headphones className="w-7 h-7" />,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    title: "Fast-Track Career",
    desc: "Designed to help you land your dream job faster with practical projects.",
    icon: <Rocket className="w-7 h-7" />,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
      {/* Decorative Blob */}
      <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="inline-block px-4 py-1.5 rounded-full bg-linear-to-r from-indigo-500/10 to-pink-500/10 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-6 border border-indigo-100 dark:border-indigo-900/30">
            Why Choose Us
          </h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
            Elevate Your Learning <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600">
              Experience
            </span>
          </h3>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
            We provide a unique learning environment combining cutting-edge
            technology with expert guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="group p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/5"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${f.bgColor} ${f.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6`}
              >
                {f.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                {f.title}
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
