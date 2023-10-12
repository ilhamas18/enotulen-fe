export const formatDate = (date: number) => {
  const inputDate = new Date(date);

  const options: any = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const locale = 'id-ID'; // Set the locale to Indonesian

  const formattedDate = inputDate.toLocaleDateString(locale, options);
  return formattedDate
}

export const getTime = (init: any) => {
  const date = new Date(init);

  // Get the hours and minutes from the Date object
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Convert hours and minutes to a two-digit format (e.g., "01" instead of "1")
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  // Create a string in the format "HH:mm"
  const formattedTime = `${formattedHours}:${formattedMinutes}`;
  return (formattedTime)
}

export const getShortDate = (input: any) => {
  // Input date string
  const inputDateString = input

  // Create a Date object from the input string
  const date = new Date(inputDateString);

  // Extract the day, month, and year components
  const day = date.getUTCDate();
  // Note: Months are zero-indexed, so we add 1 to get the correct month
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();

  // Format the date components
  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate
}

export const getShortDate2 = (input: any) => {
  const parsedDate = new Date(input);

  // Extract the day, month, and year from the parsed date
  const day = parsedDate.getDate();
  const month = parsedDate.getMonth() + 1; // Months are 0-based (0 = January, 1 = February, etc.)
  const year = parsedDate.getFullYear();

  // Format the date as "9/10/2023"
  const formattedDate = `${month}/${day}/${year}`;
  return formattedDate
}

export const getStartMonthDate = () => {
  const currentDate = new Date();
  currentDate.setDate(1); // Set the day to 1 to get the first date of the current month

  // Get the year, month, and day components
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 to get the month as a number, and padding with '0'
  const day = String(currentDate.getDate()).padStart(2, '0'); // Padding with '0'

  // Get the time components
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');

  // Get the UTC offset in the format "+HHMM"
  const utcOffsetMinutes = currentDate.getTimezoneOffset();
  const utcOffsetHours = Math.abs(utcOffsetMinutes / 60);
  const utcOffsetMinutesRemainder = Math.abs(utcOffsetMinutes % 60);
  const utcOffsetSign = utcOffsetMinutes >= 0 ? '+' : '-';
  const formattedUtcOffset = `${utcOffsetSign}${String(utcOffsetHours).padStart(2, '0')}${String(utcOffsetMinutesRemainder).padStart(2, '0')}`;

  // Create a formatted date string
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds} ${formattedUtcOffset}`;

  return formattedDate;
}

export const getCurrentMonthDate = () => {
  const currentDate = new Date();

  // Get the year, month, day, hour, minute, second, and millisecond components
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 to get the month as a number, and padding with '0'
  const day = String(currentDate.getDate()).padStart(2, '0'); // Padding with '0'
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');

  // Get the UTC offset in the format "+HHMM"
  const utcOffsetMinutes = currentDate.getTimezoneOffset();
  const utcOffsetHours = Math.abs(utcOffsetMinutes / 60);
  const utcOffsetMinutesRemainder = Math.abs(utcOffsetMinutes % 60);
  const utcOffsetSign = utcOffsetMinutes >= 0 ? '+' : '-';
  const formattedUtcOffset = `${utcOffsetSign}${String(utcOffsetHours).padStart(2, '0')}${String(utcOffsetMinutesRemainder).padStart(2, '0')}`;

  // Create a formatted date string
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds} ${formattedUtcOffset}`;

  return formattedDate
}