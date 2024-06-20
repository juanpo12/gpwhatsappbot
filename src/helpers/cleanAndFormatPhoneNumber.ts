/* eslint-disable no-console */
/* eslint-disable max-len */
export function cleanAndFormatPhoneNumber(phoneNumber : string): unknown {
  console.log('Input PhoneNumber:', phoneNumber); // Log the input phoneNumber
  if (!phoneNumber) return '';
  
  let isAlter = false;
  let formattedNumber = phoneNumber.replace(/\D/g, ''); // Remove non-digit characters
  console.log('After removing non-digits:', formattedNumber); // Log the formatted phoneNumber
  
  if (formattedNumber.startsWith('1')) {
    formattedNumber = formattedNumber.substring(1);
    console.log('Without leading 1:', formattedNumber); // Log the formatted phoneNumber
  }
  
  if (formattedNumber.length === 10) {
    formattedNumber = '1' + formattedNumber;
    console.log('10 digits long, added 1:', formattedNumber); // Log the formatted phoneNumber
  } else {
    isAlter = true;
    formattedNumber = phoneNumber;
    console.log('Using alterPhone:', formattedNumber); // Log the formatted phoneNumber
  }
  
  if (formattedNumber.startsWith('5415')) {
    formattedNumber = '549' + formattedNumber.substring(4);
    console.log('Argentina format:', formattedNumber); // Log the formatted phoneNumber
  }
  
  if (!formattedNumber.startsWith('+')) {
    formattedNumber = '+' + formattedNumber;
  }
  console.log('Final formatted number:', formattedNumber); // Log the formatted phoneNumber
  
  return {
    cleanedPhoneNumber: formattedNumber.slice(1), // Remove '+' prefix for cleaned number
    isAlter,
  };
}
  