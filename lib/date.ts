export const dateFormat = (isoDate: string): string => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };
    const dateString = date.toLocaleDateString('ja-JP', options);
    return dateString.replace(/\//g, '-').replace(',', '');
};