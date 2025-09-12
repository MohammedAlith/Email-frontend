import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";


interface Email {
  id?: string;
  from?: string;
  to?: string;
  subject: string;
  body: string;
  date?: string;
  sent_at?: string;
}

const ReceivedEmails: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://emai-node.onrender.com/emails/receive");
        const data: Email[] = await res.json();
        setEmails(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmails();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">


      {loading ? (
        <div className="flex justify-center items-center gap-3">
       <p className="text-white text-5xl font-bold">
                   <FontAwesomeIcon icon={faSpinner} spinPulse />
                  
              </p>
              <p className="text-white text-4xl font-semibold">Loading</p>
              </div>
      ) : emails.length === 0 ? (
        <p className="text-gray-500">No received emails.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 p-4">
          {emails.map((email, idx) => (
            <div
              key={email.id || idx}
              onClick={() => setSelectedEmail(email)}
              className="p-4 border rounded-2xl cursor-pointer hover:shadow-lg bg-gray-50 transition duration-200 flex flex-col justify-between"
            >
              <p className="font-semibold text-gray-800 truncate">{email.subject || "(No subject)"}</p>
              <p className="text-sm text-gray-600 mt-2 truncate">From: {email.from}</p>
              <p className="text-xs text-gray-500 mt-1">
                {email.date && new Date(email.date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      
      {selectedEmail && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6 relative">
            <button
              onClick={() => setSelectedEmail(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl"
            >
              ✕
            </button>
            <h4 className="text-xl font-semibold mb-2">{selectedEmail.subject}</h4>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">From:</span> {selectedEmail.from}
            </p>
            <p className="text-sm text-gray-500 mb-3">
              {selectedEmail.date && new Date(selectedEmail.date).toLocaleString()}
            </p>
            <div className="border-t pt-3 max-h-80 overflow-y-auto whitespace-pre-wrap">
              {selectedEmail.body}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceivedEmails;
