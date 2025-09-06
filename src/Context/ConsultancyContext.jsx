// context/ConsultancyContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ConsultancyContext = createContext();

export const useConsultancy = () => {
  const context = useContext(ConsultancyContext);
  if (!context) {
    throw new Error('useConsultancy must be used within a ConsultancyProvider');
  }
  return context;
};

export const ConsultancyProvider = ({ children }) => {
  const [submissions, setSubmissions] = useState([]);

  // Load submissions from localStorage on component mount
  useEffect(() => {
    const savedSubmissions = localStorage.getItem('consultancySubmissions');
    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions));
    }
  }, []);

  // Save submissions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('consultancySubmissions', JSON.stringify(submissions));
  }, [submissions]);

  const addSubmission = (submission) => {
    const newSubmission = {
      ...submission,
      id: Date.now(), // Unique ID
      createdAt: new Date().toISOString()
    };
    
    setSubmissions(prev => [...prev, newSubmission]);
    return newSubmission;
  };

  const updateSubmission = (id, updates) => {
    setSubmissions(prev => 
      prev.map(sub => sub.id === id ? { ...sub, ...updates } : sub)
    );
  };

  const deleteSubmission = (id) => {
    setSubmissions(prev => prev.filter(sub => sub.id !== id));
  };

  const value = {
    submissions,
    addSubmission,
    updateSubmission,
    deleteSubmission
  };

  return (
    <ConsultancyContext.Provider value={value}>
      {children}
    </ConsultancyContext.Provider>
  );
};

// Make sure to export ConsultancyContext as default
export default ConsultancyContext;