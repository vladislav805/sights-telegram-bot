import { Sex } from '../api/types/user';

/**
 * Замена опасных символов на безопасные (чтобы не возникало ошибок из-за
 * парсинга и предотвращение вставки произвольной вёрстки)
 * @param text Текст
 */
export const sanitize = (text: string): string => text
    .replace('<', '&lt;')
    .replace('>', '&gt;')
    .replace('&', '&amp;');

/**
 * Жирный текст
 * @param text Текст
 */
export const bold = (text: string): string => `<b>${sanitize(text)}</b>`;

/**
 * Курсивный текст
 * @param text Текст
 */
export const italic = (text: string): string => `<i>${sanitize(text)}</i>`;

/**
 * Ссылка
 * @param text Текст ссылки
 * @param url URL ссылки
 */
export const link = (text: string, url: string): string => `<a href="${sanitize(url)}">${sanitize(text)}</a>`;

/**
 * Ссылка на главный сайт
 * @param path
 */
export const siteUrl = (path: string): string => `https://${process.env.DOMAIN_MAIN}/${path}`;

export const genderize = <T = string>(gender: Sex, male: T, female: T): T =>
    gender === Sex.FEMALE ? female : male;
