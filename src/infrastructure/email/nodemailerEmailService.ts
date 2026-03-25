import nodemailer from "nodemailer"
import { EmailService } from "../../application/ports/emailService"

export class NodemailerEmailService implements EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendStatusUpdateEmail({
    to,
    clienteNome,
    ordemId,
    novoStatus,
  }: any) {
    const info = await this.transporter.sendMail({
      from: '"Oficina" <no-reply@oficina.com>',
      to,
      subject: `Ordem #${ordemId} atualizada`,
      html: `
        <h2>Olá ${clienteNome}</h2>
        <p>Status atualizado:</p>
        <strong>${novoStatus}</strong>
      `,
    });

    console.log("Email enviado (Mailtrap):", info.messageId);
  }
}