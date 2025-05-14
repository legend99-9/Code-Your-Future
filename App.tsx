import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState } from "react";
import { Quiz } from "./Quiz";
import { MainMenu } from "./MainMenu";
import { Settings } from "./Settings";
import { Leaderboard } from "./Leaderboard";
import { ProfileSetup } from "./ProfileSetup";
import { Badges } from "./Badges";
import { Statistics } from "./Statistics";

type ThemeType = "default" | "blue" | "green" | "purple" | "orange" | "pink" | "red" | "yellow" | "cyan" | "indigo" | "lime" | "emerald" | "sky" | "violet" | "rose";

export default function App() {
  const [view, setView] = useState<"menu" | "quiz" | "settings" | "leaderboard" | "badges" | "statistics">("menu");
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [theme, setTheme] = useState<ThemeType>("default");
  const [mode, setMode] = useState<"light" | "dark" | "system">("system");

  const themeClasses = {
    default: "from-teal-500 to-purple-600",
    blue: "from-blue-500 to-indigo-600",
    green: "from-emerald-500 to-teal-600",
    purple: "from-purple-500 to-pink-600",
    orange: "from-orange-500 to-red-600",
    pink: "from-pink-500 to-rose-600",
    red: "from-red-500 to-rose-600",
    yellow: "from-yellow-500 to-amber-600",
    cyan: "from-cyan-500 to-blue-600",
    indigo: "from-indigo-500 to-violet-600",
    lime: "from-lime-500 to-green-600",
    emerald: "from-emerald-500 to-green-600",
    sky: "from-sky-500 to-blue-600",
    violet: "from-violet-500 to-purple-600",
    rose: "from-rose-500 to-pink-600"
  } as const;

  const modeClasses = {
    light: "bg-white text-gray-900",
    dark: "bg-gray-900 text-white",
    system: typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? "bg-gray-900 text-white" 
      : "bg-white text-gray-900"
  };

  const translations = {
    title: language === "ar" ? "برمج مستقبلك!" : "Program Your Future!",
    mainMenu: language === "ar" ? "القائمة الرئيسية" : "Main Menu",
    signIn: language === "ar" ? "سجل دخول لبدء الاختبار" : "Sign in to start the quiz",
    discover: language === "ar" ? "اكتشف مستقبلك البرمجي" : "Discover Your Programming Future",
    copyright: language === "ar" ? "© 2025 أحمد بلفقيه. جميع الحقوق محفوظة." : "© 2025 Ahmed Balfaqih. All rights reserved.",
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br ${themeClasses[theme]} ${modeClasses[mode]}`} dir={language === "ar" ? "rtl" : "ltr"}>
      <header className="sticky top-0 z-10 bg-white/10 backdrop-blur-sm p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">{translations.title}</h2>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setView("menu")}
            className="text-white hover:text-teal-200 transition-colors"
          >
            {translations.mainMenu}
          </button>
          <SignOutButton />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl mx-auto">
          <Content 
            view={view} 
            setView={setView} 
            language={language} 
            setLanguage={setLanguage} 
            theme={theme} 
            setTheme={setTheme}
            mode={mode}
            setMode={setMode}
          />
        </div>
      </main>
      <footer className="text-center text-white/70 py-4 bg-black/10">
        <p>{translations.copyright}</p>
      </footer>
      <Toaster />
    </div>
  );
}

function Content({ view, setView, language, setLanguage, theme, setTheme, mode, setMode }: {
  view: string;
  setView: (view: "menu" | "quiz" | "settings" | "leaderboard" | "badges" | "statistics") => void;
  language: "ar" | "en";
  setLanguage: (lang: "ar" | "en") => void;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  mode: "light" | "dark" | "system";
  setMode: (mode: "light" | "dark" | "system") => void;
}) {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const profile = useQuery(api.profiles.get);
  const lastResponse = useQuery(api.questions.getLastResponse);

  const translations = {
    discover: language === "ar" ? "اكتشف مستقبلك البرمجي" : "Discover Your Programming Future",
    signIn: language === "ar" ? "سجل دخول لبدء الاختبار" : "Sign in to start the quiz",
    lastResult: language === "ar" ? "النتيجة السابقة" : "Last Result",
  };

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!loggedInUser) {
    return (
      <div className="bg-white/20 backdrop-blur-md rounded-xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            {translations.discover}
          </h1>
          <p className="text-xl text-teal-100">
            {translations.signIn}
          </p>
        </div>
        <SignInForm />
      </div>
    );
  }

  if (!profile) {
    return <ProfileSetup language={language} />;
  }

  switch (view) {
    case "quiz":
      return <Quiz language={language} />;
    case "settings":
      return <Settings 
        language={language} 
        setLanguage={setLanguage} 
        theme={theme} 
        setTheme={setTheme}
        mode={mode}
        setMode={setMode}
      />;
    case "leaderboard":
      return <Leaderboard language={language} />;
    case "badges":
      return <Badges language={language} />;
    case "statistics":
      return <Statistics language={language} />;
    default:
      return (
        <>
          <MainMenu setView={setView} language={language} />
          {lastResponse && (
            <div className="mt-8 text-center text-white/80">
              {translations.lastResult}: {lastResponse.personality} ({Math.round(((3 - (lastResponse.score ?? 0)) / 2) * 100)}%)
            </div>
          )}
        </>
      );
  }
}
