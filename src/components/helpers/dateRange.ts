function dateRangeFormat(data: any) {
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

export default dateRangeFormat