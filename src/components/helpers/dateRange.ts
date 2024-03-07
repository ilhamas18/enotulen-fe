export function dateRangeFormat(data: any) {
  const formatDate = (dateString: string): string => {
    const options: any = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', options);
  };

  const getDatesBetween = (startDate: Date, endDate: Date): string[] => {
    const dates: string[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(formatDate(currentDate.toISOString()));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };
  // console.log(data);

  const { startDate, endDate } = data;

  const dateRange: string[] = getDatesBetween(new Date(startDate), new Date(endDate));

  return dateRange;
}

export function dateISOFormat(data: any) {
  const monthMap: any = {
    "Januari": 0,
    "Februari": 1,
    "Maret": 2,
    "April": 3,
    "Mei": 4,
    "Juni": 5,
    "Juli": 6,
    "Agustus": 7,
    "September": 8,
    "Oktober": 9,
    "November": 10,
    "Desember": 11
  };
  // Split the input string into day, month, and year
  const [day, month, year]: any = data.split(' ');

  // Convert month name to numerical representation
  const monthNumber = monthMap[month];

  // Create a Date object with the specified year, month, and day
  const inputDate = new Date(year, monthNumber, day);

  // Set the start and end dates to "2024-03-06T17:00:00.000Z"
  const startDate = new Date(inputDate);
  const endDate = new Date(inputDate);

  // Format dates to ISO string
  const isoStartDate = startDate.toISOString();
  const isoEndDate = endDate.toISOString();

  // Create the JSON object
  const result = {
    "startDate": isoStartDate,
    "endDate": isoEndDate,
    "key": "selection"
  };

  return result;
}