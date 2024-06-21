/* eslint-disable max-len */
import { client } from '@src/config/whatsAppClient';
import { cleanAndFormatPhoneNumber } from '@src/helpers/cleanAndFormatPhoneNumber';
import { sendImageAndMessage } from '@src/helpers/helpers';
import { Participant } from '@src/types/types';
import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { participant } = req.body as { participant: Participant };

    if(!participant) {
      return res.status(400).send({ error: 'Missing parameters' });
    }
    const { phone, image, rank, name } = participant;

    if( typeof phone !== 'string' || !image || !rank || !name ) {
      return res.status(400).send({ error: 'Missing parameters' });
    }

    const { cleanedPhoneNumber } = cleanAndFormatPhoneNumber(phone);

    const text = `Saludos ${name}, felicidades en tu P${rank}, sube tu historia a Instagram y recuerda etiquetar a @gpesportsrd y @entrandoapits. ¡Buena suerte en tu próxima carrera!`;
        
    await sendImageAndMessage(client, `${cleanedPhoneNumber.replace(/\+/g, '')}@c.us`, image, `image_${name}`, text);
    return res.status(200).send({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Error sending image' });
  }
});

export default router;
