import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      firstName,
      lastName,
      businessName,
      businessEmail,
      ownerNumber,
      salonNumber,
      phoneNumber,   // optional
      cityArea,
      message,       // optional
    } = req.body;

    let transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'recipient_email@example.com',
      subject: `Demo Request from ${firstName} ${lastName}`,
      html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #222; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 24px; background-color: #fff;">
      <h1 style="color: #5E38D1; font-weight: 700; border-bottom: 3px solid #5E38D1; padding-bottom: 10px; margin-bottom: 24px; font-size: 28px;">
        New Demo Request for Trakky
      </h1>
      <p style="font-size: 18px; margin-bottom: 24px;">
        A new demo request has been submitted. Here are the details:
      </p>
      <table style="width: 100%; border-collapse: collapse; font-size: 16px;">
        <tbody>
          <tr style="background-color: #f8f8f8;">
            <td style="padding: 12px 16px; font-weight: 600; border: 1px solid #ddd; width: 40%;">Name</td>
            <td style="padding: 12px 16px; border: 1px solid #ddd;">${firstName} ${lastName}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-weight: 600; border: 1px solid #ddd;">Business Name</td>
            <td style="padding: 12px 16px; border: 1px solid #ddd;">${businessName}</td>
          </tr>
          <tr style="background-color: #f8f8f8;">
            <td style="padding: 12px 16px; font-weight: 600; border: 1px solid #ddd;">Business Email</td>
            <td style="padding: 12px 16px; border: 1px solid #ddd;">${businessEmail}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-weight: 600; border: 1px solid #ddd;">Owner Number</td>
            <td style="padding: 12px 16px; border: 1px solid #ddd;">${ownerNumber}</td>
          </tr>
          <tr style="background-color: #f8f8f8;">
            <td style="padding: 12px 16px; font-weight: 600; border: 1px solid #ddd;">Salon Number</td>
            <td style="padding: 12px 16px; border: 1px solid #ddd;">${salonNumber}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-weight: 600; border: 1px solid #ddd;">Additional Phone (Optional)</td>
            <td style="padding: 12px 16px; border: 1px solid #ddd;">${phoneNumber || 'N/A'}</td>
          </tr>
          <tr style="background-color: #f8f8f8;">
            <td style="padding: 12px 16px; font-weight: 600; border: 1px solid #ddd;">City / Area</td>
            <td style="padding: 12px 16px; border: 1px solid #ddd;">${cityArea}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-weight: 600; border: 1px solid #ddd;">Message</td>
            <td style="padding: 12px 16px; border: 1px solid #ddd;">${message || 'No additional message provided.'}</td>
          </tr>
        </tbody>
      </table>
      <p style="margin-top: 32px; font-size: 14px; color: #555; font-style: italic;">
        Please respond promptly to the request.<br />
        Regards,<br />
        <strong>The Trakky Team</strong>
      </p>
    </div>
  `,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error sending email' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
