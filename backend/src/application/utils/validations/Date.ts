export function isValidDate(date: any) {
    return !isNaN(Date.parse(date));
}