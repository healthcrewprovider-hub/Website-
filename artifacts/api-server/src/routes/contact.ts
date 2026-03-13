import { Router, type IRouter } from "express";
import { sendEmail } from "../lib/gmail.js";

const router: IRouter = Router();

const RECIPIENT_EMAIL = "healthcrewprovider@gmail.com";

router.post("/contact", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      position,
      province,
      experience,
      message,
    } = req.body;

    if (!name || !email) {
      res.status(400).json({ success: false, error: "Name and email are required." });
      return;
    }

    const positionLabels: Record<string, string> = {
      lpn: "LPN (Licensed Practical Nurse)",
      psw: "PSW (Personal Support Worker)",
      hsw: "HSW (Home Support Worker)",
      rpn: "RPN (Registered Practical Nurse)",
      other: "Other",
    };

    const provinceLabels: Record<string, string> = {
      on: "Ontario",
      bc: "British Columbia",
      ab: "Alberta",
      qc: "Quebec",
      mb: "Manitoba",
      sk: "Saskatchewan",
      ns: "Nova Scotia",
    };

    const experienceLabels: Record<string, string> = {
      "<1": "Less than 1 year",
      "1-3": "1–3 years",
      "3-5": "3–5 years",
      "5-10": "5–10 years",
      "10+": "10+ years",
    };

    const htmlBody = `
<html>
<body style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #1e3a5f, #0f6b3b); padding: 30px; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 22px;">New Job Application</h1>
    <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Health Crew Provider – Website Submission</p>
  </div>
  <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b; width: 40%;">Full Name</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Email Address</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${email}" style="color: #1e3a5f;">${email}</a></td>
      </tr>
      ${phone ? `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Phone Number</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${phone}</td>
      </tr>` : ""}
      ${position ? `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Position Applying For</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${positionLabels[position] || position}</td>
      </tr>` : ""}
      ${province ? `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Province</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${provinceLabels[province] || province}</td>
      </tr>` : ""}
      ${experience ? `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Years of Experience</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${experienceLabels[experience] || experience}</td>
      </tr>` : ""}
      ${message ? `
      <tr>
        <td style="padding: 10px 0; font-weight: bold; color: #64748b; vertical-align: top;">Message / Cover Letter</td>
        <td style="padding: 10px 0; white-space: pre-wrap;">${message}</td>
      </tr>` : ""}
    </table>
    <div style="margin-top: 24px; padding: 16px; background: #e8f5e9; border-radius: 6px; border-left: 4px solid #27ae60;">
      <p style="margin: 0; font-size: 13px; color: #2d6a4f;">
        <strong>Note:</strong> The applicant may also attach their resume via email directly to 
        <a href="mailto:${RECIPIENT_EMAIL}" style="color: #1e3a5f;">${RECIPIENT_EMAIL}</a>
      </p>
    </div>
  </div>
</body>
</html>`;

    await sendEmail({
      to: RECIPIENT_EMAIL,
      subject: `New Application from ${name} – ${positionLabels[position] || "Healthcare Role"}`,
      body: htmlBody,
    });

    res.json({ success: true, message: "Application submitted successfully." });
  } catch (err) {
    console.error("Error sending contact email:", err);
    res.status(500).json({ success: false, error: "Failed to send application. Please try again or email us directly." });
  }
});

export default router;
