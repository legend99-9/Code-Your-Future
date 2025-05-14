import { motion } from "framer-motion";

type ThemeType = "default" | "blue" | "green" | "purple" | "orange" | "pink" | "red" | "yellow" | "cyan" | "indigo" | "lime" | "emerald" | "sky" | "violet" | "rose";

export function Settings({ 
  language, 
  setLanguage, 
  theme, 
  setTheme,
  mode,
  setMode 
}: {
  language: "en" | "ar";
  setLanguage: (lang: "en" | "ar") => void;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  mode: "light" | "dark" | "system";
  setMode: (mode: "light" | "dark" | "system") => void;
}) {
  const translations = {
    settings: language === "ar" ? "الإعدادات" : "Settings",
    language: language === "ar" ? "اللغة" : "Language",
    theme: language === "ar" ? "المظهر" : "Theme",
    mode: language === "ar" ? "الوضع" : "Mode",
    default: language === "ar" ? "افتراضي" : "Default",
    blue: language === "ar" ? "أزرق" : "Blue",
    green: language === "ar" ? "أخضر" : "Green",
    purple: language === "ar" ? "بنفسجي" : "Purple",
    orange: language === "ar" ? "برتقالي" : "Orange",
    pink: language === "ar" ? "وردي" : "Pink",
    red: language === "ar" ? "أحمر" : "Red",
    yellow: language === "ar" ? "أصفر" : "Yellow",
    cyan: language === "ar" ? "سماوي" : "Cyan",
    indigo: language === "ar" ? "نيلي" : "Indigo",
    lime: language === "ar" ? "ليموني" : "Lime",
    emerald: language === "ar" ? "زمردي" : "Emerald",
    sky: language === "ar" ? "سماوي فاتح" : "Sky",
    violet: language === "ar" ? "بنفسجي غامق" : "Violet",
    rose: language === "ar" ? "وردي غامق" : "Rose",
    english: language === "ar" ? "الإنجليزية" : "English",
    arabic: language === "ar" ? "العربية" : "Arabic",
    light: language === "ar" ? "فاتح" : "Light",
    dark: language === "ar" ? "داكن" : "Dark",
    system: language === "ar" ? "النظام" : "System",
    modeDescription: {
      light: language === "ar" ? "مظهر فاتح دائماً" : "Always light appearance",
      dark: language === "ar" ? "مظهر داكن دائماً" : "Always dark appearance",
      system: language === "ar" ? "يتبع إعدادات النظام" : "Follow system settings"
    }
  };

  const themeColors = {
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

  const modeIcons = {
    light: "☀️",
    dark: "🌙",
    system: "💻"
  };

  const getThemeTranslation = (themeKey: ThemeType) => {
    return translations[themeKey] || themeKey;
  };

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-xl p-8 text-white" dir={language === "ar" ? "rtl" : "ltr"}>
      <h2 className="text-3xl font-bold mb-8">{translations.settings}</h2>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <label className="text-xl">{translations.language}</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "en" | "ar")}
            className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2"
          >
            <option value="en">{translations.english}</option>
            <option value="ar">{translations.arabic}</option>
          </select>
        </div>

        <div>
          <label className="text-xl block mb-4">{translations.mode}</label>
          <div className="flex gap-4">
            {(["light", "dark", "system"] as const).map((m) => (
              <motion.button
                key={m}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMode(m)}
                className={`flex-1 p-4 rounded-xl flex flex-col items-center gap-2
                  ${mode === m 
                    ? "bg-white/30 ring-2 ring-white" 
                    : "bg-white/10 hover:bg-white/20"}`}
              >
                <span className="text-2xl">{modeIcons[m]}</span>
                <span className="font-semibold">{translations[m]}</span>
                <span className="text-sm opacity-70 text-center">
                  {translations.modeDescription[m]}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xl block mb-4">{translations.theme}</label>
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(themeColors).map(([key, colors]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(key as ThemeType)}
                className={`p-4 rounded-xl bg-gradient-to-br ${colors}
                  ${theme === key 
                    ? "ring-2 ring-white ring-offset-2 ring-offset-black/20" 
                    : "opacity-70 hover:opacity-100"}
                  aspect-square transition-all duration-200 group relative`}
                title={getThemeTranslation(key as ThemeType)}
              >
                <span className="sr-only">
                  {getThemeTranslation(key as ThemeType)}
                </span>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 
                                px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 
                                transition-opacity duration-200 whitespace-nowrap">
                  {getThemeTranslation(key as ThemeType)}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
