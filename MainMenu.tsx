import { motion } from "framer-motion";

export function MainMenu({ setView, language }: { 
  setView: (view: "menu" | "quiz" | "settings" | "leaderboard" | "badges" | "statistics") => void;
  language: string;
}) {
  const translations = {
    title: language === "ar" ? "برمج مستقبلك" : "Program Your Future!",
    startQuiz: language === "ar" ? "ابدأ الاختبار" : "Start Quiz",
    leaderboard: language === "ar" ? "المتصدرون" : "Leaderboard",
    badges: language === "ar" ? "الشارات" : "Badges",
    settings: language === "ar" ? "الإعدادات" : "Settings",
    statistics: language === "ar" ? "الإحصائيات" : "Statistics",
  };

  return (
    <div className="flex flex-col items-center gap-8 text-white">
      <h1 className="text-6xl font-bold mb-12">
        {translations.title}
      </h1>
      <div className="flex flex-col gap-4 w-64">
        <MenuButton onClick={() => setView("quiz")} icon="🎮" title={translations.startQuiz} text={translations.startQuiz} />
        <MenuButton onClick={() => setView("statistics")} icon="📊" title={translations.statistics} text={translations.statistics} />
        <MenuButton onClick={() => setView("leaderboard")} icon="🏆" title={translations.leaderboard} text={translations.leaderboard} />
        <MenuButton onClick={() => setView("badges")} icon="🎖️" title={translations.badges} text={translations.badges} />
        <MenuButton onClick={() => setView("settings")} icon="⚙️" title={translations.settings} text={translations.settings} />
      </div>
    </div>
  );
}

function MenuButton({ text, onClick, icon, title }: {
  text: string;
  onClick: () => void;
  icon: string;
  title: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      title={title}
      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors
                 py-4 px-8 rounded-xl text-xl font-semibold shadow-lg
                 flex items-center gap-4 group relative"
    >
      <span className="text-2xl">{icon}</span>
      {text}
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white 
                    px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 
                    transition-opacity duration-200 whitespace-nowrap">
        {title}
      </span>
    </motion.button>
  );
}
