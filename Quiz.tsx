import { useState, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";

export function Quiz({ language = "ar" }: { language?: string }) {
  const questions = useQuery(api.questions.list);
  const saveResponse = useMutation(api.questions.saveResponse);
  const addQuestions = useMutation(api.questions.addQuestions);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Array<{ questionId: Id<"questions">, response: number }>>([]);
  const [showResults, setShowResults] = useState(false);
  const [personality, setPersonality] = useState<string | null>(null);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const translations = {
    previous: language === "ar" ? "السابق" : "Previous",
    noQuestions: language === "ar" ? "لا توجد أسئلة متاحة حالياً" : "No questions available",
    addQuestions: language === "ar" ? "إضافة الأسئلة" : "Add Questions",
    questionsAdded: language === "ar" ? "تم إضافة الأسئلة!" : "Questions added successfully!",
    questionsAddedDesc: language === "ar" ? "تم إضافة الأسئلة!" : "Questions have been added!",
    result: language === "ar" ? "نتيجتك 🎉" : "Your Result 🎉",
    youAre: language === "ar" ? "أنت" : "You are",
    interestLevel: language === "ar" ? "مستوى اهتمامك بالبرمجة:" : "Your Programming Interest Level:",
    newBadges: language === "ar" ? "🎊 حصلت على شارات جديدة!" : "🎊 You earned new badges!",
    tryAgain: language === "ar" ? "حاول مرة أخرى" : "Try Again",
    startOver: language === "ar" ? "ابدأ من جديد" : "Start Over",
    question: language === "ar" ? "السؤال" : "Question",
    of: language === "ar" ? "من" : "of",
    answersSaved: language === "ar" ? "تم حفظ إجاباتك!" : "Answers saved successfully!",
    answersSavedDesc: language === "ar" ? "تم حفظ إجاباتك!" : "Your answers have been saved!",
    errorSaving: language === "ar" ? "حدث خطأ في حفظ إجاباتك" : "Error saving answers",
    errorSavingDesc: language === "ar" ? "حدث خطأ في حفظ إجاباتك" : "There was an error saving your answers",
    share: language === "ar" ? "مشاركة النتيجة" : "Share Result",
    shareDesc: language === "ar" ? "حفظ النتيجة كصورة" : "Save result as image",
  };

  const personalityMap = {
    "مهتم بالبرمجة": "Interested in Programming",
    "متردد": "Undecided",
    "غير مهتم": "Not Interested"
  };

  // Rest of the component code remains the same...
  
  const generateShareImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !personality) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 1080;  // Instagram-friendly size
    canvas.height = 1080;

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#0d9488");  // teal-600
    gradient.addColorStop(1, "#7c3aed");  // purple-600
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add semi-transparent overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Configure text
    ctx.textAlign = "center";
    ctx.fillStyle = "white";

    // Draw title
    ctx.font = "bold 72px Poppins";
    ctx.fillText(translations.result, canvas.width / 2, 200);

    // Draw personality result
    ctx.font = "bold 96px Poppins";
    const personalityText = language === "ar" ? personality : personalityMap[personality as keyof typeof personalityMap];
    ctx.fillText(personalityText, canvas.width / 2, canvas.height / 2);

    // Draw percentage
    const percentage = Math.round(((3 - answers.reduce((sum, a) => sum + a.response, 0) / answers.length) / 2) * 100);
    ctx.font = "64px Poppins";
    ctx.fillText(`${percentage}%`, canvas.width / 2, canvas.height / 2 + 100);

    // Draw badges if any
    if (newBadges.length > 0) {
      ctx.font = "48px Poppins";
      ctx.fillText(translations.newBadges, canvas.width / 2, canvas.height - 200);
      ctx.font = "40px Poppins";
      ctx.fillText(newBadges.join(" • "), canvas.width / 2, canvas.height - 120);
    }

    // Add watermark
    ctx.font = "32px Poppins";
    ctx.fillText("programyourfuture.app", canvas.width / 2, canvas.height - 40);

    // Download the image
    const link = document.createElement("a");
    link.download = "quiz-result.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  if (questions === undefined) {
    return (
      <div className="flex justify-center items-center bg-white/20 backdrop-blur-md rounded-xl p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center bg-white/20 backdrop-blur-md rounded-xl p-8">
        <div className="text-xl mb-4 text-white">{translations.noQuestions}</div>
        <button
          onClick={async () => {
            await addQuestions();
            toast.success(translations.questionsAdded, { 
              description: translations.questionsAddedDesc 
            });
          }}
          className="bg-teal-500 text-white px-6 py-3 rounded-xl hover:bg-teal-600
                     transition-colors duration-200 font-semibold"
        >
          {translations.addQuestions}
        </button>
      </div>
    );
  }

  if (showResults) {
    const avgScore = answers.reduce((sum, a) => sum + a.response, 0) / answers.length;
    const percentage = ((3 - avgScore) / 2) * 100;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/20 backdrop-blur-md rounded-xl p-8 text-white"
      >
        <h2 className="text-3xl font-bold mb-6">{translations.result}</h2>
        <div className="text-2xl mb-8">
          {language === "ar" ? (
            <>أنت <span className="font-bold">{personality}</span></>
          ) : (
            <>{translations.youAre} <span className="font-bold">
              {personalityMap[personality as keyof typeof personalityMap]}
            </span></>
          )}
        </div>
        <div className="mb-8">
          <h3 className="text-xl mb-4">{translations.interestLevel}</h3>
          <div className="relative h-8 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 to-purple-500"
            />
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center font-bold">
              {Math.round(percentage)}%
            </div>
          </div>
        </div>
        {newBadges.length > 0 && (
          <div className="mb-8 p-4 bg-white/10 rounded-xl">
            <h3 className="text-xl mb-4">{translations.newBadges}</h3>
            <div className="flex gap-2 flex-wrap">
              {newBadges.map((badge, index) => (
                <motion.div
                  key={badge}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white/20 px-3 py-1 rounded-full font-semibold"
                >
                  {badge}
                </motion.div>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-4">
          <button
            onClick={() => {
              setShowResults(false);
              setCurrentQuestion(0);
              setAnswers([]);
              setPersonality(null);
              setNewBadges([]);
            }}
            className="flex-1 bg-teal-500 text-white px-6 py-3 rounded-xl hover:bg-teal-600
                      transition-colors duration-200 font-semibold"
          >
            {translations.tryAgain}
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateShareImage}
            className="flex-1 bg-purple-500 text-white px-6 py-3 rounded-xl hover:bg-purple-600
                      transition-colors duration-200 font-semibold flex items-center justify-center gap-2"
          >
            {translations.share} 🖼️
          </motion.button>
        </div>
        
        {/* Hidden canvas for generating the image */}
        <canvas
          ref={canvasRef}
          style={{ display: "none" }}
        />
      </motion.div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  if (!currentQuestionData) {
    return null;
  }

  const handlePrevious = () => {
    if (isAnimating || currentQuestion === 0) return;
    setIsAnimating(true);
    setSlideDirection("right");
    
    const prevAnswer = answers.find(a => a.questionId === questions[currentQuestion - 1]._id);
    setSelectedAnswer(prevAnswer?.response ?? null);
    
    setCurrentQuestion(currentQuestion - 1);
    setIsAnimating(false);
  };

  const handleAnswer = (value: number) => {
    if (isAnimating) return;
    setSelectedAnswer(value);
    setIsAnimating(true);
    
    setTimeout(() => {
      const newAnswers = [...answers.filter(a => a.questionId !== currentQuestionData._id), { 
        questionId: currentQuestionData._id,
        response: value 
      }];
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setSlideDirection("left");
        setCurrentQuestion(currentQuestion + 1);
        const nextAnswer = answers.find(a => a.questionId === questions[currentQuestion + 1]._id);
        setSelectedAnswer(nextAnswer?.response ?? null);
        setIsAnimating(false);
      } else {
        saveResponse({ answers: newAnswers })
          .then(result => {
            setShowResults(true);
            setPersonality(result.personality);
            setNewBadges(result.newBadges);
            setIsAnimating(false);
            toast.success(translations.answersSaved, { 
              description: translations.answersSavedDesc 
            });
          })
          .catch(() => {
            setIsAnimating(false);
            toast.error(translations.errorSaving, {
              description: translations.errorSavingDesc
            });
          });
      }
    }, 500);
  };

  const getButtonColor = (value: number) => {
    if (selectedAnswer === value) {
      switch (value) {
        case 1: return "bg-emerald-500 hover:bg-emerald-600";
        case 2: return "bg-gray-500 hover:bg-gray-600";
        case 3: return "bg-red-500 hover:bg-red-600";
        default: return "bg-white/20 hover:bg-white/30";
      }
    }
    return "bg-white/20 hover:bg-white/30";
  };

  const getButtonRingColor = (value: number) => {
    if (selectedAnswer === value) {
      switch (value) {
        case 1: return "ring-4 ring-emerald-400/50";
        case 2: return "ring-4 ring-gray-400/50";
        case 3: return "ring-4 ring-red-400/50";
        default: return "";
      }
    }
    return "";
  };

  const slideVariants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "left" ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: "left" | "right") => ({
      zIndex: 0,
      x: direction === "left" ? -1000 : 1000,
      opacity: 0
    })
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-8 p-8 bg-white/20 backdrop-blur-md rounded-xl"
    >
      <AnimatePresence mode="wait" custom={slideDirection}>
        <motion.h2
          key={currentQuestion}
          custom={slideDirection}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="text-2xl font-semibold text-white text-center"
        >
          {language === "ar" ? currentQuestionData.text_ar : currentQuestionData.text_en}
        </motion.h2>
      </AnimatePresence>
      <div className="flex gap-8 justify-center">
        {[
          { value: 1, label_ar: "نعم", label_en: "Yes", color: "emerald" },
          { value: 2, label_ar: "محايد", label_en: "Neutral", color: "gray" },
          { value: 3, label_ar: "لا", label_en: "No", color: "red" }
        ].map(({ value, label_ar, label_en, color }) => (
          <motion.button
            key={value}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleAnswer(value)}
            className="flex flex-col items-center gap-2"
            disabled={selectedAnswer !== null}
          >
            <motion.div
              className={`w-16 h-16 rounded-full ${getButtonColor(value)} ${getButtonRingColor(value)}
                        flex items-center justify-center text-white text-xl font-bold
                        transition-all duration-300 shadow-lg`}
              animate={{
                scale: selectedAnswer === value ? 1.1 : 1,
                backgroundColor: selectedAnswer === value 
                  ? color === "emerald" 
                    ? "rgb(16 185 129)" 
                    : color === "gray"
                    ? "rgb(107 114 128)"
                    : "rgb(239 68 68)"
                  : "rgba(255, 255, 255, 0.2)",
                transition: { duration: 0.2 }
              }}
            >
              {value}
            </motion.div>
            <div className="text-white text-sm">{language === "ar" ? label_ar : label_en}</div>
          </motion.button>
        ))}
      </div>
      <div className="flex items-center gap-4">
        {currentQuestion > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            className={`bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-xl
                      transition-all duration-200 font-semibold shadow-lg
                      ${language === "ar" ? "flex flex-row-reverse" : "flex"} items-center gap-2`}
          >
            {language === "ar" ? "→" : "←"} {translations.previous}
          </motion.button>
        )}
        <motion.div 
          className="text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {language === "ar" 
            ? `${translations.question} ${currentQuestion + 1} ${translations.of} ${questions.length}`
            : `${translations.question} ${currentQuestion + 1} ${translations.of} ${questions.length}`}
        </motion.div>
      </div>
    </motion.div>
  );
}
