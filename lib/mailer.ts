import { Resend } from "resend";

export async function sendMail(options: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY not configured");

  const resend = new Resend(apiKey);
  return resend.emails.send({
    from: "Rachra.com <onboarding@resend.dev>",
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}
