import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      secure: false,
    });

    await transporter.sendMail({
      from: 'Test App <no-reply@example.test>',
      to: 'jiritresohlavy2@gmail.com',
      subject: 'Test e-mail z Next.js',
      html: '<h1>Ahoj Jirko 👋</h1><p>Toto je testovací e-mail přes MailHog.</p>',
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
