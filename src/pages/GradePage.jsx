import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GradePage = () => {
  const [student, setStudent] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const groupId = localStorage.getItem("groupId");
    
    if (!token || !groupId) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://167.86.121.42:8080/group/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        
        const body = res?.data?.data?.students || [];
        setStudent(body);
        
      })
      .catch((err) => {
        setError(`Xato: ${err.response?.status} So‘rov bajarilmadi`);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

   if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-400 via-green-500 to-green-600">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }
  console.log(student);
  
  return (
    <div>
    {
      student.map(item=>(
        <div key={item.id}>
          <h1>{item.name}</h1>
        </div>
      ))
    }     
    </div>
  );
};

export default GradePage;