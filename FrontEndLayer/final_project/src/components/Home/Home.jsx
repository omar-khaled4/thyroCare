import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function Home() {
    const { userToken, user } = useContext(UserContext);
    const isLoggedIn = userToken && user;

    const features = [
        {
            icon: "fa-brain",
            title: "AI-Powered Diagnosis",
            description:
                "Advanced AI analyzes your thyroid test results instantly, providing accurate diagnosis with confidence scores and severity levels.",
        },
        {
            icon: "fa-chart-line",
            title: "Health Tracking",
            description:
                "Monitor your TSH, T3, T4 levels and symptom patterns over time with interactive charts and visual dashboards.",
        },
        {
            icon: "fa-lightbulb",
            title: "Smart Recommendations",
            description:
                "Receive personalized, priority-ranked health recommendations based on your diagnosis, lab values, and reported symptoms.",
        },
        {
            icon: "fa-file-pdf",
            title: "Medical Reports",
            description:
                "Generate downloadable PDF reports with your complete diagnosis, lab values, and AI recommendations to share with your doctor.",
        },
        {
            icon: "fa-robot",
            title: "AI Health Assistant",
            description:
                "Chat with our AI assistant anytime to ask questions about your thyroid condition, medications, and lifestyle adjustments.",
        },
        {
            icon: "fa-shield-heart",
            title: "Patient-Centered Care",
            description:
                "Everything is designed around the patient — clear information, continuous support, and an easy-to-use experience you can trust.",
        },
    ];

    const stats = [
        { value: "7+", label: "Lab Markers Tracked" },
        { value: "24/7", label: "AI Assistant Available" },
        { value: "< 5s", label: "Diagnosis Time" },
        { value: "100%", label: "Free to Use" },
    ];

    const howItWorks = [
        {
            step: "1",
            icon: "fa-file-medical",
            title: "Submit Your Report",
            description: "Enter your thyroid lab results and rate your symptoms through our simple form.",
        },
        {
            step: "2",
            icon: "fa-microscope",
            title: "AI Analysis",
            description: "Our AI model analyzes your TSH, T3, T4, antibodies, and symptoms together.",
        },
        {
            step: "3",
            icon: "fa-clipboard-check",
            title: "Get Your Results",
            description: "Receive your diagnosis, health score, and personalized recommendations instantly.",
        },
    ];

    const teamMembers = [
        {
            name: "Omar Khaled",
            role: "Full-Stack Developer",
            description: "Built the backend API, LLM integration layer, and dashboard system.",
            avatar: "/assets/boy.png",
        },
        {
            name: "Oliver Attia",
            role: "ML Engineer",
            description: "Developed the neural network prediction model and data pipeline.",
            avatar: "/assets/boy.png",
        },
        {
            name: "Mazzen Essam",
            role: "Frontend Developer",
            description: "Designed and implemented the React frontend and user experience.",
            avatar: "/assets/boy.png",
        },
        {
            name: "Kirolos Onse",
            role: "Frontend Developer",
            description: "Designed and implemented the React frontend and user experience.",
            avatar: "/assets/boy.png",
        },
        {
            name: "Youssef Maged",
            role: "UI/UX Designer",
            description: "Created the visual design system and patient-centered interface.",
            avatar: "/assets/boy.png",
        },
        {
            name: "Ahmed Soliman",
            role: "QA Engineer",
            description: "Designed and Implemented the testing strategy for the platform to ensure quality and reliability.",
            avatar: "/assets/boy.png",
        },
    ];

    return (
        <div className="bg-white">
            {/* ═══════════════════════════════════════════════════════════
       *  HERO SECTION
       * ═══════════════════════════════════════════════════════════ */}
            <section className="relative h-screen flex items-center overflow-hidden">
                {/* Background */}
                <div
                    className="absolute inset-0 bg-[url(/assets/home-background.png)] bg-cover bg-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent" />

                {/* Content */}
                <div className="relative z-10 px-6 md:px-16 lg:px-24 max-w-3xl">
                    <p className="font-5 text-[#00B3A1] text-sm uppercase tracking-[3px] mb-4">
                        AI-Powered Thyroid Care
                    </p>
                    <h1 className="font-1 text-4xl md:text-6xl text-gray-800 leading-tight">
                        Healthy thyroid,
                        <br />
                        <span className="text-[#00B3A1]">healthy life</span>
                    </h1>
                    <p className="font-5 text-gray-600 text-base md:text-lg mt-6 leading-relaxed max-w-xl">
                        Empowering thyroid care through trusted medical insights and smart
                        digital solutions. Get AI-powered diagnosis, track your health over
                        time, and receive personalized recommendations — all in one place.
                    </p>

                    {!isLoggedIn && (
                        <div className="flex gap-3 mt-8">
                            <Link
                                to="signup"
                                className="px-8 py-3 bg-[#00B3A1] text-white font-1 rounded-xl hover:bg-[#009e8e] transition-all duration-200 hover:shadow-lg hover:shadow-[#00B3A1]/20"
                            >
                                Get Started
                            </Link>
                            <Link
                                to="login"
                                className="px-8 py-3 border-2 border-[#00B3A1] text-[#00B3A1] font-1 rounded-xl hover:bg-[#00B3A1] hover:text-white transition-all duration-200"
                            >
                                Sign In
                            </Link>
                        </div>
                    )}

                    {isLoggedIn && (
                        <div className="mt-8">
                            <Link
                                to="dashboard"
                                className="px-8 py-3 bg-[#00B3A1] text-white font-1 rounded-xl hover:bg-[#009e8e] transition-all duration-200 hover:shadow-lg hover:shadow-[#00B3A1]/20 inline-flex items-center gap-2"
                            >
                                <i className="fas fa-chart-line"></i>
                                Go to Dashboard
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
       *  STATS BAR
       * ═══════════════════════════════════════════════════════════ */}
            <section className="bg-[#00B3A1] py-10">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                    {stats.map((stat) => (
                        <div key={stat.label}>
                            <p className="font-1 text-3xl md:text-4xl font-bold">{stat.value}</p>
                            <p className="font-5 text-sm opacity-80 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
       *  FEATURES
       * ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 px-6 md:px-16 lg:px-24">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="font-5 text-[#00B3A1] text-sm uppercase tracking-[3px] mb-3">
                            What We Offer
                        </p>
                        <h2 className="font-1 text-3xl md:text-4xl text-gray-800">
                            Features
                        </h2>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="p-6 rounded-2xl border border-gray-100 hover:border-[#00B3A1]/20 hover:shadow-lg hover:shadow-[#00B3A1]/5 transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#00B3A1]/10 flex items-center justify-center mb-4 group-hover:bg-[#00B3A1]/20 transition-colors">
                                    <i className={`fas ${feature.icon} text-[#00B3A1] text-lg`}></i>
                                </div>
                                <h3 className="font-1 text-lg text-gray-800 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="font-5 text-sm text-gray-500 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
       *  HOW IT WORKS
       * ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 px-6 md:px-16 lg:px-24 bg-[#f4fcff]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="font-5 text-[#00B3A1] text-sm uppercase tracking-[3px] mb-3">
                            Simple Process
                        </p>
                        <h2 className="font-1 text-3xl md:text-4xl text-gray-800">
                            How It Works
                        </h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {howItWorks.map((step, index) => (
                            <div key={step.step} className="text-center">
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#00B3A1] flex items-center justify-center mb-5">
                                    <i className={`fas ${step.icon} text-white text-xl`}></i>
                                </div>
                                <div className="w-8 h-8 mx-auto rounded-full bg-gray-200 flex items-center justify-center mb-3">
                                    <span className="font-1 text-sm text-gray-600 font-bold">
                                        {step.step}
                                    </span>
                                </div>
                                <h3 className="font-1 text-lg text-gray-800 mb-2">
                                    {step.title}
                                </h3>
                                <p className="font-5 text-sm text-gray-500 leading-relaxed">
                                    {step.description}
                                </p>
                                {index < howItWorks.length - 1 && (
                                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-gray-300">
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        {!isLoggedIn ? (
                            <Link
                                to="signup"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-[#00B3A1] text-white font-1 rounded-xl hover:bg-[#009e8e] transition-all duration-200 hover:shadow-lg hover:shadow-[#00B3A1]/20"
                            >
                                Start Now <i className="fas fa-arrow-right"></i>
                            </Link>
                        ) : (
                            <Link
                                to="report"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-[#00B3A1] text-white font-1 rounded-xl hover:bg-[#009e8e] transition-all duration-200 hover:shadow-lg hover:shadow-[#00B3A1]/20"
                            >
                                Submit a Report <i className="fas fa-arrow-right"></i>
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
       *  CTA — CALL TO ACTION
       * ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 px-6 md:px-16 lg:px-24">
                <div className="max-w-4xl mx-auto">
                    <div className="background-card p-10 md:p-14 text-center">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#00B3A1]/10 flex items-center justify-center mb-6">
                            <i className="fas fa-heart-pulse text-[#00B3A1] text-2xl"></i>
                        </div>
                        <h2 className="font-1 text-3xl md:text-4xl text-gray-800 mb-4">
                            Take Control of Your{" "}
                            <span className="text-[#00B3A1]">Thyroid Health</span>
                        </h2>
                        <p className="font-5 text-gray-500 text-base max-w-2xl mx-auto leading-relaxed mb-8">
                            Don't wait for symptoms to worsen. Upload your lab results, get an
                            instant AI analysis, and receive personalized recommendations —
                            all for free. Your health deserves proactive care.
                        </p>
                        {!isLoggedIn && (
                            <Link
                                to="signup"
                                className="inline-flex items-center gap-2 px-10 py-3.5 bg-[#00B3A1] text-white font-1 text-lg rounded-xl hover:bg-[#009e8e] transition-all duration-200 hover:shadow-lg hover:shadow-[#00B3A1]/20"
                            >
                                Get Started Free <i className="fas fa-arrow-right"></i>
                            </Link>
                        )}
                        {isLoggedIn && (
                            <Link
                                to="dashboard"
                                className="inline-flex items-center gap-2 px-10 py-3.5 bg-[#00B3A1] text-white font-1 text-lg rounded-xl hover:bg-[#009e8e] transition-all duration-200 hover:shadow-lg hover:shadow-[#00B3A1]/20"
                            >
                                Go to Dashboard <i className="fas fa-arrow-right"></i>
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
       *  TEAM
       * ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 px-6 md:px-16 lg:px-24 bg-[#f4fcff]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="font-5 text-[#00B3A1] text-sm uppercase tracking-[3px] mb-3">
                            The People Behind ThyroCare
                        </p>
                        <h2 className="font-1 text-3xl md:text-4xl text-gray-800">
                            Our Team
                        </h2>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {teamMembers.map((member) => (
                            <div
                                key={member.name}
                                className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-20 h-20 mx-auto rounded-2xl bg-[#00B3A1]/10 flex items-center justify-center mb-4">
                                    <img
                                        src={member.avatar}
                                        className="w-14 h-14 rounded-xl object-cover"
                                        alt={member.name}
                                    />
                                </div>
                                <h3 className="font-1 text-lg text-gray-800">{member.name}</h3>
                                <p className="font-5 text-xs text-[#00B3A1] uppercase tracking-wider mt-1 mb-3">
                                    {member.role}
                                </p>
                                <p className="font-5 text-sm text-gray-500 leading-relaxed">
                                    {member.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
       *  DISCLAIMER
       * ═══════════════════════════════════════════════════════════ */}
            <section className="py-10 px-6 md:px-16 lg:px-24">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <i className="fas fa-info-circle text-amber-500"></i>
                        <p className="font-5 text-sm text-gray-500 font-semibold">
                            Medical Disclaimer
                        </p>
                    </div>
                    <p className="font-5 text-xs text-gray-400 leading-relaxed">
                        ThyroCare provides AI-generated health insights for informational
                        purposes only. It does not constitute a medical diagnosis and should
                        not replace a consultation with a qualified healthcare professional.
                        Always seek the advice of your physician regarding your condition.
                    </p>
                </div>
            </section>
        </div>
    );
}