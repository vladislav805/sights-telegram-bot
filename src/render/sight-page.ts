import { bold, genderize, italic, link, siteUrl } from './common';
import { renderDate } from './date-time';
import type { ISight } from '../api/types/sight';
import type { IUser } from '../api/types/user';

type ISightPageOptions = Partial<{
    author: IUser;
    showSiteLink: boolean;
    showMapLink: boolean;
}>;

export const renderSightPage = (sight: ISight, options?: ISightPageOptions): string => [
    sight.photo && link('​', sight.photo.photoMax),
    bold(sight.title),
    ' ',
    italic(sight.description),
    ' ',
    options?.author && `${genderize(options?.author.sex, 'Добавил', 'Добавила')} ${link(options?.author.login, siteUrl(`user/${options?.author.login}`))} ${renderDate(sight.dateCreated)}`,
    ' ',
    options?.showSiteLink && link('⌘ Открыть на сайте', siteUrl(`sight/${sight.sightId}?s=tgs`)),
    options?.showMapLink && link('🗺 На карте', `https://www.google.com/maps/@?api=1&map_action=map&center=${sight.latitude},${sight.longitude}&zoom=17`),
]
    .filter(Boolean)
    .map((line: string) => line.trim())
    .join('\n')
    .trim();
