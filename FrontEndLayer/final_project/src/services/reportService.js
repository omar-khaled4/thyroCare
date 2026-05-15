import api from "./api";

/**
 * Fetch all reports
 * @returns {Promise<Array>} List of reports
 * @throws {Error} If the request fails
 */
export const getReports = async () => {
  try {
    const response = await api.get("/reports");
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new report
 * @param {Object} reportData - Data for the new report
 * @returns {Promise<Object>} Created report
 * @throws {Error} If the request fails
 */
export const createReport = async (reportData) => {
  try {
    const response = await api.post("/reports", reportData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing report
 * @param {string|number} id - Report ID
 * @param {Object} reportData - Updated data for the report
 * @returns {Promise<Object>} Updated report
 * @throws {Error} If the request fails
 */
export const updateReport = async (id, reportData) => {
  try {
    const response = await api.put(`/reports/${id}`, reportData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a report by ID
 * @param {string|number} id - Report ID
 * @returns {Promise<void>}
 * @throws {Error} If the request fails
 */
export const deleteReport = async (id) => {
  try {
    await api.delete(`/reports/${id}`);
  } catch (error) {
    throw error;
  }
};