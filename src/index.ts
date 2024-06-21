/* eslint-disable no-console */
/* eslint-disable max-len */
// eslint-disable-next-line node/no-extraneous-import
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
import followupRoute from './routes/followUp';
import receiveImageAndJSONRoute from './routes/receiveImageAndJson';
import confirmationRoute from './routes/confirmation';
    
client.on('ready', () => {
  app.use('/send-message', sendMessageRoute);
  app.use('/pending', pendingRoute);
  app.use('/followup', followupRoute);
  app.use('/receive-image-and-json', receiveImageAndJSONRoute);
  app.use('/confirmation', confirmationRoute);
  console.log('Client is ready! Endpoints available: /send-message, /pending, /followup, /receive-image-and-json');
});
client.on('error', (error) => {
  console.log(error);
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
