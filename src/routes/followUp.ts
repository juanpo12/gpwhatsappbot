/* eslint-disable max-len */
import { client } from '@src/config/whatsAppClient';
import { cleanAndFormatPhoneNumber } from '@src/helpers/cleanAndFormatPhoneNumber';
import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    if(!phoneNumber) {
      return res.status(400).send({error: '"phoneNumber" query parameter is required' });
    }
    
    const { cleanedPhoneNumber } = cleanAndFormatPhoneNumber(phoneNumber as string);

    const messages = await client.getChatById(`${cleanedPhoneNumber}@c.us`);
    
    const lastMessage = messages.lastMessage;

    const response = {
      phoneNumber: cleanedPhoneNumber,
      lastSentMessage: lastMessage.fromMe ? lastMessage.body : 'No message sent',
      lastSentMessageDateTime: lastMessage.fromMe ? lastMessage.timestamp : 'No message sent',
      lastReceivedMessage: !lastMessage.fromMe ? lastMessage.body : 'No message received',
      lastReceivedMessageDateTime: !lastMessage.fromMe ? lastMessage.timestamp : 'No message received',
    };

    return res.status(200).send(response);

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error retrieving follow-up data:', error);
    res.status(500).send({ error: 'Error retrieving follow-up data' });
  }
});