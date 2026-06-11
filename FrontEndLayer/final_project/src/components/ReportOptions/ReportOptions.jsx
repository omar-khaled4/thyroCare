import React from "react";
import { Link } from "react-router-dom";

export default function ReportOptions() {
  const options = [
    {
      to: "insert_report",
      icon: "fa-file-medical",
      title: "Insert Report",
      description: "Enter your thyroid test results manually",
      color: "bg-[#00B3A1]",
    },
    {
      to: "view_report",
      icon: "fa-clipboard-list",
      title: "View Reports",
      description: "Review your past reports and predictions",
      color: "bg-[#282828]",
    },
  ];

  return (
    <div className="background-DB min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg mx-4">
        <div className="text-center mb-8">
          <h1 className="font-1 text-3xl text-gray-800">Thyroid Reports</h1>
          <p className="font-5 text-gray-500 text-sm mt-2">
            Choose what you'd like to do
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {options.map((opt) => (
            <Link
              key={opt.to}
              to={opt.to}
              className="background-card p-6 flex items-center gap-5 group hover:shadow-lg hover:shadow-[#00B3A1]/10 transition-all duration-300"
            >
              <div
                className={`w-14 h-14 ${opt.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}
              >
                <i className={`fas ${opt.icon} text-white text-xl`}></i>
              </div>
              <div>
                <p className="font-1 text-xl text-gray-800">{opt.title}</p>
                <p className="font-5 text-sm text-gray-500 mt-0.5">
                  {opt.description}
                </p>
              </div>
              <i className="fas fa-chevron-right text-gray-300 ml-auto group-hover:text-[#00B3A1] group-hover:translate-x-1 transition-all duration-300"></i>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}