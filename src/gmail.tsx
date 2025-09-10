import React, { useState, FormEvent, ChangeEvent, ElementType, useRef } from "react";
import { AiOutlinePaperClip, AiOutlineSend } from "react-icons/ai";

const PaperClipIcon = AiOutlinePaperClip as ElementType;
const SendIcon = AiOutlineSend as ElementType;

const GmailStyleEmailForm: React.FC = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("to", to);
      formData.append("subject", subject);
      formData.append("text", text);
      files.forEach((file) => formData.append("attachments", file));

      const res = await fetch("http://localhost:8000/send-email", { method: "POST", body: formData });
      const data: { success: boolean } = await res.json();

      if (data.success) {
        setMessageType("success");
        setMessage("Email sent successfully!");
        setTo("");
        setSubject("");
        setText("");
        setFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setMessageType("error");
        setMessage("Failed to send email.");
      }
    } catch (err) {
      console.error(err);
      setMessageType("error");
      setMessage("Error sending email.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 border border-gray-300 rounded-md shadow-lg bg-white">
      <div className="border-b border-gray-300 px-4 py-2 font-semibold text-gray-800">New Message</div>
      <form onSubmit={handleSubmit} className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700 w-16">To:</span>
          <input type="email" placeholder="Recipient" value={to} onChange={(e) => setTo(e.target.value)} required className="flex-1 p-2 border-b border-gray-300 focus:outline-none focus:ring-0" />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700 w-16">Subject:</span>
          <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required className="flex-1 p-2 border-b border-gray-300 focus:outline-none focus:ring-0" />
        </div>

        <textarea placeholder="Compose your email..." value={text} onChange={(e) => setText(e.target.value)} rows={10} className="w-full p-2 border-b border-gray-300 focus:outline-none focus:ring-0 resize-none" />

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 cursor-pointer text-gray-600 hover:text-gray-800">
            <PaperClipIcon size={20} /> Attach files
            <input ref={fileInputRef} type="file" multiple onChange={handleFileChange} className="hidden" />
          </label>
          {files.length > 0 && <ul className="ml-4 text-sm text-gray-600">{files.map((file, idx) => <li key={idx}>{file.name}</li>)}</ul>}
        </div>

        <div className="flex justify-between items-center mt-4">
          <button type="submit" disabled={loading} className="flex items-center gap-1 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Sending..." : <><SendIcon size={18} /> Send</>}
          </button>
          {message && <p className={messageType === "success" ? "text-green-600" : "text-red-600"}>{message}</p>}
        </div>
      </form>
    </div>
  );
};

export default GmailStyleEmailForm;
