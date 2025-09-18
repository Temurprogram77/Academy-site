import React, { createContext, useContext, useState, useEffect } from "react";

const StarContext = createContext();

export const StarProvider = ({ children }) => {
  const [stars, setStars] = useState(0);

  useEffect(() => {
    const stored = Number(localStorage.getItem("stars") || 0);
    setStars(stored);
  }, []);

  const addStar = () => {
    setStars((prev) => {
      const newStars = prev + 1;
      localStorage.setItem("stars", String(newStars));
      return newStars;
    });
  };

  return (
    <StarContext.Provider value={{ stars, addStar }}>
      {children}
    </StarContext.Provider>
  );
};

export const useStars = () => useContext(StarContext);
