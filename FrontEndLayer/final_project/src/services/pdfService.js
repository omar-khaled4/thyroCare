import api from "./api";

async function fetchLatestReport() {
    const res = await api.get("/reports");
    const reports = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
            ? res.data.data
            : [];
    if (!reports.length) return null;
    return reports.sort((a, b) => new Date(b.testDate) - new Date(a.testDate))[0];
}

function getStatus(value, min, max) {
    if (value === null || value === undefined || value === "") return { label: "N/A", color: "#999999" };
    const v = Number(value);
    if (v < min) return { label: "Low ↓", color: "#dc2626" };
    if (v > max) return { label: "High ↑", color: "#dc2626" };
    return { label: "Normal ✓", color: "#16a34a" };
}

function labRow(label, value, unit, min, max) {
    const status = getStatus(value, min, max);
    const v = value != null ? `${value} ${unit}` : "—";
    return `
    <tr>
      <td>${label}</td>
      <td><strong>${v}</strong></td>
      <td style="color:#6b7280;">${min} – ${max} ${unit}</td>
      <td><span style="background:${status.color}22;color:${status.color};font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;border:1px solid ${status.color}55;">${status.label}</span></td>
    </tr>`;
}

function symptomBar(label, value) {
    const v = Number(value) || 0;
    const color = v === 0 ? "#16a34a" : v <= 3 ? "#d97706" : v <= 6 ? "#ea580c" : "#dc2626";
    const bars = Array.from({ length: 10 }, (_, i) =>
        `<span style="display:inline-block;width:16px;height:8px;border-radius:2px;margin-right:2px;background:${i < v ? color : "#e5e7eb"};"></span>`
    ).join("");
    return `
    <tr>
      <td>${label}</td>
      <td>${bars}</td>
      <td style="color:${color};font-weight:700;">${v}/10</td>
    </tr>`;
}

function buildHTML({ user, report, prediction }) {
    const tf = report.thyroidFunction ?? {};
    const ab = report.antibodies ?? {};
    const ot = report.otherTests ?? {};
    const sy = report.symptoms ?? {};
    const recs = prediction?.recommendations ?? [];
    const hs = prediction?.healthScore ?? 0;
    const hsColor = hs >= 75 ? "#16a34a" : hs >= 50 ? "#e17100" : "#dc2626";
    const hsLabel = hs >= 75 ? "Good" : hs >= 50 ? "Needs Monitoring" : "Critical";
    const priorityColor = (p) => p === "high" ? "#dc2626" : p === "medium" ? "#d97706" : "#16a34a";
    const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    const testDate = report.testDate
        ? new Date(report.testDate).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
        : "—";

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>ThyroCare Report - ${user?.firstName ?? "Patient"}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; color: #111827; background: #fff; padding: 32px; font-size: 13px; line-height: 1.5; }
  h2 { font-size: 12px; color: #00B3A1; border-bottom: 2px solid #00B3A1; padding-bottom: 5px; margin: 20px 0 10px; text-transform: uppercase; letter-spacing: 0.07em; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
  th { background: #f3f4f6; padding: 7px 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; text-align: left; border-bottom: 2px solid #e5e7eb; }
  td { padding: 7px 10px; border-bottom: 1px solid #f0f0f0; font-size: 13px; vertical-align: middle; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 6px; }
  .card { background: #f9fafb; border-radius: 6px; padding: 10px 12px; }
  .card-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: #6b7280; }
  .card-value { font-size: 14px; font-weight: 700; margin-top: 2px; }
  .summary { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 8px; margin-bottom: 6px; }
  .sum-card { border-radius: 8px; padding: 10px; text-align: center; border: 1px solid #e5e7eb; }
  .sum-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: #6b7280; }
  @media print {
    body { padding: 16px; }
    @page { margin: 10mm; size: A4; }
  }
</style>
</head>
<body>

<!-- HEADER -->
<div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #00B3A1;padding-bottom:14px;margin-bottom:20px;">
  <div>
    <div style="font-size:26px;font-weight:700;color:#00B3A1;letter-spacing:-0.5px;">ThyroCare</div>
    <div style="font-size:11px;color:#6b7280;margin-top:3px;">AI-Assisted Thyroid Health Report</div>
  </div>
  <div style="text-align:right;font-size:12px;color:#6b7280;line-height:1.9;">
    <div><strong style="color:#111827;">Generated:</strong> ${today}</div>
    <div><strong style="color:#111827;">Test Date:</strong> ${testDate}</div>
    <div><strong style="color:#111827;">Facility:</strong> ${report.testingFacility ?? "—"}</div>
  </div>
</div>

<!-- PATIENT INFO -->
<h2>Patient Information</h2>
<div class="grid2">
  <div class="card"><div class="card-label">Full Name</div><div class="card-value">${user?.firstName ?? ""} ${user?.lastName ?? ""}</div></div>
  <div class="card"><div class="card-label">Gender</div><div class="card-value" style="text-transform:capitalize;">${user?.gender ?? "—"}</div></div>
  <div class="card"><div class="card-label">Email</div><div class="card-value">${user?.email ?? "—"}</div></div>
  <div class="card"><div class="card-label">Phone</div><div class="card-value">${user?.phone ?? "—"}</div></div>
</div>

<!-- AI SUMMARY -->
<h2>AI Diagnosis Summary</h2>
<div class="summary">
  <div class="sum-card" style="background:#f0fdf4;border-color:#bbf7d0;">
    <div class="sum-label">Diagnosis</div>
    <div style="font-size:13px;font-weight:700;margin-top:4px;">${prediction?.diagnosis ?? "—"}</div>
  </div>
  <div class="sum-card" style="background:#f0fdf4;border-color:#bbf7d0;">
    <div class="sum-label">Severity</div>
    <div style="font-size:13px;font-weight:700;margin-top:4px;">${prediction?.severity ?? "—"}</div>
  </div>
  <div class="sum-card" style="background:${hsColor}11;border-color:${hsColor}55;">
    <div class="sum-label">Health Score</div>
    <div style="font-size:22px;font-weight:700;color:${hsColor};margin-top:2px;">${hs}%</div>
    <div style="font-size:11px;color:${hsColor};font-weight:600;">${hsLabel}</div>
  </div>
  <div class="sum-card" style="background:#f0fdfc;border-color:#99f6e4;">
    <div class="sum-label">AI Confidence</div>
    <div style="font-size:22px;font-weight:700;color:#00B3A1;margin-top:2px;">${Math.round((prediction?.confidence ?? 0) * 100)}%</div>
  </div>
</div>

<!-- THYROID FUNCTION -->
<h2>Thyroid Function Tests</h2>
<table>
  <thead><tr><th>Test</th><th>Result</th><th>Normal Range</th><th>Status</th></tr></thead>
  <tbody>
    ${labRow("TSH", tf.tsh, "mIU/L", 0.4, 4.0)}
    ${labRow("Free T3", tf.freeT3, "pg/mL", 2.3, 4.2)}
    ${labRow("Free T4", tf.freeT4, "ng/dL", 0.8, 1.8)}
    ${labRow("Total T3", tf.totalT3, "ng/dL", 0.8, 2.0)}
    ${labRow("Total T4", tf.totalT4, "μg/dL", 5.0, 12.0)}
  </tbody>
</table>

<!-- ANTIBODIES -->
<h2>Thyroid Antibody Tests</h2>
<table>
  <thead><tr><th>Test</th><th>Result</th><th>Normal Range</th><th>Status</th></tr></thead>
  <tbody>
    ${labRow("TPO Antibodies", ab.tpo, "IU/mL", 0, 35)}
    ${labRow("Thyroglobulin Antibodies (TgAb)", ab.antiTg, "IU/mL", 0, 20)}
    ${labRow("TSH Receptor Antibodies (TRAb)", ab.tshr, "IU/L", 0, 1.75)}
  </tbody>
</table>

<!-- OTHER TESTS -->
<h2>Other Relevant Tests</h2>
<table>
  <thead><tr><th>Test</th><th>Result</th><th>Normal Range</th><th>Status</th></tr></thead>
  <tbody>
    ${labRow("Thyroglobulin", ot.thyroglobulin, "ng/mL", 1.5, 38.5)}
    ${labRow("Calcitonin", ot.calcitonin, "pg/mL", 0, 10)}
    ${labRow("Reverse T3", ot.reverseT3, "ng/dL", 9, 25)}
  </tbody>
</table>

<!-- SYMPTOMS -->
<h2>Reported Symptoms</h2>
<table>
  <thead><tr><th>Symptom</th><th>Severity (0 = None, 10 = Severe)</th><th>Score</th></tr></thead>
  <tbody>
    ${symptomBar("Fatigue", sy.fatigue)}
    ${symptomBar("Weight Change", sy.weightChange)}
    ${symptomBar("Cold Intolerance", sy.coldIntolerance)}
    ${symptomBar("Hair Loss", sy.hairLoss)}
    ${symptomBar("Palpitations", sy.palpitations)}
    ${symptomBar("Anxiety", sy.anxiety)}
    ${symptomBar("Insomnia", sy.insomnia)}
  </tbody>
</table>

${recs.length > 0 ? `
<!-- RECOMMENDATIONS -->
<h2>AI Recommended Actions</h2>
${recs.map((r, i) => `
<div style="display:flex;gap:10px;align-items:flex-start;padding:9px 0;border-bottom:1px solid #f0f0f0;">
  <div style="min-width:22px;height:22px;background:#00B3A1;color:#fff;border-radius:50%;text-align:center;line-height:22px;font-size:11px;font-weight:700;flex-shrink:0;">${i + 1}</div>
  <div>
    <span style="font-size:13px;font-weight:600;">${r.action}</span>
    <span style="margin-left:6px;background:${priorityColor(r.priority)}18;color:${priorityColor(r.priority)};font-size:10px;font-weight:700;padding:1px 7px;border-radius:20px;border:1px solid ${priorityColor(r.priority)}44;text-transform:uppercase;">${r.priority}</span>
    ${r.reason ? `<div style="font-size:12px;color:#6b7280;margin-top:2px;">${r.reason}</div>` : ""}
  </div>
</div>`).join("")}
` : ""}

<!-- DISCLAIMER -->
<div style="margin-top:28px;background:#fff5f5;border:2px solid #fecaca;border-radius:8px;padding:14px 18px;">
  <div style="font-size:12px;font-weight:700;color:#dc2626;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.05em;">⚠️ Medical Disclaimer</div>
  <div style="font-size:12px;color:#7f1d1d;line-height:1.7;">
    This report is generated by an AI-assisted system and is intended for <strong>informational purposes only</strong>.
    It does <strong>not</strong> constitute a medical diagnosis and should <strong>not</strong> replace a consultation with a qualified healthcare professional.
    The AI analysis is based solely on the data entered and may not reflect your complete medical picture.
    Always seek the advice of your physician or endocrinologist regarding your thyroid condition, symptoms, and treatment options.
  </div>
</div>

<!-- FOOTER -->
<div style="margin-top:20px;text-align:center;font-size:11px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:12px;">
  ThyroCare AI Health Platform &nbsp;|&nbsp; Generated on ${today} &nbsp;|&nbsp; For informational use only
</div>

</body>
</html>`;
}

export async function downloadMedicalReport({ user, prediction, onStart, onEnd }) {
    try {
        onStart?.();

        const report = await fetchLatestReport();
        if (!report) {
            alert("No report found. Please submit a thyroid report first.");
            onEnd?.();
            return;
        }

        const html = buildHTML({ user, report, prediction });

        // Open in new window and trigger print dialog (user saves as PDF)
        const win = window.open("", "_blank");
        if (!win) {
            alert("Please allow popups for this site to generate the PDF.");
            onEnd?.();
            return;
        }

        win.document.open();
        win.document.write(html);
        win.document.close();

        // Wait for full render then print
        setTimeout(() => {
            win.focus();
            win.print();
        }, 800);

    } catch (err) {
        
        alert("Failed to generate report. Please try again.");
    } finally {
        onEnd?.();
    }
}