import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { getMe, updateProfile } from "../../services/authService";

export default function Profile() {
    const { userToken, setuserToken, user, setuser } = useContext(UserContext);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [showEdit, setShowEdit] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            setIsLoading(true);
            try {
                const userData = await getMe();
                if (userData) setuser(userData);
            } catch (error) {
                setFeedback({ message: "Failed to load profile", type: "error" });
            } finally {
                setIsLoading(false);
            }
        };
        if (userToken) {
            fetchUserProfile();
        } else {
            setIsLoading(false);
        }
    }, [userToken, setuser]);

    function signout() {
        localStorage.removeItem("userToken");
        setuserToken(null);
        localStorage.removeItem("user");
        setuser(null);
        navigate("/");
    }

    const handleProfileUpdate = async (values) => {
        setFeedback({ message: "", type: "" });
        try {
            const updatedUser = await updateProfile(values);
            setuser(updatedUser);
            setFeedback({ message: "Profile updated successfully!", type: "success" });
            setTimeout(() => {
                setShowEdit(false);
                setFeedback({ message: "", type: "" });
            }, 1000);
        } catch (error) {
            setFeedback({
                message: error.response?.data?.message || "Failed to update profile",
                type: "error",
            });
        }
    };

    const formik = useFormik({
        initialValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            phone: user?.phone || "",
            dateOfBirth: user?.dateOfBirth || "",
            gender: user?.gender || "",
            address: user?.address || "",
            emergencyContact: user?.emergencyContact || "",
            primaryCondition: user?.primaryCondition || "",
            diagnosisDate: user?.diagnosisDate || "",
            currentMedications: user?.currentMedications || "",
            allergies: user?.allergies || "",
            primaryEndocrinologist: user?.primaryEndocrinologist || "",
        },
        enableReinitialize: true,
        onSubmit: handleProfileUpdate,
    });

    const inputClass =
        "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 font-5 text-sm outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#00B3A1] focus:ring-2 focus:ring-[#00B3A1]/20";

    const personalFields = [
        { key: "firstName", label: "First Name", type: "text" },
        { key: "lastName", label: "Last Name", type: "text" },
        { key: "email", label: "Email", type: "email" },
        { key: "phone", label: "Phone", type: "tel" },
        { key: "dateOfBirth", label: "Date of Birth", type: "date" },
        { key: "gender", label: "Gender", type: "select" },
        { key: "address", label: "Address", type: "text" },
        { key: "emergencyContact", label: "Emergency Contact", type: "text" },
    ];

    const medicalFields = [
        { key: "primaryCondition", label: "Primary Condition", type: "text" },
        { key: "diagnosisDate", label: "Diagnosis Date", type: "text" },
        { key: "currentMedications", label: "Current Medications", type: "text" },
        { key: "allergies", label: "Allergies", type: "text" },
        { key: "primaryEndocrinologist", label: "Primary Endocrinologist", type: "text" },
    ];

    const infoItem = (label, value) => (
        <div>
            <p className="font-5 text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
            <p className="font-1 text-base text-gray-800">{value || "—"}</p>
        </div>
    );

    if (isLoading) {
        return (
            <div className="background-DB min-h-screen flex items-center justify-center">
                <i className="fas fa-spinner fa-spin text-[#00B3A1] text-3xl"></i>
            </div>
        );
    }

    return (
        <div className="background-DB min-h-screen">
            <div className="pt-24 pb-8 px-4 md:px-12 lg:px-20 max-w-4xl mx-auto">

                {/* ═══════════════════════════════════════════════════════════
         *  PROFILE CARD
         * ═══════════════════════════════════════════════════════════ */}
                <div className="background-card p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            {user?.gender === "female" ? (
                                <div className="w-24 h-24 rounded-2xl bg-[#00B3A1]/10 flex items-center justify-center">
                                    <img src="/assets/girl.png" className="w-20 h-20 rounded-xl" alt="Avatar" />
                                </div>
                            ) : (
                                <div className="w-24 h-24 rounded-2xl bg-[#00B3A1]/10 flex items-center justify-center">
                                    <img src="/assets/boy.png" className="w-20 h-20 rounded-xl" alt="Avatar" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="text-center sm:text-left flex-1">
                            <h1 className="font-1 text-2xl text-gray-800">
                                {user?.firstName} {user?.lastName}
                            </h1>
                            <p className="font-5 text-sm text-gray-500 mt-1">{user?.email}</p>
                            {user?.primaryCondition && (
                                <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#00B3A1]/10 text-[#00B3A1] border border-[#00B3A1]/20">
                                    {user.primaryCondition}
                                </span>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowEdit(true)}
                                className="px-5 py-2 bg-[#00B3A1] text-white font-1 rounded-xl hover:bg-[#009e8e] transition-all duration-200 text-sm"
                            >
                                <i className="fas fa-pen mr-1.5"></i>Edit
                            </button>
                            <button
                                onClick={signout}
                                className="px-5 py-2 border border-gray-200 text-gray-600 font-5 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 text-sm"
                            >
                                <i className="fas fa-sign-out-alt mr-1.5"></i>Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════
         *  PERSONAL INFORMATION
         * ═══════════════════════════════════════════════════════════ */}
                <div className="background-card p-6 md:p-8 mt-4">
                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-200">
                        <div className="w-9 h-9 rounded-xl bg-[#00B3A1]/10 flex items-center justify-center">
                            <i className="fas fa-user text-[#00B3A1] text-sm"></i>
                        </div>
                        <h3 className="font-1 text-lg text-gray-800">Personal Information</h3>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        {infoItem("First Name", user?.firstName)}
                        {infoItem("Last Name", user?.lastName)}
                        {infoItem("Date of Birth", user?.dateOfBirth)}
                        {infoItem("Gender", user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "")}
                        {infoItem("Email", user?.email)}
                        {infoItem("Phone", user?.phone)}
                        {infoItem("Address", user?.address)}
                        {infoItem("Emergency Contact", user?.emergencyContact)}
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════
         *  MEDICAL INFORMATION
         * ═══════════════════════════════════════════════════════════ */}
                <div className="background-card p-6 md:p-8 mt-4">
                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-200">
                        <div className="w-9 h-9 rounded-xl bg-[#00B3A1]/10 flex items-center justify-center">
                            <i className="fas fa-heart-pulse text-[#00B3A1] text-sm"></i>
                        </div>
                        <h3 className="font-1 text-lg text-gray-800">Medical Information</h3>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        {infoItem("Primary Condition", user?.primaryCondition)}
                        {infoItem("Diagnosis Date", user?.diagnosisDate)}
                        {infoItem("Current Medications", user?.currentMedications)}
                        {infoItem("Allergies", user?.allergies)}
                        {infoItem("Primary Endocrinologist", user?.primaryEndocrinologist)}
                    </div>
                </div>

            </div>

            {/* ═══════════════════════════════════════════════════════════
       *  EDIT MODAL
       * ═══════════════════════════════════════════════════════════ */}
            {showEdit && (
                <>
                    <div className="fixed inset-0 bg-black/40 z-40" />
                    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
                        <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl mb-8">
                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#00B3A1]/10 flex items-center justify-center">
                                        <i className="fas fa-pen text-[#00B3A1] text-sm"></i>
                                    </div>
                                    <h3 className="font-1 text-lg text-gray-800">Edit Profile</h3>
                                </div>
                                <button
                                    onClick={() => { setShowEdit(false); setFeedback({ message: "", type: "" }); }}
                                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={formik.handleSubmit} className="p-5 space-y-5">
                                {/* Feedback */}
                                {feedback.message && (
                                    <div className={`p-3 rounded-xl text-sm font-5 ${feedback.type === "success"
                                            ? "bg-green-50 text-green-700 border border-green-200"
                                            : "bg-red-50 text-red-700 border border-red-200"
                                        }`}>
                                        <i className={`fas ${feedback.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"} mr-2`}></i>
                                        {feedback.message}
                                    </div>
                                )}

                                {/* Personal Info */}
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                    <i className="fas fa-user text-[#00B3A1] text-sm"></i>
                                    <span className="font-5 text-sm text-gray-500">Personal Information</span>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {personalFields.map((field) => (
                                        <div key={field.key} className={field.key === "address" || field.key === "emergencyContact" ? "sm:col-span-2" : ""}>
                                            <label className="block font-5 text-xs text-gray-500 mb-1">{field.label}</label>
                                            {field.type === "select" ? (
                                                <select
                                                    name={field.key}
                                                    value={formik.values[field.key]}
                                                    onChange={formik.handleChange}
                                                    className={`${inputClass} appearance-none cursor-pointer`}
                                                >
                                                    <option value="female" className="text-black">Female</option>
                                                    <option value="male" className="text-black">Male</option>
                                                </select>
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    name={field.key}
                                                    value={formik.values[field.key]}
                                                    onChange={formik.handleChange}
                                                    className={`${inputClass} ${field.type === "date" ? "[color-scheme:light]" : ""}`}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Medical Info */}
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                    <i className="fas fa-heart-pulse text-[#00B3A1] text-sm"></i>
                                    <span className="font-5 text-sm text-gray-500">Medical Information</span>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {medicalFields.map((field) => (
                                        <div key={field.key}>
                                            <label className="block font-5 text-xs text-gray-500 mb-1">{field.label}</label>
                                            <input
                                                type="text"
                                                name={field.key}
                                                value={formik.values[field.key]}
                                                onChange={formik.handleChange}
                                                className={inputClass}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={formik.isSubmitting}
                                        className="flex-1 py-2.5 bg-[#00B3A1] text-white font-1 rounded-xl hover:bg-[#009e8e] transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                                    >
                                        {formik.isSubmitting ? (
                                            <><i className="fas fa-spinner fa-spin mr-2"></i>Saving...</>
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setShowEdit(false); setFeedback({ message: "", type: "" }); }}
                                        className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-5 rounded-xl hover:bg-gray-50 transition-all text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}