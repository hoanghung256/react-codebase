export const formattedDate = (date) => {
    return new Date(date).toLocaleDateString(navigator.language, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

export const formattedDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString(navigator.language, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const getYearDiff = (startDate, endDate) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    let yearDiff = endDate.getFullYear() - startDate.getFullYear();
    const m = endDate.getMonth() - startDate.getMonth();
    if (m < 0 || (m === 0 && endDate.getDate() < startDate.getDate())) {
        yearDiff--;
    }
    return yearDiff;
};
