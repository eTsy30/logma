// test-email.ts
import * as nodemailer from 'nodemailer';

async function test() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'xxxxxxxxxxxxxxxx', // 16-значный пароль
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"Test" <your-email@gmail.com>',
      to: 'recipient@example.com',
      subject: 'Test',
      html: '<h1>Test</h1>',
    });
    console.log('✅ Sent:', info.messageId);
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

test();
