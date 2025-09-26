import React, { useEffect, useState } from "react";

function ScoreHistory() {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyMarks();
  }, []);

  const fetchMyMarks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); 
      if (!token) {
        console.error("Token topilmadi. Iltimos qayta login qiling.");
        return;
      }

      const response = await fetch("https://nazorat.sferaacademy.uz/api/mark/myMarks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
      });

      if (!response.ok) {
        throw new Error("Xatolik: " + response.status);
      }

      const result = await response.json();
      console.log("API natija:", result);

      if (result.success && result.data) {
        setMarks(result.data);
      } else {
        setMarks([]);
      }
    } catch (error) {
      console.error("Ballarni olishda xatolik:", error);
      setMarks([]);
    } finally {
      setLoading(false);
    }
  };

  // Ranglarni aniqlash
  const getLevelColor = (level) => {
    switch (level) {
      case "YASHIL":
        return "bg-green-600 text-white";
      case "QIZIL":
        return "bg-red-600 text-white";
      case "SARIQ":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 p-6">
      <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-green-600">Ball Tarixi</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin"></div>
            <span className="ml-3 text-green-600">Yuklanmoqda...</span>
          </div>
        ) : marks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Ballar topilmadi
          </div>
        ) : (
          <div className="space-y-3">
            {marks.map((mark) => (
              <div
                key={mark.id}
                className="group bg-white/95 rounded-xl p-4 shadow-lg flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getLevelColor(
                      mark.level
                    )}`}
                  >
                    {mark.level[0]} {/* Y, Q, S harfi */}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">
                      {mark.studentName}
                    </span>
                    <div className="text-xs text-gray-500">
                      Sana: {mark.date}
                    </div>
                  </div>
                </div>

                <div className="font-bold text-green-600">{mark.score}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ScoreHistory;
