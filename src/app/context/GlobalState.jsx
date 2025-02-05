'use client'
import React, { createContext, useState, useContext } from "react";

// Create a context
const GlobalContext = createContext();

// Create a provider component
export const GlobalProvider = ({ children }) => {
    const [stocks, setStocks] = useState([  { size: '', quantity: '' }]);
    const [count,setCount] = useState(0)

  return (
    <GlobalContext.Provider value={{ stocks, setStocks,count,setCount }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to use the context
export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
