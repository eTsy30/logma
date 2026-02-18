// test-email.ts
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

// Загружаем .env вручную
dotenv.config();

async function test() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, '');

  console.log('GMAIL_USER:', user || 'NOT SET');
  console.log('GMAIL_APP_PASSWORD length:', pass?.length || 0);

  if (!user || !pass) {
    console.error('❌ Переменные окружения не заданы!');
    console.log('Создайте .env файл с:');
    console.log('GMAIL_USER=your@gmail.com');
    console.log('GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified');

    const info = await transporter.sendMail({
      from: `"Test" <${user}>`,
      to: user,
      subject: 'Test Email',
      html: '<h1>Test</h1><p>Gmail SMTP работает!</p>',
    });
    console.log('✅ Email sent:', info.messageId);
  } catch (err: any) {
    console.error('❌ Error:', err);
  }
}

test();
