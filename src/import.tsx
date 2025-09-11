import React, { useState, useRef } from "react";

const ImportExcel: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setMessage("");
    }
  };

  const handleSend = async () => {
    if (!file) {
      setMessage("Please upload a file first.");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://emai-node.onrender.com/import-excel", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      setMessage(data.success ? " Emails sent successfully!" : ` Failed: ${data.message}`);
      if (data.success) {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
      setMessage(" Error sending emails.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-4 rounded-2xl bg-white w-fit max-w-md">
      <h2 className="text-xl font-bold mb-4 text-center">Import Excel</h2>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
        disabled={loading}
        className="w-fit mb-4"
      />

      {file && (
        <div className="flex justify-center gap-3">
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send"}
          </button>

          <button
            onClick={handleCancel}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      )}

      {message && <p className="mt-3 text-center text-green-500 text-bold text-xl">{message}</p>}
    </div>
  );
};

export default ImportExcel;
