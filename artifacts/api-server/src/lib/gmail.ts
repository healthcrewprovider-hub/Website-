import nodemailer from "nodemailer";

function createTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variables."
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function sendEmail({
  to,
  subject,
  body,
  attachment,
}: {
  to: string;
  subject: string;
  body: string;
  attachment?: { filename: string; mimeType: string; data: Buffer };
}) {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    html: body,
    ...(attachment && {
      attachments: [
        {
          filename: attachment.filename,
          content: attachment.data,
          contentType: attachment.mimeType,
        },
      ],
    }),
  });
}
