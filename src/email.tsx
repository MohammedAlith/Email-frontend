import React, { useEffect, useState } from "react";

interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
}

const EmailList: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://emai-node.onrender.com/emails");
        const data = await res.json();
        setEmails(data);
      } catch (err) {
        console.error("Error fetching emails:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  return (
    <div 
    // className="border border-gray-200 rounded-2xl shadow-xl bg-white m-2 p-4"
    >
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Unread Emails</h3>

      {loading ? (
        <p className="text-gray-500">Loading emails...</p>
      ) : emails.length === 0 ? (
        <p className="text-gray-500">No unread emails found.</p>
      ) : (
        <ul className="space-y-3 max-h-96 overflow-y-auto">
          {emails.map((email) => (
            <li
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
            >
              <p className="font-medium text-gray-800">
                {email.subject || "(No subject)"}
              </p>
              <p className="text-sm text-gray-600">From: {email.from}</p>
              <p className="text-xs text-gray-500">
                {new Date(email.date).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Popup Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedEmail(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl"
            >
              ✕
            </button>

            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              {selectedEmail.subject || "(No subject)"}
            </h4>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">From:</span> {selectedEmail.from}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">To:</span> {selectedEmail.to}
            </p>
            <p className="text-sm text-gray-500 mb-3">
              {new Date(selectedEmail.date).toLocaleString()}
            </p>
            <div className="border-t pt-3 text-gray-700 whitespace-pre-line max-h-80 overflow-y-auto">
              {selectedEmail.body || "No message body"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailList;
