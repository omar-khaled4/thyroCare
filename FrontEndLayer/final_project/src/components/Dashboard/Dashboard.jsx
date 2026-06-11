import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import style from "./Dashboard.module.css";
import { UserContext } from "./../../context/UserContext";
import Chart from "react-apexcharts";
import html2pdf from "html2pdf.js";
import { downloadMedicalReport } from "../../services/pdfService";
import { fetchDashboardData } from "../../services/dashboardService";

/* ═══════════════════════════════════════════════════════════════════
 *  Loading-skeleton animation
 * ═══════════════════════════════════════════════════════════════════ */
let _skeletonStyleTag = null;

function injectSkeletonStyles() {
  if (_skeletonStyleTag) return;
  _skeletonStyleTag = document.createElement("style");
  _skeletonStyleTag.textContent = `
    @keyframes dash-skeleton-pulse {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    .skeleton-pulse {
      background: linear-gradient(90deg, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.10) 50%, rgba(0,0,0,0.04) 75%);
      background-size: 200% 100%;
      animation: dash-skeleton-pulse 1.4s ease-in-out infinite;
      border-radius: 8px;
    }
  `;
  document.head.appendChild(_skeletonStyleTag);
}

function SkeletonChart() {
  return <div className="w-full h-[300px] skeleton-pulse rounded-xl" />;
}

function SkeletonRadar() {
  return <div className="w-full h-[380px] skeleton-pulse rounded-xl" />;
}

function SkeletonText({ width, height, style: extra }) {
  return (
    <div
      className="skeleton-pulse"
      style={{ width: width ?? "100%", height: height ?? 14, marginBottom: 4, ...extra }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════
 *  Empty state components
 * ═══════════════════════════════════════════════════════════════════ */

function EmptyChartState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-[300px] text-gray-400 font-5 text-sm text-center px-6">
      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <i className="fas fa-chart-line text-gray-300 text-xl"></i>
      </div>
      {message}
    </div>
  );
}

function EmptyRadarState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-[380px] text-gray-400 font-5 text-sm text-center px-6">
      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <i className="fas fa-radar text-gray-300 text-xl"></i>
      </div>
      {message}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 *  Dashboard component
 * ═══════════════════════════════════════════════════════════════════ */

export default function Dashboard() {
  const { user } = useContext(UserContext);

  useEffect(() => { injectSkeletonStyles(); }, []);

  // ── Chart raw data ──
  const [T3data, setT3data] = useState([]);
  const [T4data, setT4data] = useState([]);
  const [TSHdata, setTSHdata] = useState([]);
  const [STdata, setSTdata] = useState([]);

  // ── Loaded flags ──
  const [T3loaded, setT3Loaded] = useState(false);
  const [T4loaded, setT4Loaded] = useState(false);
  const [TSHloaded, setTSHLoaded] = useState(false);
  const [SymptomsLoaded, setSymptomsLoaded] = useState(false);
  const [ProfileLoaded, setProfileLoaded] = useState(false);

  const [prediction, setPrediction] = useState(null);
  const [predictionLoaded, setPredictionLoaded] = useState(false);
  const [profile, setProfileState] = useState(null);

  // ── Fetch ──
  useEffect(() => {
    let cancelled = false;
    injectSkeletonStyles();

    fetchDashboardData().then((data) => {
      if (cancelled) return;
      setT3data(Array.isArray(data.t3) ? data.t3 : []);
      setT4data(Array.isArray(data.t4) ? data.t4 : []);
      setTSHdata(Array.isArray(data.tsh) ? data.tsh : []);
      setSTdata(Array.isArray(data.symptoms) ? data.symptoms : []);
      setProfileState(data.profile ?? null);
      setPrediction(data.latestPrediction ?? null);

      setTimeout(() => {
        if (cancelled) return;
        setT3Loaded(true);
        setT4Loaded(true);
        setTSHLoaded(true);
        setSymptomsLoaded(true);
        setProfileLoaded(true);
        setPredictionLoaded(true);
      }, 400);
    }).catch(() => {
      if (cancelled) return;
      setT3Loaded(true);
      setT4Loaded(true);
      setTSHLoaded(true);
      setSymptomsLoaded(true);
      setProfileLoaded(true);
      setPredictionLoaded(true);
    });
    return () => { cancelled = true; };
  }, []);

  /* ────────────────────────────────────────────────────────────────
   *  CHART CONFIGS
   * ──────────────────────────────────────────────────────────────── */

  // ── T3 ──
  const [T3range, setT3Range] = useState("all");

  const T3filteredData = useMemo(() => {
    const sorted = [...T3data].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (T3range === "all") return sorted;
    const months = T3range === "1m" ? 1 : T3range === "6m" ? 6 : 12;
    const from = new Date();
    from.setMonth(from.getMonth() - months);
    return sorted.filter((p) => new Date(p.date) >= from);
  }, [T3data, T3range]);

  const T3series = useMemo(() => [{ name: "T3", data: T3filteredData.map((p) => p.t3) }], [T3filteredData]);

  const T3options = {
    chart: { type: "bar", toolbar: { show: false }, zoom: { enabled: false } },
    plotOptions: { bar: { borderRadius: 6, columnWidth: "45%" } },
    stroke: { curve: "smooth", width: 3 },
    dataLabels: { enabled: false },
    colors: ["#00B3A1"],
    fill: { opacity: 0.25 },
    xaxis: { categories: T3filteredData.map((p) => p.date), labels: { rotate: -30, style: { fontSize: "11px" } } },
    grid: { borderColor: "rgba(0,0,0,0.06)", strokeDashArray: 4 },
    tooltip: { y: { formatter: (val) => `${val} pg/mL` } },
    yaxis: { title: { text: "T3 (pg/mL)" }, decimalsInFloat: 1 },
  };

  // ── T4 ──
  const [T4range, setT4Range] = useState("all");

  const T4filteredData = useMemo(() => {
    const sorted = [...T4data].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (T4range === "all") return sorted;
    const months = T4range === "1m" ? 1 : T4range === "6m" ? 6 : 12;
    const from = new Date();
    from.setMonth(from.getMonth() - months);
    return sorted.filter((p) => new Date(p.date) >= from);
  }, [T4data, T4range]);

  const T4series = useMemo(() => [{ name: "T4", data: T4filteredData.map((p) => p.t4) }], [T4filteredData]);

  const T4options = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true, borderRadius: 6, barHeight: "55%" } },
    dataLabels: { enabled: false },
    colors: ["rgba(0, 179, 161, 0.28)"],
    stroke: { show: true, width: 2, colors: ["#00B3A1"] },
    xaxis: { categories: T4filteredData.map((p) => p.date), title: { text: "T4 (ng/dL)" }, labels: { style: { colors: "#666" } } },
    yaxis: { labels: { style: { colors: "#666" } } },
    grid: { borderColor: "rgba(0,0,0,0.06)", strokeDashArray: 4 },
    tooltip: { x: { formatter: (_, opts) => T4filteredData[opts.dataPointIndex]?.date }, y: { formatter: (val) => `${val} ng/dL` } },
  };

  // ── TSH ──
  const [TSHrange, setTSHRange] = useState("all");

  const TSHfilteredData = useMemo(() => {
    const sorted = [...TSHdata].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (TSHrange === "all") return sorted;
    const months = TSHrange === "1m" ? 1 : TSHrange === "6m" ? 6 : 12;
    const from = new Date();
    from.setMonth(from.getMonth() - months);
    return sorted.filter((p) => new Date(p.date) >= from);
  }, [TSHdata, TSHrange]);

  const TSHseries = useMemo(() => [{ name: "TSH", data: TSHfilteredData.map((p) => [new Date(p.date).getTime(), p.tsh]) }], [TSHfilteredData]);

  const TSHoptions = {
    chart: { type: "area", toolbar: { show: false }, zoom: { enabled: false } },
    stroke: { curve: "smooth", width: 3 },
    dataLabels: { enabled: false },
    xaxis: { type: "datetime", labels: { style: { color: "#666" } } },
    yaxis: { labels: { style: { color: "#666" } } },
    colors: ["#00B3A1"],
    fill: { opacity: 0.25 },
    tooltip: { x: { format: "dd MMM yyyy" } },
  };

  // ── Symptom Tracker ──
  const [STselectedMonth, setSTSelectedMonth] = useState("");

  const STavailableMonths = useMemo(() => {
    const months = STdata.map((x) => String(x.date).slice(0, 7)).filter(Boolean);
    return Array.from(new Set(months)).sort();
  }, [STdata]);

  useEffect(() => {
    if (!STavailableMonths.length) return;
    if (!STselectedMonth || !STavailableMonths.includes(STselectedMonth)) {
      setSTSelectedMonth(STavailableMonths[STavailableMonths.length - 1]);
    }
  }, [STavailableMonths, STselectedMonth]);

  const STfiltered = useMemo(() => STdata.filter((item) => String(item.date).slice(0, 7) === STselectedMonth), [STdata, STselectedMonth]);
  const STlast = STfiltered[STfiltered.length - 1];

  const STcategories = ["Fatigue", "Anxiety", "Insomnia", "Hair Loss", "Palpitations", "Cold Intolerance"];
  const STseries = STlast ? [{ name: "Severity (0-10)", data: [Number(STlast.fatigue) || 0, Number(STlast.anxiety) || 0, Number(STlast.insomnia) || 0, Number(STlast.hairLoss) || 0, Number(STlast.palpitations) || 0, Number(STlast.coldIntolerance) || 0] }] : [];
  const SToptions = {
    chart: { type: "radar", toolbar: { show: false } },
    xaxis: { categories: STcategories, labels: { style: { colors: "#444" } } },
    yaxis: { min: 0, max: 10, tickAmount: 5 },
    stroke: { width: 3 },
    fill: { opacity: 0.25 },
    colors: ["#00B3A1"],
    dataLabels: { enabled: false },
    plotOptions: { radar: { polygons: { strokeColors: "rgba(0,0,0,0.12)", connectorColors: "rgba(0,0,0,0.12)" } } },
  };

  /* ────────────────────────────────────────────────────────────────
   *  DERIVED VALUES
   * ──────────────────────────────────────────────────────────────── */

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Patient";
  const hasReports = T3data.length > 0 || T4data.length > 0 || TSHdata.length > 0 || STdata.length > 0;
  const healthScore = hasReports ? (prediction?.healthScore ?? null) : null;
  const diagnosis = hasReports ? (prediction?.diagnosis ?? "Stable") : null;
  const conditionLabel = diagnosis ?? "No Reports";
  const severity = prediction?.severity;

  const med = profile?.medicalInfo ?? {};
  const medicationName = med.medication ?? "Levothyroxine";
  const dosage = med.dosage ?? "75 mcg daily";
  const refillDaysLeft = med.refillDaysLeft ?? 12;
  const doctor = med.doctor ?? "Dr. Sarah Johnson";
  const nextAppointment = med.nextAppointment ?? "";

  const sortedTSH = [...TSHdata].sort((a, b) => new Date(b.date) - new Date(a.date));
  const tshCurrentVal = sortedTSH[0]?.tsh;
  const tshPreviousVal = sortedTSH[1]?.tsh;
  const tshCurrent = tshCurrentVal != null ? `${tshCurrentVal} mIU/L` : "—";
  const tshPrevious = tshPreviousVal != null ? `${tshPreviousVal} mIU/L` : "—";
  const tshChange = (tshCurrentVal != null && tshPreviousVal != null) ? (tshCurrentVal - tshPreviousVal).toFixed(1) : "—";

  const sortedT4 = [...T4data].sort((a, b) => new Date(b.date) - new Date(a.date));
  const freeT4CurrentVal = sortedT4[0]?.t4;
  const freeT4PreviousVal = sortedT4[1]?.t4;
  const freeT4Current = freeT4CurrentVal != null ? `${freeT4CurrentVal} ng/dL` : "—";
  const freeT4Previous = freeT4PreviousVal != null ? `${freeT4PreviousVal} ng/dL` : "—";
  const freeT4Change = (freeT4CurrentVal != null && freeT4PreviousVal != null) ? (freeT4CurrentVal - freeT4PreviousVal >= 0 ? "+" : "") + (freeT4CurrentVal - freeT4PreviousVal).toFixed(1) : "—";

  const sortedT3 = [...T3data].sort((a, b) => new Date(b.date) - new Date(a.date));
  const freeT3CurrentVal = sortedT3[0]?.t3;
  const freeT3PreviousVal = sortedT3[1]?.t3;
  const freeT3Current = freeT3CurrentVal != null ? `${freeT3CurrentVal} pg/mL` : "—";
  const freeT3Previous = freeT3PreviousVal != null ? `${freeT3PreviousVal} pg/mL` : "—";
  const freeT3Change = (freeT3CurrentVal != null && freeT3PreviousVal != null) ? (freeT3CurrentVal - freeT3PreviousVal >= 0 ? "+" : "") + (freeT3CurrentVal - freeT3PreviousVal).toFixed(1) : "—";

  const [pdfLoading, setPdfLoading] = useState(false);
  const handleDownloadPDF = () => {
    downloadMedicalReport({ user, prediction, onStart: () => setPdfLoading(true), onEnd: () => setPdfLoading(false) });
  };

  /* ────────────────────────────────────────────────────────────────
   *  HELPERS
   * ──────────────────────────────────────────────────────────────── */

  function getScoreColor(score) {
    if (score >= 75) return { stroke: "#16a34a", text: "text-green-600", bg: "bg-green-50", label: "Good" };
    if (score >= 50) return { stroke: "#e17100", text: "text-amber-600", bg: "bg-amber-50", label: "Fair" };
    return { stroke: "#dc2626", text: "text-red-600", bg: "bg-red-50", label: "Critical" };
  }

  function getPriorityConfig(priority) {
    if (priority === "high") return { bg: "bg-red-50 border-red-200", text: "text-red-700", dot: "bg-red-500", label: "High" };
    if (priority === "medium") return { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", dot: "bg-amber-500", label: "Medium" };
    return { bg: "bg-green-50 border-green-200", text: "text-green-700", dot: "bg-green-500", label: "Low" };
  }

  const rangeButtons = ["1m", "6m", "1y", "all"];

  /* ────────────────────────────────────────────────────────────────
   *  RENDER
   * ──────────────────────────────────────────────────────────────── */

  return (
    <div className="background-DB min-h-screen">
      <div className="pt-24 pb-8 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">

        {/* ═══════════════════════════════════════════════════════════
         *  HERO SECTION — Welcome + Health Score
         * ═══════════════════════════════════════════════════════════ */}
        <div className="background-card p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Left — Welcome text */}
            <div className="flex-1 text-center md:text-left">
              <p className="font-5 text-gray-500 text-sm mb-1">
                <i className="fas fa-calendar-day mr-1"></i>
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
              <h1 className="font-1 text-3xl md:text-4xl text-gray-800">
                Welcome, <span className="text-[#00B3A1]">{fullName}</span>
              </h1>

              {diagnosis && hasReports && (
                <div className="mt-3 flex items-center gap-2 justify-center md:justify-start">
                  <span className="font-5 text-gray-600 text-sm">Diagnosis:</span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#00B3A1]/10 text-[#00B3A1] border border-[#00B3A1]/20">
                    {diagnosis}
                  </span>
                  {severity && (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${severity === "Severe" ? "bg-red-50 text-red-700 border-red-200" :
                        severity === "Moderate" ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-green-50 text-green-700 border-green-200"
                      }`}>
                      {severity}
                    </span>
                  )}
                </div>
              )}

              <p className="font-1 text-2xl mt-4">
                {!hasReports || prediction === null ? (
                  <span className="text-gray-400 text-lg italic">
                    Insert a report to know your thyroid levels.
                  </span>
                ) : healthScore >= 75 ? (
                  <>Your thyroid levels <span className="text-green-600">look good</span> today.</>
                ) : healthScore >= 50 ? (
                  <>Your thyroid levels <span className="text-amber-600">need monitoring</span> today.</>
                ) : (
                  <>Your thyroid levels <span className="text-red-600">are critical</span> today.</>
                )}
              </p>

              <button
                onClick={handleDownloadPDF}
                disabled={pdfLoading}
                className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 bg-[#00B3A1] text-white font-1 rounded-xl hover:bg-[#009e8e] transition-all duration-200 hover:shadow-lg hover:shadow-[#00B3A1]/20 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
              >
                <i className="fas fa-file-pdf"></i>
                {pdfLoading ? "Generating..." : "Download Report"}
              </button>
            </div>

            {/* Right — Health Score Gauge */}
            <div className="flex-shrink-0">
              {ProfileLoaded ? (
                (() => {
                  const score = healthScore != null ? Math.round(healthScore) : 0;
                  const displayScore = hasReports ? score : 0;
                  const colors = hasReports ? getScoreColor(score) : { stroke: "#d1d5db", text: "text-gray-400", bg: "bg-gray-50", label: "—" };
                  const size = 170;
                  const strokeWidth = 12;
                  const radius = (size - strokeWidth) / 2;
                  const circumference = 2 * Math.PI * radius;
                  const offset = circumference - (displayScore / 100) * circumference;

                  return (
                    <div className="relative">
                      <svg width={size} height={size}>
                        <circle stroke="#e5e7eb" fill="transparent" strokeWidth={strokeWidth} r={radius} cx={size / 2} cy={size / 2} />
                        <circle
                          stroke={colors.stroke}
                          fill="transparent"
                          strokeWidth={strokeWidth}
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                          r={radius}
                          cx={size / 2}
                          cy={size / 2}
                          style={{ transition: "stroke-dashoffset 0.8s ease", transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-4xl font-bold ${colors.text}`}>{displayScore}</span>
                        <span className="text-xs text-gray-500 mt-0.5 font-5">Health Score</span>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="w-[170px] h-[170px] skeleton-pulse rounded-full" />
              )}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
         *  INFO CARDS — Condition, Medication, Appointment
         * ═══════════════════════════════════════════════════════════ */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          {/* Current Condition */}
          <div className="background-card p-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#00B3A1]/10 flex items-center justify-center flex-shrink-0">
              <i className="fas fa-heart-pulse text-[#00B3A1] text-xl"></i>
            </div>
            <div>
              <p className="font-5 text-xs text-gray-500 uppercase tracking-wider mb-1">Current Condition</p>
              <p className="font-1 text-lg text-gray-800 font-semibold">{conditionLabel}</p>
              <p className="font-5 text-sm text-gray-500">
                {prediction && hasReports
                  ? `Confidence: ${Math.round((prediction.confidence ?? 0) * 100)}%`
                  : hasReports ? "Stable" : "No reports submitted"}
              </p>
            </div>
          </div>

          {/* Medication Status */}
          <div className="background-card p-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#00B3A1]/10 flex items-center justify-center flex-shrink-0">
              <i className="fas fa-pills text-[#00B3A1] text-xl"></i>
            </div>
            <div>
              <p className="font-5 text-xs text-gray-500 uppercase tracking-wider mb-1">Medication</p>
              <p className="font-1 text-lg text-gray-800 font-semibold">{medicationName}</p>
              <p className="font-5 text-sm text-gray-500">{dosage}</p>
              <p className="font-5 text-xs text-[#00B3A1] mt-1">
                <i className="fas fa-clock mr-1"></i>Refill in {refillDaysLeft} day{refillDaysLeft !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Next Appointment */}
          <div className="background-card p-5 flex items-start gap-4 sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-[#00B3A1]/10 flex items-center justify-center flex-shrink-0">
              <i className="fas fa-calendar-check text-[#00B3A1] text-xl"></i>
            </div>
            <div>
              <p className="font-5 text-xs text-gray-500 uppercase tracking-wider mb-1">Next Appointment</p>
              <p className="font-1 text-lg text-gray-800 font-semibold">{doctor || "—"}</p>
              {nextAppointment ? (
                <p className="font-5 text-sm text-[#00B3A1]">
                  <i className="fas fa-clock mr-1"></i>{nextAppointment}
                </p>
              ) : (
                <p className="font-5 text-sm text-gray-400 italic">No upcoming appointment</p>
              )}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
         *  CHARTS GRID
         * ═══════════════════════════════════════════════════════════ */}
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          {/* T3 */}
          <div className="background-card p-5 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-1 text-lg text-gray-800">T3 Levels</h3>
              <div className="flex gap-1">
                {rangeButtons.map((r) => (
                  <button key={r} onClick={() => setT3Range(r)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-5 transition-all duration-200 ${T3range === r ? "bg-[#00B3A1] text-white" : "text-gray-500 hover:bg-gray-100"
                      }`}>
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            {!T3loaded ? <SkeletonChart /> : T3filteredData.length > 0 ? (
              <Chart options={T3options} series={T3series} type="bar" height={300} />
            ) : (
              <EmptyChartState message="No T3 lab results yet. Add a report to see your data." />
            )}
          </div>

          {/* T4 */}
          <div className="background-card p-5 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-1 text-lg text-gray-800">T4 Levels</h3>
              <div className="flex gap-1">
                {rangeButtons.map((r) => (
                  <button key={r} onClick={() => setT4Range(r)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-5 transition-all duration-200 ${T4range === r ? "bg-[#00B3A1] text-white" : "text-gray-500 hover:bg-gray-100"
                      }`}>
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            {!T4loaded ? <SkeletonChart /> : T4filteredData.length > 0 ? (
              <Chart options={T4options} series={T4series} type="bar" height={300} />
            ) : (
              <EmptyChartState message="No T4 lab results yet. Add a report to see your data." />
            )}
          </div>

          {/* TSH */}
          <div className="background-card p-5 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-1 text-lg text-gray-800">TSH Levels</h3>
              <div className="flex gap-1">
                {rangeButtons.map((r) => (
                  <button key={r} onClick={() => setTSHRange(r)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-5 transition-all duration-200 ${TSHrange === r ? "bg-[#00B3A1] text-white" : "text-gray-500 hover:bg-gray-100"
                      }`}>
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            {!TSHloaded ? <SkeletonChart /> : TSHfilteredData.length > 0 ? (
              <Chart options={TSHoptions} series={TSHseries} type="area" height={300} />
            ) : (
              <EmptyChartState message="No TSH lab results yet. Add a report to see your data." />
            )}
          </div>

          {/* Symptom Tracker */}
          <div className="background-card p-5 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-1 text-lg text-gray-800">Symptom Tracker</h3>
              {!SymptomsLoaded ? (
                <SkeletonText width={120} height={32} />
              ) : STavailableMonths.length > 0 ? (
                <select
                  value={STselectedMonth}
                  onChange={(e) => setSTSelectedMonth(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-5 text-gray-700 bg-white focus:border-[#00B3A1] focus:ring-1 focus:ring-[#00B3A1]/20 outline-none"
                >
                  {STavailableMonths.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              ) : null}
            </div>
            {!SymptomsLoaded ? <SkeletonRadar /> : STlast ? (
              <Chart options={SToptions} series={STseries} type="radar" height={380} />
            ) : (
              <EmptyRadarState message="No symptom records yet. Log a report to begin tracking." />
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
         *  LAB COMPARISON CARDS
         * ═══════════════════════════════════════════════════════════ */}
        <div className="grid gap-4 sm:grid-cols-3 mt-6">
          {[
            { title: "TSH", current: tshCurrent, previous: tshPrevious, change: tshChange, unit: "mIU/L", icon: "fa-wave-square" },
            { title: "Free T4", current: freeT4Current, previous: freeT4Previous, change: freeT4Change, unit: "ng/dL", icon: "fa-vial" },
            { title: "Free T3", current: freeT3Current, previous: freeT3Previous, change: freeT3Change, unit: "pg/mL", icon: "fa-flask" },
          ].map((item) => (
            <div key={item.title} className="background-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#00B3A1]/10 flex items-center justify-center">
                  <i className={`fas ${item.icon} text-[#00B3A1] text-sm`}></i>
                </div>
                <h3 className="font-1 text-lg text-gray-800">{item.title}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-5 text-sm text-gray-500">Current</span>
                  <span className="font-1 text-lg text-[#00B3A1] font-semibold">{item.current}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-5 text-sm text-gray-500">Previous</span>
                  <span className="font-5 text-sm text-gray-600">{item.previous}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="font-5 text-sm text-gray-500">Change</span>
                  <span className={`font-5 text-sm font-semibold ${item.change !== "—" ? (parseFloat(item.change) >= 0 ? "text-amber-600" : "text-green-600") : "text-gray-400"}`}>
                    {item.change !== "—" ? (parseFloat(item.change) >= 0 ? "↑ " : "↓ ") + Math.abs(parseFloat(item.change)) : "—"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════
         *  RECOMMENDED ACTIONS
         * ═══════════════════════════════════════════════════════════ */}
        <div className="background-card mt-6 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#00B3A1]/10 flex items-center justify-center">
              <i className="fas fa-lightbulb text-[#00B3A1] text-sm"></i>
            </div>
            <h3 className="font-1 text-lg text-gray-800">Recommended Actions</h3>
          </div>

          {!predictionLoaded ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <SkeletonText width={28} height={28} style={{ borderRadius: "50%", flexShrink: 0 }} />
                  <div className="flex-grow">
                    <SkeletonText width="70%" height={18} />
                    <SkeletonText width="45%" height={12} />
                  </div>
                </div>
              ))}
            </div>
          ) : !prediction || (prediction.recommendations ?? []).length === 0 ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <i className="fas fa-clipboard-list text-gray-300 text-xl"></i>
              </div>
              <p className="font-5 text-gray-400 text-sm">
                No recommendations available yet. Submit a thyroid report to get personalized recommendations.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {(prediction.recommendations ?? []).map((item, index) => {
                const config = getPriorityConfig(item.priority);
                return (
                  <div key={index} className={`flex items-start gap-3 p-4 rounded-xl border ${config.bg} transition-all duration-200`}>
                    <span className="w-7 h-7 rounded-full bg-[#00B3A1] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-1 text-base text-gray-800 font-semibold">{item.action}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase tracking-wider ${config.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
                          {config.label}
                        </span>
                      </div>
                      {item.reason && (
                        <p className="font-5 text-sm text-gray-500 mt-1">{item.reason}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}