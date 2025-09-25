import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Modal, Spin } from "antd";

function ScoreHistory() {
  const [selectedMark, setSelectedMark] = useState(null);

  const token = localStorage.getItem("token");

  const fetchMyMarks = async () => {
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
    return result.success && result.data ? [...result.data].reverse() : [];
  };

  const {
    data: marks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myMarks"],
    queryFn: fetchMyMarks,
    staleTime: 1000 * 60 * 5, 
  });

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

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Spin size="large" />
            <span className="ml-3 text-green-600">Yuklanmoqda...</span>
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-red-500">
            Xatolik yuz berdi
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
      <Modal
        open={!!selectedMark}
        onCancel={() => setSelectedMark(null)}
        footer={null}
        maskClosable={true}
      >
        <h3 className="text-base font-semibold text-green-600 mb-3">
          Baho haqida ma'lumot
        </h3>
        {selectedMark && (
          <div className="space-y-2 text-sm">
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
        )}
      </Modal>
    </div>
  );
}

export default ScoreHistory;
