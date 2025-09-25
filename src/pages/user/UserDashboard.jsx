import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, Spin, Modal, Tag, Row, Col } from "antd";
import { FaStar, FaMedal } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { GrScorecard } from "react-icons/gr";

export default function UserDashboard() {
  const token = localStorage.getItem("token");
  const [selectedMark, setSelectedMark] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchDashboard = async () => {
    const res = await axios.get(
      "http://167.86.121.42:8080/user/user-dashboard",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data.data;
  };

  const fetchMarks = async () => {
    const res = await axios.get("http://167.86.121.42:8080/mark/myMarks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data?.slice(-3) || [];
  };

  const fetchLeaderboard = async () => {
    const res = await axios.get("http://167.86.121.42:8080/user/leaderboard", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data?.slice(0, 5) || [];
  };

  const { data: dashboard, isLoading: isDashboardLoading } = useQuery({
    queryKey: ["user-dashboard"],
    queryFn: fetchDashboard,
  });

  const { data: marks = [], isLoading: isMarksLoading } = useQuery({
    queryKey: ["user-marks"],
    queryFn: fetchMarks,
  });

  const { data: leaderboard = [], isLoading: isLeaderboardLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: fetchLeaderboard,
  });

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

  const getCardStyle = (level) => {
    switch (level) {
      case "YASHIL":
        return { backgroundColor: "#4ade80", color: "#fff" };
      case "SARIQ":
        return { backgroundColor: "#facc15", color: "#fff" };
      case "QIZIL":
        return { backgroundColor: "#dc2626", color: "#fff" };
      default:
        return { backgroundColor: "#9ca3af", color: "#fff" };
    }
  };

  const showMarkDetails = (mark) => {
    setSelectedMark(mark);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setSelectedMark(null);
    setIsModalVisible(false);
  };

  if (isDashboardLoading || isMarksLoading || isLeaderboardLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Card
            className="shadow-xl rounded-2xl hover:shadow-2xl transition-all"
            title={
              <div className="flex items-center gap-2">
                <FaMedal className="text-yellow-500" /> Daraja
              </div>
            }
          >
            <p className="text-2xl font-bold text-gray-800">
              {dashboard?.level}
            </p>
          </Card>
        </Col>

        <Col xs={24} sm={12}>
          <Card
            className="shadow-xl rounded-2xl hover:shadow-2xl transition-all"
            title={
              <div className="flex items-center gap-2">
                <FaStar className="text-blue-500" /> Umumiy Ball
              </div>
            }
          >
            <p className="text-2xl font-bold text-gray-800">
              {dashboard?.score}
            </p>
          </Card>
        </Col>
      </Row>

      <div>
        <h2 className="mb-4 text-2xl font-bold text-blue-500">
          Oxirgi 3 ta Baho
        </h2>
        <Row gutter={[16, 16]}>
          {marks.map((mark) => (
            <Col xs={24} sm={8} key={mark.id}>
              <Card
                className="shadow-lg rounded-2xl cursor-pointer hover:shadow-2xl transition-all"
                style={getCardStyle(mark.level)}
                hoverable
                onClick={() => showMarkDetails(mark)}
              >
                <p className="text-4xl font-bold text-center">
                  {mark.totalScore ?? mark.score}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-bold text-blue-500">
          Leaderboard (Top 5)
        </h2>
        <Row gutter={[16, 16]}>
          {leaderboard.map((student) => (
            <Col xs={24} sm={12} md={8} lg={6} key={student.studentId}>
              <Card
                className="shadow-lg rounded-2xl transition-all hover:shadow-2xl"
                style={getCardStyle(student.level)}
                title={student.fullName}
                styles={{ header: { color: "#fff", fontWeight: "bold" } }}
              >
                <p className="text-3xl font-bold text-center">
                  O'rni: {student.rank}
                </p>
                <p className="mt-2 text-center">{student.totalScore} ball</p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Modal
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        maskClosable={true}
      >
        <div className="space-y-2">
          <p className="flex justify-between text-3xl text-green-500 mt-4">
            <GrScorecard />{" "}
            {selectedMark?.totalScore ?? selectedMark?.score ?? "—"}
          </p>
          <p className="flex text-2xl text-green-500 justify-between">
            <GiTeacher /> {selectedMark?.teacherName}
          </p>
          <p className="flex text-2xl text-green-500 justify-between">
            <strong>Vaqti:</strong> {selectedMark?.date || "Noma’lum"}
          </p>
        </div>
      </Modal>
    </div>
  );
}