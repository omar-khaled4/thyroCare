# ThyroCare Unit Testing Report

This report outlines the unit tests conducted on the core logic of the ThyroCare platform, specifically targeting the Backend API (Node.js/Express) and the Machine Learning Layer (Python/FastAPI).

## Overview

All tests were performed in isolated environments. External dependencies, such as the database and the machine learning model inference, were mocked to ensure consistent results, fast execution times, and protection of API quotas. 

**Overall Status**: **13 / 13 Tests Passed (100%)**

---

## Backend Layer (Node.js / Express)

### Testing Framework: Jest & Supertest
The following table details the tests conducted on the primary controllers handling user authentication and prediction data routing.

| Module / Controller | Function Tested | Test Case / Scenario | Result |
| :--- | :--- | :--- | :--- |
| `auth.controller.js` | `login()` | Rejects login if email or password are missing (Returns 400) | **PASS** 🟢 |
| `auth.controller.js` | `login()` | Rejects login if user does not exist in the database (Returns 401) | **PASS** 🟢 |
| `auth.controller.js` | `login()` | Prevents login if the user's email is not yet verified (Returns 403) | **PASS** 🟢 |
| `auth.controller.js` | `login()` | Authenticates successfully and returns JWT token when credentials are valid | **PASS** 🟢 |
| `auth.controller.js` | `register()` | Prevents registration if the email is already in use (Returns 400) | **PASS** 🟢 |
| `auth.controller.js` | `register()` | Registers user successfully and triggers verification email logic | **PASS** 🟢 |
| `prediction.controller.js` | `predict()` | Rejects prediction request if no patient lab report is found (Returns 400) | **PASS** 🟢 |
| `prediction.controller.js` | `predict()` | Handles successful prediction from ML model, saves to DB, and returns data | **PASS** 🟢 |
| `prediction.controller.js` | `predict()` | Handles ML model service unavailability gracefully (Returns 503) | **PASS** 🟢 |
| `prediction.controller.js` | `getPredictionHistory()` | Retrieves and returns a list of past predictions for the logged-in user | **PASS** 🟢 |

---

## Machine Learning Layer (Python / FastAPI)

### Testing Framework: Pytest & FastAPI TestClient
The following table details the tests conducted on the ML API, focusing on data formatting, model inference simulation, and error handling.

| Module / Script | Function Tested | Test Case / Scenario | Result |
| :--- | :--- | :--- | :--- |
| `main.py` | `health()` | Verifies that the API health check endpoint returns status 200 OK | **PASS** 🟢 |
| `main.py` | `predict()` | Simulates model inference on patient data and parses diagnosis/recommendations successfully | **PASS** 🟢 |
| `main.py` | `predict()` | Verifies error handling (Returns 500) if the model returns unparseable or invalid data formats | **PASS** 🟢 |

---

### Conclusion
The core business logic across both the backend orchestration layer and the machine learning inference layer has been successfully validated. All edge cases related to authentication, data availability, and service communication function as expected.
