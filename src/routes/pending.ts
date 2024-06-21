/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable max-len */
import { client } from '@src/config/whatsAppClient';
import { User, fetchUserData, formatMessage, sendMessage } from '@src/helpers/helpers';
import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { discorduserid, message }: { discorduserid: string; message: string } = req.body;

    if(!discorduserid || !message) {
      return res.status(400).send({ error: 'Missing parameters' });
    }

    const userData: User = await fetchUserData(discorduserid);

    if(userData){
      const { cleanedPhoneNumber, formattedMessage } = formatMessage(message, userData);

      const result = await sendMessage(client, cleanedPhoneNumber, formattedMessage);

      return res.status(200).send(result);
    }

    // eslint-disable-next-line no-console
    console.error('Discord user ID not found:', discorduserid);
    res.status(404).send({ error: 'Discord user ID not found' });
  } catch (error) {
    return res.status(500).send({ error: 'Internal server error' });
  }

});

export default router;
