import React, { useEffect, useState } from "react";
import { Card, Spin, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";

export default function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://167.86.121.42:8080/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <Spin />;

  return (
    <Card title="👤 Profile">
      <Avatar
        size={64}
        src={user?.imageUrl !== "string" ? user?.imageUrl : null}
        icon={<UserOutlined />}
      />
      <p><b>Full name:</b> {user?.fullName}</p>
      <p><b>Phone:</b> {user?.phone}</p>
      <p><b>Group:</b> {user?.groupName}</p>
      <p><b>Level:</b> {user?.level}</p>
      <p><b>Parent:</b> {user?.parentName}</p>
    </Card>
  );
}