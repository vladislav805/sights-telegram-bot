const months = ['яна', 'фев', 'мар', 'апр', 'мая', 'июня', 'июля', 'авг', 'сен', 'окт', 'ноя', 'дек'];

export const renderDate = (date: Date | number) => {
    if (typeof date === 'number') {
        date = new Date(date * 1000);
    }

    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};


