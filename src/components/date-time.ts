/* eslint-disable @typescript-eslint/no-empty-function */
const monthNames: string[] = [
    'January', 'February', 'March',
    'April', 'May', 'June',
    'July', 'August', 'September',
    'October', 'November', 'December'
  ];

  const monthDays: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const isLeapYear = (year:number) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const getMonthDays = (index: number, year: number) => index !== 1 ? monthDays[index] : isLeapYear(year) ? 29 : 28;
  
  export const getDateRows = (monthIndex: number, year: number): (number | undefined)[] => {
    const { days } = getMonthStats(monthIndex, year);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = Array.from({ length: 42 }).map((): any => []);
    const startIndex = new Date(year, monthIndex, 1).getDay();

    Array.from({ length: days }).forEach((_, i) => {
      const index = startIndex + i;
      rows[index] = i + 1;
    });

    const filled = rows.map((i: number) => (Array.isArray(i) ? undefined : i));
  
    return filled[35] ? filled : filled.slice(0, -7);
  };
  
  export const getMonthName = (index: number) => monthNames[index];

  const getMonthStats = (monthIndex: number, year: number) => {
    const today: Date = new Date(year, monthIndex, 1);
    return { name:  monthNames[today.getMonth()], days: getMonthDays(today.getMonth(), year)};
  };
  
  export const noop = () => {};
  
  export const uuid = (() => {
    let id = 1;
    return () => {
      return ++id;
    };
  })();