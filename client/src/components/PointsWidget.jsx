import React from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, History, Award, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const fetchMyPoints = () => api.get("/points/me").then((r) => r.data);

const PointsWidget = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["myPoints"],
    queryFn: fetchMyPoints,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 bg-white/5 rounded-[32px] border border-white/10">
        <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
      </div>
    );
  }

  const points = data?.points?.totalPoints || 0;
  const history = data?.points?.history || [];
  const rank = data?.rank || "-";

  return (
    <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-8 rounded-[32px] shadow-xl text-white relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
        <Award className="w-32 h-32" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold">My Achievements</h3>
            <p className="text-indigo-100 text-xs">Keep learning to earn more!</p>
          </div>
          <Badge className="bg-white/20 text-white border-white/20 px-3 py-1 font-black">
            Rank #{rank}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-widest block mb-1 opacity-70">
              Total Points
            </span>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-300" />
              <span className="text-2xl font-black">{points}</span>
            </div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-widest block mb-1 opacity-70">
              Activities
            </span>
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-purple-300" />
              <span className="text-2xl font-black">{history.length}</span>
            </div>
          </div>
        </div>

        {/* Recent History */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest opacity-70 flex items-center gap-2">
            <History className="w-3 h-3" /> Recent Activity
          </h4>
          <div className="max-h-32 overflow-y-auto pr-2 custom-scrollbar">
            {history.length > 0 ? (
              history.slice(-5).reverse().map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-xs truncate max-w-[140px] opacity-90">{item.reason}</span>
                  <span className={`text-xs font-black ${item.points > 0 ? "text-green-300" : "text-red-300"}`}>
                    {item.points > 0 ? "+" : ""}{item.points}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs italic opacity-50 py-2">No activity yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsWidget;
