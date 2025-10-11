export const formatDateToYearFirst = (date : Date) => {
    return date.toISOString().split('T')[0]
}