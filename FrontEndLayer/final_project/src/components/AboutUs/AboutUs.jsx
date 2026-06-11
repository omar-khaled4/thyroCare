import React from "react";

export default function AboutUs() {
    const values = [
        {
            icon: "fa-heart-pulse",
            title: "Patient First",
            description:
                "Every feature we build starts with one question: does this genuinely help thyroid patients manage their condition better?",
        },
        {
            icon: "fa-microscope",
            title: "Science-Driven",
            description:
                "Our AI model is built on real thyroid medical data — lab values, antibody markers, and symptom patterns analyzed together.",
        },
        {
            icon: "fa-universal-access",
            title: "Accessible Care",
            description:
                "Thyroid monitoring shouldn't be expensive or complicated. ThyroCare is free, simple, and available to everyone.",
        },
        {
            icon: "fa-shield-halved",
            title: "Privacy & Trust",
            description:
                "Your medical data is sensitive. We handle it with the care it deserves — secure, private, and never shared.",
        },
    ];

    const milestones = [
        { label: "Founded", value: "2026" },
        { label: "University", value: "Faculty of Computers & AI" },
        { label: "University Name", value: "Capital University" },
        { label: "Team Size", value: "6 Members" },
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* ═══════════════════════════════════════════════════════════
       *  HERO
       * ═══════════════════════════════════════════════════════════ */}
            <section className="relative h-[70vh] flex items-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-[url(/assets/image-1.png)] bg-cover bg-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/50" />

                <div className="relative z-10 px-6 md:px-16 lg:px-24 max-w-3xl">
                    <p className="font-5 text-[#00B3A1] text-sm uppercase tracking-[3px] mb-4">
                        Our Story
                    </p>
                    <h1 className="font-1 text-4xl md:text-6xl text-gray-800 leading-tight">
                        About <span className="text-[#00B3A1]">ThyroCare</span>
                    </h1>
                    <p className="font-5 text-gray-600 text-base md:text-lg mt-6 leading-relaxed max-w-xl">
                        Built by students who believe healthcare technology should be
                        accessible, intelligent, and genuinely helpful.
                    </p>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
       *  OUR STORY
       * ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 px-6 md:px-16 lg:px-24">
                <div className="max-w-5xl mx-auto">
                    <div className="grid gap-12 md:grid-cols-2 items-center">
                        {/* Text */}
                        <div>
                            <p className="font-5 text-[#00B3A1] text-sm uppercase tracking-[3px] mb-3">
                                Who We Are
                            </p>
                            <h2 className="font-1 text-3xl text-gray-800 mb-6">
                                Students on a Mission
                            </h2>
                            <div className="space-y-4 font-5 text-gray-600 text-sm leading-relaxed">
                                <p>
                                    We are a team of six passionate students from the Faculty of
                                    Computers and Artificial Intelligence at Capital University who
                                    came together with one clear goal: to make life easier for
                                    people living with thyroid disorders.
                                </p>
                                <p>
                                    Through our academic journey, we realized how challenging it
                                    can be for thyroid patients to continuously monitor their
                                    condition, understand medical results, and stay committed to
                                    treatment plans. That realization inspired us to create a
                                    dedicated platform that focuses on patient care, continuous
                                    follow-up, and real support — not just numbers and reports.
                                </p>
                                <p>
                                    Our platform helps thyroid patients track their test results
                                    over time, understand changes in their condition, and receive
                                    personalized guidance based on their health data. By combining
                                    technology with healthcare awareness, we aim to bridge the gap
                                    between medical information and everyday life.
                                </p>
                            </div>
                        </div>

                        {/* Milestones */}
                        <div className="grid grid-cols-2 gap-4">
                            {milestones.map((m) => (
                                <div
                                    key={m.label}
                                    className="p-5 rounded-2xl bg-[#f4fcff] border border-[#00B3A1]/10"
                                >
                                    <p className="font-5 text-xs text-gray-500 uppercase tracking-wider mb-1">
                                        {m.label}
                                    </p>
                                    <p className="font-1 text-xl text-gray-800 font-semibold">
                                        {m.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
       *  OUR VALUES
       * ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 px-6 md:px-16 lg:px-24 bg-[#f4fcff]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="font-5 text-[#00B3A1] text-sm uppercase tracking-[3px] mb-3">
                            What Drives Us
                        </p>
                        <h2 className="font-1 text-3xl md:text-4xl text-gray-800">
                            Our Values
                        </h2>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        {values.map((value) => (
                            <div
                                key={value.title}
                                className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#00B3A1]/10 flex items-center justify-center mb-4 group-hover:bg-[#00B3A1]/20 transition-colors">
                                    <i
                                        className={`fas ${value.icon} text-[#00B3A1] text-lg`}
                                    ></i>
                                </div>
                                <h3 className="font-1 text-lg text-gray-800 mb-2">
                                    {value.title}
                                </h3>
                                <p className="font-5 text-sm text-gray-500 leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
       *  WHAT WE BUILT
       * ═══════════════════════════════════════════════════════════ */}
            <section className="py-20 px-6 md:px-16 lg:px-24">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="font-5 text-[#00B3A1] text-sm uppercase tracking-[3px] mb-3">
                            Our Platform
                        </p>
                        <h2 className="font-1 text-3xl md:text-4xl text-gray-800">
                            What We Built
                        </h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        {[
                            {
                                icon: "fa-vials",
                                title: "Lab Result Tracking",
                                description:
                                    "Enter TSH, T3, T4, and antibody values from any lab report and track them over time with interactive charts.",
                            },
                            {
                                icon: "fa-brain",
                                title: "AI Diagnosis Engine",
                                description:
                                    "An AI model analyzes your complete thyroid profile — hormones, antibodies, and symptoms — to provide a diagnosis with confidence scores.",
                            },
                            {
                                icon: "fa-lightbulb",
                                title: "Personalized Recommendations",
                                description:
                                    "Receive priority-ranked health recommendations tailored to your specific diagnosis, severity, and symptom profile.",
                            },
                            {
                                icon: "fa-robot",
                                title: "AI Health Assistant",
                                description:
                                    "Chat with an AI assistant that can answer questions about thyroid conditions, medications, and lifestyle adjustments.",
                            },
                            {
                                icon: "fa-file-pdf",
                                title: "Downloadable Reports",
                                description:
                                    "Generate professional PDF reports with your complete diagnosis, lab values, and recommendations to share with your doctor.",
                            },
                            {
                                icon: "fa-chart-line",
                                title: "Health Dashboard",
                                description:
                                    "A central dashboard showing your health score, diagnosis, symptom trends, and medication status at a glance.",
                            },
                        ].map((item) => (
                            <div key={item.title} className="p-5 rounded-xl border border-gray-100 hover:border-[#00B3A1]/20 transition-all duration-200">
                                <div className="w-10 h-10 rounded-lg bg-[#00B3A1]/10 flex items-center justify-center mb-3">
                                    <i className={`fas ${item.icon} text-[#00B3A1] text-sm`}></i>
                                </div>
                                <h3 className="font-1 text-base text-gray-800 mb-1.5">
                                    {item.title}
                                </h3>
                                <p className="font-5 text-xs text-gray-500 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
       *  DISCLAIMER
       * ═══════════════════════════════════════════════════════════ */}
            <section className="py-10 px-6 md:px-16 lg:px-24 bg-[#f4fcff]">
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