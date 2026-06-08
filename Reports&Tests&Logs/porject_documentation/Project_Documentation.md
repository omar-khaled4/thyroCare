# ThyroCare — Intelligent Thyroid Health Monitoring and Diagnosis System

**Faculty of Computers and Information**
**Department of Information Systems**
**Graduation Project — Final Report**

---

## Acknowledgements

We would like to express our sincere gratitude to all those who contributed to the successful completion of this graduation project.

First and foremost, we extend our deepest thanks to our project supervisor for the invaluable guidance, continuous support, and constructive feedback throughout every phase of this project. Their expertise and encouragement were instrumental in shaping both the technical direction and the academic quality of our work.

We are grateful to the **Faculty of Computers and Information** for providing us with the right infrastructure, computing equipment, and laboratory facilities that enabled us to develop, test, and deploy the ThyroCare system. The university's licensed software and cloud service credits played a significant role in bringing this project to life.

We would also like to thank our families and friends for their unwavering patience, moral support, and understanding during the long working hours and demanding milestones of the project.

Finally, we acknowledge the open-source community and the developers behind the frameworks and libraries we utilized — including React, Node.js, MongoDB, FastAPI, Keras/TensorFlow, and the Mistral AI platform — whose freely available tools made modern, full-stack AI-driven web development accessible to us.

---

## Table of Contents

- [Chapter 1: Introduction](#chapter-1-introduction)
  - [1.1 Overview](#11-overview)
  - [1.2 Objectives](#12-objectives)
  - [1.3 Purpose](#13-purpose)
  - [1.4 Scope](#14-scope)
  - [1.5 General Constraints](#15-general-constraints)
- [Chapter 2: Project Planning and Analysis](#chapter-2-project-planning-and-analysis)
  - [2.1 Project Planning](#21-project-planning)
  - [2.2 Analysis and Limitation of Existing System](#22-analysis-and-limitation-of-existing-system)
  - [2.3 Need for the New System](#23-need-for-the-new-system)
  - [2.4 Analysis of the New System](#24-analysis-of-the-new-system)
  - [2.5 Advantages of the New System](#25-advantages-of-the-new-system)
  - [2.6 Risk and Risk Management](#26-risk-and-risk-management)
- [Chapter 3: Software Design](#chapter-3-software-design)
  - [3.1 Database Design (ERD / Class Diagram)](#31-database-design-erd--class-diagram)
  - [3.2 Use Case Diagram](#32-use-case-diagram)
  - [3.3 Sequence Diagram](#33-sequence-diagram)
  - [3.4 Activity Diagram](#34-activity-diagram)
- [Chapter 4: Implementation](#chapter-4-implementation)
  - [4.1 Software Architecture](#41-software-architecture)
  - [4.2 Pseudocode / Workflow](#42-pseudocode--workflow)
- [Chapter 5: Testing](#chapter-5-testing)
  - [5.1 Unit Testing](#51-unit-testing)
  - [5.2 Integrated Testing](#52-integrated-testing)
  - [5.3 Additional Testing](#53-additional-testing)
- [Chapter 6: Results and Discussion](#chapter-6-results-and-discussion)
  - [6.1 Results](#61-results)
  - [6.2 Discussion](#62-discussion)
- [Chapter 7: Conclusion](#chapter-7-conclusion)
- [Chapter 8: Future Work](#chapter-8-future-work)
- [Bibliography](#bibliography)
- [Appendix](#appendix)

---

## List of Tables

| Table # | Title | Section |
|---------|-------|---------|
| Table 1 | Technology Stack Summary | 4.1 |
| Table 2 | Backend Environment Variables | 4.1 |
| Table 3 | API Endpoint Coverage Matrix | 4.2 |
| Table 4 | Frontend Component Registry | 4.1 |
| Table 5 | Mongoose Data Model Summary | 3.1 |
| Table 6 | NN Model Preprocessing Pipeline | 4.2 |
| Table 7 | Possible Diagnosis Output Classes | 6.1 |
| Table 8 | Functional Requirements | 2.4 |
| Table 9 | Non-Functional Requirements | 2.4 |
| Table 10 | Risk Register | 2.6 |

---

## List of Figures

| Figure # | Title | Section |
|----------|-------|---------|
| Figure 1 | Three-Tier Software Architecture Diagram | 4.1 |
| Figure 2 | Entity-Relationship Diagram (ERD) | 3.1 |
| Figure 3 | Use Case Diagram | 3.2 |
| Figure 4 | Authentication Sequence Diagram | 3.3 |
| Figure 5 | Prediction Sequence Diagram | 3.3 |
| Figure 6 | Report Submission Activity Diagram | 3.4 |
| Figure 7 | Patient Prediction Workflow Activity Diagram | 3.4 |
| Figure 8 | Client-Server Communication Workflow | 4.2 |

---

## Abstract

ThyroCare is a full-stack, AI-powered web application designed to assist patients in monitoring, tracking, and understanding their thyroid health conditions. The system provides a secure, user-friendly platform where patients can submit thyroid lab reports — including TSH, Free T3, Free T4, antibody panels, and symptom assessments — and receive AI-generated diagnostic predictions alongside personalised health recommendations.

The project is built on a modern three-tier architecture. The **frontend layer** uses React 19 with Vite 7 and TailwindCSS v4 to deliver a responsive single-page application (SPA). The **backend layer** is powered by Node.js with Express 5 and MongoDB Atlas for data persistence, secured through JWT-based authentication with email verification. The **AI/ML layer** is a Python FastAPI microservice hosting a Mistral LLM (Large Language Model) that analyses patient data and returns structured diagnoses, severity assessments, confidence scores, health scores, and actionable recommendations.

Key features include secure user registration with email verification, thyroid report CRUD management, interactive health dashboards with real-time charts (ApexCharts), a symptom tracker, an AI-powered chatbot ("Aiva") for thyroid health Q&A, neural-network-based thyroid disease prediction, PDF report generation, and prediction history tracking. The system is deployed across Vercel (frontend and backend) and Railway (LLM microservice) for production accessibility.

This project demonstrates how artificial intelligence and modern web technologies can be combined to create an accessible health monitoring tool that empowers patients with data-driven insights into their thyroid health, while always recommending professional medical consultation for definitive diagnosis and treatment.

---

# Chapter 1: Introduction

## 1.1 Overview

ThyroCare is an intelligent, web-based thyroid health monitoring and diagnosis system developed as a graduation project for the Department of Information Systems, Faculty of Computers and Information. The system addresses a critical need in healthcare: providing patients with accessible, AI-powered tools to track, understand, and manage their thyroid conditions.

Thyroid disorders — including hypothyroidism, hyperthyroidism, Hashimoto's Thyroiditis, and Graves' Disease — affect millions of people worldwide. Patients often struggle to interpret complex laboratory results, track symptom trends over time, and understand what their test values mean for their overall health. ThyroCare bridges this gap by offering a centralised platform where patients can:

- Submit and manage their thyroid lab reports digitally.
- Track key biomarkers (TSH, T3, T4) and symptoms over time through interactive charts.
- Receive AI-generated diagnostic predictions based on their actual lab data and reported symptoms.
- Get personalised health recommendations prioritised by urgency.
- Chat with an AI thyroid health assistant for real-time guidance.
- Generate downloadable PDF summaries of their health data.

The system is composed of three distinct layers: a **React-based frontend** for the user interface, a **Node.js/Express backend** for business logic and data management, and a **Python FastAPI microservice** for AI/ML predictions. These layers communicate through RESTful APIs, forming a scalable, maintainable, and modular architecture suitable for real-world healthcare applications.

## 1.2 Objectives

The objectives of the ThyroCare project are:

1. **Design and develop a secure patient registration and authentication system** with email verification, JWT-based session management, and password reset functionality — ensuring only verified users access protected resources.

2. **Build a comprehensive thyroid report management module** that allows patients to create, read, update, and delete (CRUD) their thyroid lab reports, including thyroid function tests (TSH, Free T3, Free T4, Total T3, Total T4), antibody panels (TPO, Anti-Tg, TRAb), and supplementary markers (Thyroglobulin, Calcitonin, Reverse T3).

3. **Implement an interactive patient dashboard** with real-time data visualisation using ApexCharts, displaying historical trends for T3, T4, TSH levels and a radar chart for symptom tracking.

4. **Integrate an AI-powered diagnostic prediction engine** using a Mistral Large Language Model (LLM) that analyses patient lab results and symptoms to produce structured diagnoses, severity ratings, confidence scores, health scores, and actionable recommendations.

5. **Develop an AI chatbot ("Aiva")** powered by the Groq API (LLaMA 3.1) to provide real-time thyroid health guidance, answer patient questions, and offer symptom explanations — while consistently advising users to consult medical professionals.

6. **Ensure data security and privacy** through bcrypt password hashing, JWT token authentication with expiration, email verification enforcement at both frontend and backend layers, and CORS configuration.

7. **Deploy the complete system to production** using Vercel (frontend and backend) and Railway (LLM microservice) for real-world accessibility and testing.

## 1.3 Purpose

The purpose of ThyroCare is to empower thyroid patients with an intelligent, centralised, and user-friendly platform that transforms raw laboratory data into meaningful health insights. By leveraging artificial intelligence, the system aims to:

- **Reduce patient anxiety** by providing clear, understandable interpretations of complex thyroid lab results.
- **Enable proactive health monitoring** through historical trend tracking and symptom logging.
- **Support clinical decision-making** by generating data-driven diagnostic suggestions that patients can discuss with their healthcare providers.
- **Improve health literacy** through the AI chatbot that educates patients about thyroid conditions, normal ranges, and recommended actions.

The ultimate output of the project is a deployable, production-ready web application that demonstrates how modern AI and web technologies can be combined to address real-world healthcare challenges.

## 1.4 Scope

The scope of the ThyroCare project encompasses the following work areas:

1. **Requirements Analysis and Planning**: Gathering user requirements for thyroid health monitoring, defining functional and non-functional requirements, feasibility study, and project scheduling.

2. **System Design**: Designing the database schema (6 Mongoose models), REST API architecture (7 route modules with 25+ endpoints), and software architecture (three-tier: frontend, backend, LLM microservice).

3. **Frontend Development**: Building 19 React components, 6 service modules, a global state management context, client-side routing with React Router DOM, form handling with Formik/Yup, charting with ApexCharts, and PDF generation with html2pdf.js.

4. **Backend Development**: Implementing 7 controller modules, 2 middleware layers (authentication, error handling), 6 database models, 7 route files, email services (Nodemailer), and database configuration (MongoDB Atlas with Mongoose).

5. **AI/ML Integration**: Developing a FastAPI microservice with a Mistral LLM for thyroid diagnosis prediction, and integrating a Groq-hosted LLaMA 3.1 model for the chatbot functionality.

6. **Testing**: Unit testing of API endpoints, integration testing between frontend and backend layers, model prediction testing with known patient samples, and security testing (email verification bypass remediation).

7. **Deployment**: Deploying the frontend and backend to Vercel, deploying the LLM microservice to Railway, and configuring environment variables for production.

8. **Documentation**: Comprehensive project documentation including API documentation, integration reports, security audit reports, and this final project report.

## 1.5 General Constraints

The following constraints affected the development and delivery of the ThyroCare project:

1. **Time Constraint**: The project was developed within the academic semester timeline, limiting the depth of certain features such as doctor-side dashboards, appointment scheduling, and multi-language support.

2. **AI API Rate Limits and Costs**: The Groq API (free tier) and Mistral API impose rate limits and token quotas. The chatbot was constrained to a maximum of 200 tokens per response and configured with the smallest available model (`llama-3.1-8b-instant`) to stay within free-tier limits.

3. **Medical Disclaimer**: The system provides AI-generated health insights for informational purposes only and is not a substitute for professional medical advice. This fundamental constraint shaped the chatbot's system prompt, which explicitly instructs it to never diagnose or prescribe, and always remind users to consult their doctor.

4. **Data Privacy and Security**: Handling medical data requires strict security measures. The team implemented bcrypt hashing, JWT authentication, and email verification, but a full HIPAA/GDPR compliance audit was beyond the project scope.

5. **Machine Learning Model Training Data**: The Keras neural network model (`medical_model.keras`) was trained on a limited dataset. Its diagnostic accuracy is constrained by the quality, size, and diversity of the training data, particularly for rare thyroid conditions.

6. **scikit-learn Version Lock**: The preprocessing pipeline (`.pkl` files) was trained with `scikit-learn==1.6.1`. Using any other version causes runtime errors, creating a dependency lock that limits environment flexibility.

7. **Deployment Platform Limitations**: Free-tier hosting on Vercel (serverless) and Railway (containerised) introduces cold start latency, memory limits, and sleep intervals for inactive services. A keep-alive ping was implemented to mitigate LLM service hibernation.

---

# Chapter 2: Project Planning and Analysis

## 2.1 Project Planning

### 2.1.1 Feasibility Study

**Technical Feasibility**: The project is technically feasible as it relies on well-established, open-source technologies. The frontend uses React 19 (stable, widely adopted), the backend uses Node.js with Express 5 (industry-standard for REST APIs), and MongoDB Atlas provides managed, scalable NoSQL database hosting. The AI layer uses FastAPI (Python), which natively supports async operations and is purpose-built for ML model serving. All chosen technologies have extensive documentation, large community support, and proven track records in production applications.

**Economic Feasibility**: The project was developed with minimal cost by leveraging free and open-source tools. MongoDB Atlas provides a free M0 cluster (512 MB storage), Vercel offers free hosting for serverless applications, Railway provides a free starter plan, and the Groq API offers a free tier for LLM inference. The total cost of development was limited to team members' time and effort.

**Operational Feasibility**: The system is designed for patients with varying levels of technical proficiency. The user interface follows modern UX patterns with clear navigation, form validation with real-time feedback, loading spinners, toast notifications, and responsive design. The system can be accessed from any modern web browser without installing additional software.

### 2.1.2 Estimated Cost

| Item | Cost |
|------|------|
| Development tools (VS Code, Git, Postman) | Free (Open Source / Free Tier) |
| MongoDB Atlas (M0 Free Cluster) | $0 |
| Vercel Hosting (Frontend + Backend) | $0 (Free Tier) |
| Railway Hosting (LLM Microservice) | $0 (Free Tier with $5 credit) |
| Groq API (Chatbot) | $0 (Free Tier) |
| Mistral API (Diagnosis Prediction) | $0 (Free Tier) |
| Gmail SMTP (Email Verification) | $0 |
| Domain Name | Not purchased (using Vercel subdomain) |
| **Total Estimated Cost** | **$0** |

### 2.1.3 Gantt Chart

| Phase | Tasks | Duration |
|-------|-------|----------|
| **Phase 1: Planning & Analysis** | Requirements gathering, feasibility study, technology research | Weeks 1–2 |
| **Phase 2: Database & Backend Design** | MongoDB schema design (6 models), API route planning | Weeks 3–4 |
| **Phase 3: Backend Development** | Authentication system, CRUD controllers, middleware, email service | Weeks 4–7 |
| **Phase 4: Frontend Development** | React component development (19 components), routing, forms | Weeks 5–9 |
| **Phase 5: AI/ML Integration** | LLM microservice (FastAPI + Mistral), chatbot (Groq + LLaMA 3.1) | Weeks 8–10 |
| **Phase 6: Frontend-Backend Integration** | Service layer, API integration, state management, 7-step integration | Weeks 10–13 |
| **Phase 7: Testing & Security** | Unit testing, integration testing, security audit (email verification bypass) | Weeks 13–14 |
| **Phase 8: Deployment & Documentation** | Vercel/Railway deployment, final report, API documentation | Weeks 14–16 |

## 2.2 Analysis and Limitation of Existing System

The existing approach to thyroid health monitoring suffers from several significant limitations:

1. **Fragmented Data**: Patients typically receive thyroid lab results on paper or through separate hospital portals. There is no unified platform to store, track, and visualise all thyroid-related data in one place.

2. **Lack of Trend Analysis**: Traditional lab reports present a single snapshot in time. Patients cannot easily compare their TSH, T3, or T4 values across multiple tests to identify trends or treatment effectiveness.

3. **Complex Medical Terminology**: Lab reports use clinical abbreviations and reference ranges that are difficult for non-medical users to interpret. Terms like "TPO Antibodies (IU/mL)" or "TRAb (IU/L)" are not self-explanatory.

4. **No Symptom Correlation**: Existing systems do not correlate lab values with patient-reported symptoms (fatigue, weight changes, cold intolerance, hair loss, etc.), making it difficult to see the full picture.

5. **Delayed Access to Medical Guidance**: Patients must wait for scheduled appointments to discuss results with their doctors. There is no immediate, accessible way to get preliminary guidance or understand what their results might indicate.

6. **No Predictive Capabilities**: Current systems simply report raw values without any intelligent analysis or prediction of potential thyroid conditions based on the data patterns.

## 2.3 Need for the New System

The migration to the ThyroCare system is justified by the following evidence:

1. **Thyroid Disorders Prevalence**: According to the American Thyroid Association, an estimated 20 million Americans have some form of thyroid disease, and up to 60% of those with thyroid disease are unaware of their condition. A digital monitoring tool can improve awareness and early detection.

2. **Patient Empowerment**: Modern healthcare trends emphasise patient-centred care and shared decision-making. ThyroCare empowers patients by giving them ownership of their health data and AI-powered insights.

3. **Digital Health Growth**: The global digital health market is projected to grow significantly, driven by demand for telehealth, remote monitoring, and AI-assisted diagnostics. ThyroCare aligns with this trend.

4. **Gap in Existing Solutions**: While general health tracking apps exist (e.g., MyFitnessPal, Apple Health), there is a lack of specialised, thyroid-focused platforms that combine lab report management, symptom tracking, AI predictions, and interactive chatbot guidance in a single application.

5. **AI Maturity**: Recent advances in large language models (Mistral, LLaMA) and ML deployment frameworks (FastAPI, TensorFlow Serving) make it feasible to integrate sophisticated AI capabilities into web applications without requiring expensive infrastructure.

## 2.4 Analysis of the New System

### 2.4.1 User Requirements

| ID | Requirement |
|----|-------------|
| UR-01 | Users shall be able to register with personal information (name, email, phone, date of birth, gender) and create a secure account. |
| UR-02 | Users shall verify their email address before accessing protected features. |
| UR-03 | Users shall be able to log in with email and password and remain authenticated across sessions. |
| UR-04 | Users shall be able to reset their password via a secure token-based process. |
| UR-05 | Users shall be able to submit thyroid lab reports with test date, facility, thyroid function values, antibody values, supplementary tests, and symptoms. |
| UR-06 | Users shall be able to view, edit, search, and delete their previously submitted reports. |
| UR-07 | Users shall see interactive charts displaying historical trends for TSH, T3, T4, and symptoms on a dashboard. |
| UR-08 | Users shall be able to request an AI-powered thyroid diagnosis prediction based on their latest report data. |
| UR-09 | Users shall be able to chat with an AI thyroid health assistant for guidance and information. |
| UR-10 | Users shall be able to view and manage their profile and medical information. |
| UR-11 | Users shall be able to download a PDF summary of their dashboard data. |

### 2.4.2 System Requirements

**Hardware Requirements:**
- Any device with a modern web browser (Chrome, Firefox, Safari, Edge).
- Internet connectivity for API communication.
- Minimum 2 GB RAM (client-side).

**Software Requirements (Development):**
- Node.js v16 or higher
- npm (Node Package Manager)
- Python 3.9+ (for LLM microservice)
- MongoDB Atlas account
- Git for version control

### 2.4.3 Domain Requirements

- The system must handle thyroid-specific medical data including TSH (mIU/L), Free T3 (pg/mL), Free T4 (ng/dL), TPO Antibodies (IU/mL), Thyroglobulin Antibodies (IU/mL), and TSH Receptor Antibodies (IU/L).
- Lab value fields must accept decimal numbers to accommodate precise clinical measurements.
- Symptom tracking must cover the seven primary thyroid symptoms: fatigue, weight change, cold intolerance, hair loss, palpitations, anxiety, and insomnia.
- AI predictions must output one of the recognised thyroid diagnoses: Normal, Hypothyroidism, Hyperthyroidism, Hashimoto's Thyroiditis, Graves' Disease, Thyroid Nodules, or Thyroiditis.

### 2.4.4 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | The system shall allow new users to register with firstName, lastName, email, phone, password, dateOfBirth, and gender. | High |
| FR-02 | The system shall send a verification email with a 24-hour token upon registration. | High |
| FR-03 | The system shall authenticate users via email/password and issue a JWT token valid for 7 days. | High |
| FR-04 | The system shall block unverified users from accessing protected API endpoints (HTTP 403). | High |
| FR-05 | The system shall support password reset via a cryptographic token valid for 1 hour. | Medium |
| FR-06 | The system shall allow authenticated users to create thyroid reports with 17 medical fields. | High |
| FR-07 | The system shall allow authenticated users to view all their reports sorted by date (newest first). | High |
| FR-08 | The system shall allow authenticated users to update and delete specific reports. | High |
| FR-09 | The system shall track lab results (T3, T4, TSH) with date-value pairs per patient. | High |
| FR-10 | The system shall track symptoms (fatigue, anxiety, insomnia, hair loss, palpitations, cold intolerance) with date-based records per patient. | High |
| FR-11 | The system shall display interactive charts (bar, area, radar) for lab and symptom data on the dashboard. | High |
| FR-12 | The system shall send patient data (from latest report + symptoms) to the LLM microservice and return a structured prediction (diagnosis, severity, confidence, healthScore, recommendations). | High |
| FR-13 | The system shall persist every prediction for history tracking and dashboard display. | Medium |
| FR-14 | The system shall provide an AI chatbot that responds to thyroid health questions within 200 tokens. | Medium |
| FR-15 | The system shall allow users to view and update their profile and medical information (condition, status, medication, dosage, doctor, next appointment). | Medium |
| FR-16 | The system shall allow users to delete their account and all associated data. | Medium |
| FR-17 | The system shall support client-side pagination (5 items per page) for report listings. | Low |

### 2.4.5 Non-Functional Requirements

| ID | Requirement | Category |
|----|-------------|----------|
| NFR-01 | Passwords shall be hashed using bcrypt with a salt factor of 10 before storage. | Security |
| NFR-02 | API responses shall follow a consistent JSON envelope: `{ success, data, message }`. | Usability |
| NFR-03 | The frontend shall be responsive and accessible on desktop and mobile browsers. | Usability |
| NFR-04 | The LLM prediction endpoint shall respond within 30 seconds (timeout configured). | Performance |
| NFR-05 | The system shall display loading spinners and skeleton screens during asynchronous operations. | Usability |
| NFR-06 | Toast notifications shall provide user feedback for every async action (success, error, loading). | Usability |
| NFR-07 | The backend shall handle Mongoose-specific errors (duplicate key, validation, cast) with appropriate HTTP status codes. | Reliability |
| NFR-08 | The system shall be deployable as serverless functions (Vercel) and containerised services (Railway). | Portability |
| NFR-09 | CORS shall be enabled to allow cross-origin requests from the frontend domain. | Security |
| NFR-10 | The LLM service shall use low temperature (0.1) for consistent, deterministic outputs. | Reliability |

## 2.5 Advantages of the New System

1. **Centralised Health Data**: All thyroid lab reports, symptoms, and predictions are stored in a single, accessible platform — eliminating data fragmentation.

2. **AI-Powered Diagnostics**: The Mistral LLM analyses patient data and provides structured diagnostic predictions with severity ratings, confidence scores, and personalised recommendations — something no existing thyroid tracking app offers.

3. **Interactive Data Visualisation**: Real-time charts (bar, area, radar) transform raw lab numbers into visual trends, making it easy for patients to track their health over time.

4. **Intelligent Chatbot**: The Aiva chatbot provides immediate, 24/7 thyroid health guidance, helping patients understand their conditions without waiting for doctor appointments.

5. **Strong Security**: Multi-layer security with bcrypt password hashing, JWT authentication, email verification enforcement, and CORS protection ensures patient data is safe.

6. **Modern, Responsive UI**: Built with React 19, TailwindCSS v4, and Formik/Yup for a premium, mobile-friendly user experience with real-time form validation and toast notifications.

7. **Scalable Architecture**: The three-tier architecture (React frontend, Node.js backend, Python LLM service) allows each layer to scale independently and be maintained by different teams.

8. **Cost-Effective Deployment**: The entire system runs on free-tier cloud services (Vercel, Railway, MongoDB Atlas), making it financially sustainable.

## 2.6 Risk and Risk Management

| # | Risk | Probability | Impact | Mitigation Strategy |
|---|------|-------------|--------|---------------------|
| 1 | **AI API rate limits exceeded** — Free-tier quotas on Groq/Mistral may be exhausted during testing | Medium | High | Configured minimal token usage (200 tokens max for chatbot, smallest model selected), implemented error handling with graceful fallback messages |
| 2 | **Security vulnerability** — Unauthorised access to protected endpoints | High | Critical | Identified and remediated email verification bypass vulnerability; added backend middleware check for `isEmailVerified`; removed token generation from registration endpoint |
| 3 | **MongoDB connection failures** — Network issues or Atlas cluster downtime | Low | High | Implemented connection retry middleware with 10-second timeout; lazy connection per request; health check endpoint (`/api/dbtest`) |
| 4 | **LLM service unavailability** — Railway free tier may hibernate the service | Medium | Medium | Implemented 10-minute keep-alive ping from the backend server; 30-second timeout with user-friendly error message; clear guidance to restart the service |
| 5 | **scikit-learn version incompatibility** — `.pkl` files break with different scikit-learn versions | Medium | High | Locked `scikit-learn==1.6.1` in requirements.txt; documented the constraint prominently in API documentation |
| 6 | **Data loss** — Accidental deletion of patient data | Low | High | Implemented `window.confirm()` prompts before deletion; cascading deletes only on full account deletion; MongoDB Atlas automated backups |
| 7 | **Team member availability** — Illness or scheduling conflicts | Medium | Medium | Used Git for version control with clear branch management; modular architecture allowed independent work on frontend, backend, and LLM layers |

---

# Chapter 3: Software Design

## 3.1 Database Design (ERD / Class Diagram)

The ThyroCare system uses MongoDB (NoSQL) with Mongoose ODM. The database consists of **6 collections** (models), each designed to support the system's core functionality:

### Mongoose Data Models

**1. User Model** (`User.js`)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| firstName | String | Required, Trimmed | Patient's first name |
| lastName | String | Required, Trimmed | Patient's last name |
| phone | String | Required, Trimmed | Phone number |
| dateOfBirth | String | Required | Date of birth |
| gender | String | Enum: ["male", "female"], Required | Biological sex |
| email | String | Required, Unique, Lowercase, Trimmed | Login email |
| password | String | Required, Min 6 chars | Bcrypt-hashed password |
| role | String | Enum: ["patient", "admin"], Default: "patient" | User role |
| isEmailVerified | Boolean | Default: false | Email verification status |
| emailVerificationToken | String | Default: null | 32-byte hex token |
| emailVerificationExpires | Date | Default: null | Token expiry (24 hours) |
| profile.phone | String | — | Additional phone |
| profile.birthday | String | — | Additional birthday field |
| medicalInfo.condition | String | Default: "" | Current thyroid condition |
| medicalInfo.status | String | Enum: ["stable", "critical", "improving", "worsening"] | Health status |
| medicalInfo.medication | String | Default: "" | Current medication |
| medicalInfo.dosage | String | Default: "" | Medication dosage |
| medicalInfo.refillDaysLeft | Number | Default: 0 | Days until refill |
| medicalInfo.doctor | String | Default: "" | Treating physician |
| medicalInfo.nextAppointment | String | Default: "" | Next appointment date |

*Features:* Pre-save hook for bcrypt password hashing (salt factor 10). Instance method `comparePassword()` for login verification. Custom `toJSON()` method that strips the password field from responses.

---

**2. Report Model** (`Report.js`)

| Field | Type | Description |
|-------|------|-------------|
| patientId | ObjectId (ref: User) | Owner reference |
| testDate | String | Date of the lab test |
| testingFacility | String | Name of the testing lab |
| thyroidFunction.tsh | Number | TSH level (mIU/L) |
| thyroidFunction.freeT3 | Number | Free T3 (pg/mL) |
| thyroidFunction.freeT4 | Number | Free T4 (ng/dL) |
| thyroidFunction.totalT3 | Number | Total T3 |
| thyroidFunction.totalT4 | Number | Total T4 |
| antibodies.tpo | Number | TPO Antibodies (IU/mL) |
| antibodies.antiTg | Number | Anti-Thyroglobulin (IU/mL) |
| antibodies.tshr | Number | TSH Receptor Antibodies (IU/L) |
| otherTests.thyroglobulin | Number | Thyroglobulin level |
| otherTests.calcitonin | Number | Calcitonin level |
| otherTests.reverseT3 | Number | Reverse T3 level |
| symptoms.fatigue | Number | Fatigue severity |
| symptoms.weightChange | Number | Weight change severity |
| symptoms.coldIntolerance | Number | Cold intolerance severity |
| symptoms.hairLoss | Number | Hair loss severity |
| symptoms.palpitations | Number | Palpitations severity |
| symptoms.anxiety | Number | Anxiety severity |
| symptoms.insomnia | Number | Insomnia severity |

---

**3. Prediction Model** (`Prediction.js`)

| Field | Type | Description |
|-------|------|-------------|
| patientId | ObjectId (ref: User) | Owner reference |
| diagnosis | String (Required) | AI-generated diagnosis |
| confidence | Number (Default: 0) | Model confidence (0.0–1.0) |
| healthScore | Number (Default: 0) | Health score (0–100) |
| recommendations | Array of {priority, action, reason} | Prioritised recommendations |
| inputData | Mixed (Required) | Full patient data sent to model (for audit) |

---

**4. LabResult Model** (`LabResult.js`)

| Field | Type | Description |
|-------|------|-------------|
| patientId | ObjectId (ref: User) | Owner reference |
| type | String, Enum: ["t3", "t4", "tsh"] | Lab test type |
| records | Array of {date: String, value: Number} | Time-series lab values |

*Features:* Compound unique index on `(patientId, type)` — one document per patient per lab type.

---

**5. Symptom Model** (`Symptom.js`)

| Field | Type | Description |
|-------|------|-------------|
| patientId | ObjectId (ref: User, Unique) | Owner reference |
| records | Array of {date, fatigue, anxiety, insomnia, hairLoss, palpitations, coldIntolerance} | Time-series symptom records |

*Features:* One document per patient (unique patientId constraint).

---

**6. ResetToken Model** (`ResetToken.js`)

| Field | Type | Description |
|-------|------|-------------|
| userId | ObjectId (ref: User) | User requesting reset |
| token | String (Required) | 32-byte hex reset token |
| expiresAt | Date (Required) | Token expiry (1 hour) |

---

### Entity Relationship Diagram (ERD)

```
┌──────────────────────┐
│        User          │
├──────────────────────┤
│ _id (PK)             │
│ firstName             │
│ lastName              │
│ email (Unique)        │
│ password (Hashed)     │
│ gender                │
│ dateOfBirth           │
│ phone                 │
│ role                  │
│ isEmailVerified       │
│ emailVerificationToken│
│ medicalInfo {}        │
│ profile {}            │
│ createdAt, updatedAt  │
└──────────┬───────────┘
           │
           │ 1 ──── * (One-to-Many)
           │
     ┌─────┼─────────────────┬──────────────────┬──────────────────┐
     │     │                 │                  │                  │
     ▼     ▼                 ▼                  ▼                  ▼
┌─────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Report    │  │  Prediction  │  │  LabResult   │  │   Symptom    │
├─────────────┤  ├──────────────┤  ├──────────────┤  ├──────────────┤
│ _id (PK)    │  │ _id (PK)     │  │ _id (PK)     │  │ _id (PK)     │
│ patientId(FK)│  │ patientId(FK)│  │ patientId(FK)│  │ patientId(FK)│
│ testDate    │  │ diagnosis    │  │ type (t3/t4/ │  │ records[]    │
│ facility    │  │ confidence   │  │   tsh)       │  │  {date,      │
│ thyroid     │  │ healthScore  │  │ records[]    │  │   fatigue,   │
│   Function{}│  │ recommend[]  │  │  {date,value}│  │   anxiety,...}│
│ antibodies{}│  │ inputData{}  │  │              │  │              │
│ otherTests{}│  │ timestamps   │  │ Unique Index:│  │ Unique:      │
│ symptoms{}  │  │              │  │ (patient,type│  │ patientId    │
│ timestamps  │  │              │  │              │  │ timestamps   │
└─────────────┘  └──────────────┘  └──────────────┘  └──────────────┘

                                                    ┌──────────────┐
                                                    │  ResetToken  │
                                                    ├──────────────┤
                                                    │ _id (PK)     │
                                                    │ userId (FK)  │
                                                    │ token        │
                                                    │ expiresAt    │
                                                    │ timestamps   │
                                                    └──────────────┘
```

## 3.2 Use Case Diagram

```
                            ThyroCare System
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│                                                                    │
│   ┌───────────┐     ┌───────────────────────────┐                 │
│   │           │────▶│  Register Account          │                 │
│   │           │     └───────────────────────────┘                 │
│   │           │     ┌───────────────────────────┐                 │
│   │           │────▶│  Verify Email              │                 │
│   │           │     └───────────────────────────┘                 │
│   │           │     ┌───────────────────────────┐                 │
│   │           │────▶│  Login / Logout            │                 │
│   │           │     └───────────────────────────┘                 │
│   │           │     ┌───────────────────────────┐                 │
│   │           │────▶│  Reset Password            │                 │
│   │           │     └───────────────────────────┘                 │
│   │           │     ┌───────────────────────────┐                 │
│   │ Patient   │────▶│  Manage Thyroid Reports    │                 │
│   │ (Actor)   │     │  (Create/Read/Update/Delete)│                │
│   │           │     └───────────────────────────┘                 │
│   │           │     ┌───────────────────────────┐                 │
│   │           │────▶│  View Dashboard & Charts   │                 │
│   │           │     └───────────────────────────┘                 │
│   │           │     ┌───────────────────────────┐                 │
│   │           │────▶│  Track Symptoms            │                 │
│   │           │     └───────────────────────────┘                 │
│   │           │     ┌───────────────────────────┐    ┌──────────┐│
│   │           │────▶│  Request AI Prediction     │───▶│ LLM API  ││
│   │           │     └───────────────────────────┘    │ (Mistral)││
│   │           │     ┌───────────────────────────┐    └──────────┘│
│   │           │────▶│  Chat with AI Assistant    │───▶┌──────────┐│
│   │           │     └───────────────────────────┘    │ Groq API ││
│   │           │     ┌───────────────────────────┐    │ (LLaMA)  ││
│   │           │────▶│  View Prediction History   │    └──────────┘│
│   │           │     └───────────────────────────┘                 │
│   │           │     ┌───────────────────────────┐                 │
│   │           │────▶│  Manage Profile & Medical  │                 │
│   │           │     │  Information               │                │
│   │           │     └───────────────────────────┘                 │
│   │           │     ┌───────────────────────────┐                 │
│   │           │────▶│  Download PDF Report       │                 │
│   │           │     └───────────────────────────┘                 │
│   │           │     ┌───────────────────────────┐                 │
│   │           │────▶│  Delete Account            │                 │
│   └───────────┘     └───────────────────────────┘                 │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

## 3.3 Sequence Diagram

### Sequence Diagram 1: User Registration & Email Verification

```
┌──────┐          ┌──────────┐          ┌─────────┐          ┌──────────┐
│ User │          │ Frontend │          │ Backend │          │Gmail SMTP│
└──┬───┘          └────┬─────┘          └────┬────┘          └────┬─────┘
   │  Fill form        │                     │                    │
   │──────────────────▶│                     │                    │
   │                   │ POST /auth/register │                    │
   │                   │────────────────────▶│                    │
   │                   │                     │ Create User        │
   │                   │                     │ (isEmailVerified   │
   │                   │                     │  = false)          │
   │                   │                     │ Generate 32-byte   │
   │                   │                     │ verification token │
   │                   │                     │                    │
   │                   │                     │ Send verify email  │
   │                   │                     │───────────────────▶│
   │                   │                     │                    │
   │                   │ 201 { user }        │                    │
   │                   │ (NO TOKEN returned) │                    │
   │                   │◀────────────────────│                    │
   │  Redirect to      │                     │                    │
   │  /verify-email    │                     │                    │
   │◀──────────────────│                     │                    │
   │                   │                     │                    │
   │  Click email link │                     │                    │
   │──────────────────▶│                     │                    │
   │                   │GET /auth/verify     │                    │
   │                   │  ?token=xxx         │                    │
   │                   │────────────────────▶│                    │
   │                   │                     │ isEmailVerified    │
   │                   │                     │ = true             │
   │                   │ 200 "Verified!"     │                    │
   │                   │◀────────────────────│                    │
   │  Redirect /login  │                     │                    │
   │◀──────────────────│                     │                    │
```

### Sequence Diagram 2: Thyroid Diagnosis Prediction

```
┌──────┐          ┌──────────┐          ┌─────────┐          ┌─────────────┐
│ User │          │ Frontend │          │ Backend │          │ LLM Service │
└──┬───┘          └────┬─────┘          └────┬────┘          │  (Mistral)  │
   │                   │                     │               └──────┬──────┘
   │ Submit Report     │                     │                      │
   │──────────────────▶│                     │                      │
   │                   │ POST /reports       │                      │
   │                   │────────────────────▶│                      │
   │                   │ 201 Report Created  │                      │
   │                   │◀────────────────────│                      │
   │                   │                     │                      │
   │                   │ POST /predict       │                      │
   │                   │────────────────────▶│                      │
   │                   │                     │ Fetch User, Report,  │
   │                   │                     │ Symptoms from MongoDB│
   │                   │                     │                      │
   │                   │                     │ Build patient_data   │
   │                   │                     │ payload              │
   │                   │                     │                      │
   │                   │                     │ POST /predict        │
   │                   │                     │─────────────────────▶│
   │                   │                     │                      │
   │                   │                     │    Mistral LLM       │
   │                   │                     │    analyses data     │
   │                   │                     │    (temp=0.1)        │
   │                   │                     │                      │
   │                   │                     │ { diagnosis,         │
   │                   │                     │   severity,          │
   │                   │                     │   confidence,        │
   │                   │                     │   healthScore,       │
   │                   │                     │   recommendations }  │
   │                   │                     │◀─────────────────────│
   │                   │                     │                      │
   │                   │                     │ Save to Prediction   │
   │                   │                     │ collection           │
   │                   │                     │                      │
   │                   │ 200 Prediction      │                      │
   │                   │◀────────────────────│                      │
   │ Display result    │                     │                      │
   │◀──────────────────│                     │                      │
```

## 3.4 Activity Diagram

### Activity Diagram 1: Report Submission Flow

```
        ┌─────────────┐
        │   Start     │
        └──────┬──────┘
               ▼
     ┌─────────────────────┐
     │  User navigates to  │
     │  Report > Insert    │
     └──────────┬──────────┘
                ▼
     ┌─────────────────────┐
     │  Fill 17-field form │
     │  (test date, TSH,   │
     │  T3, T4, antibodies,│
     │  symptoms, etc.)    │
     └──────────┬──────────┘
                ▼
        ┌───────────────┐
        │  Yup Schema   │──── Invalid ───▶ Show validation errors
        │  Validation   │                  (return to form)
        └───────┬───────┘
                │ Valid
                ▼
     ┌─────────────────────┐
     │  POST /api/reports  │
     │  (via reportService)│
     └──────────┬──────────┘
                ▼
        ┌───────────────┐
        │  Report saved │
        │  in MongoDB   │
        └───────┬───────┘
                ▼
     ┌─────────────────────┐
     │  POST /api/predict  │
     │  (auto-triggered)   │
     └──────────┬──────────┘
                ▼
     ┌─────────────────────┐
     │  Backend builds     │
     │  patient_data from  │
     │  DB (User + Report  │
     │  + Symptoms)        │
     └──────────┬──────────┘
                ▼
     ┌─────────────────────┐
     │  LLM analyses data  │
     │  Returns prediction │
     └──────────┬──────────┘
                ▼
     ┌─────────────────────┐
     │  Display prediction │
     │  card with diagnosis│
     │  health gauge, and  │
     │  recommendations    │
     └──────────┬──────────┘
                ▼
        ┌─────────────┐
        │    End      │
        └─────────────┘
```

### Activity Diagram 2: User Authentication Flow

```
        ┌─────────────┐
        │   Start     │
        └──────┬──────┘
               ▼
     ┌─────────────────────┐
     │  User enters email  │
     │  and password       │
     └──────────┬──────────┘
                ▼
     ┌─────────────────────┐
     │  POST /auth/login   │
     └──────────┬──────────┘
                ▼
        ┌───────────────┐
        │ Credentials   │──── Invalid ───▶ Show "Invalid email or password"
        │ valid?        │                  (HTTP 401)
        └───────┬───────┘
                │ Valid
                ▼
        ┌───────────────┐
        │ Email         │──── Not Verified ──▶ Show "Please verify email"
        │ verified?     │                       (HTTP 403)
        └───────┬───────┘
                │ Verified
                ▼
     ┌─────────────────────┐
     │  Generate JWT token │
     │  (expires in 7 days)│
     └──────────┬──────────┘
                ▼
     ┌─────────────────────┐
     │  Store token in     │
     │  localStorage       │
     │  Update UserContext  │
     └──────────┬──────────┘
                ▼
     ┌─────────────────────┐
     │  Redirect to        │
     │  /dashboard         │
     └──────────┬──────────┘
                ▼
        ┌─────────────┐
        │    End      │
        └─────────────┘
```

---

# Chapter 4: Implementation

## 4.1 Software Architecture

ThyroCare follows a **three-tier client-server architecture** where each layer is independently developed, deployed, and maintainable:

```
┌──────────────────────────────────────────────────────────────┐
│                      CLIENT TIER                              │
│                                                               │
│   React 19 + Vite 7 + TailwindCSS v4                        │
│   Deployed on: Vercel                                         │
│                                                               │
│   ┌────────────┐  ┌────────────┐  ┌────────────────────┐    │
│   │ Components │  │  Services  │  │   Context (State)  │    │
│   │ (19 React  │  │ (6 modules)│  │  (UserContext.jsx) │    │
│   │ components)│  │            │  │                    │    │
│   └─────┬──────┘  └─────┬──────┘  └────────┬───────────┘    │
│         │               │                  │                  │
│         └───────────────┼──────────────────┘                  │
│                         │ Axios HTTP (REST API)               │
│                         │ Bearer Token (JWT)                  │
└─────────────────────────┼────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                      SERVER TIER                              │
│                                                               │
│   Node.js + Express 5 + Mongoose 9                           │
│   Deployed on: Vercel (Serverless Functions)                  │
│                                                               │
│   ┌────────────┐  ┌────────────┐  ┌────────────────────┐    │
│   │ Controllers │  │ Middleware │  │     Models         │    │
│   │ (7 modules) │  │ (Auth+Err) │  │   (6 Mongoose)    │    │
│   └─────┬──────┘  └─────┬──────┘  └────────┬───────────┘    │
│         │               │                  │                  │
│         └───────────────┼──────────────────┘                  │
│                         │                                     │
│                   ┌─────┼─────┐                              │
│                   │     │     │                               │
│                   ▼     ▼     ▼                               │
│           ┌──────────┐  ┌──────────────┐                     │
│           │ MongoDB  │  │ HTTP fetch() │                     │
│           │ Atlas    │  │ to LLM Layer │                     │
│           └──────────┘  └──────┬───────┘                     │
│                                │                              │
└────────────────────────────────┼─────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────┐
│                      AI / ML TIER                             │
│                                                               │
│   Python FastAPI + Mistral LLM                               │
│   Deployed on: Railway                                        │
│                                                               │
│   ┌──────────────────┐    ┌──────────────────────┐           │
│   │  /predict         │    │  Mistral AI Client   │           │
│   │  endpoint         │───▶│  (mistral-small-     │           │
│   │  (Pydantic schema)│    │   latest, temp=0.1)  │           │
│   └──────────────────┘    └──────────────────────┘           │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | React | 19.2.0 | Component-based UI framework |
| | Vite | 7.3.1 | Build tool and dev server |
| | TailwindCSS | 4.2.0 | Utility-first CSS framework |
| | React Router DOM | 7.13.0 | Client-side routing |
| | Formik + Yup | 2.4.9 / 1.7.1 | Form management and validation |
| | Axios | 1.15.1 | HTTP client with interceptors |
| | ApexCharts | 5.8.1 | Interactive data visualisation |
| | react-hot-toast | 2.6.0 | Toast notification system |
| | html2pdf.js | 0.14.0 | PDF generation |
| | FontAwesome | 7.2.0 | Icon library |
| **Backend** | Node.js | 16+ | Server-side JavaScript runtime |
| | Express | 5.2.1 | HTTP framework |
| | Mongoose | 9.3.3 | MongoDB ODM |
| | bcryptjs | 3.0.3 | Password hashing |
| | jsonwebtoken | 9.0.3 | JWT authentication |
| | Nodemailer | 8.0.10 | Email sending (Gmail SMTP) |
| | cors | 2.8.6 | Cross-origin resource sharing |
| | dotenv | 17.4.0 | Environment variable management |
| **AI/ML** | FastAPI | Latest | Python async web framework |
| | Mistral AI SDK | Latest | LLM inference client |
| | Pydantic | Latest | Request/response schema validation |
| **AI Chat** | Groq API | — | Cloud-hosted LLM inference |
| | LLaMA 3.1 (8B Instant) | — | Chatbot language model |
| **Database** | MongoDB Atlas | M0 Free Cluster | Cloud NoSQL database |
| **Deployment** | Vercel | — | Frontend + Backend hosting |
| | Railway | — | LLM microservice hosting |

### Frontend Component Registry

| Component | Route | Description |
|-----------|-------|-------------|
| Layout | `/` (wrapper) | Navbar + Footer wrapper |
| Home | `/` (index) | Landing page |
| AboutUs | `/about` | About the project page |
| Login | `/login` | Email/password login form |
| SignUp | `/signup` | Registration form (7 fields) |
| ForgotPassword | `/forgot-password` | Password reset request |
| ResetPassword | `/reset-password` | New password entry |
| VerifyEmail | `/verify-email` | Email verification handler |
| Dashboard | `/dashboard` 🔒 | Charts, health score, predictions |
| Report | `/report` 🔒 | Report module wrapper |
| ReportOptions | `/report` (index) 🔒 | Insert/View report choice |
| InsertReport | `/report/insert_report` 🔒 | 17-field report form |
| ViewReports | `/report/view_report` 🔒 | Report list with CRUD |
| Profile | `/profile` 🔒 | User profile & medical info |
| AiChat | `/chat` 🔒 | AI chatbot interface |
| ProtectedRoute | — | Auth guard (redirects to /login) |
| Navbar | — | Navigation bar |
| Footer | — | Page footer |
| NotFound | `/*` | 404 error page |

🔒 = Protected route (requires authentication)

### Backend Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JSON Web Tokens |
| `JWT_EXPIRES_IN` | Token expiration period (7d) |
| `GROQ_API_KEY` | Groq API key for the chatbot (LLaMA 3.1) |
| `NN_MODEL_URL` | URL of the LLM prediction microservice (Railway) |
| `EMAIL_SERVICE` | Email provider (gmail) |
| `EMAIL_USER` | Sender email address |
| `EMAIL_PASS` | App-specific password for Gmail SMTP |
| `FRONTEND_URL` | Frontend URL for verification email links |
| `NODE_ENV` | Environment mode (development / production) |

### Object-Relational Mapping (ORM)

The system uses **Mongoose** as the Object-Document Mapper (ODM) for MongoDB. Mongoose provides:

- **Schema Definition**: Each model (User, Report, Prediction, LabResult, Symptom, ResetToken) is defined using `mongoose.Schema` with field types, validation rules, enums, and defaults.
- **Middleware Hooks**: The User model uses a `pre('save')` hook to automatically hash passwords with bcrypt before persisting to the database.
- **Instance Methods**: `comparePassword()` on the User model enables secure password comparison during login.
- **Query Building**: Controllers use Mongoose's chainable query methods (`find`, `findOne`, `findById`, `findOneAndUpdate`, `findOneAndDelete`, `sort`, `select`).
- **Indexing**: LabResult uses a compound unique index `{ patientId: 1, type: 1 }` and Symptom uses a unique constraint on `patientId`.

Data flows between the client and server via JSON over HTTP. Axios (frontend) serialises JavaScript objects to JSON, Express parses incoming JSON with `express.json()` middleware, and Mongoose maps JSON documents to MongoDB BSON storage and back.

## 4.2 Pseudocode / Workflow

### Client-Server Communication Workflow

```
┌──────────────────────────────────────────────────────────────┐
│                  FRONTEND (React + Axios)                     │
│                                                               │
│  1. User interacts with a component (e.g. clicks "Submit")  │
│  2. Component calls a service function:                      │
│     e.g. reportService.createReport(formData)                │
│  3. Service function calls api.post("/reports", data)        │
│  4. Axios interceptor attaches Bearer token from localStorage│
│  5. HTTP POST request sent to backend                        │
│                                                               │
│  On Response:                                                 │
│  6. Axios interceptor checks response status                 │
│  7. If success → extract data, show toast.success()          │
│  8. If error → show toast.error(), handle specific cases     │
│  9. Component updates local state with response data         │
└──────────────────────────────┬────────────────────────────────┘
                               │ HTTPS / JSON
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                  BACKEND (Express + Mongoose)                 │
│                                                               │
│  1. Express receives request at route handler                │
│  2. CORS middleware validates origin                         │
│  3. express.json() parses request body                       │
│  4. DB middleware ensures MongoDB connection                 │
│  5. Auth middleware (for protected routes):                   │
│     a. Extract token from Authorization header               │
│     b. Verify JWT signature and expiration                   │
│     c. Find user by decoded ID in MongoDB                    │
│     d. Check isEmailVerified === true                        │
│     e. Attach req.user = { id, role }                        │
│  6. Controller executes business logic                       │
│  7. Mongoose performs database operation                     │
│  8. Response sent: { success, data, message }                │
│                                                               │
│  For Predictions:                                             │
│  9. Controller fetches User + latest Report + Symptoms       │
│ 10. Builds patient_data payload from DB data                 │
│ 11. Sends HTTP POST to LLM microservice                     │
│ 12. Receives AI result, saves to Prediction collection       │
│ 13. Returns prediction to frontend                           │
│                                                               │
│  Error Handling:                                              │
│  14. Global error middleware catches unhandled errors         │
│  15. Maps Mongoose errors to appropriate HTTP status codes   │
│      - 11000 (duplicate key) → 409                           │
│      - ValidationError → 400                                 │
│      - CastError → 400                                       │
│      - Default → 500                                         │
└──────────────────────────────┬────────────────────────────────┘
                               │ HTTPS / JSON
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                  LLM SERVICE (FastAPI + Mistral)              │
│                                                               │
│  1. Receive POST /predict with patient_data                  │
│  2. Extract patient demographics, lab values, symptoms       │
│  3. Build analysis prompt with all patient data              │
│  4. Call Mistral API (mistral-small-latest, temp=0.1)        │
│  5. Parse JSON response from LLM                            │
│  6. Extract: diagnosis, severity, confidence, healthScore,   │
│     recommendations                                          │
│  7. Return structured JSON to backend                        │
└──────────────────────────────────────────────────────────────┘
```

### API Endpoint Coverage Matrix

| Method | Endpoint | Controller | Middleware | Description |
|--------|----------|-----------|------------|-------------|
| POST | `/api/auth/register` | auth.register | — | Register new user |
| GET | `/api/auth/verify-email?token=xxx` | auth.verifyEmail | — | Verify email address |
| POST | `/api/auth/resend-verification` | auth.resendVerification | — | Resend verification email |
| POST | `/api/auth/login` | auth.login | — | Login (returns JWT) |
| GET | `/api/auth/me` | auth.getMe | auth | Get current user profile |
| POST | `/api/auth/forgot-password` | auth.forgotPassword | — | Request password reset token |
| POST | `/api/auth/reset-password` | auth.resetPassword | — | Reset password with token |
| GET | `/api/profile` | profile.getProfile | auth | Get user profile |
| PUT | `/api/profile` | profile.updateProfile | auth | Update profile & medical info |
| DELETE | `/api/profile` | profile.deleteProfile | auth | Delete account + all data |
| GET | `/api/reports` | report.getReports | auth | List all patient reports |
| GET | `/api/reports/:id` | report.getReportById | auth | Get single report |
| POST | `/api/reports` | report.createReport | auth | Create new thyroid report |
| PUT | `/api/reports/:id` | report.updateReport | auth | Update existing report |
| DELETE | `/api/reports/:id` | report.deleteReport | auth | Delete a report |
| GET | `/api/lab-results/:type` | labResult.getLabResults | auth | Get lab results (t3/t4/tsh) |
| POST | `/api/lab-results/:type` | labResult.addLabResult | auth | Add lab result entry |
| PUT | `/api/lab-results/:type` | labResult.updateLabResult | auth | Update lab result by date |
| DELETE | `/api/lab-results/:type?date=` | labResult.deleteLabResult | auth | Delete lab result by date |
| PUT | `/api/lab-results/:type/bulk` | labResult.bulkUpdateLabResults | auth | Bulk replace lab results |
| GET | `/api/symptoms` | symptom.getSymptoms | auth | Get all symptom records |
| POST | `/api/symptoms` | symptom.addSymptom | auth | Add symptom record |
| PUT | `/api/symptoms` | symptom.updateSymptom | auth | Update symptom by date |
| DELETE | `/api/symptoms?date=` | symptom.deleteSymptom | auth | Delete symptom by date |
| PUT | `/api/symptoms/bulk` | symptom.bulkUpdateSymptoms | auth | Bulk replace symptoms |
| POST | `/api/chat` | chat.chat | auth | Send message to AI chatbot |
| POST | `/api/predict` | prediction.predict | auth | Run AI prediction |
| GET | `/api/predict/history` | prediction.getPredictionHistory | auth | Get prediction history |
| GET | `/api/predict/history/:id` | prediction.getPredictionById | auth | Get single prediction |
| DELETE | `/api/predict/history/:id` | prediction.deletePrediction | auth | Delete a prediction |

---

# Chapter 5: Testing

## 5.1 Unit Testing

### Backend API Unit Testing

Individual API endpoints were tested using **Postman** with the full collection documented in `ThyroCare.postman_collection.json`. Each endpoint was tested for:

- **Valid Inputs**: Correct request body format, proper response structure (`{ success, data, message }`), and appropriate HTTP status codes (200, 201).
- **Invalid Inputs**: Missing required fields (returns 400), invalid email format, passwords shorter than 6 characters, non-existent resource IDs (returns 404).
- **Authentication**: Protected endpoints return 401 when no token is provided, 401 when an invalid/expired token is used, and 403 when an unverified user's token is used.
- **Duplicate Handling**: Registration with an existing email returns 409 (duplicate key error handled by error middleware).

### LLM Microservice Unit Testing

The LLM prediction endpoint was tested using a Python test script (`test_api.py`) with known patient samples:

- **Normal Patient Sample**: Sent healthy lab values (TSH=2.5, FreeT3=3.0, FreeT4=1.2) → Expected "Normal" diagnosis.
- **Hypothyroid Patient Sample**: Sent elevated TSH (15.0), low FreeT4 (0.5) → Expected "Hypothyroidism" diagnosis.
- **Hyperthyroid Patient Sample**: Sent suppressed TSH (0.1), elevated FreeT3 (8.0) → Expected "Hyperthyroidism" diagnosis.

Results from these tests are documented in `testing_apis_results.md` and `server_log.txt`.

### Frontend Component Testing

Individual React components were tested manually by:

- Verifying form validation (Formik + Yup) shows appropriate error messages for empty required fields.
- Confirming loading spinners appear during API calls and disappear on completion.
- Testing toast notifications fire for success and error scenarios.
- Verifying protected routes redirect unauthenticated users to `/login`.

## 5.2 Integrated Testing

The frontend-backend integration was executed in **7 incremental steps**, each thoroughly documented:

| Step | Integration Area | Key Tests | Report |
|------|-----------------|-----------|--------|
| 1 | Frontend Setup | Axios singleton, API interceptors, mock data removal | `report_of_frontend_setup.md` |
| 2 | Schema Alignment | InsertReport form fields → backend nested object mapping (17 fields) | `report_of_schema_alignment.md` |
| 3 | Authentication Flow | Login → JWT → localStorage, Register → no token, GET /auth/me rehydration | `report_of_authentication_flow.md` |
| 4 | Core CRUD | ViewReports (fetch, delete, update), Profile (fetch, update) | `report_of_core_crud_integration.md` |
| 5 | Dashboard | T3/T4/TSH charts, symptom radar, profile card, prediction display | `report_of_dashboard_integration.md` |
| 6 | AI Chat + NN | POST /chat → Groq/LLaMA, POST /predict → Mistral, inline result card | (covered in step 6 work) |
| 7 | Polish | Toast system, pagination, dead-link fixes, loading spinners | `report_of_polish.md` |

Each step was tested end-to-end by:
1. Starting the backend server (`node src/server.js`).
2. Starting the LLM microservice (`uvicorn main:app`).
3. Starting the frontend dev server (`npm run dev`).
4. Performing all CRUD operations through the UI.
5. Verifying database state in MongoDB Atlas dashboard.
6. Checking server console logs for errors.

The final consolidated integration report is documented in `Final_Integration_Report.md`.

## 5.3 Additional Testing

### Security Testing — Email Verification Bypass Remediation

A critical security vulnerability was discovered during testing: newly registered users could access protected dashboard features before verifying their email address. A comprehensive security audit was conducted and documented in `Security_Report_Email_Verification.md`.

**Vulnerability**: The registration endpoint returned a JWT token, which the frontend stored in localStorage, allowing immediate access to protected routes.

**Root Causes Identified**:
1. Backend `register` controller generated and returned a JWT token upon registration.
2. Frontend `authService.register()` stored the token and user in localStorage.
3. Frontend `UserContext` updated global auth state with registration data.
4. Backend `auth.middleware.js` did not check `isEmailVerified` flag.

**Remediation Applied**:
1. Removed JWT token generation from the `register` controller.
2. Added `isEmailVerified` check in auth middleware (returns HTTP 403 if false).
3. Removed localStorage writes from frontend registration service.
4. Updated `UserContext.handleRegister()` to not update global auth state.

**Verification**: After remediation, registered users remain in "guest" state until email verification is complete. Attempting to access `/dashboard` redirects to `/login`. API calls with unverified tokens receive HTTP 403.

### Model Integration Testing

The LLM microservice integration was tested end-to-end with the backend, documented in `Model_integration_report.md`. Tests verified:
- The backend correctly builds `patient_data` from MongoDB (User + Report + Symptom).
- The LLM microservice correctly receives and processes the payload.
- The prediction response is correctly persisted in the Prediction collection.
- The frontend correctly displays the prediction result with diagnosis, health score gauge, and recommendations.

---

# Chapter 6: Results and Discussion

## 6.1 Results

### 6.1.1 Expected Results

The ThyroCare system was designed to deliver the following expected outcomes:

1. **User Authentication**: 100% secure registration, login, and session management with email verification enforcement. Users should only access protected features after proving email ownership.

2. **Report Management**: Complete CRUD functionality for thyroid lab reports. Users should be able to create reports with 17 medical fields, view them in a paginated list, update any field, and delete reports with confirmation.

3. **Dashboard Visualisation**: Interactive, real-time charts displaying historical T3, T4, and TSH trends using bar and area charts. A radar chart should visualise symptom severity patterns. Health score and latest diagnosis should be prominently displayed.

4. **AI Prediction**: The Mistral LLM should analyse patient lab data and return a structured JSON response with diagnosis (e.g., "Hypothyroidism"), severity ("Mild"/"Moderate"/"Severe"), confidence score (0.0–1.0), health score (0–100), and 3 prioritised recommendations.

5. **AI Chatbot**: The Aiva chatbot should respond to thyroid health questions concisely (max 3 sentences), provide educational guidance, and always remind users to consult their doctor.

6. **Deployment**: All three tiers should be accessible via public URLs — frontend and backend on Vercel, LLM service on Railway.

### 6.1.2 Actual Results

1. **User Authentication**: ✅ **Achieved**. The full authentication flow works as expected. Registration creates an unverified user, verification email is sent via Gmail SMTP, email verification activates the account, and login issues a 7-day JWT. The email verification bypass vulnerability was discovered and remediated (see Section 5.3).

2. **Report Management**: ✅ **Achieved**. All CRUD operations function correctly. The InsertReport form captures all 17 fields and maps them to the backend's nested object structure. ViewReports displays reports with search, pagination (5 per page), edit (slide-in drawer), and delete (with confirmation).

3. **Dashboard Visualisation**: ✅ **Achieved**. All dashboard charts render live data from the backend. T3 (vertical bar), T4 (horizontal bar), TSH (area/datetime), and symptom radar charts update in real-time. Skeleton loaders display while data is loading. The health score gauge and latest prediction card are displayed when prediction data is available.

4. **AI Prediction**: ✅ **Achieved**. The Mistral LLM successfully analyses patient data and returns structured diagnoses. Predictions are persisted in MongoDB for history tracking. The prediction card displays inline after report submission with a circular SVG health gauge.

5. **AI Chatbot**: ✅ **Achieved**. The Aiva chatbot powered by Groq API (LLaMA 3.1-8B-Instant) responds to thyroid health questions concisely. The chat interface includes typing indicators, message history, and clear chat functionality.

6. **Deployment**: ✅ **Achieved**. The system is deployed with the frontend accessible at the Vercel subdomain (`thyro-care-app.vercel.app`) and the LLM service on Railway (`thyrocare-model.up.railway.app`).

### Possible Diagnosis Output Classes

| Prediction | Description |
|------------|-------------|
| Normal | No thyroid disorder detected |
| Hypothyroidism | Underactive thyroid (with severity: Mild/Moderate/Severe) |
| Hyperthyroidism | Overactive thyroid (with severity: Mild/Moderate/Severe) |
| Hashimoto's Thyroiditis | Autoimmune hypothyroidism |
| Graves' Disease | Autoimmune hyperthyroidism |
| Thyroid Nodules | Thyroid nodule detection |
| Thyroiditis | Thyroid inflammation |

## 6.2 Discussion

The ThyroCare system successfully met all its primary objectives, delivering a functional, AI-powered thyroid health monitoring platform. However, several differences between expected and actual results are worth discussing:

1. **LLM vs. Neural Network for Predictions**: The original design envisioned a Keras/TensorFlow neural network (`medical_model.keras`) for predictions. During development, the team migrated to a Mistral LLM-based approach for predictions because: (a) the NN model required a rigid 76-field input schema with many fields not collected by the frontend form, (b) the LLM provides more flexible, context-aware analysis with only the available thyroid-specific data, and (c) the LLM returns structured recommendations alongside the diagnosis, which the NN could not. The NN model and preprocessing pipeline (`.pkl` files) remain in the codebase for potential future hybrid approaches.

2. **Cold Start Latency**: On free-tier Railway, the LLM microservice hibernates after periods of inactivity. The first prediction request after hibernation can take 10–15 seconds as the service spins up. The 10-minute keep-alive ping mitigates this but does not eliminate it entirely. The 30-second timeout was configured to accommodate cold starts.

3. **Chatbot Token Limits**: The Groq API free tier imposes rate limits. The chatbot is configured with `max_tokens: 200` to stay within quotas, which occasionally results in truncated responses for complex medical questions. The system prompt instructs the model to keep responses to 3 sentences maximum.

4. **Security Vulnerability Discovery**: The email verification bypass vulnerability (Section 5.3) was a significant finding. It demonstrated the importance of defence-in-depth — the vulnerability required fixes at 4 different points (backend controller, backend middleware, frontend service, and frontend context) to fully remediate. This experience reinforced that security must be tested at every layer, not just the obvious ones.

5. **Data Accuracy Disclaimer**: The LLM's predictions are based on pattern matching against its training data, not clinical validation. The system always accompanies predictions with a recommendation to consult a healthcare provider. The predictions should be treated as informational aids, not medical diagnoses.

---

# Chapter 7: Conclusion

ThyroCare represents a successful synthesis of modern web technologies and artificial intelligence to address a real-world healthcare need. Over the course of this graduation project, the team designed, developed, tested, and deployed a full-stack web application that empowers thyroid patients with centralised health data management, interactive trend visualisation, AI-powered diagnostic predictions, and intelligent chatbot guidance.

The project achieved all of its primary objectives: a secure authentication system with email verification, a comprehensive thyroid report management module, an interactive dashboard with real-time charts, an AI prediction engine powered by the Mistral LLM, and a thyroid health chatbot powered by Groq's LLaMA 3.1. The system was deployed to production using Vercel and Railway, making it accessible to users worldwide. A critical security vulnerability (email verification bypass) was discovered during testing and comprehensively remediated across both frontend and backend layers, demonstrating the team's commitment to security best practices.

For future enhancement, we recommend the following improvements given adequate resources: (1) implementing a doctor-side dashboard to allow physicians to monitor their patients' data and predictions, (2) adding multi-language support (particularly Arabic) to serve a broader user base, (3) developing a hybrid prediction model that combines the Keras NN with LLM analysis for improved diagnostic accuracy, (4) implementing push notifications and medication reminders, (5) adding HIPAA/GDPR compliance for deployment in regulated healthcare environments, and (6) migrating to a paid hosting tier to eliminate cold start latency and API rate limits.

---

# Chapter 8: Future Work

The following items represent planned future improvements to the ThyroCare system:

1. **Doctor Dashboard**: Develop a dedicated doctor-side interface where physicians can view their patients' reports, predictions, and symptom trends. This would include role-based access control (RBAC), patient-doctor linking, and shared treatment notes.

2. **File Upload for Lab Reports**: Implement a `POST /reports/upload` endpoint to accept uploaded lab report images (JPEG, PNG) or PDFs. The frontend already has the upload UI wired (ReportOptions component); the backend endpoint needs to be implemented with file storage (e.g., AWS S3 or Cloudinary).

3. **OCR for Report Extraction**: Integrate Optical Character Recognition (OCR) to automatically extract thyroid lab values from uploaded report images, reducing manual data entry for patients.

4. **Hybrid AI Model**: Combine the existing Keras neural network (trained on structured clinical data) with the Mistral LLM (for contextual analysis) into a hybrid prediction pipeline that leverages both statistical patterns and language understanding.

5. **Push Notifications & Reminders**: Implement web push notifications to remind patients about upcoming appointments, medication refills, and scheduled lab tests based on their profile data (`medicalInfo.nextAppointment`, `medicalInfo.refillDaysLeft`).

6. **Multi-Language Support**: Add Arabic language support for the entire user interface, making the platform accessible to a broader audience in the Middle East and North Africa region.

7. **Server-Side Pagination**: Implement cursor-based or offset-based pagination on the backend for `/reports` and `/predict/history` endpoints to handle large datasets efficiently. The frontend pagination infrastructure is already in place.

8. **Progressive Web App (PWA)**: Convert the React application into a PWA with offline support, enabling patients to view their cached dashboard data without an internet connection.

9. **Wearable Integration**: Explore integration with health wearables (e.g., smartwatches) to automatically capture physiological data (heart rate, body temperature) that could supplement thyroid health assessments.

10. **HIPAA/GDPR Compliance**: Conduct a full compliance audit and implement necessary safeguards (data encryption at rest, audit logging, consent management, data portability) for deployment in regulated healthcare environments.

---

# Bibliography

1. **React Documentation**. React — A JavaScript Library for Building User Interfaces. Facebook Open Source. https://react.dev/

2. **Vite Documentation**. Vite — Next Generation Frontend Tooling. https://vitejs.dev/

3. **Express.js Documentation**. Express — Fast, Unopinionated, Minimalist Web Framework for Node.js. https://expressjs.com/

4. **MongoDB Documentation**. MongoDB Atlas — Cloud Database Service. https://www.mongodb.com/docs/atlas/

5. **Mongoose Documentation**. Mongoose — Elegant MongoDB Object Modeling for Node.js. https://mongoosejs.com/docs/

6. **FastAPI Documentation**. FastAPI — Modern, Fast Web Framework for Building APIs with Python. https://fastapi.tiangolo.com/

7. **Mistral AI Documentation**. Mistral AI Platform. https://docs.mistral.ai/

8. **Groq Documentation**. Groq API — Fast AI Inference. https://console.groq.com/docs

9. **Meta AI**. LLaMA: Open and Efficient Foundation Language Models. https://ai.meta.com/llama/

10. **TailwindCSS Documentation**. Tailwind CSS — Rapidly Build Modern Websites Without Ever Leaving Your HTML. https://tailwindcss.com/docs

11. **JWT Introduction**. JSON Web Tokens — Introduction. https://jwt.io/introduction

12. **bcrypt.js**. bcryptjs — Optimised bcrypt in JavaScript. https://www.npmjs.com/package/bcryptjs

13. **Nodemailer**. Nodemailer — Send Emails from Node.js. https://nodemailer.com/

14. **ApexCharts**. ApexCharts — Modern & Interactive Open-source Charts. https://apexcharts.com/

15. **Formik Documentation**. Formik — Build Forms in React, Without the Tears. https://formik.org/docs/overview

16. **Yup Documentation**. Yup — JavaScript Schema Builder for Value Parsing and Validation. https://github.com/jquense/yup

17. **Vercel Documentation**. Vercel — Develop, Preview, Ship. https://vercel.com/docs

18. **Railway Documentation**. Railway — Infrastructure, Subtracted. https://docs.railway.app/

19. **American Thyroid Association**. General Information — Prevalence and Impact of Thyroid Disease. https://www.thyroid.org/media-main/press-room/

20. **Pydantic Documentation**. Pydantic — Data Validation Using Python Type Annotations. https://docs.pydantic.dev/

---

# Appendix

## Appendix A: Project File Structure

```
thyroCare/
├── BackEndLayer/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                    # MongoDB Atlas connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js       # Register, Login, Verify, Reset
│   │   │   ├── chat.controller.js       # AI chatbot (Groq/LLaMA)
│   │   │   ├── labResult.controller.js  # Lab results CRUD + bulk
│   │   │   ├── prediction.controller.js # AI prediction + history
│   │   │   ├── profile.controller.js    # Profile CRUD + account delete
│   │   │   ├── report.controller.js     # Thyroid report CRUD
│   │   │   └── symptom.controller.js    # Symptom tracking CRUD + bulk
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js       # JWT verification + email check
│   │   │   └── error.middleware.js      # Global error handler
│   │   ├── models/
│   │   │   ├── LabResult.js             # Lab result schema
│   │   │   ├── Prediction.js            # AI prediction schema
│   │   │   ├── Report.js                # Thyroid report schema
│   │   │   ├── ResetToken.js            # Password reset token schema
│   │   │   ├── Symptom.js               # Symptom tracker schema
│   │   │   └── User.js                  # User account schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── chat.routes.js
│   │   │   ├── labResult.routes.js
│   │   │   ├── prediction.routes.js
│   │   │   ├── profile.routes.js
│   │   │   ├── report.routes.js
│   │   │   └── symptom.routes.js
│   │   ├── utils/
│   │   │   ├── helpers.js               # respond() + tryCatch() helpers
│   │   │   └── sendEmail.js             # Nodemailer email sender
│   │   ├── app.js                       # Express app setup + routes
│   │   └── server.js                    # Entry point + LLM keep-alive
│   ├── .env                             # Environment variables
│   ├── package.json                     # Node.js dependencies
│   ├── vercel.json                      # Vercel deployment config
│   └── ThyroCare.postman_collection.json # API test collection
│
├── FrontEndLayer/
│   └── final_project/
│       ├── src/
│       │   ├── components/
│       │   │   ├── AboutUs/             # About page
│       │   │   ├── AiChat/              # AI chatbot interface
│       │   │   ├── Dashboard/           # Health dashboard + charts
│       │   │   ├── Footer/              # Page footer
│       │   │   ├── ForgotPassword/      # Password reset request
│       │   │   ├── Home/                # Landing page
│       │   │   ├── InsertReport/        # 17-field report form
│       │   │   ├── Layout/              # Navbar + Footer wrapper
│       │   │   ├── Login/               # Login form
│       │   │   ├── Navbar/              # Navigation bar
│       │   │   ├── NotFound/            # 404 page
│       │   │   ├── Profile/             # User profile + medical info
│       │   │   ├── ProtectedRoute/      # Auth guard
│       │   │   ├── Report/              # Report module wrapper
│       │   │   ├── ReportOptions/       # Insert/View report choice
│       │   │   ├── ResetPassword/       # New password form
│       │   │   ├── SignUp/              # Registration form
│       │   │   ├── VerifyEmail/         # Email verification handler
│       │   │   └── ViewReports/         # Report list with CRUD
│       │   ├── context/
│       │   │   └── UserContext.jsx       # Global auth state
│       │   ├── services/
│       │   │   ├── api.js               # Axios singleton + interceptors
│       │   │   ├── authService.js       # Auth API calls
│       │   │   ├── chatService.js       # Chat + prediction API calls
│       │   │   ├── dashboardService.js  # Dashboard data fetching
│       │   │   ├── pdfService.js        # PDF generation
│       │   │   └── reportService.js     # Report CRUD API calls
│       │   ├── App.jsx                  # Router configuration
│       │   ├── App.css                  # App styles
│       │   ├── index.css                # Global styles
│       │   └── main.jsx                 # React entry point + Toaster
│       ├── index.html                   # HTML entry point
│       ├── package.json                 # Frontend dependencies
│       ├── vite.config.js               # Vite configuration
│       └── vercel.json                  # Vercel SPA config
│
├── LLMLayer/
│   ├── main.py                          # FastAPI app + /predict endpoint
│   ├── medical_model.keras              # Trained Keras NN model
│   ├── num_imputer.pkl                  # Numerical imputer
│   ├── cat_imputer.pkl                  # Categorical imputer
│   ├── ohe_encoder.pkl                  # One-Hot Encoder
│   ├── scaler.pkl                       # StandardScaler
│   ├── label_encoder.pkl               # Label encoder
│   ├── requirements.txt                 # Python dependencies
│   ├── Procfile                         # Railway deployment config
│   └── test_gemini.py                   # Gemini API test script
│
└── Reports&Tests&Logs/
    ├── BackEndReports/
    │   ├── api_documentation.md         # Full NN API documentation
    │   └── Model_integration_report.md  # Model integration report
    ├── FrontEndReports/
    │   └── FrontEnd_analysis.MD         # Frontend analysis report
    ├── Integration_reports/
    │   ├── BackEnd_integration_plan.md
    │   ├── FrontEnd_Integration_Plan.md
    │   ├── Final_Integration_Report.md  # Consolidated integration report
    │   ├── report_of_frontend_setup.md
    │   ├── report_of_schema_alignment.md
    │   ├── report_of_authentication_flow.md
    │   ├── report_of_core_crud_integration.md
    │   ├── report_of_dashboard_integration.md
    │   └── report_of_polish.md
    ├── Model_test_samples/
    │   ├── samples.txt                  # Test patient data samples
    │   ├── test_api.py                  # Automated API test script
    │   ├── testing_apis_results.md      # Test results
    │   └── server_log.txt              # Server logs during testing
    ├── Security_Report_Email_Verification.md
    └── porject_documentation/
        └── Project_Documentation.md     # This file
```

## Appendix B: Key Pseudocode — Prediction Controller

```
FUNCTION predict(request):
    userId ← request.user.id  (from JWT middleware)

    // 1. Fetch all patient data from MongoDB in parallel
    [user, latestReport, symptomDoc] ← AWAIT Promise.all([
        User.findById(userId),
        Report.findOne({ patientId: userId }).sort({ createdAt: -1 }),
        Symptom.findOne({ patientId: userId })
    ])

    IF user NOT found:
        RETURN 404 "User not found"

    IF latestReport NOT found:
        RETURN 400 "No report found. Please submit a report first."

    // 2. Get latest symptom record
    latestSymptom ← last element of symptomDoc.records (or null)

    // 3. Build patient_data payload from DB data
    patientData ← {
        age: user.age,
        gender: capitalize(user.gender),
        tsh: latestReport.thyroidFunction.tsh,
        freeT3: latestReport.thyroidFunction.freeT3,
        freeT4: latestReport.thyroidFunction.freeT4,
        // ... all other fields from report and symptoms
    }

    // 4. Call LLM microservice
    llmResponse ← HTTP POST to LLM_URL/predict
        with body: { patient_data: patientData }
        with timeout: 30 seconds

    IF llmResponse NOT OK:
        RETURN 502 "LLM service error"

    // 5. Extract fields from LLM response
    diagnosis ← llmResponse.diagnosis
    severity ← llmResponse.severity
    confidence ← llmResponse.confidence
    healthScore ← llmResponse.healthScore
    recommendations ← llmResponse.recommendations

    // 6. Persist prediction in MongoDB
    saved ← Prediction.create({
        patientId: userId,
        diagnosis, severity, confidence,
        healthScore, recommendations,
        inputData: patientData
    })

    // 7. Return result to frontend
    RETURN 200 {
        diagnosis, severity, confidence,
        healthScore, recommendations,
        predictionId: saved._id,
        createdAt: saved.createdAt
    }
END FUNCTION
```

## Appendix C: Key Pseudocode — LLM Prediction Endpoint (FastAPI)

```
FUNCTION predict(request):
    patient ← request.patient_data

    // 1. Build list of active symptoms
    activeSymptoms ← []
    IF patient.symptoms.fatigue: APPEND "fatigue"
    IF patient.symptoms.weightChange: APPEND "weight change"
    IF patient.symptoms.coldIntolerance: APPEND "cold intolerance"
    IF patient.symptoms.hairLoss: APPEND "hair loss"
    IF patient.symptoms.palpitations: APPEND "palpitations"
    IF patient.symptoms.anxiety: APPEND "anxiety"
    IF patient.symptoms.insomnia: APPEND "insomnia"

    // 2. Build prompt with all patient data
    prompt ← FORMAT(
        "You are a thyroid disease analysis assistant.
         Patient: Age={age}, Gender={gender}
         TSH={tsh}, FreeT3={freeT3}, FreeT4={freeT4}
         TPO={tpo}, TgAb={antiTg}, TRAb={tshr}
         Symptoms: {activeSymptoms}
         Return JSON: {diagnosis, severity, confidence, healthScore, recommendations}"
    )

    // 3. Call Mistral LLM API
    response ← MistralClient.chat.complete(
        model: "mistral-small-latest",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1  // Low = consistent outputs
    )

    // 4. Parse JSON from LLM response
    rawText ← response.choices[0].message.content
    // Strip markdown fences if present
    result ← JSON.parse(rawText)

    // 5. Return structured prediction
    RETURN {
        prediction: "{severity} {diagnosis}",
        diagnosis: result.diagnosis,
        severity: result.severity,
        confidence: result.confidence,
        healthScore: result.healthScore,
        recommendations: result.recommendations
    }
END FUNCTION
```
