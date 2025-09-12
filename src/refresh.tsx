import React, { useEffect, useState } from "react";

interface Email {
  id?: string;
  from?: string;
  to?: string;
  subject: string;
  body: string;
  date?: string;
}

const RefreshEmails: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  useEffect(() => {
    const fetchRefreshEmails = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://emai-node.onrender.com/emails/refresh");
        const data: Email[] = await res.json();

        
        const uniqueEmails = Array.from(
          new Map(data.map(e => [e.id, e])).values()
        );

        setEmails(uniqueEmails);
      } catch (err) {
        console.error("Error fetching refresh emails:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRefreshEmails();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
    

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : emails.length === 0 ? (
        <p className="text-white text-5xl">No new emails .</p>
      ) : (
        <div>
        <h3 className="text-2xl font-semibold mb-6 text-white">New Email added to Receive </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {emails.map((email, idx) => (
            <div
              key={`${email.id}-${email.date}-${idx}`} 
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

export default RefreshEmails;
