import VerificationEmail from "../../emails/VarificationEmail";
import { resend } from "../lib/resend";

export async function sendVerificationEmail(email, username, verifyCode) {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "refero message verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "Send verification email" };
  } catch (emailError) {
    console.log("Email verification failed", emailError);

    return { success: false, message: "Failed to send verification email" };
  }
}
