import React, { useRef, useState } from "react";
import style from "./ReportOptions.module.css"
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function ReportOptions(){
    const navigate = useNavigate();
    const [uploadError, setUploadError] = useState("");
    const [uploadSuccess, setUploadSuccess] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    /* ── handle file selection ── */
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        /* ── guard: only image or PDF ── */
        const allowedTypes = [
          "application/pdf",
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        if (!allowedTypes.includes(file.type)) {
          setUploadError("Only PDF and image files (JPG, PNG, GIF, WEBP) are supported.");
          e.target.value = "";
          return;
        }

        setUploadError("");
        setUploadSuccess("");
        setIsUploading(true);

        const formData = new FormData();
        formData.append("report", file);

        try {
          /* ── POST /reports/upload ──
           * The backend defines POST /reports as the create endpoint with a
           * structured JSON body. A dedicated multipart upload endpoint has NOT
           * yet been added to the ThyroCare.postman_collection.json. Until the
           * backend provides a POST /reports/upload endpoint the code below
           * attempts the upload and catches the 405/404 so the UI degrades
           * gracefully instead of crashing. */
          const { data } = await api.post("/reports/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          setUploadSuccess(`${file.name} uploaded successfully!`);
          /* ── NOTE: Add a dedicated POST /reports/upload endpoint to the backend
           * to accept multipart file uploads. The expected response body is:
           *   { reportId: string, fileName: string, message: string } */
        } catch (err) {
          if (err.response?.status === 404 || err.response?.status === 405) {
            setUploadError(
              "File upload endpoint (/reports/upload) is not yet available on the backend. " +
              "A new POST /reports/upload endpoint needs to be added to serve this feature."
            );
          } else {
            const msg = err.response?.data?.message || err.message || "Upload failed. Please try again.";
            setUploadError(msg);
          }
        } finally {
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return <>
        <div className="background-DB flex items-center justify-center">

            <div className="flex flex-wrap w-[50%] md:w-[35%] gap-5">
                <Link to="insert_report" className="text-black text-2xl font-1 py-1 background-card rounded-full w-full text-center hover:scale-125 transition duration-400">Insert Report</Link>
                <Link to="view_report" className="text-black text-2xl font-1 py-1 background-card rounded-full w-full text-center hover:scale-125 transition duration-400">View Report</Link>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="text-black text-2xl font-1 py-1 background-card rounded-full w-full text-center hover:scale-125 transition duration-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isUploading ? "Uploading…" : "Insert Photo/PDF"}
                </button>
                {/* native file input — hidden until the button above is clicked */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {/* ── inline upload feedback ── */}
            {uploadError && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 rounded-lg text-red-800 text-sm text-center max-w-[50%] md:max-w-[35%] font-1">
                {uploadError}
              </div>
            )}
            {uploadSuccess && (
              <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded-lg text-green-800 text-sm text-center max-w-[50%] md:max-w-[35%] font-1">
                {uploadSuccess}
              </div>
            )}
        </div>
    </>
}