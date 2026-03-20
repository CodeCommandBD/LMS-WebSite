import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Medal, Crown, TrendingUp, User as UserIcon, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const fetchLeaderboard = () => api.get("/points/leaderboard").then((r) => r.data.leaderboard);

const Leaderboard = () => {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: fetchLeaderboard,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const sortedLeaderboard = leaderboard || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4">
            <Trophy className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
            Student Leaderboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Join the top learners and climb the ranks by completing courses and quizzes!
          </p>
        </div>

        {/* Top 3 Spades */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {sortedLeaderboard.slice(0, 3).map((student, index) => (
            <div
              key={student._id}
              className={`relative p-8 rounded-[32px] border-2 shadow-2xl flex flex-col items-center transform hover:scale-105 transition-all duration-300 ${
                index === 0
                  ? "bg-linear-to-br from-yellow-400 to-amber-600 border-yellow-300 text-white order-1 md:order-2 md:-translate-y-4"
                  : index === 1
                  ? "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 order-2 md:order-1"
                  : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 order-3 md:order-3"
              }`}
            >
              {index === 0 && (
                <Crown className="absolute -top-6 w-12 h-12 text-yellow-500 drop-shadow-lg" />
              )}
              <div className="relative mb-4">
                <Avatar className="w-24 h-24 border-4 border-white shadow-xl">
                  <AvatarImage src={student.userId?.profilePicture} />
                  <AvatarFallback className="text-2xl font-black bg-blue-100 text-blue-600">
                    {student.userId?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center font-black border-2 border-white shadow-lg ${
                  index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-600"
                }`}>
                  {index + 1}
                </div>
              </div>
              <h3 className={`text-xl font-bold truncate max-w-full ${index === 0 ? "text-white" : "text-gray-900 dark:text-white"}`}>
                {student.userId?.name}
              </h3>
              <div className={`flex items-center gap-2 mt-2 px-4 py-1.5 rounded-full font-black text-sm ${
                index === 0 ? "bg-white/20" : "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
              }`}>
                <TrendingUp className="w-4 h-4" />
                {student.totalPoints} pts
              </div>
            </div>
          ))}
        </div>

        {/* The List (Rank 4+) */}
        <div className="bg-white dark:bg-gray-800 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700/50">
                  <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Rank</th>
                  <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Student</th>
                  <th className="px-8 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {sortedLeaderboard.slice(3).map((student, index) => (
                  <tr key={student._id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                    <td className="px-8 py-5">
                      <span className="text-lg font-black text-gray-400 group-hover:text-blue-600 transition-colors">
                        #{index + 4}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-10 h-10 border-2 border-transparent group-hover:border-blue-500/20 transition-all">
                          <AvatarImage src={student.userId?.profilePicture} />
                          <AvatarFallback className="font-bold bg-blue-50 text-blue-600 text-xs">
                            {student.userId?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-gray-900 dark:text-white group-hover:translate-x-1 transition-transform inline-block">
                          {student.userId?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Badge variant="outline" className="font-black text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10">
                        {student.totalPoints} pts
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {sortedLeaderboard.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-[40px] border-2 border-dashed border-gray-200 dark:border-gray-700">
            <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">No rankings yet</h3>
            <p className="text-gray-500">Be the first to join the leaderboard by learning!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
