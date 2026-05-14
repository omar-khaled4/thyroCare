# FrontEnd Integration Plan

This document outlines the step-by-step plan for integrating the ThyroCare FrontEnd with the BackEnd API, based on the FrontEnd analysis and the provided Postman API collection.

## 1. Endpoint Mapping

The following mappings connect the existing React UI components to the available backend endpoints.

### Authentication & User Management
* **Login**
  * **Method/Path:** `POST /auth/login`
  * **Component:** `Login.jsx`
  * **Request:** `{ "email", "password" }`
  * **Response:** JWT token and user details.
* **Registration**
  * **Method/Path:** `POST /auth/register`
  * **Component:** `SignUp.jsx`
  * **Request:** `{ "firstName", "lastName", "email", "password", "gender", "dateOfBirth", "phone" }`
  * **Response:** Created user details / success message.
* **Get Current User**
  * **Method/Path:** `GET /auth/me`
  * **Component:** `UserContext.jsx` (on mount)
  * **Request:** Header: `Authorization: Bearer {{token}}`
  * **Response:** Authenticated user data.

### User Profile
* **Get Profile**
  * **Method/Path:** `GET /profile`
  * **Component:** `Profile.jsx`, `Dashboard.jsx` (for info cards like Condition, Medication)
  * **Request:** Header Auth
  * **Response:** User details including `medicalInfo`.
* **Update Profile**
  * **Method/Path:** `PUT /profile`
  * **Component:** `Profile.jsx` (Edit drawer)
  * **Request:** `{ "name", "profile": {...}, "medicalInfo": {...} }`
  * **Response:** Updated profile.

### Reports Management
* **Get All Reports**
  * **Method/Path:** `GET /reports`
  * **Component:** `ViewReports.jsx` (table view)
  * **Request:** Header Auth
  * **Response:** Array of report objects.
* **Create Report**
  * **Method/Path:** `POST /reports`
  * **Component:** `InsertReport.jsx`
  * **Request:** `{ "testDate", "testingFacility", "thyroidFunction": {...}, "antibodies": {...}, "otherTests": {...}, "symptoms": {...} }`
  * **Response:** Created report.
* **Update Report**
  * **Method/Path:** `PUT /reports/{{reportId}}`
  * **Component:** `ViewReports.jsx` (Edit drawer)
  * **Request:** Partial report object.
  * **Response:** Updated report.
* **Delete Report**
  * **Method/Path:** `DELETE /reports/{{reportId}}`
  * **Component:** `ViewReports.jsx`
  * **Request:** Header Auth
  * **Response:** Success confirmation.

### Dashboard Charts (Lab Results & Symptoms)
* **T3 / T4 / TSH Chart Data**
  * **Method/Path:** `GET /lab-results/{{type}}` (e.g., `t3`, `t4`, `tsh`)
  * **Component:** `Dashboard.jsx` (ApexCharts series)
  * **Request:** Header Auth
  * **Response:** Array of date-value pairs.
* **Symptom Tracker Chart Data**
  * **Method/Path:** `GET /symptoms`
  * **Component:** `Dashboard.jsx` (Radar chart)
  * **Request:** Header Auth
  * **Response:** Array of symptom severity objects per date.

### AI Chatbot
* **Send Message**
  * **Method/Path:** `POST /chat`
  * **Component:** `AiChat.jsx`
  * **Request:** `{ "message": "string" }`
  * **Response:** AI response string.

### Neural Network Predictions
* **Run Prediction**
  * **Method/Path:** `POST /predict`
  * **Component:** Backend integration / Post-Report Submission
  * **Request:** `{ "patient_data": {...} }`
  * **Response:** Thyroid diagnosis prediction and Health Stability Score (for Dashboard).

---

## 2. Missing Endpoints

While the Postman collection covers most core operations, the frontend UI implies the need for the following endpoints that are not explicitly clear or fully structured in the collection:

* **Dashboard Recommended Actions:** The Dashboard has a "Recommended Actions" section. There is no specific endpoint for this. It should either be a dedicated `GET /dashboard/recommendations` endpoint or included as a field in the response of `POST /predict` or `GET /profile`.
* **Report Field Mappings:** The frontend's `InsertReport` collects fields like `Calcitonin`, `ReverseT3`, and various symptom metrics (e.g., `TemperatureSensitivity`, `SkinChanges`) that do not perfectly align with the existing `POST /reports` JSON body structure. The backend schema needs to support these new fields, or the frontend payload must be mapped properly.
* **Bulk Lab Results GET:** The dashboard fetches T3, T4, and TSH independently. A unified `GET /lab-results` that returns all grouped by date would be more efficient for the frontend.

---

## 3. Warnings & Notes

### Tagged by Layer

* **[Frontend] ⚠️ CRITICAL:** The frontend currently has NO real backend integration. All data is hardcoded or stored in `localStorage`.
* **[Frontend] 📝 NOTE:** The `"about us"` path contains a space, which is unconventional.
* **[Both] ⚠️ WARNING:** The `AiChat` route (`/chat`) is public. Unauthenticated users shouldn't typically have access to an API-connected AI chatbot to prevent abuse.
* **[Frontend] ⚠️ IMPORTANT:** There is no centralized API service layer (e.g., Axios instance).
* **[Frontend] 📝 NOTE:** `ProtectedRoute` relies on `localStorage` only, not React context.
* **[Frontend] ⚠️ WARNING:** The "Insert Photo/PDF" link in `ReportOptions` is a dead link (missing `to` prop).
* **[Both] ⚠️ WARNING:** The frontend uses different JSON keys for fields (e.g., `HairSkinChanges` vs `hairLoss`) compared to the backend APIs.

---

## 4. Recommended Fixes

### Frontend Layer Fixes
1. **Centralized API Service:** Create `src/services/api.js` using Axios with a base URL defined in `.env`. Add interceptors to automatically attach the JWT `Bearer` token to headers and handle 401 Unauthorized responses.
2. **Fix Runtime Crashes:** Implement the missing `Delete()` functions in `AiChat.jsx` (line 42) and `ViewReports.jsx` (line 262).
3. **Connect State to API:** Remove hardcoded arrays in `Dashboard.jsx`, `ViewReports.jsx`, and `AiChat.jsx`. Replace them with `useState` and `useEffect` hooks that call the backend APIs.
4. **Form Submissions:** Update `Login.jsx`, `SignUp.jsx`, `InsertReport.jsx`, and `Profile.jsx` to send POST/PUT requests using Axios instead of storing/logging values.
5. **Add Validation:** Add missing Yup validation schemas to `InsertReport.jsx`.
6. **Error/Loading Handling:** Implement a global toast notification system (e.g., `react-hot-toast`) to show success/error messages for API calls.
7. **Fix Route Typos:** Change `/about us` to `/about-us` and fix typos like `ysxis` in chart configurations.

### Backend Layer Fixes
1. **Payload Alignment:** Update backend schemas (e.g., Reports, Symptoms, Predictions) to exactly match the data collected by the frontend forms, or provide a clear data mapping layer.
2. **Missing Dashboard Data:** Ensure the `GET /profile` or a new endpoint returns the data needed for the Dashboard info cards (Health Stability %, Current Condition, Next Appointment).
3. **Chat Auth Enforcement:** Ensure `POST /chat` strictly validates the JWT token.

---

## 5. Implementation Priorities

To proceed without blockers, development should follow this order:

1. **[High Urgency] Frontend Setup:** 
   * Create the Axios service layer (`api.js`) and environment variables.
   * Fix the crashing bugs (`Delete` functions).
2. **[High Urgency] Authentication Flow:**
   * Integrate `POST /auth/login` and `POST /auth/register`.
   * Update `UserContext` to properly use the token and `GET /auth/me`.
   * Secure the `/chat` route.
3. **[High Dependency] Schema Alignment (Backend & Frontend):**
   * Review and map the frontend `InsertReport` fields to the backend `POST /reports` endpoint. Modify backend models if necessary.
4. **[Medium Urgency] Core CRUD Integration:**
   * Wire up `ViewReports` (GET, DELETE, Edit drawer).
   * Wire up `Profile` (GET, PUT).
5. **[Medium Urgency] Dashboard Integration:**
   * Fetch lab results and symptoms for ApexCharts.
   * Fetch user medical data for the Dashboard info cards.
6. **[Low Urgency] AI Chat & NN Predictions:**
   * Implement message state in `AiChat` and wire to `POST /chat`.
   * Wire report submission to trigger `POST /predict`.
7. **[Low Urgency] Polish:**
   * Add loading spinners, error toasts, and pagination.
   * Fix the "Insert Photo/PDF" dead link.
