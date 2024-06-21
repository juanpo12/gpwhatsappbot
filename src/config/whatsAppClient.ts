/* eslint-disable no-console */
import { Client, LocalAuth } from 'whatsapp-web.js';
import qrTerminal from 'qrcode-terminal';

export const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox'],
  },
  webVersionCache: {
    type: 'remote',
    remotePath:
      'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
  },
});

client.on('qr', (qr) => {
  console.log('Scan the QR code with your phone:');
  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  qrTerminal.generate(qr, { small: true });
});

client.initialize();

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', async (message) => {
  const isGroup = await message.getChat().then((chat) => chat.isGroup);
  console.log('ISGROUP', isGroup);
    
  if (message.body.toLowerCase() === 'estamos ready??' && !isGroup) {
    try {
      await client.sendMessage(message.from, 'Funcionando jefe 👀');
    } catch (error) {
      console.error('Error while processing message:', error);
    }
  }
});