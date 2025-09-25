import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, Spin, Modal, Tag } from "antd";
import { IoMdCloseCircle } from "react-icons/io";

export default function MarksPage() {
  const token = localStorage.getItem("token");
  const [selectedMark, setSelectedMark] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchMarks = async () => {
    const res = await axios.get("http://167.86.121.42:8080/mark/myMarks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data || [];
  };

  const { data: marks = [], isLoading, isError } = useQuery({
    queryKey: ["all-marks"],
    queryFn: fetchMarks,
    staleTime: 1000 * 60 * 2,
  });

  const showMarkDetails = (mark) => {
    setSelectedMark(mark);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setSelectedMark(null);
    setIsModalVisible(false);
  };

  const getLevelTag = (level) => {
    switch (level) {
      case "YASHIL":
        return <Tag color="green">YASHIL</Tag>;
      case "SARIQ":
        return <Tag color="gold">SARIQ</Tag>;
      case "QIZIL":
        return <Tag color="red">QIZIL</Tag>;
      default:
        return <Tag>{level || "—"}</Tag>;
    }
  };

  const getCardColor = (level) => {
    switch (level) {
      case "YASHIL":
        return "bg-green-400";
      case "QIZIL":
        return "bg-red-600";
      case "SARIQ":
        return "bg-yellow-400";
      default:
        return "bg-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center mt-10">
        ❌ Xatolik yuz berdi, qayta urinib ko‘ring.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-green-600">
        Mening Baholarim
      </h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {marks.map((mark) => (
          <Card
            key={mark.id}
            className={`${getCardColor(mark.level)} shadow-xl flex items-center justify-center rounded-2xl hover:shadow-2xl transition-all cursor-pointer`}
            hoverable
            onClick={() => showMarkDetails(mark)}
          >
            <p className="text-4xl text-white font-bold">
              {mark.totalScore ?? mark.score}
            </p>
          </Card>
        ))}
      </div>

      <Modal
        open={isModalVisible}
        title={
          <div className="flex items-center justify-between">
            <span>{selectedMark?.studentName}</span>
            <IoMdCloseCircle
              className="cursor-pointer text-gray-500 hover:text-black"
              onClick={handleModalClose}
              size={24}
            />
          </div>
        }
        onCancel={handleModalClose}
        footer={null}
        maskClosable={true}
        bodyStyle={{
          backgroundColor:
            selectedMark?.level === "YASHIL"
              ? "#d4edda"
              : selectedMark?.level === "QIZIL"
              ? "#f8d7da"
              : selectedMark?.level === "SARIQ"
              ? "#fff3cd"
              : "#f0f0f0",
          borderRadius: "12px",
          padding: "20px",
        }}
        style={{ borderRadius: "12px" }}
      >
        <div className="space-y-3">
          <p>
            <strong>O‘qituvchi:</strong> {selectedMark?.teacherName}
          </p>
          <p>
            <strong>Umumiy Ball:</strong>{" "}
            {selectedMark?.totalScore ?? selectedMark?.score ?? "—"}
          </p>
          <p>
            <strong className="bg-[#fff]">Daraja:</strong> {getLevelTag(selectedMark?.level)}
          </p>
          <p>
            <strong>Vaqti:</strong>{" "}
            {selectedMark?.date
              ? new Date(selectedMark.date).toLocaleDateString("uz-UZ")
              : "Noma’lum"}
          </p>
        </div>
      </Modal>
    </div>
  );
}