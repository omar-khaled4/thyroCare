import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import style from "./Dashboard.module.css";
import { UserContext } from "./../../context/UserContext";
import Chart from "react-apexcharts";
import html2pdf from "html2pdf.js";
import { downloadMedicalReport } from "../../services/pdfService";

/* ── API services (already exist at the paths below) ── */
import { fetchDashboardData } from "../../services/dashboardService";

/* ═══════════════════════════════════════════════════════════════════
 *  Loading-skeleton animation bundled via CSS-in-JS style object
 *  (avoids touching the global index.css)
 *  The .Dashboard-skeleton-keyframes rule is injected once via
 *  injectSkeletonStyles() below.
 * ═══════════════════════════════════════════════════════════════════ */
let _skeletonStyleTag = null;

function injectSkeletonStyles() {
  if (_skeletonStyleTag) return; // inject once per session
  _skeletonStyleTag = document.createElement("style");
  _skeletonStyleTag.textContent = `
    @keyframes dash-skeleton-pulse {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    .skeleton-pulse {
      background: linear-gradient(
        90deg,
        rgba(0,0,0,0.06) 25%,
        rgba(0,0,0,0.14) 50%,
        rgba(0,0,0,0.06) 75%
      );
      background-size: 200% 100%;
      animation: dash-skeleton-pulse 1.4s ease-in-out infinite;
      border-radius: 6px;
    }
  `;
  document.head.appendChild(_skeletonStyleTag);
}

/* ═══════════════════════════════════════════════════════════════════
 *  Reusable skeleton components
 * ═══════════════════════════════════════════════════════════════════ */

function SkeletonChart() {
  return (
    <div className="w-full h-[320px] skeleton-pulse" />
  );
}

function SkeletonRadar() {
  return (
    <div className="w-full h-[400px] skeleton-pulse" />
  );
}

function SkeletonStatCard() {
  return (
    <div className="skeleton-pulse w-full" style={{ height: 28, marginBottom: 6 }} />
  );
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
 *  Empty state components  (shown when a response returns [])
 * ═══════════════════════════════════════════════════════════════════ */

function EmptyChartState({ message }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 320,
        color: "#999",
        fontFamily: "Amaranth, sans-serif",
        fontSize: 15,
        textAlign: "center",
        padding: 20,
      }}
    >
      <div>
        <i className="fas fa-chart-area" style={{ fontSize: 36, display: "block", marginBottom: 10 }} />
        {message}
      </div>
    </div>
  );
}

function EmptyRadarState({ message }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 400,
        color: "#999",
        fontFamily: "Amaranth, sans-serif",
        fontSize: 15,
        fontStyle: "italic",
      }}
    >
      {message}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 *  Dashboard component
 * ═══════════════════════════════════════════════════════════════════ */

export default function Dashboard() {
  const { userToken, setuserToken, user, setuser } = useContext(UserContext);

  /* inject skeleton keyframes into <head> once */
  useEffect(() => { injectSkeletonStyles(); }, []);

  /* ────────────────────────────────────────────────────────────────
   *  DATA LOADING STATE
   *
   *  Each loader is independent so that partially-loaded data partially
   *  renders rather than waiting for the slowest endpoint.
   *
   *  Timeline
   *      mount ─► fetchDashboardData() [Promise.all]
   *                    ├─ fetchT3()          ─► setT3loaded
   *                    ├─ fetchT4()          ─► setT4loaded
   *                    ├─ fetchTSH()         ─► setTSHloaded
   *                    ├─ fetchSymptoms()    ──► setSymptomsLoaded
   *                    └─ fetchProfile()       ─► setProfileLoaded
   *
   *  With useMemo-derived filtered/output arrays, every subsequent
   *  mounted and only re-evaluated when their source useState arrays
   *  signal "ready" (they flip from [] to the API response).
   * ──────────────────────────────────────────────────────────────── */

  // ── Chart raw data ──
  const [T3data, setT3data] = useState([]);
  const [T4data, setT4data] = useState([]);
  const [TSHdata, setTSHdata] = useState([]);

  // ── Symptom-tracker raw data ──
  const [STdata, setSTdata] = useState([]);

  // ── Loaded flags ──
  const [T3loaded, setT3Loaded] = useState(false);
  const [T4loaded, setT4Loaded] = useState(false);
  const [TSHloaded, setTSHLoaded] = useState(false);
  const [SymptomsLoaded, setSymptomsLoaded] = useState(false);
  const [ProfileLoaded, setProfileLoaded] = useState(false);

  // ── Prediction (NN model) ──
  const [prediction, setPrediction] = useState(null);
  const [predictionLoaded, setPredictionLoaded] = useState(false);

  // ── Profile (info cards) ──
  const [profile, setProfileState] = useState(null);

  // ────────────────────────────────────────────────────────────────
  //  FETCH — runs once when the dashboard mounts
  // ────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    injectSkeletonStyles();

    // Fire off all five requests in parallel
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
      // Even if fetch fails, flip all loaded flags so skeletons show empty state
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
   *  FRAGMENTED LOAD TOOLTIPS
   *
   *  Because flagged groups load at slightly different times (the
   *  400ms artificial delay plays here too), the skeleton animations
   *  can fire in any order. Set manually per flag:
   *
   *  ┌─────────┬───────────────────────────┐
   *  │ T3/T4   │ Lab-results shared model ──┴──► fetchHealthEndpoint()   │
   *  │ TSH     │ Lab-results shared model ──┴──► fetchHealthEndpoint()   │
   *  │ Symptoms│ standalone normaliser ──► normaliseSymptoms()          │
   *  │ Profile │ standalone mapper ──► setProfileState()                  │
   *  └─────────┴──────────────────────────────────────────────────────────┘
   *
   *  The 400 ms guard prevents skeleton→content flicker on localhost.
   *  If fetchDashboardData() fails entirely all five "loaded" flags
   *  will never flip — the skeleton is replaced by an Empty State.
   * ──────────────────────────────────────────────────────────────── */

  /* ────────────────────────────────────────────────────────────────
   *  T3 CHART
   * ──────────────────────────────────────────────────────────────── */
  const [T3range, setT3Range] = useState("all"); // 1m | 6m | 1y | all

  /** Filter T3raw[] by selected range → T3filteredData */
  const T3filteredData = useMemo(() => {
    const T3sorted = [...T3data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    if (T3range === "all") return T3sorted;

    const T3months = T3range === "1m" ? 1 : T3range === "6m" ? 6 : 12;
    const T3from = new Date();
    T3from.setMonth(T3from.getMonth() - T3months);

    return T3sorted.filter((p) => new Date(p.date) >= T3from);
  }, [T3data, T3range]);

  const T3series = useMemo(
    () => [
      {
        name: "T3",
        data: T3filteredData.map((p) => p.t3),
      },
    ],
    [T3filteredData]
  );

  const T3options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "45%",
      },
    },
    dataLabels: { enabled: false },
    colors: ["#00B3A1"],
    fill: { opacity: 0.25 },
    xaxis: {
      categories: T3filteredData.map((p) => p.date),
      labels: { rotate: -30 },
    },
    grid: {
      borderColor: "rgba(0,0,0,0.2)",
      strokeDashArray: 4,
    },
    tooltip: {
      y: { formatter: (val) => `${val} pg/mL` },
    },
    yaxis: {
      title: { text: "T3 (pg/mL)" },
      decimalsInFloat: 1,
    },
  };

  /* ────────────────────────────────────────────────────────────────
   *  T4 CHART
   * ──────────────────────────────────────────────────────────────── */
  const [T4range, setT4Range] = useState("all");

  const T4filteredData = useMemo(() => {
    const T4sorted = [...T4data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    if (T4range === "all") return T4sorted;

    const T4months = T4range === "1m" ? 1 : T4range === "6m" ? 6 : 12;
    const T4from = new Date();
    T4from.setMonth(T4from.getMonth() - T4months);

    return T4sorted.filter((p) => new Date(p.date) >= T4from);
  }, [T4data, T4range]);

  const T4series = useMemo(
    () => [
      {
        name: "T4",
        data: T4filteredData.map((p) => p.t4),
      },
    ],
    [T4filteredData]
  );

  const T4options = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 10,
        barHeight: "55%",
      },
    },
    dataLabels: { enabled: false },
    colors: ["rgba(0, 179, 161, 0.28)"],
    stroke: {
      show: true,
      width: 2,
      colors: ["#00B3A1"],
    },
    xaxis: {
      categories: T4filteredData.map((p) => p.date),
      title: { text: "T4 (ng/dL)" },
      labels: { style: { colors: "#000" } },
    },
    yaxis: {
      labels: { style: { colors: "#000" } },
    },
    grid: {
      borderColor: "rgba(0,0,0,0.2)",
      strokeDashArray: 4,
    },
    tooltip: {
      x: { formatter: (_, opts) => T4filteredData[opts.dataPointIndex]?.date },
      y: { formatter: (val) => `${val} ng/dL` },
    },
  };

  /* ────────────────────────────────────────────────────────────────
   *  TSH CHART  (typo fix: ysxis → yaxis — retained from original)
   * ──────────────────────────────────────────────────────────────── */
  const [TSHrange, setTSHRange] = useState("all");

  const TSHfilteredData = useMemo(() => {
    const TSHsorted = [...TSHdata].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    if (TSHrange === "all") return TSHsorted;

    const TSHmonths = TSHrange === "1m" ? 1 : TSHrange === "6m" ? 6 : 12;
    const TSHfrom = new Date();
    TSHfrom.setMonth(TSHfrom.getMonth() - TSHmonths);
    return TSHsorted.filter((p) => new Date(p.date) >= TSHfrom);
  }, [TSHdata, TSHrange]);

  const TSHseries = useMemo(
    () => [
      {
        name: "TSH",
        data: TSHfilteredData.map((p) => [new Date(p.date).getTime(), p.tsh]),
      },
    ],
    [TSHfilteredData]
  );

  const TSHoptions = {
    chart: { type: "area", toolbar: { show: false }, zoom: { enabled: false } },
    stroke: { curve: "smooth", width: 3 },
    dataLabels: { enabled: false },
    xaxis: { type: "datetime", labels: { style: { color: "#000" } } },
    yaxis: { labels: { style: { color: "#000" } } }, // ← fixed typo
    colors: ["#00B3A1"],
    fill: { opacity: 0.25 },
    tooltip: { x: { format: "dd MMM yyyy" } },
  };

  /* ────────────────────────────────────────────────────────────────
   *  SYMPTOM TRACKER
   * ──────────────────────────────────────────────────────────────── */
  const [STselectedMonth, setSTSelectedMonth] = useState("");

  const STavailableMonths = useMemo(() => {
    const months = STdata.map((x) => String(x.date).slice(0, 7)).filter(Boolean);
    return Array.from(new Set(months)).sort();
  }, [STdata]);

  // Auto-select the most recent available month whenever the data changes
  useEffect(() => {
    if (!STavailableMonths.length) return;
    if (!STselectedMonth || !STavailableMonths.includes(STselectedMonth)) {
      setSTSelectedMonth(STavailableMonths[STavailableMonths.length - 1]);
    }
  }, [STavailableMonths, STselectedMonth]);

  const STfiltered = useMemo(() => {
    return STdata.filter(
      (item) => String(item.date).slice(0, 7) === STselectedMonth
    );
  }, [STdata, STselectedMonth]);

  const STlast = STfiltered[STfiltered.length - 1];

  const STcategories = [
    "Fatigue",
    "Anxiety",
    "Insomnia",
    "Hair Loss",
    "Palpitations",
    "Cold Intolerance",
  ];

  const STseries = STlast
    ? [
      {
        name: "Severity (0-10)",
        data: [
          Number(STlast.fatigue) || 0,
          Number(STlast.anxiety) || 0,
          Number(STlast.insomnia) || 0,
          Number(STlast.hairLoss) || 0,
          Number(STlast.palpitations) || 0,
          Number(STlast.coldIntolerance) || 0,
        ],
      },
    ]
    : [];

  const SToptions = {
    chart: { type: "radar", toolbar: { show: false } },
    xaxis: {
      categories: STcategories,
      labels: { style: { colors: "#000" } },
    },
    yaxis: { min: 0, max: 10, tickAmount: 5 },
    stroke: { width: 3 },
    fill: { opacity: 0.25 },
    colors: ["#00B3A1"],
    dataLabels: { enabled: false },
    grid: { borderColor: "rgba(0,0,0,0.35)" },
    plotOptions: {
      radar: {
        polygons: {
          strokeColors: "rgba(0,0,0,0.45)",
          connectorColors: "rgba(0,0,0,0.45)",
        },
      },
    },
  };

  /* ────────────────────────────────────────────────────────────────
   *  DERIVED VALUES — computed from profile / fetched data
   * ──────────────────────────────────────────────────────────────── */

  // Full name from profile (falls back to user?.firstName and/or user?.lastName)
  const fullName = (() => {
    const parts = [];
    if (user?.firstName) parts.push(user.firstName);
    if (user?.lastName) parts.push(user.lastName);
    return parts.join(" ") || "Patient";
  })();

  const hasReports = T3data.length > 0 || T4data.length > 0 || TSHdata.length > 0 || STdata.length > 0;

  // Prediction-derived values (fall back to profile / static defaults)
  const healthScore = hasReports ? (prediction?.healthScore ?? null) : null;   // 0-100 from NN model
  const diagnosis = hasReports
    ? (prediction?.diagnosis ?? profile?.medicalInfo?.status ?? "Stable")
    : null;
  const conditionLabel = diagnosis ?? "No Reports";

  // Medical info extracted with safe defaults
  const med =
    profile?.medicalInfo ??
    ({});

  const status = med.status ?? "Stable condition";
  const medicationName = med.medication ?? "Levothyroxine";
  const dosage = med.dosage ?? "75 mcg daily";
  const refillDaysLeft = med.refillDaysLeft ?? 12;
  const doctor = med.doctor ?? "Dr. Sarah Johnson";
  const nextAppointment = med.nextAppointment ?? "";  // ISO / display string

  // Dynamically computed comparison values from reports
  const sortedTSH = [...TSHdata].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const tshCurrentVal = sortedTSH[0]?.tsh;
  const tshPreviousVal = sortedTSH[1]?.tsh;
  const tshCurrent = tshCurrentVal != null ? `${tshCurrentVal} mIU/L` : "—";
  const tshPrevious = tshPreviousVal != null ? `${tshPreviousVal} mIU/L` : "—";
  const tshChange = (tshCurrentVal != null && tshPreviousVal != null)
    ? (tshCurrentVal - tshPreviousVal).toFixed(1)
    : "—";

  const sortedT4 = [...T4data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const freeT4CurrentVal = sortedT4[0]?.t4;
  const freeT4PreviousVal = sortedT4[1]?.t4;
  const freeT4Current = freeT4CurrentVal != null ? `${freeT4CurrentVal} ng/dL` : "—";
  const freeT4Previous = freeT4PreviousVal != null ? `${freeT4PreviousVal} ng/dL` : "—";
  const freeT4Change = (freeT4CurrentVal != null && freeT4PreviousVal != null)
    ? (freeT4CurrentVal - freeT4PreviousVal >= 0 ? "+" : "") + (freeT4CurrentVal - freeT4PreviousVal).toFixed(1)
    : "—";

  const sortedT3 = [...T3data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const freeT3CurrentVal = sortedT3[0]?.t3;
  const freeT3PreviousVal = sortedT3[1]?.t3;
  const freeT3Current = freeT3CurrentVal != null ? `${freeT3CurrentVal} pg/mL` : "—";
  const freeT3Previous = freeT3PreviousVal != null ? `${freeT3PreviousVal} pg/mL` : "—";
  const freeT3Change = (freeT3CurrentVal != null && freeT3PreviousVal != null)
    ? (freeT3CurrentVal - freeT3PreviousVal >= 0 ? "+" : "") + (freeT3CurrentVal - freeT3PreviousVal).toFixed(1)
    : "—";

  /* ────────────────────────────────────────────────────────────────
   *  HANDLERS
   * ──────────────────────────────────────────────────────────────── */

  /** Download the dashboard as a PDF via html2pdf.js */
  const [pdfLoading, setPdfLoading] = useState(false);
  const handleDownloadPDF = () => {
    downloadMedicalReport({
      user,
      prediction,
      onStart: () => setPdfLoading(true),
      onEnd: () => setPdfLoading(false),
    });
  };

  /* ────────────────────────────────────────────────────────────────
   *  RENDER
   * ──────────────────────────────────────────────────────────────── */
  return (
    <>
      <div className="background-DB">

        <div className="h-25" />

        {/* ── Hero row ─────────────────────────────────────────── */}
        <div className="background-card mx-5 md:mx-20 grid gap-5 p-5 md:grid-cols-12">
          <div className="md:col-span-8 text-center md:text-left md:flex md:flex-col md:justify-center">
            <p className="font-1 text-3xl">
              Welcome,{" "}
              <span className="color-1">{fullName}</span>
            </p>
            {diagnosis && (
              <p className="font-1 text-xl text-gray-500 mt-3 mb-1">
                Diagnosis: <span className="color-1 font-bold">{diagnosis}</span>
              </p>
            )}
            <p className="font-1 text-3xl">
              {!hasReports || prediction === null ? (
                <>
                  <span className="text-gray-400 text-2xl italic">
                    Insert a report to know your thyroid levels.
                  </span>
                </>
              ) : healthScore >= 75 ? (
                <>
                  Your thyroid levels <span className="text-green-600">look good</span> today.
                </>
              ) : healthScore >= 50 ? (
                <>
                  Your thyroid levels <span className="text-amber-600">need monitoring</span> today.
                </>
              ) : (
                <>
                  Your thyroid levels <span className="text-red-600">are critical</span> today.
                </>
              )}
            </p>
            <button
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
              className="background-1 w-33 py-2 mt-6 text-white font-1 rounded-full cursor-pointer disabled:opacity-60"
            >
              {pdfLoading ? "Generating..." : "Download PDF"}
            </button>
          </div>
          {/* Health Stability circle — profile-loaded only */}
          <div className="md:col-span-4 flex items-center justify-center">
            {ProfileLoaded ? (
              (() => {
                const gaugeValue = healthScore != null ? Math.round(healthScore) : (hasReports ? 82 : 0);
                const size = 180;
                const strokeWidth = 14;
                const radius = (size - strokeWidth) / 2;
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (gaugeValue / 100) * circumference;

                let strokeColor = "rgba(0,0,0,0.1)";
                let textColor = "text-gray-400";
                if (hasReports) {
                  const scoreVal = healthScore != null ? healthScore : 82;
                  if (scoreVal >= 75) {
                    strokeColor = "#16a34a";
                    textColor = "text-green-600";
                  } else if (scoreVal >= 50) {
                    strokeColor = "#e17100";
                    textColor = "text-amber-600";
                  } else {
                    strokeColor = "#dc2626";
                    textColor = "text-red-600";
                  }
                }

                return (
                  <div className="relative">
                    <svg width={size} height={size}>
                      <circle
                        stroke="rgba(0,0,0,0.1)"
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                      />
                      <circle
                        stroke={strokeColor}
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                        style={{
                          transition: "stroke-dashoffset 0.8s ease",
                          transform: "rotate(-90deg)",
                          transformOrigin: "50% 50%",
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-3xl font-bold ${textColor}`}>{gaugeValue}%</span>
                      <span className="text-sm text-gray-600 mt-1">
                        Health Stability
                      </span>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="flex flex-col items-center justify-center gap-3">
                <SkeletonChart />
                <div className="skeleton-pulse" style={{ width: 80, height: 48, borderRadius: 50 }}>
                  <div className="text-sm text-gray-400 text-center pt-4 h-full">
                    Health Stability
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Info cards row ────────────────────────────────────── */}
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 mx-5 md:mx-20 mt-10">

          {/* Current Condition ─ profile */}
          <div className="background-card p-5">
            <p className="text-center font-1 text-2xl">Current Condition</p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <div className="bg-white w-15 my-auto h-15 rounded-full flex">
                <i className="fa-solid fa-hand-holding-medical text-4xl mx-auto my-auto color-1" />
              </div>
              <div>
                <p className="font-1 text-xl">{conditionLabel}</p>
                <p className="font-1 text-lg">
                  {prediction && hasReports
                    ? `Confidence: ${Math.round((prediction.confidence ?? 0) * 100)}%`
                    : (hasReports ? status : "No reports submitted")}
                </p>
                <p className="font-1 color-1 text-[15px]">
                  Last updated: {hasReports ? "Today" : "Never"}
                </p>
              </div>
            </div>
          </div>

          {/* Medication Status ─ profile */}
          <div className="background-card p-5">
            <p className="text-center font-1 text-2xl">Medication Status</p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <div className="bg-white w-15 my-auto h-15 rounded-full flex">
                <i className="fa-solid fa-pills text-4xl mx-auto my-auto color-1" />
              </div>
              <div>
                <p className="font-1 text-xl">{medicationName}</p>
                <p className="font-1 text-lg">{dosage}</p>
                <p className="font-1 color-1 text-[15px]">
                  Next refill in {refillDaysLeft} day{refillDaysLeft !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Next Appointment ─ profile */}
          <div className="background-card p-5">
            <p className="text-center font-1 text-2xl">Next Appointment</p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <div className="bg-white w-15 my-auto h-15 rounded-full flex">
                <i className="fa-regular fa-calendar text-4xl mx-auto my-auto color-1" />
              </div>
              <div>
                <p className="font-1 text-xl">{doctor || "—"}</p>
                {nextAppointment ? (
                  <>
                    <p className="font-1 color-1 text-[15px]">{nextAppointment}</p>
                    <p className="font-1 color-1 text-[15px]">10:30 AM</p>
                  </>
                ) : (
                  <p className="font-1 text-gray-400 text-[15px] italic">
                    No upcoming appointment
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Charts grid ───────────────────────────────────────── */}
        <div className="grid gap-5 md:grid-cols-2 mx-5 md:mx-20 mt-10">

          {/* T3 Levels */}
          <div className="background-card p-5 overflow-hidden">
            <p className="text-center font-1 text-2xl">T3 Levels</p>
            <div className="mt-4">
              <div className="flex gap-2 mb-4 justify-center">
                {["1m", "6m", "1y", "all"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setT3Range(r)}
                    className={`px-3 py-1 rounded-lg ${T3range === r
                      ? "bg-amber-600"
                      : "background-1"
                      } text-white hover:bg-amber-600! transition duration-300`}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
              {!T3loaded ? (
                <SkeletonChart />
              ) : T3filteredData.length > 0 ? (
                <Chart options={T3options} series={T3series} type="bar" height={320} />
              ) : (
                <EmptyChartState message="No T3 lab results yet. Add a report to see your data." />
              )}
            </div>
          </div>

          {/* T4 Levels */}
          <div className="background-card p-5 overflow-hidden">
            <p className="text-center font-1 text-2xl">T4 Levels</p>
            <div className="mt-4">
              <div className="flex gap-2 mb-4 justify-center">
                {["1m", "6m", "1y", "all"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setT4Range(r)}
                    className={`px-3 py-1 rounded-lg ${T4range === r
                      ? "bg-amber-600"
                      : "background-1"
                      } text-white hover:bg-amber-600! transition duration-300`}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
              {!T4loaded ? (
                <SkeletonChart />
              ) : T4filteredData.length > 0 ? (
                <Chart options={T4options} series={T4series} type="bar" height={320} />
              ) : (
                <EmptyChartState message="No T4 lab results yet. Add a report to see your data." />
              )}
            </div>
          </div>

          {/* TSH Levels */}
          <div className="background-card p-5 overflow-hidden">
            <p className="text-center font-1 text-2xl">TSH Levels</p>
            <div className="mt-4">
              <div className="flex gap-2 mb-4 justify-center">
                {["1m", "6m", "1y", "all"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setTSHRange(r)}
                    className={`px-3 py-1 rounded-lg ${TSHrange === r
                      ? "bg-amber-600"
                      : "background-1"
                      } text-white hover:bg-amber-600! transition duration-300`}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
              {!TSHloaded ? (
                <SkeletonChart />
              ) : TSHfilteredData.length > 0 ? (
                <Chart options={TSHoptions} series={TSHseries} type="area" height={320} />
              ) : (
                <EmptyChartState message="No TSH lab results yet. Add a report to see your data." />
              )}
            </div>
          </div>

          {/* Symptom Tracker — radar */}
          <div className="background-card p-5 overflow-hidden">
            <p className="text-center font-1 text-2xl">Symptom Tracker</p>
            <div className="mt-4">
              <div className="flex mb-4 justify-center">
                {!SymptomsLoaded ? (
                  <SkeletonText width={180} height={40} />
                ) : STavailableMonths.length > 0 ? (
                  <select
                    value={STselectedMonth}
                    onChange={(e) => setSTSelectedMonth(e.target.value)}
                    className="px-10 py-2 rounded-lg color-1 font-1"
                  >
                    {STavailableMonths.map((m) => (
                      <option key={m} value={m} className="text-black">
                        {m}
                      </option>
                    ))}
                  </select>
                ) : null}
              </div>
              {!SymptomsLoaded ? (
                <SkeletonRadar />
              ) : STlast ? (
                <Chart options={SToptions} series={STseries} type="radar" height={400} />
              ) : (
                <EmptyRadarState message="No symptom records yet. Log a report to begin tracking." />
              )}
            </div>
          </div>
        </div>

        {/* ── Lab comparison cards ─────────────────────────────── */}
        {/* Static values — replace with live computed values once the
         * prediction / latest-report endpoint is wired in a future step. */}
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 mx-5 md:mx-20 mt-10">

          <div className="background-card p-5">
            <p className="text-center font-1 text-2xl">TSH</p>
            <p className="font-1 text-xl mt-4">
              Current : <span className="color-1">{tshCurrent}</span>
            </p>
            <p className="font-1 text-xl mt-2">
              Previous : <span className="color-1">{tshPrevious}</span>
            </p>
            <p className="font-1 text-xl mt-2">
              Change : <span className={tshChange !== "—" ? "text-amber-600" : "text-gray-400"}>
                {tshChange}
              </span>
            </p>
          </div>

          <div className="background-card p-5">
            <p className="text-center font-1 text-2xl">Free T4</p>
            <p className="font-1 text-xl mt-4">
              Current : <span className="color-1">{freeT4Current}</span>
            </p>
            <p className="font-1 text-xl mt-2">
              Previous : <span className="color-1">{freeT4Previous}</span>
            </p>
            <p className="font-1 text-xl mt-2">
              Change : <span className={freeT4Change !== "—" ? "text-amber-600" : "text-gray-400"}>
                {freeT4Change}
              </span>
            </p>
          </div>

          <div className="background-card p-5">
            <p className="text-center font-1 text-2xl">Free T3</p>
            <p className="font-1 text-xl mt-4">
              Current : <span className="color-1">{freeT3Current}</span>
            </p>
            <p className="font-1 text-xl mt-2">
              Previous : <span className="color-1">{freeT3Previous}</span>
            </p>
            <p className="font-1 text-xl mt-2">
              Change : <span className={freeT3Change !== "—" ? "text-amber-600" : "text-gray-400"}>
                {freeT3Change}
              </span>
            </p>
          </div>
        </div>

        {/* ── Recommended Actions ─────────────────────────────── */}
        {/* Static values — future step: call GET /recommendations or
         * derive from the prediction endpoint response. */}
        <div className="background-card mt-10 mx-5 md:mx-20 p-5">
          <p className="text-center font-1 text-2xl">Recommended Actions</p>
          {!predictionLoaded ? (
            <div className="mt-4 flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <SkeletonText width={28} height={28} style={{ borderRadius: "50%", flexShrink: 0 }} />
                  <div className="flex-grow">
                    <SkeletonText width="70%" height={20} />
                    <SkeletonText width="45%" height={14} />
                  </div>
                </div>
              ))}
            </div>
          ) : !prediction || (prediction.recommendations ?? []).length === 0 ? (
            <p className="font-1 text-gray-400 italic mt-4">
              No recommendations available yet. Submit a thyroid report to get
              personalized recommendations.
            </p>
          ) : (
            (prediction.recommendations ?? []).map((item, index) => {
              let badgeColorClass = "";
              if (item.priority === "high") {
                badgeColorClass = "bg-red-100 text-red-600 border border-red-200";
              } else if (item.priority === "medium") {
                badgeColorClass = "bg-amber-100 text-amber-600 border border-amber-200";
              } else {
                badgeColorClass = "bg-green-100 text-green-600 border border-green-200";
              }

              return (
                <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-black/5 transition duration-200 mt-2">
                  <span className="background-1 inline-flex items-center justify-center w-7 h-7 text-center text-white rounded-full font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-1 text-xl text-gray-800 font-semibold">{item.action}</span>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${badgeColorClass}`}>
                        {item.priority}
                      </span>
                    </div>
                    {item.reason && (
                      <p className="font-1 text-sm text-gray-500 mt-1">
                        {item.reason}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="h-15" />
      </div>
    </>
  );
}