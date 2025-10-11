export const formatDateToYearFirst = (date : Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return date.toISOString().split('T')[0]
}