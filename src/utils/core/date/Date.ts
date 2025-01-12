export function addSeconds(date: Date, seconds: number): Date {
    const newDate = new Date(date.getTime());
    newDate.setSeconds(newDate.getSeconds() + seconds);
    return newDate;
}