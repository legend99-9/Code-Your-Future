import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { motion } from "framer-motion";
import { toast } from "sonner";

export function ProfileSetup({ language }: { language: string }) {
  const [name, setName] = useState("");
  const saveProfile = useMutation(api.profiles.save);
  const badges = useQuery(api.badges.getUserBadges) ?? [];

  const translations = {
    welcome: language === "ar" ? "مرحباً! 👋" : "Welcome! 👋",
    beforeStart: language === "ar" ? "قبل أن نبدأ، نحتاج إلى معرفة اسمك" : "Before we start, we need to know your name",
    nickname: language === "ar" ? "الاسم المستعار" : "Nickname",
    example: language === "ar" ? "مثال: أحمد" : "Example: Ahmed",
    continue: language === "ar" ? "متابعة" : "Continue",
    earnedBadges: language === "ar" ? "الشارات المكتسبة:" : "Earned Badges:",
    errorName: language === "ar" ? "الرجاء إدخال اسمك" : "Please enter your name",
    successProfile: language === "ar" ? "تم حفظ الملف الشخصي بنجاح!" : "Profile saved successfully!",
    errorProfile: language === "ar" ? "خطأ في حفظ الملف الشخصي" : "Error saving profile",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(translations.errorName);
      return;
    }
    try {
      await saveProfile({ name: name.trim() });
      toast.success(translations.successProfile);
    } catch (error) {
      toast.error(translations.errorProfile);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/20 backdrop-blur-md rounded-xl p-8 shadow-xl w-full max-w-md mx-auto"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        {translations.welcome}
      </h2>
      <p className="text-white/80 mb-8 text-center">
        {translations.beforeStart}
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-white mb-2">
            {translations.nickname}
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={translations.example}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 
                     text-white placeholder-white/50 focus:outline-none focus:border-teal-400"
            autoFocus
          />
        </div>
        {badges.length > 0 && (
          <div className="mt-8">
            <h3 className="text-white mb-4">
              {translations.earnedBadges}
            </h3>
            <div className="flex gap-2 flex-wrap">
              {badges.map((badge) => (
                <div
                  key={badge}
                  className="bg-white/10 px-3 py-1 rounded-full text-white"
                >
                  {badge}
                </div>
              ))}
            </div>
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-gradient-to-r from-teal-500 to-purple-500 text-white 
                    py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          {translations.continue}
        </motion.button>
      </form>
    </motion.div>
  );
}
