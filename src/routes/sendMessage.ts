/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable max-len */
import express from 'express';
import { fetchUserData, formatMessage, getCurrentClient, sendMessage } from '../helpers/helpers';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { discorduserid, phoneNumber, message } = req.body;

    if(!discorduserid || !phoneNumber || !message) {
      return res.status(400).send({ error: 'Missing parameters' });
    }

    const client = await getCurrentClient();

    let user, finalPhoneNumber = phoneNumber;

    if(discorduserid){
      user = await fetchUserData(discorduserid as string);
      finalPhoneNumber = user.celular;
    }

    if(finalPhoneNumber){
      const { cleanedPhoneNumber, formattedMessage } = formatMessage(
        message as string, user || { firstName: '' },
      );

      await sendMessage(client, cleanedPhoneNumber as string, formattedMessage);
      return res.send({ message: 'Message sent successfully' });
    }

    throw new Error('User not found');
        
  } catch (error) {
    console.error('Error while processing message:', error);
    return res.status(500).send({ error: 'Error while processing message' });
  }
});


export default router;