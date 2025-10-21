export const formatDateToYearFirst = (date : Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${adjustDate(month)}-${adjustDate(day)}`;
}

const adjustDate = (dateNum: number) => {
    return (dateNum < 10) ? '0' + dateNum : dateNum;
}