/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable node/no-extraneous-import */
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import { SystemError } from './types/types';
import {client} from './config/whatsAppClient';
const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

import sendMessageRoute from './routes/sendMessage';
import pendingRoute from './routes/pending';
// import followupRoute from './routes/followup';
// import receiveImageAndJSONRoute from './routes/receiveImageAndJSON';


client.on('ready', () => {
  console.log('Client is ready!');
});

app.use('/send-message', sendMessageRoute);
app.use('/pending', pendingRoute);
// app.use('/followup', followupRoute);
// app.use('/receive-image-and-json', receiveImageAndJSONRoute);
// const client = new Client({
//   authStrategy: new LocalAuth(),
//   puppeteer: {
//     headless: true,
//   },
// });

client.on('ready', () => {
  console.log('Client is ready!');
});

const port = 5000;
const startServer = (port: number) => app.listen(port, () => {
  console.log(`Server started on port ${port}`);
}).on('error', (err: SystemError) => {
  console.log(err);
  if (err.code === 'EADDRINUSE') {
    console.log('Address in use, retrying...');
    setTimeout(() => {
      startServer(port);
    }, 1000);
  }
});

startServer(port);

process.on('SIGINT', async () => {
  console.log('Closing WhatsApp client...');

  await client.destroy();
  // eslint-disable-next-line no-process-exit
  process.exit(0);
});
