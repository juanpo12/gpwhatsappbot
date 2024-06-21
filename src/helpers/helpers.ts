/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import { Client } from 'whatsapp-web.js';
import { URL } from '../constants/URL';
import { cleanAndFormatPhoneNumber } from './cleanAndFormatPhoneNumber';
import { FALLBACK_PHONE_NUMBER } from '@src/constants/numbers';

export interface User {
  user_id: number;
  full_name: string;
  username: string;
  nickname: string;
  email: string;
  user_discord_id: string;
  hearratelink?: string | null;
  youtube_id: string;
  iracing_id?: string | null;
  ea_ccount?: string | null;
  individualID: number;
  individual_id: number;
  SubmissionId: number;
  instagram: string;
  celular: string;
}

export const fetchUserData = async (discorduserid: string) => {
  try {
    const response = await fetch(`${URL}/consultaUser/private?user_discord_id=${discorduserid}`,{
      method: 'GET',
      headers: { 'accept': 'application/json' },
    });
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const users: User[] = await response.json();
        
    if(response.status === 200 && users.length > 0) {
      return users[0];
    }

    throw new Error('User not found');
  } catch (error: any) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};

export const formatMessage = (message: string, user: User) => {
  const { cleanedPhoneNumber, isValid } = cleanAndFormatPhoneNumber(user.celular || FALLBACK_PHONE_NUMBER);
  let formattedMessage = message.replace(/-/g, ' ');

  if (!isValid) {
    formattedMessage += ` Mensaje no enviado a: ${user.full_name} con numero de telefono ${cleanedPhoneNumber}.
    ${user.instagram ? `Instagram: ${user.instagram}` : ''},
    Nombre completo: ${user.full_name},
    Celular: ${user.celular}`;
  }

  return { formattedMessage, cleanedPhoneNumber };
};

export const sendMessage = async (client: Client, phoneNumber: string , message: string ) => {
  const formattedPhoneNumber = `${phoneNumber.trim()}@c.us`;
  
  try {
    await client.sendMessage(formattedPhoneNumber, message);
    return { status: 'success', message: 'Message sent successfully' };
  } catch (error) {
    console.error('Error sending message:', error);
    const errorDetails = error.response ? error.response.data : { to: phoneNumber, text: error.message };
    throw new Error(`Error sending message: ${JSON.stringify(errorDetails)}`);
  }
};