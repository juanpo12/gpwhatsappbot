/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import { Client } from 'whatsapp-web.js';
import { client } from '../config/whatsAppClient';
import { URL } from '../constans/URL';
import { cleanAndFormatPhoneNumber } from './cleanAndFormatPhoneNumber';

const BOT_CLIENT = process.env.BOT_CLIENT;
const FALLBACK_PHONE_NUMBER = '18298870174'; // Fallback number

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

export const getCurrentClient = (): Promise<Client> => {
  return new Promise((resolve, reject) => {
    console.log(BOT_CLIENT, 'client');

    if (BOT_CLIENT === 'webWhatsappJS') {
      resolve(client);
    } else {
      reject(new Error('Invalid BOT_CLIENT configuration.'));
    }
  });
};

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

export const formatMessage = (message: string, user: any) => {
  const { cleanedPhoneNumber, isAlter }: any = cleanAndFormatPhoneNumber(user.celular || FALLBACK_PHONE_NUMBER );
  let formattedMessage = message.replace(/-/g, ' ');
  
  if (isAlter) {
    formattedMessage += ` Mensaje no enviado a: ${user.firstName} con numero de telefono ${cleanedPhoneNumber}. Instagram: ${user.instagram}, Full Name: ${user.full_name}, Celular: ${user.celular}`;
  }
  
  return { formattedMessage, cleanedPhoneNumber };
};

export const sendMessage = async (client: Client, phoneNumber: string , message: string ) => {
  const { cleanedPhoneNumber }: any = cleanAndFormatPhoneNumber(phoneNumber);
  const formattedPhoneNumber = `${cleanedPhoneNumber}@c.us`;
  
  try {
    if (BOT_CLIENT === 'webWhatsappJS') {
      await client.sendMessage(formattedPhoneNumber, message);
    }
    return { status: 'success', message: 'Message sent successfully' };
  } catch (error) {
    console.error('Error sending message:', error);
    const errorDetails = error.response ? error.response.data : { to: phoneNumber, text: error.message };
    throw new Error(`Error sending message: ${JSON.stringify(errorDetails)}`);
  }
};