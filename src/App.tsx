import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./navbar";
import GmailStyleEmailForm from "./gmail";
import ReceivedEmails from "./receivedMail";
import SentEmails from "./sendMail";
import Refresh from './refresh'
import './App.css';

function App() {
  return (
    <div className="flex flex-col h-screen">
 
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      
      <div className="flex-1 overflow-auto pt-16 p-6">
        <Routes>
          <Route path="/" element={<GmailStyleEmailForm />} />
          <Route path="/emails/received" element={<ReceivedEmails />} />
          <Route path="/emails/sent" element={<SentEmails />} />
          <Route path="/emails/refresh" element={<Refresh />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
