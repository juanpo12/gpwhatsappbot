/* eslint-disable no-console */

import { FALLBACK_PHONE_NUMBER } from '@src/constants/numbers';

/* eslint-disable max-len */
export function cleanAndFormatPhoneNumber(phoneNumber: string): { cleanedPhoneNumber: string, isValid: boolean } {
  // Clean the phone number by removing all non-numeric characters except for the plus sign
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');

  const finalNumber = cleaned.startsWith('+54') ? cleaned.replace('+54', '+549') : cleaned;

  // Validate the cleaned phone number
  const isValid = finalNumber.startsWith('+') && finalNumber.length > 4 && finalNumber.length <= 15;

  if (isValid) {
    return { cleanedPhoneNumber: finalNumber, isValid };
  } else {
    return { cleanedPhoneNumber: FALLBACK_PHONE_NUMBER, isValid: false };
  }
}
