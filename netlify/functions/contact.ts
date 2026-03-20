import type { Handler } from "@netlify/functions";
import busboy from "busboy";
import nodemailer from "nodemailer";
import { Readable } from "stream";

const RECIPIENT_EMAIL = "healthcrewprovider@gmail.com";

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

interface ParsedForm {
  fields: Record<string, string>;
  resume?: { filename: string; mimeType: string; data: Buffer };
}

function parseMultipart(
  contentType: string,
  rawBody: Buffer
): Promise<ParsedForm> {
  return new Promise((resolve, reject) => {
    const fields: Record<string, string> = {};
    let resume: ParsedForm["resume"] | undefined;

    const bb = busboy({ headers: { "content-type": contentType } });

    bb.on("field", (name, value) => {
      fields[name] = value;
    });

    bb.on("file", (name, file, info) => {
      const chunks: Buffer[] = [];
      file.on("data", (chunk: Buffer) => chunks.push(chunk));
      file.on("end", () => {
        if (name === "resume" && info.filename) {
          resume = {
            filename: info.filename,
            mimeType: info.mimeType,
            data: Buffer.concat(chunks),
          };
        }
      });
    });

    bb.on("finish", () => resolve({ fields, resume }));
    bb.on("error", reject);

    const stream = Readable.from(rawBody);
    stream.pipe(bb);
  });
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const contentType = event.headers["content-type"] || "";
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body || "", "base64")
    : Buffer.from(event.body || "");

  let parsed: ParsedForm;
  try {
    parsed = await parseMultipart(contentType, rawBody);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: "Failed to parse form." }),
    };
  }

  const { fields, resume } = parsed;
  const { name, email, phone, position, province, experience, message } = fields;

  if (!name || !email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: "Name and email are required." }),
    };
  }

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
        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${email}">${email}</a></td>
      </tr>
      ${phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:bold;color:#64748b;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">${phone}</td></tr>` : ""}
      ${position ? `<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:bold;color:#64748b;">Position</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">${positionLabels[position] || position}</td></tr>` : ""}
      ${province ? `<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:bold;color:#64748b;">Province</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">${provinceLabels[province] || province}</td></tr>` : ""}
      ${experience ? `<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:bold;color:#64748b;">Experience</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">${experienceLabels[experience] || experience}</td></tr>` : ""}
      ${message ? `<tr><td style="padding:10px 0;font-weight:bold;color:#64748b;vertical-align:top;">Message</td><td style="padding:10px 0;white-space:pre-wrap;">${message}</td></tr>` : ""}
    </table>
    ${resume ? `<div style="margin-top:24px;padding:16px;background:#e8f5e9;border-radius:6px;border-left:4px solid #27ae60;"><p style="margin:0;font-size:13px;color:#2d6a4f;"><strong>Resume attached:</strong> ${resume.filename} (${(resume.data.length / 1024).toFixed(1)} KB)</p></div>` : ""}
  </div>
</body>
</html>`;

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Email service not configured." }),
    };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailUser, pass: gmailPass },
  });

  try {
    await transporter.sendMail({
      from: gmailUser,
      to: RECIPIENT_EMAIL,
      subject: `New Application from ${name} – ${positionLabels[position] || "Healthcare Role"}`,
      html: htmlBody,
      ...(resume && {
        attachments: [
          {
            filename: resume.filename,
            content: resume.data,
            contentType: resume.mimeType,
          },
        ],
      }),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Application submitted successfully." }),
    };
  } catch (err) {
    console.error("Email error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Failed to send application. Please try again or email us directly." }),
    };
  }
};
