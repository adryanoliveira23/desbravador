import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendWelcomeEmail(to: string, name: string) {
  const mailOptions = {
    from: `"Desbravador Manager" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Bem-vindo ao Desbravador Manager! 🛡️",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #D92D20; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Bem-vindo, Diretor ${name}!</h1>
        </div>
        <div style="padding: 30px; line-height: 1.6; color: #333;">
          <p>Estamos muito felizes em ter você conosco na missão de guiar nossos juvenis.</p>
          <p>Seu acesso ao painel administrativo já está liberado. Lá você encontrará:</p>
          <ul>
            <li>Gestão completa de classes</li>
            <li>Gerador de especialidades com IA</li>
            <li>Planejador de eventos inteligente</li>
          </ul>
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://desbravador-manager.vercel.app/auth" style="background-color: #D92D20; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Acessar Dashboard</a>
          </div>
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #888;">
          <p>© 2024 Desbravador Manager - Guia do Serviço</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return false;
  }
}
