import { createTransport, Transporter } from 'nodemailer';
import logging from './logging';

const logger = logging.getLogger('Email');

let transporter: Transporter | undefined;

export interface EmailConfig{
  host: string
  port: number
  secure: boolean
  username: string
  password: string
}

function init(config: EmailConfig): void {
  const {
    host, port, secure, username, password,
  } = config;

  transporter = createTransport({
    host, port, secure, auth: { user: username, pass: password },
  });

  transporter.on('error', (e) => {
    logger.error('Error occurred when sending email:');
    logger.error(e);
  });
}

function close(): void {
  logger.debug('Closing email service...');
  transporter?.close();
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const _default = {
  send: transporter?.sendMail.bind(transporter),
  init,
  close,
};

export default _default;
__blognode.email = _default;
