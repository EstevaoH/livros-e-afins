import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  resetLink: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  resetLink,
}) => (
  <div style={styles.container}>
    <h1 style={styles.heading}>Redefinição de Senha</h1>
    <p style={styles.text}>Olá {firstName},</p>
    <p style={styles.text}>
      Recebemos uma solicitação para redefinir a senha da sua conta. Clique no link abaixo para criar uma nova senha:
    </p>
    <a href={resetLink} style={styles.button}>
      Redefinir Senha
    </a>
    <p style={styles.text}>
      Se você não solicitou a redefinição de senha, ignore este e-mail.
    </p>
    <p style={styles.footer}>
      Atenciosamente,<br />
      Equipe de Suporte
    </p>
  </div>
);

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  heading: {
    color: '#333',
    fontSize: '24px',
    marginBottom: '20px',
  },
  text: {
    color: '#555',
    fontSize: '16px',
    lineHeight: '1.5',
    marginBottom: '20px',
  },
  button: {
    display: 'inline-block',
    backgroundColor: '#0070f3',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '16px',
    marginBottom: '20px',
  },
  footer: {
    color: '#777',
    fontSize: '14px',
    marginTop: '20px',
  },
};