import api from "./api";
import toast from "react-hot-toast";

/**
 * GET /reports
 * Fetches all reports for the current user. Supports optional pagination
 * via ?page= and ?limit= query params (backend may ignore them if not yet
 * supported — the caller should still pass them and check data length).
 *
 * @param {number} [page=1]
 * @param {number} [limit=25]
 */
export async function getReports(page = 1, limit = 25) {
  console.log(`[reportService] Fetching reports (page: ${page}, limit: ${limit})...`);
  try {
    const { data } = await api.get("/reports", { params: { page, limit } });
    console.log("[reportService] Reports fetched successfully:", data);
    return Array.isArray(data) ? data : data.data || data.items || [];
  } catch (err) {
    console.error("[reportService] Failed to load reports:", err.message);
    toast.error(`Failed to load reports: ${err.message}`);
    throw err;
  }
}

/**
 * POST /reports
 * Creates a new thyroid report.
 */
export async function createReport(reportData) {
  console.log("[reportService] Creating new report...", reportData);
  try {
    const { data } = await api.post("/reports", reportData);
    console.log("[reportService] Report created successfully:", data);
    toast.success("Report submitted successfully!");
    return data;
  } catch (err) {
    console.error("[reportService] Failed to create report:", err.message);
    toast.error(
      err?.response?.data?.message || "Failed to create report. Please try again."
    );
    throw err;
  }
}

/**
 * PUT /reports/:id
 * Updates an existing report.
 */
export async function updateReport(id, reportData) {
  console.log(`[reportService] Updating report ${id}...`, reportData);
  try {
    const { data } = await api.put(`/reports/${id}`, reportData);
    console.log("[reportService] Report updated successfully:", data);
    toast.success("Report updated successfully!");
    return data;
  } catch (err) {
    console.error("[reportService] Failed to update report:", err.message);
    toast.error(
      err?.response?.data?.message || "Failed to update report. Please try again."
    );
    throw err;
  }
}

/**
 * DELETE /reports/:id
 * Deletes a report by its MongoDB _id.
 */
export async function deleteReport(id) {
  console.log(`[reportService] Deleting report ${id}...`);
  try {
    await api.delete(`/reports/${id}`);
    console.log("[reportService] Report deleted successfully.");
  } catch (err) {
    console.error("[reportService] Failed to delete report:", err.message);
    throw err;
  }
}