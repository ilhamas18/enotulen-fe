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
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();

  // Format the date components
  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate
}

export const getIndoDate = (data: string) => {
  const date = new Date(data);
  const options: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('id-ID', options);

  return formattedDate;
}

export const conversionDate = (inputDateString: string) => {
  const parts = inputDateString.split(', ')[1].split(' '); // Split the string into day, day number, month, and year
  const day = parts[0]; // Extract day
  const dayNumber = parts[1]; // Extract day number
  const month = parts[2]; // Extract month
  const year = parts[3]; // Extract year

  // Define an object to map Indonesian month names to English month names
  const monthMap: any = {
    'Januari': 'Jan',
    'Februari': 'Feb',
    'Maret': 'Mar',
    'April': 'Apr',
    'Mei': 'May',
    'Juni': 'Jun',
    'Juli': 'Jul',
    'Agustus': 'Aug',
    'September': 'Sep',
    'Oktober': 'Oct',
    'November': 'Nov',
    'Desember': 'Dec'
  };

  // Convert the Indonesian month name to English abbreviation
  const formattedMonth = monthMap[month];

  // Combine the parts to form the desired format
  const formattedDate = `${day} ${formattedMonth} ${dayNumber} ${year} 00:00:00 GMT+0700 (Western Indonesia Time)`;

  return formattedDate;
}