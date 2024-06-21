/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable max-len */
import express from 'express';
import { fetchUserData, formatMessage, sendMessage } from '../helpers/helpers';
import { client } from '@src/config/whatsAppClient';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { discorduserid, phoneNumber, message } = req.body;

    if(!message || (!discorduserid && !phoneNumber)) {
      return res.status(400).send({ error: 'Missing parameters. Message, phone number and discord user id are required' });
    }

    if(typeof discorduserid === 'string' && discorduserid.length > 0 || typeof discorduserid === 'number' && discorduserid > 0) {
      const user = await fetchUserData(discorduserid as string);
      if(user.celular){
        const { cleanedPhoneNumber, formattedMessage } = formatMessage(
          message as string, user || { firstName: '' },
        );
  
        await sendMessage(client, cleanedPhoneNumber, formattedMessage);
        return res.send({ message: 'Message sent successfully' });
      }
    } else if (phoneNumber) {
      console.log('falling back to phone number')
      const { cleanedPhoneNumber, formattedMessage } = formatMessage(
        message as string,
        {
          full_name: '', celular: phoneNumber,
          user_id: 0,
          username: '',
          nickname: '',
          email: '',
          user_discord_id: '',
          youtube_id: '',
          individualID: 0,
          individual_id: 0,
          SubmissionId: 0,
          instagram: '',
        },
      );
  
      await sendMessage(client, cleanedPhoneNumber, formattedMessage);
      return res.send({ message: 'Message sent successfully' });
    }

    throw new Error('User not found');
        
  } catch (error) {
    console.error('Error while processing message:', error);
    return res.status(500).send({ error: 'Error while processing message' });
  }
});


export default router;