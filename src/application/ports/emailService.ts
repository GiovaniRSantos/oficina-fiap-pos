export interface EmailService {
  sendStatusUpdateEmail(params: {
    to: string
    clienteNome: string
    ordemId: string
    novoStatus: string
  }): Promise<void>
}