import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { motion } from "framer-motion";

interface LeaderboardEntry {
  name: string;
  personality: string;
  points: number;
  rank: string;
}

export function Leaderboard({ language }: { language: string }) {
  const leaderboard = useQuery(api.questions.getLeaderboard) ?? [];

  const translations = {
    title: language === "ar" ? "لوحة المتصدرين 🏆" : "Leaderboard 🏆",
    points: language === "ar" ? "نقطة" : "XP",
    rank: language === "ar" ? "الرتبة" : "Rank",
    personalities: {
      "Interested in Programming": language === "ar" ? "مهتم بالبرمجة" : "Interested in Programming",
      "Undecided": language === "ar" ? "متردد" : "Undecided",
      "Not Interested": language === "ar" ? "غير مهتم" : "Not Interested",
    },
    ranks: {
      "Legendary Developer": language === "ar" ? "مطور أسطوري" : "Legendary Developer",
      "Master Developer": language === "ar" ? "مطور خبير" : "Master Developer",
      "Senior Developer": language === "ar" ? "مطور متقدم" : "Senior Developer",
      "Developer": language === "ar" ? "مطور" : "Developer",
      "Junior Developer": language === "ar" ? "مطور مبتدئ" : "Junior Developer",
      "Code Enthusiast": language === "ar" ? "متحمس للبرمجة" : "Code Enthusiast",
      "Code Apprentice": language === "ar" ? "متدرب برمجة" : "Code Apprentice",
      "Code Novice": language === "ar" ? "مبتدئ برمجة" : "Code Novice",
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "Legendary Developer": return "from-yellow-400 to-amber-600";
      case "Master Developer": return "from-purple-400 to-purple-600";
      case "Senior Developer": return "from-blue-400 to-blue-600";
      case "Developer": return "from-green-400 to-green-600";
      case "Junior Developer": return "from-teal-400 to-teal-600";
      case "Code Enthusiast": return "from-cyan-400 to-cyan-600";
      case "Code Apprentice": return "from-indigo-400 to-indigo-600";
      default: return "from-gray-400 to-gray-600";
    }
  };

  const getAvatarEmoji = (rank: string) => {
    switch (rank) {
      case "Legendary Developer": return "👑";
      case "Master Developer": return "⭐";
      case "Senior Developer": return "💫";
      case "Developer": return "💻";
      case "Junior Developer": return "🚀";
      case "Code Enthusiast": return "✨";
      case "Code Apprentice": return "🌱";
      default: return "🎮";
    }
  };

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-xl p-8 text-white" dir={language === "ar" ? "rtl" : "ltr"}>
      <h2 className="text-3xl font-bold mb-8">{translations.title}</h2>
      <div className="space-y-4">
        {leaderboard.map((entry: LeaderboardEntry, index: number) => (
          <motion.div
            initial={{ opacity: 0, x: language === "ar" ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            key={index}
            className={`flex items-center gap-4 p-4 rounded-xl ${
              index === 0 
                ? "bg-gradient-to-r from-yellow-500/30 to-amber-500/30 border border-yellow-500/50" 
                : index === 1 
                ? "bg-gradient-to-r from-slate-400/30 to-gray-500/30 border border-slate-400/50"
                : index === 2
                ? "bg-gradient-to-r from-orange-700/30 to-orange-800/30 border border-orange-700/50"
                : "bg-white/10"
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl
              ${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-slate-400" : index === 2 ? "bg-orange-700" : "bg-teal-500"}`}>
              {index + 1}
            </div>
            
            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getRankColor(entry.rank)} 
                           flex items-center justify-center text-2xl shadow-lg`}>
              {getAvatarEmoji(entry.rank)}
            </div>

            <div className="flex-1">
              <div className="font-semibold text-xl flex items-center gap-2">
                {entry.name}
                {index === 0 && "👑"}
              </div>
              <div className="flex items-center gap-2 text-sm opacity-80">
                <span className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${getRankColor(entry.rank)}`}>
                  {translations.ranks[entry.rank as keyof typeof translations.ranks]}
                </span>
                <span className={`
                  ${entry.personality === "Interested in Programming" ? "text-teal-200" : 
                    entry.personality === "Undecided" ? "text-purple-200" : "text-red-200"}
                `}>
                  {translations.personalities[entry.personality as keyof typeof translations.personalities]}
                </span>
              </div>
            </div>

            <div className="text-2xl font-bold flex items-center gap-2">
              {entry.points}
              <span className="text-sm font-normal opacity-70">{translations.points}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
