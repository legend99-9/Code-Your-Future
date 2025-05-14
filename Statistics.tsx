import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doc } from "../convex/_generated/dataModel";

ChartJS.register(ArcElement, Tooltip, Legend);

type Response = Doc<"responses"> & { score: number };

export function Statistics({ language }: { language: string }) {
  const responses = useQuery(api.questions.getAllResponses) ?? [];

  const translations = {
    title: language === "ar" ? "إحصائيات 📊" : "Statistics 📊",
    openToProgramming: language === "ar" ? "مهتم بالبرمجة" : "Open to Programming",
    undecided: language === "ar" ? "متردد" : "Undecided",
    notInterested: language === "ar" ? "غير مهتم" : "Not Interested",
    noData: language === "ar" ? "لا توجد بيانات متاحة" : "No data available",
    percentage: language === "ar" ? "النسبة" : "Percentage",
    distribution: language === "ar" ? "توزيع النتائج" : "Results Distribution",
  };

  if (responses.length === 0) {
    return (
      <div className="bg-white/20 backdrop-blur-md rounded-xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">{translations.title}</h2>
        <p>{translations.noData}</p>
      </div>
    );
  }

  const scores = responses.map((r: Response) => ((3 - r.score) / 2) * 100);
  const openCount = scores.filter((s: number) => s >= 75).length;
  const undecidedCount = scores.filter((s: number) => s >= 25 && s < 75).length;
  const notInterestedCount = scores.filter((s: number) => s < 25).length;

  const data = {
    labels: [
      `👨‍💻 ${translations.openToProgramming}`,
      `🤷 ${translations.undecided}`,
      `❌ ${translations.notInterested}`,
    ],
    datasets: [
      {
        data: [openCount, undecidedCount, notInterestedCount],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)', // Emerald
          'rgba(139, 92, 246, 0.8)', // Purple
          'rgba(239, 68, 68, 0.8)',  // Red
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'white',
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const total = responses.length;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${translations.percentage}: ${percentage}% (${value} / ${total})`;
          }
        }
      }
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/20 backdrop-blur-md rounded-xl p-8 text-white"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <h2 className="text-3xl font-bold mb-8">{translations.title}</h2>
      <div className="max-w-md mx-auto">
        <h3 className="text-xl mb-4 text-center">{translations.distribution}</h3>
        <Pie data={data} options={options} />
      </div>
    </motion.div>
  );
}
