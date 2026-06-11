import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { getReports, deleteReport, updateReport } from "../../services/reportService";

export default function ViewReports() {
    const [Loading, setLoading] = useState(true);
    const [reports, setReports] = useState([]);
    const [viewData, setViewData] = useState([]);
    const [report, setReport] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [showView, setShowView] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Pagination
    const ITEMS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalReports, setTotalReports] = useState(0);
    const totalPages = Math.ceil(totalReports / ITEMS_PER_PAGE);

    const paginatedData = viewData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => { setCurrentPage(1); }, [viewData]);

    // Fetch reports
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await getReports(1, 100);
                const normalized = data.map((r) => ({
                    ...r,
                    id: r._id,
                    date: r.testDate,
                    TestingFacility: r.testingFacility,
                    TSH: r.thyroidFunction?.tsh,
                    FreeT3: r.thyroidFunction?.freeT3,
                    FreeT4: r.thyroidFunction?.freeT4,
                    TotalT4: r.thyroidFunction?.totalT4,
                    TotalT3: r.thyroidFunction?.totalT3,
                    TPOAntibodies: r.antibodies?.tpo,
                    ThyroglobulinAntibodies: r.antibodies?.antiTg,
                    TSHReceptorAntibodies: r.antibodies?.tshr,
                    Thyroglobulin: r.otherTests?.thyroglobulin,
                    Calcitonin: r.otherTests?.calcitonin,
                    ReverseT3: r.otherTests?.reverseT3,
                    Fatigue: r.symptoms?.fatigue,
                    WeightChanges: r.symptoms?.weightChange,
                    TemperatureSensitivity: r.symptoms?.coldIntolerance,
                    HairSkinChanges: r.symptoms?.hairLoss,
                    MoodChanges: r.symptoms?.anxiety,
                    Palpitations: r.symptoms?.palpitations,
                    Insomnia: r.symptoms?.insomnia,
                }));
                setReports(normalized);
                setViewData(normalized);
                setTotalReports(normalized.length);
            } catch (err) {
                console.error("[ViewReports] Fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    // Search
    const [inputValue, setInputValue] = useState("");
    const handleSearch = (event) => {
        const value = event.target.value;
        setInputValue(value);
        if (value === "") {
            setViewData(reports);
        } else {
            const filtered = reports.filter(
                (r) =>
                    (r.TestingFacility || "").toLowerCase().includes(value.toLowerCase()) ||
                    (r.date || "").includes(value)
            );
            setViewData(filtered);
        }
    };
    const clearSearch = () => {
        setInputValue("");
        setViewData(reports);
    };

    // View
    const openView = (r) => { setReport(r); setShowView(true); };
    const closeView = () => { setShowView(false); setReport(null); };

    // Update
    const openUpdate = (r) => { setReport(r); setShowUpdate(true); };
    const closeUpdate = () => { setShowUpdate(false); setReport(null); };

    const formik = useFormik({
        initialValues: {
            id: report?.id,
            DateOfTest: report?.date,
            TestingFacility: report?.TestingFacility,
            TSH: report?.TSH,
            FreeT4: report?.FreeT4,
            FreeT3: report?.FreeT3,
            TotalT4: report?.TotalT4,
            TPOAntibodies: report?.TPOAntibodies,
            ThyroglobulinAntibodies: report?.ThyroglobulinAntibodies,
            TSHReceptorAntibodies: report?.TSHReceptorAntibodies,
            Thyroglobulin: report?.Thyroglobulin,
            Calcitonin: report?.Calcitonin,
            ReverseT3: report?.ReverseT3,
            Fatigue: report?.Fatigue,
            WeightChanges: report?.WeightChanges,
            TemperatureSensitivity: report?.TemperatureSensitivity,
            MoodChanges: report?.MoodChanges,
            SkinChanges: report?.HairSkinChanges,
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            setUpdateLoading(true);
            try {
                await updateReport(report.id, values);
                // Refresh list
                const data = await getReports(1, 100);
                const normalized = data.map((r) => ({
                    ...r, id: r._id, date: r.testDate, TestingFacility: r.testingFacility,
                    TSH: r.thyroidFunction?.tsh, FreeT3: r.thyroidFunction?.freeT3,
                    FreeT4: r.thyroidFunction?.freeT4, TotalT4: r.thyroidFunction?.totalT4,
                    TotalT3: r.thyroidFunction?.totalT3, TPOAntibodies: r.antibodies?.tpo,
                    ThyroglobulinAntibodies: r.antibodies?.antiTg, TSHReceptorAntibodies: r.antibodies?.tshr,
                    Thyroglobulin: r.otherTests?.thyroglobulin, Calcitonin: r.otherTests?.calcitonin,
                    ReverseT3: r.otherTests?.reverseT3, Fatigue: r.symptoms?.fatigue,
                    WeightChanges: r.symptoms?.weightChange, TemperatureSensitivity: r.symptoms?.coldIntolerance,
                    HairSkinChanges: r.symptoms?.hairLoss, MoodChanges: r.symptoms?.anxiety,
                    Palpitations: r.symptoms?.palpitations, Insomnia: r.symptoms?.insomnia,
                }));
                setReports(normalized);
                setViewData(normalized);
                setTotalReports(normalized.length);
                closeUpdate();
            } catch (err) {
                console.error("[ViewReports] Update failed:", err);
            } finally {
                setUpdateLoading(false);
            }
        },
    });

    // Delete
    const confirmDelete = async (reportId) => {
        setDeleteLoading(true);
        const removed = viewData.find((r) => r._id === reportId);
        setViewData((prev) => prev.filter((r) => r._id !== reportId));
        setTotalReports((prev) => prev - 1);
        try {
            await deleteReport(reportId);
            setShowDeleteConfirm(null);
        } catch (err) {
            if (removed) {
                setViewData((prev) => [...prev, removed]);
                setTotalReports((prev) => prev + 1);
            }
        } finally {
            setDeleteLoading(false);
        }
    };

    // Pagination helpers
    function goToPage(page) {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    }

    function getPageNumbers() {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (currentPage <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
        if (currentPage >= totalPages - 3) return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
    }

    // Shared classes
    const inputClass = "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 font-5 text-sm outline-none transition-all duration-200 focus:border-[#00B3A1] focus:ring-2 focus:ring-[#00B3A1]/20";

    const sectionHeader = (icon, title) => (
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
            <i className={`fas ${icon} text-[#00B3A1] text-sm`}></i>
            <span className="font-1 text-sm text-gray-700">{title}</span>
        </div>
    );

    const symptomLabels = {
        Fatigue: "Fatigue",
        WeightChanges: "Weight Changes",
        TemperatureSensitivity: "Temp. Sensitivity",
        MoodChanges: "Mood Changes",
        SkinChanges: "Hair/Skin Changes",
    };

    return (
        <div className="background-DB min-h-screen">
            <div className="pt-24 pb-8 px-4 md:px-12 lg:px-20 max-w-5xl mx-auto">

                {/* ═══════════════════════════════════════════════════════════
         *  HEADER + SEARCH
         * ═══════════════════════════════════════════════════════════ */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="font-1 text-3xl text-gray-800">Your Reports</h1>
                        <p className="font-5 text-gray-500 text-sm mt-1">
                            {totalReports} report{totalReports !== 1 ? "s" : ""} found
                        </p>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                        <input
                            type="search"
                            value={inputValue}
                            onChange={handleSearch}
                            className="w-full pl-9 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-5 text-gray-700 outline-none focus:border-[#00B3A1] focus:ring-2 focus:ring-[#00B3A1]/20 transition-all"
                            placeholder="Search by date or facility..."
                        />
                        {inputValue && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <i className="fas fa-times text-sm"></i>
                            </button>
                        )}
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════
         *  REPORTS LIST
         * ═══════════════════════════════════════════════════════════ */}
                {!Loading ? (
                    paginatedData.length > 0 ? (
                        <div className="space-y-3">
                            {paginatedData.map((r, index) => (
                                <div
                                    key={r._id}
                                    className="background-card p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                                >
                                    {/* Left — Report info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-8 h-8 rounded-lg bg-[#00B3A1]/10 flex items-center justify-center flex-shrink-0">
                                                <i className="fas fa-file-medical text-[#00B3A1] text-sm"></i>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-1 text-base text-gray-800 truncate">
                                                    {r.TestingFacility || "Unknown Facility"}
                                                </p>
                                                <p className="font-5 text-xs text-gray-500">
                                                    {new Date(r.date).toLocaleDateString("en-US", {
                                                        year: "numeric", month: "short", day: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Quick lab values */}
                                        <div className="flex gap-4 mt-2 ml-10">
                                            <span className="font-5 text-xs text-gray-500">
                                                TSH: <span className="text-[#00B3A1] font-semibold">{r.TSH}</span>
                                            </span>
                                            <span className="font-5 text-xs text-gray-500">
                                                FT4: <span className="text-[#00B3A1] font-semibold">{r.FreeT4}</span>
                                            </span>
                                            <span className="font-5 text-xs text-gray-500">
                                                FT3: <span className="text-[#00B3A1] font-semibold">{r.FreeT3}</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right — Actions */}
                                    <div className="flex items-center gap-2 sm:gap-1">
                                        <button
                                            onClick={() => openView(r)}
                                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                                            title="View"
                                        >
                                            <i className="fas fa-eye text-sm"></i>
                                            <span className="sm:hidden">View</span>
                                        </button>
                                        <button
                                            onClick={() => openUpdate(r)}
                                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                                            title="Edit"
                                        >
                                            <i className="fas fa-pen-to-square text-sm"></i>
                                            <span className="sm:hidden">Edit</span>
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteConfirm(r._id)}
                                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                            title="Delete"
                                        >
                                            <i className="fas fa-trash-can text-sm"></i>
                                            <span className="sm:hidden">Delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-1.5 mt-6 font-5 text-sm">
                                    <button
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                                    >
                                        <i className="fas fa-chevron-left text-xs"></i>
                                    </button>
                                    {getPageNumbers().map((p, idx) =>
                                        p === "..." ? (
                                            <span key={`e${idx}`} className="px-2 text-gray-400">…</span>
                                        ) : (
                                            <button
                                                key={p}
                                                onClick={() => goToPage(p)}
                                                className={`w-8 h-8 rounded-lg transition ${currentPage === p
                                                        ? "bg-[#00B3A1] text-white"
                                                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        )
                                    )}
                                    <button
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                                    >
                                        <i className="fas fa-chevron-right text-xs"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="background-card p-12 text-center">
                            <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <i className="fas fa-folder-open text-gray-300 text-2xl"></i>
                            </div>
                            <p className="font-1 text-xl text-gray-500">
                                {inputValue ? "No matching reports found" : "No reports yet"}
                            </p>
                            <p className="font-5 text-sm text-gray-400 mt-1">
                                {inputValue
                                    ? "Try a different search term"
                                    : "Insert your first thyroid report to get started"}
                            </p>
                        </div>
                    )
                ) : (
                    /* Loading */
                    <div className="background-card p-12 flex items-center justify-center">
                        <i className="fas fa-spinner fa-spin text-[#00B3A1] text-3xl"></i>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════════
         *  VIEW MODAL
         * ═══════════════════════════════════════════════════════════ */}
                {showView && report && (
                    <>
                        <div onClick={closeView} className="fixed inset-0 bg-black/40 z-40" />
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-xl">
                                {/* Header */}
                                <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b border-gray-100 rounded-t-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-[#00B3A1]/10 flex items-center justify-center">
                                            <i className="fas fa-file-medical text-[#00B3A1] text-sm"></i>
                                        </div>
                                        <div>
                                            <h3 className="font-1 text-lg text-gray-800">Report Details</h3>
                                            <p className="font-5 text-xs text-gray-400">
                                                {new Date(report.date).toLocaleDateString("en-US", {
                                                    year: "numeric", month: "long", day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={closeView} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition">
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-5 space-y-5">
                                    {/* Facility */}
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                                        <i className="fas fa-hospital text-[#00B3A1] text-sm"></i>
                                        <span className="font-5 text-sm text-gray-700">{report.TestingFacility || "—"}</span>
                                    </div>

                                    {/* Thyroid Function */}
                                    {sectionHeader("fa-vials", "Thyroid Function")}
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: "TSH", value: report.TSH, unit: "mIU/L" },
                                            { label: "Free T4", value: report.FreeT4, unit: "ng/dL" },
                                            { label: "Free T3", value: report.FreeT3, unit: "pg/mL" },
                                            { label: "Total T4", value: report.TotalT4, unit: "μg/dL" },
                                            { label: "Total T3", value: report.TotalT3, unit: "ng/dL" },
                                        ].map((item) => (
                                            <div key={item.label} className="p-3 bg-gray-50 rounded-xl">
                                                <p className="font-5 text-xs text-gray-500">{item.label}</p>
                                                <p className="font-1 text-base text-gray-800">
                                                    {item.value ?? "—"} <span className="text-xs text-gray-400">{item.unit}</span>
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Antibodies */}
                                    {sectionHeader("fa-shield-virus", "Antibodies")}
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { label: "TPO", value: report.TPOAntibodies, unit: "IU/mL" },
                                            { label: "Anti-Tg", value: report.ThyroglobulinAntibodies, unit: "IU/mL" },
                                            { label: "TSHR", value: report.TSHReceptorAntibodies, unit: "IU/L" },
                                        ].map((item) => (
                                            <div key={item.label} className="p-3 bg-gray-50 rounded-xl">
                                                <p className="font-5 text-xs text-gray-500">{item.label}</p>
                                                <p className="font-1 text-base text-gray-800">
                                                    {item.value ?? "—"} <span className="text-xs text-gray-400">{item.unit}</span>
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Other Tests */}
                                    {sectionHeader("fa-flask", "Other Tests")}
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { label: "Thyroglobulin", value: report.Thyroglobulin, unit: "ng/mL" },
                                            { label: "Calcitonin", value: report.Calcitonin, unit: "pg/mL" },
                                            { label: "Reverse T3", value: report.ReverseT3, unit: "ng/dL" },
                                        ].map((item) => (
                                            <div key={item.label} className="p-3 bg-gray-50 rounded-xl">
                                                <p className="font-5 text-xs text-gray-500">{item.label}</p>
                                                <p className="font-1 text-base text-gray-800">
                                                    {item.value ?? "—"} <span className="text-xs text-gray-400">{item.unit}</span>
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Symptoms */}
                                    {sectionHeader("fa-stethoscope", "Symptoms")}
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(symptomLabels).map(([key, label]) => {
                                            const val = Number(report[key]) || 0;
                                            return (
                                                <div key={key} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                                                    <span className="font-5 text-xs text-gray-600">{label}</span>
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${val === 0 ? "text-gray-400 bg-gray-100" :
                                                            val <= 3 ? "text-green-600 bg-green-50" :
                                                                val <= 6 ? "text-amber-600 bg-amber-50" :
                                                                    "text-red-600 bg-red-50"
                                                        }`}>
                                                        {val}/10
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* ═══════════════════════════════════════════════════════════
         *  UPDATE MODAL
         * ═══════════════════════════════════════════════════════════ */}
                {showUpdate && report && (
                    <>
                        <div className="fixed inset-0 bg-black/40 z-40" />
                        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
                            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl mb-8">
                                {/* Header */}
                                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                                            <i className="fas fa-pen text-amber-500 text-sm"></i>
                                        </div>
                                        <h3 className="font-1 text-lg text-gray-800">Edit Report</h3>
                                    </div>
                                    <button onClick={closeUpdate} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition">
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={formik.handleSubmit} className="p-5 space-y-4">
                                    {/* Basic */}
                                    <div className="grid gap-4 grid-cols-2">
                                        <div>
                                            <label className="block font-5 text-xs text-gray-500 mb-1">Date of Test</label>
                                            <input type="date" name="DateOfTest" value={formik.values.DateOfTest} onChange={formik.handleChange} className={`${inputClass} [color-scheme:light]`} />
                                        </div>
                                        <div>
                                            <label className="block font-5 text-xs text-gray-500 mb-1">Facility</label>
                                            <input type="text" name="TestingFacility" value={formik.values.TestingFacility} onChange={formik.handleChange} className={inputClass} />
                                        </div>
                                    </div>

                                    {/* Thyroid Function */}
                                    {sectionHeader("fa-vials", "Thyroid Function")}
                                    <div className="grid gap-3 grid-cols-2">
                                        {[
                                            { name: "TSH", label: "TSH (mIU/L)" },
                                            { name: "FreeT4", label: "Free T4 (ng/dL)" },
                                            { name: "FreeT3", label: "Free T3 (pg/mL)" },
                                            { name: "TotalT4", label: "Total T4 (μg/dL)" },
                                        ].map((f) => (
                                            <div key={f.name}>
                                                <label className="block font-5 text-xs text-gray-500 mb-1">{f.label}</label>
                                                <input type="number" step="any" name={f.name} value={formik.values[f.name]} onChange={formik.handleChange} className={inputClass} />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Antibodies */}
                                    {sectionHeader("fa-shield-virus", "Antibodies")}
                                    <div className="grid gap-3 grid-cols-3">
                                        {[
                                            { name: "TPOAntibodies", label: "TPO (IU/mL)" },
                                            { name: "ThyroglobulinAntibodies", label: "Anti-Tg (IU/mL)" },
                                            { name: "TSHReceptorAntibodies", label: "TSHR (IU/L)" },
                                        ].map((f) => (
                                            <div key={f.name}>
                                                <label className="block font-5 text-xs text-gray-500 mb-1">{f.label}</label>
                                                <input type="number" step="any" name={f.name} value={formik.values[f.name]} onChange={formik.handleChange} className={inputClass} />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Other Tests */}
                                    {sectionHeader("fa-flask", "Other Tests")}
                                    <div className="grid gap-3 grid-cols-3">
                                        {[
                                            { name: "Thyroglobulin", label: "Thyroglobulin" },
                                            { name: "Calcitonin", label: "Calcitonin" },
                                            { name: "ReverseT3", label: "Reverse T3" },
                                        ].map((f) => (
                                            <div key={f.name}>
                                                <label className="block font-5 text-xs text-gray-500 mb-1">{f.label}</label>
                                                <input type="number" step="any" name={f.name} value={formik.values[f.name]} onChange={formik.handleChange} className={inputClass} />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Symptoms */}
                                    {sectionHeader("fa-stethoscope", "Symptoms")}
                                    <div className="grid gap-3 grid-cols-2">
                                        {Object.entries(symptomLabels).map(([key, label]) => {
                                            const value = Number(formik.values[key]) || 0;
                                            return (
                                                <div key={key} className="bg-gray-50 rounded-xl p-3">
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <span className="font-5 text-xs text-gray-600">{label}</span>
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${value === 0 ? "text-gray-400 bg-gray-100" :
                                                                value <= 3 ? "text-green-600 bg-green-50" :
                                                                    value <= 6 ? "text-amber-600 bg-amber-50" :
                                                                        "text-red-600 bg-red-50"
                                                            }`}>
                                                            {value}
                                                        </span>
                                                    </div>
                                                    <input type="range" name={key} min="0" max="10" value={formik.values[key]} onChange={formik.handleChange} className="w-full cursor-pointer" />
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-3 pt-2">
                                        <button type="submit" disabled={updateLoading} className="flex-1 py-2.5 bg-[#00B3A1] text-white font-1 rounded-xl hover:bg-[#009e8e] transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm">
                                            {updateLoading ? <><i className="fas fa-spinner fa-spin mr-2"></i>Saving...</> : "Save Changes"}
                                        </button>
                                        <button type="button" onClick={closeUpdate} className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-5 rounded-xl hover:bg-gray-50 transition-all text-sm">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                )}

                {/* ═══════════════════════════════════════════════════════════
         *  DELETE CONFIRMATION MODAL
         * ═══════════════════════════════════════════════════════════ */}
                {showDeleteConfirm && (
                    <>
                        <div className="fixed inset-0 bg-black/40 z-40" />
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl text-center">
                                <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
                                    <i className="fas fa-trash-can text-red-500 text-xl"></i>
                                </div>
                                <h3 className="font-1 text-lg text-gray-800 mb-2">Delete Report?</h3>
                                <p className="font-5 text-sm text-gray-500 mb-6">
                                    This action cannot be undone. The report will be permanently removed.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowDeleteConfirm(null)}
                                        className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-5 rounded-xl hover:bg-gray-50 transition-all text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(showDeleteConfirm)}
                                        disabled={deleteLoading}
                                        className="flex-1 py-2.5 bg-red-500 text-white font-1 rounded-xl hover:bg-red-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                                    >
                                        {deleteLoading ? <><i className="fas fa-spinner fa-spin mr-1"></i>Deleting...</> : "Delete"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}