import React, { useEffect, useState } from "react";

function ScoreHistory() {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMark, setSelectedMark] = useState(null);

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

      const response = await fetch("http://167.86.121.42:8080/mark/myMarks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Xatolik: " + response.status);
      }

      const result = await response.json();
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
          <div className="text-center py-8 text-gray-500">Ballar topilmadi</div>
        ) : (
          <div className="space-y-3">
            {marks.map((mark) => (
              <div
                key={mark.id}
                onClick={() => setSelectedMark(mark)}
                className="cursor-pointer group bg-white/95 rounded-xl p-4 shadow-lg flex justify-between items-center hover:shadow-xl transition"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getLevelColor(
                      mark.level
                    )}`}
                  >
                    {mark.level[0]}
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

      {selectedMark && (
       <div
  className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
  onClick={() => setSelectedMark(null)}
>
  <div
    className="bg-white rounded-lg p-4 max-w-xs w-full shadow-lg relative"
    onClick={(e) => e.stopPropagation()}
  >
    <button
      onClick={() => setSelectedMark(null)}
      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-sm"
    >
      ✕
    </button>
    <h3 className="text-base font-semibold text-green-600 mb-2">
      Baho haqida ma'lumot
    </h3>
    <div className="space-y-1 text-xs">
      <p>
        <span className="font-semibold">Talaba:</span>{" "}
        {selectedMark.studentName}
      </p>
      <p>
        <span className="font-semibold">Bahosi:</span>{" "}
        {selectedMark.score}
      </p>
      <p>
        <span className="font-semibold">Daraja:</span>{" "}
        <span
          className={`px-1.5 py-0.5 rounded text-xs ${getLevelColor(
            selectedMark.level
          )}`}
        >
          {selectedMark.level}
        </span>
      </p>
      <p>
        <span className="font-semibold">Sana:</span>{" "}
        {selectedMark.date}
      </p>
      {selectedMark.description && (
        <p>
          <span className="font-semibold">Izoh:</span>{" "}
          {selectedMark.description}
        </p>
      )}
    </div>
  </div>
</div>

      )}
    </div>
  );
}

export default ScoreHistory;