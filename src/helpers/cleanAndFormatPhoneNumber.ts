/* eslint-disable no-console */

import { FALLBACK_PHONE_NUMBER } from '@src/constants/numbers';

/* eslint-disable max-len */
export function cleanAndFormatPhoneNumber(phoneNumber: string): { cleanedPhoneNumber: string, isValid: boolean } {
  // Clean the phone number by removing all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Function to format Argentinian phone numbers
  function formatArgentinian(number: string): string {
    if (number.startsWith('54')) {
      number = number.slice(2);
    }
    if (number.length === 10 && number.startsWith('9')) {
      return `549${number.slice(1, 3)}${number.slice(3, 7)}${number.slice(7)}`;
    }
    if (number.length === 10) {
      return `549${number.slice(0, 2)}${number.slice(2, 6)}${number.slice(6)}`;
    }
    throw new Error('Invalid Argentinian phone number length');
  }

  // Function to format Dominican Republic phone numbers
  function formatDominican(number: string): string {
    if (number.startsWith('1')) {
      number = number.slice(1);
    }
    if (number.length === 10) {
      return `1(${number.slice(0, 3)})${number.slice(3, 6)}${number.slice(6)}`;
    }
    throw new Error('Invalid Dominican Republic phone number length');
  }

  try {
    if (cleaned.startsWith('54')) {
      return { cleanedPhoneNumber: formatArgentinian(cleaned), isValid: true };
    } else if (cleaned.startsWith('1') && (cleaned.slice(1, 4) === '809' || cleaned.slice(1, 4) === '829' || cleaned.slice(1, 4) === '849')) {
      return { cleanedPhoneNumber: formatDominican(cleaned), isValid: true };
    } else {
      throw new Error('Unsupported or unknown country code or area code');
    }
  } catch (error) {
    return { cleanedPhoneNumber: FALLBACK_PHONE_NUMBER, isValid: false };
  }
}
  