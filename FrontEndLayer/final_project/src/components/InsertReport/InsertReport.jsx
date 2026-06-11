import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { createReport } from "../../services/reportService";
import { postPredict } from "../../services/chatService";

export default function InsertReport() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);

  function getCurrentUser() {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function healthColor(score) {
    if (score >= 75) return "text-green-600";
    if (score >= 50) return "text-amber-600";
    return "text-red-600";
  }

  function ringColor(score) {
    if (score >= 75) return "#22c55e";
    if (score >= 50) return "#e17100";
    return "#dc2626";
  }

  const validationSchema = Yup.object({
    testDate: Yup.date().required("Test date is required"),
    testingFacility: Yup.string().required("Testing facility is required"),
    thyroidFunction: Yup.object({
      tsh: Yup.number().typeError("Must be a number").required("Required"),
      freeT3: Yup.number().typeError("Must be a number").required("Required"),
      freeT4: Yup.number().typeError("Must be a number").required("Required"),
      totalT3: Yup.number().typeError("Must be a number").required("Required"),
      totalT4: Yup.number().typeError("Must be a number").required("Required"),
    }),
    antibodies: Yup.object({
      tpo: Yup.number().typeError("Must be a number").required("Required"),
      antiTg: Yup.number().typeError("Must be a number").required("Required"),
      tshr: Yup.number().typeError("Must be a number").required("Required"),
    }),
    otherTests: Yup.object({
      thyroglobulin: Yup.number().typeError("Must be a number").required("Required"),
      calcitonin: Yup.number().typeError("Must be a number").required("Required"),
      reverseT3: Yup.number().typeError("Must be a number").required("Required"),
    }),
    symptoms: Yup.object({
      fatigue: Yup.number().min(0).max(10).required("Required"),
      weightChange: Yup.number().min(0).max(10).required("Required"),
      coldIntolerance: Yup.number().min(0).max(10).required("Required"),
      hairLoss: Yup.number().min(0).max(10).required("Required"),
      palpitations: Yup.number().min(0).max(10).required("Required"),
      anxiety: Yup.number().min(0).max(10).required("Required"),
      insomnia: Yup.number().min(0).max(10).required("Required"),
    }),
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const created = await createReport(values);
      const user = getCurrentUser();
      const result = await postPredict(values, user);

      const normalizedResult = {
        diagnosis: result?.diagnosis || "Negative",
        confidence: result?.confidence ?? 0.0,
        healthScore: result?.healthScore ?? 0,
        severity: result?.severity || "",
        recommendations: result?.recommendations || [],
        createdAt: result?.createdAt || new Date().toISOString(),
        ...result,
      };

      setPrediction(normalizedResult);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      testDate: "",
      testingFacility: "",
      thyroidFunction: { tsh: "", freeT3: "", freeT4: "", totalT3: "", totalT4: "" },
      antibodies: { tpo: "", antiTg: "", tshr: "" },
      otherTests: { thyroglobulin: "", calcitonin: "", reverseT3: "" },
      symptoms: { fatigue: "0", weightChange: "0", coldIntolerance: "0", hairLoss: "0", palpitations: "0", anxiety: "0", insomnia: "0" },
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  // Shared classes
  const inputClass =
    "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 font-5 text-sm outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#00B3A1] focus:ring-2 focus:ring-[#00B3A1]/20";

  const errorClass = "text-red-500 font-5 text-xs mt-1";

  const sectionHeader = (icon, title, subtitle) => (
    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
      <div className="w-9 h-9 rounded-xl bg-[#00B3A1]/10 flex items-center justify-center flex-shrink-0">
        <i className={`fas ${icon} text-[#00B3A1] text-sm`}></i>
      </div>
      <div>
        <h3 className="font-1 text-lg text-gray-800">{title}</h3>
        {subtitle && <p className="font-5 text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );

  const labField = (name, label, placeholder, unit) => (
    <div>
      <label className="block font-5 text-sm text-gray-600 mb-1.5">
        {label} {unit && <span className="text-gray-400 text-xs">({unit})</span>}
      </label>
      <input
        type="number"
        step="any"
        name={name}
        value={formik.values[name.split(".")[0]]?.[name.split(".")[1]] ?? ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={placeholder}
        className={inputClass}
        required
      />
      {(() => {
        const keys = name.split(".");
        const err = formik.errors[keys[0]]?.[keys[1]];
        const touched = formik.touched[keys[0]]?.[keys[1]];
        return err && touched ? <p className={errorClass}>{err}</p> : null;
      })()}
    </div>
  );

  const symptomLabels = {
    fatigue: { label: "Fatigue", icon: "fa-battery-quarter" },
    weightChange: { label: "Weight Changes", icon: "fa-weight-scale" },
    coldIntolerance: { label: "Temperature Sensitivity", icon: "fa-temperature-low" },
    hairLoss: { label: "Hair Loss", icon: "fa-head-side" },
    palpitations: { label: "Palpitations", icon: "fa-heartbeat" },
    anxiety: { label: "Anxiety", icon: "fa-brain" },
    insomnia: { label: "Insomnia", icon: "fa-moon" },
  };

  function getSeverityBadge(severity) {
    if (severity === "Severe") return "bg-red-50 text-red-700 border-red-200";
    if (severity === "Moderate") return "bg-amber-50 text-amber-700 border-amber-200";
    if (severity === "Mild") return "bg-green-50 text-green-700 border-green-200";
    return "bg-gray-50 text-gray-600 border-gray-200";
  }

  function getPriorityConfig(priority) {
    if (priority === "high") return { bg: "bg-red-50 border-red-200", text: "text-red-700", dot: "bg-red-500" };
    if (priority === "medium") return { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", dot: "bg-amber-500" };
    return { bg: "bg-green-50 border-green-200", text: "text-green-700", dot: "bg-green-500" };
  }

  return (
    <div className="background-DB min-h-screen">
      <div className="pt-24 pb-8 px-4 md:px-12 lg:px-20 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-1 text-3xl text-gray-800">Thyroid Test Report</h1>
          <p className="font-5 text-gray-500 text-sm mt-1">
            Enter your lab results and symptoms to get an AI-powered analysis
          </p>
        </div>

        {/* Form Card */}
        <div className="background-card p-6 md:p-8">
          <form onSubmit={formik.handleSubmit} className="space-y-8">
            {/* ── Basic Information ── */}
            {sectionHeader("fa-user", "Basic Information", "When and where was the test done?")}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block font-5 text-sm text-gray-600 mb-1.5">Date of Test</label>
                <input
                  type="date"
                  name="testDate"
                  value={formik.values.testDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`${inputClass} [color-scheme:light]`}
                  required
                />
                {formik.errors.testDate && formik.touched.testDate ? (
                  <p className={errorClass}>{formik.errors.testDate}</p>
                ) : null}
              </div>
              <div>
                <label className="block font-5 text-sm text-gray-600 mb-1.5">Testing Facility</label>
                <input
                  type="text"
                  name="testingFacility"
                  value={formik.values.testingFacility}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Hospital or clinic name"
                  className={inputClass}
                  required
                />
                {formik.errors.testingFacility && formik.touched.testingFacility ? (
                  <p className={errorClass}>{formik.errors.testingFacility}</p>
                ) : null}
              </div>
            </div>

            {/* ── Thyroid Function Tests ── */}
            {sectionHeader("fa-vials", "Thyroid Function Tests", "Core thyroid hormone levels from your lab report")}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {labField("thyroidFunction.tsh", "TSH", "e.g. 2.1", "mIU/L")}
              {labField("thyroidFunction.freeT4", "Free T4", "e.g. 1.2", "ng/dL")}
              {labField("thyroidFunction.freeT3", "Free T3", "e.g. 3.1", "pg/mL")}
              {labField("thyroidFunction.totalT4", "Total T4", "e.g. 8.5", "μg/dL")}
              {labField("thyroidFunction.totalT3", "Total T3", "e.g. 1.1", "ng/dL")}
            </div>

            {/* ── Antibody Tests ── */}
            {sectionHeader("fa-shield-virus", "Thyroid Antibody Tests", "Autoimmune markers — key for diagnosing thyroiditis")}
            <div className="grid gap-4 md:grid-cols-3">
              {labField("antibodies.tpo", "TPO Antibodies", "e.g. 12", "IU/mL")}
              {labField("antibodies.antiTg", "Anti-Thyroglobulin", "e.g. 8", "IU/mL")}
              {labField("antibodies.tshr", "TSH Receptor Ab", "e.g. 0.3", "IU/L")}
            </div>

            {/* ── Other Tests ── */}
            {sectionHeader("fa-flask", "Other Relevant Tests", "Additional markers your doctor may have ordered")}
            <div className="grid gap-4 md:grid-cols-3">
              {labField("otherTests.thyroglobulin", "Thyroglobulin", "e.g. 15", "ng/mL")}
              {labField("otherTests.calcitonin", "Calcitonin", "e.g. 3", "pg/mL")}
              {labField("otherTests.reverseT3", "Reverse T3", "e.g. 14", "ng/dL")}
            </div>

            {/* ── Symptoms Checklist ── */}
            {sectionHeader("fa-stethoscope", "Symptoms Checklist", "Rate each symptom from 0 (none) to 10 (severe)")}
            <div className="grid gap-5 md:grid-cols-2">
              {Object.entries(symptomLabels).map(([key, { label, icon }]) => {
                const value = Number(formik.values.symptoms[key]) || 0;
                return (
                  <div key={key} className="bg-white rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <i className={`fas ${icon} text-gray-400 text-sm`}></i>
                        <span className="font-5 text-sm text-gray-700">{label}</span>
                      </div>
                      <span className={`text-sm font-bold min-w-[28px] text-center py-0.5 px-2 rounded-lg ${value === 0 ? "text-gray-400 bg-gray-50" :
                        value <= 3 ? "text-green-600 bg-green-50" :
                          value <= 6 ? "text-amber-600 bg-amber-50" :
                            "text-red-600 bg-red-50"
                        }`}>
                        {value}
                      </span>
                    </div>
                    <input
                      type="range"
                      name={`symptoms.${key}`}
                      min="0"
                      max="10"
                      value={formik.values.symptoms[key]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full cursor-pointer"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-gray-400 font-5">None</span>
                      <span className="text-[10px] text-gray-400 font-5">Severe</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Error ── */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <i className="fas fa-exclamation-circle text-red-500"></i>
                  <p className="font-5 text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#00B3A1] text-white font-1 text-lg rounded-xl hover:bg-[#009e8e] transition-all duration-200 hover:shadow-lg hover:shadow-[#00B3A1]/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-spinner fa-spin"></i>
                  Analyzing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-microscope"></i>
                  Generate Report
                </span>
              )}
            </button>
          </form>
        </div>

        {/* ═══════════════════════════════════════════════════════════
         *  PREDICTION RESULT
         * ═══════════════════════════════════════════════════════════ */}
        {prediction && !isLoading && (
          <div className="mt-6 background-card p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 rounded-xl bg-[#00B3A1]/10 flex items-center justify-center">
                <i className="fas fa-brain text-[#00B3A1]"></i>
              </div>
              <div>
                <h3 className="font-1 text-lg text-gray-800">AI Analysis Result</h3>
                <p className="font-5 text-xs text-gray-400">
                  {prediction.createdAt
                    ? new Date(prediction.createdAt).toLocaleString()
                    : "Just now"}
                </p>
              </div>
            </div>

            {/* Diagnosis + Score */}
            <div className="grid gap-6 md:grid-cols-2 mb-6">
              {/* Diagnosis */}
              <div>
                <p className="font-5 text-xs text-gray-500 uppercase tracking-wider mb-2">Diagnosis</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-1 text-xl text-gray-800 font-semibold">
                    {prediction.diagnosis || "—"}
                  </span>
                  {prediction.severity && (
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getSeverityBadge(prediction.severity)}`}>
                      {prediction.severity}
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <p className="font-5 text-xs text-gray-500 mb-1">Confidence</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00B3A1] rounded-full transition-all duration-500"
                        style={{ width: `${Math.round((prediction.confidence ?? 0) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="font-5 text-sm text-gray-600 font-semibold">
                      {typeof prediction.confidence === "number"
                        ? `${Math.round(prediction.confidence * 100)}%`
                        : `${prediction.confidence}%` || "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Health Score */}
              <div>
                <p className="font-5 text-xs text-gray-500 uppercase tracking-wider mb-2">Health Score</p>
                <div className="flex items-center gap-4">
                  <svg width="80" height="80" className="transform -rotate-90">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <circle
                      cx="40" cy="40" r="34" fill="none"
                      stroke={ringColor(prediction.healthScore)}
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 34}`}
                      strokeDashoffset={`${2 * Math.PI * 34 * (1 - (prediction.healthScore || 0) / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div>
                    <span className={`font-1 text-3xl font-bold ${healthColor(prediction.healthScore)}`}>
                      {prediction.healthScore ?? "—"}
                    </span>
                    <span className="font-5 text-sm text-gray-500"> / 100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {prediction.recommendations && prediction.recommendations.length > 0 && (
              <div>
                <p className="font-5 text-xs text-gray-500 uppercase tracking-wider mb-3">Recommendations</p>
                <div className="space-y-2">
                  {prediction.recommendations.map((item, index) => {
                    const config = getPriorityConfig(item.priority);
                    return (
                      <div key={index} className={`flex items-start gap-3 p-3 rounded-xl border ${config.bg}`}>
                        <span className="w-6 h-6 rounded-full bg-[#00B3A1] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-1 text-sm text-gray-800 font-semibold">{item.action}</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase tracking-wider ${config.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
                              {item.priority}
                            </span>
                          </div>
                          {item.reason && (
                            <p className="font-5 text-xs text-gray-500 mt-0.5">{item.reason}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 py-2.5 bg-[#00B3A1] text-white font-1 rounded-xl hover:bg-[#009e8e] transition-all duration-200 text-sm"
              >
                <i className="fas fa-chart-line mr-2"></i>Go to Dashboard
              </button>
              <button
                onClick={() => setPrediction(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-5 rounded-xl hover:bg-gray-50 transition-all duration-200 text-sm"
              >
                <i className="fas fa-plus mr-2"></i>New Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}