import { sendMail } from "@/lib/send-mail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, role } = body;

    const mailOptions = {
      to: email,
      subject: "Registration Success on Epiclinx",
      html: `<h1>Congratulation ${username} on becoming a ${role} on Epiclinx platform connecting brands and creators.</h1>`,
    };

    await sendMail(mailOptions);
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error Sending Registration Confirmation Mail",
      },
      { status: 500 }
    );
  }
}
