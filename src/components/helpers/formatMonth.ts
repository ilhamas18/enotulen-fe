export const formatMonth = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
];


export const formattedDate = (data: any) => {
  const dateParts = data.split('/');
  const day = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10); // Months are 0-based (0 = January, 1 = February, etc.)
  const year = parseInt(dateParts[2], 10);
  // Create a Date object with the parsed values
  const formattedDate = new Date(year, month, day);

  // Define a formatting option for the date
  const options: any = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'long',
    timeZone: 'Asia/Jakarta' // Set the desired time zone
  };

  // Format the date using the Intl.DateTimeFormat API
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const formattedDateString = formatter.format(formattedDate);
  return formattedDate;
}

export const localDateFormat = (data: any) => {
  const inputDate = new Date("2024-03-07T17:00:00.000Z");

  // Convert to the desired time zone (e.g., 'Asia/Jakarta')
  const options = { timeZone: 'Asia/Jakarta' };
  const convertedDate = new Date(inputDate.toLocaleString('en-US', options));

  // Format the date as "8 Maret 2024"
  const formattedDate = convertedDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return formattedDate
}

