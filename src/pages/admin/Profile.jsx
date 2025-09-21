import React, { useState, useEffect, useRef } from "react";
import { Pencil } from "lucide-react"; // Edit icon uchun

const Profile = () => {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  // LocalStorage'dan rasmni olish
  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setImage(savedImage);
    }
  }, []);

  // Rasm yuklash
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        localStorage.setItem("profileImage", reader.result); // saqlash
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-32 h-32">
        {image ? (
          <>
            <img
              src={image}
              alt="Profile"
              className="w-full h-full object-cover rounded-full border-2 border-gray-300"
            />
            {/* Edit tugma */}
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
            >
              <Pencil className="w-4 h-4 text-gray-600" />
            </button>
          </>
        ) : (
          // Rasm yo‘q bo‘lsa
          <button
            onClick={() => fileInputRef.current.click()}
            className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-400 rounded-full hover:bg-gray-100"
          >
            <Pencil className="w-6 h-6 text-gray-500" />
          </button>
        )}
        {/* Fayl input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
};

export default Profile;
