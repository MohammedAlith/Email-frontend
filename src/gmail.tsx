import React, {
  useState,
  FormEvent,
  ChangeEvent,
  ElementType,
  useRef,
} from "react";
import { AiOutlinePaperClip, AiOutlineSend } from "react-icons/ai";
import { IoIosMailUnread } from "react-icons/io";
import { IoClose, IoAttach } from "react-icons/io5";
import ImportExcel from "./import";
import EmailList from "./email";

const PaperClipIcon = AiOutlinePaperClip as ElementType;
const SendIcon = AiOutlineSend as ElementType;
const MailIcon = IoIosMailUnread as ElementType;
const CloseIcon = IoClose as ElementType;
const AttachIcon = IoAttach as ElementType;

const GmailStyleEmailForm: React.FC = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(false);

  // 🔥 State for popups / sidebar
  const [showImport, setShowImport] = useState(false);
  const [showEmails, setShowEmails] = useState(false);

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

      const res = await fetch("https://emai-node.onrender.com/send-email", {
        method: "POST",
        body: formData,
      });
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
    <div className="flex justify-center items-center h-screen relative">
      {/* Main Compose Box */}
      <div className="border border-gray-200 rounded-2xl shadow-xl bg-white overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3 bg-gray-50 text-xl">
          <h2 className="font-semibold text-gray-800 flex gap-1">
            <span className="text-red-500 text-3xl">
              <MailIcon />
            </span>
            New Message
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* To */}
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700 w-20">To:</span>
            <input
              type="email"
              placeholder="Recipient"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Subject */}
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700 w-20">Subject:</span>
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Message */}
          <textarea
            placeholder="Compose your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none overflow-y-auto transition"
          />

          {/* Attachments */}
          <div className="flex items-start gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-blue-600 transition">
              <PaperClipIcon size={20} />
              <span className="text-sm">Attach files</span>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {files.length > 0 && (
              <ul className="ml-4 space-y-1 text-xl text-gray-600">
                {files.map((file, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <AttachIcon /> {file.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 gap-2">
            {/* Send button */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-md transition"
            >
              {loading ? "Sending..." : (<><SendIcon size={18} /> Send</>)}
            </button>

            {message && (
              <p
                className={`text-sm ${
                  messageType === "success"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowImport(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-md"
              >
                Import
              </button>

              {/* 🔥 Show Emails button */}
              <button
                type="button"
                onClick={() => setShowEmails(!showEmails)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 shadow-md"
              >
                {showEmails ? "Hide Emails" : "Show Emails"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ImportExcel Popup */}
      {showImport && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-2 rounded-2xl shadow-xl w-fit relative">
            <button
              onClick={() => setShowImport(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl"
            >
              <CloseIcon />
            </button>
            <ImportExcel />
          </div>
        </div>
      )}

      {/* 🔥 EmailList Sidebar (unmounted when hidden) */}
      {showEmails && (
        <div className="fixed right-2  w-[400px] bg-white z-50 border border-gray-200 rounded-l-2xl shadow-xl m-2">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-700">Unread Emails</h3>
            <button
              onClick={() => setShowEmails(false)}
              className="text-gray-500 hover:text-red-500 text-2xl"
            >
              <CloseIcon />
            </button>
          </div>
          <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
            <EmailList />
          </div>
        </div>
      )}
    </div>
  );
};

export default GmailStyleEmailForm;
