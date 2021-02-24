import { bold, italic, link, siteUrl } from './common';
import { SightMask, VisitState } from '../api/types/sight';
import type { ISight } from '../api/types/sight';

type ISightRenderOptions = Partial<{
    showSiteLink: boolean;
    showCommandLink: boolean;
    showSightStatus: boolean;
    distance: number;
}>;

/**
 * Элемент списка достопримечательностей
 * @param sight Достопримечательность
 * @param options Опции
 */
export const renderSight = (sight: ISight, options: ISightRenderOptions = {}): string => [
    [
        options.showCommandLink && renderSightCommandLink(sight),
        bold(sight.title),
        options.showSightStatus && renderSightStatus(sight),
    ].join(' '),
    sight.description && italic(sight.description.slice(0, 200)),
    options?.distance && `От Вас в ≈${options.distance}м`,
    ' ',
    options?.showSiteLink && link('На сайте', siteUrl(`sight/${sight.sightId}`)),
]
    .filter(Boolean)
    .map((line: string) => line.trim())
    .join('\n')
    .trim();

/**
 * Команда-ссылка для достопримечательности
 * @param sight Достопримечательность
 */
const renderSightCommandLink = (sight: ISight): string => `/sight${sight.sightId}`;

/**
 * Иконки, обозначающие разные статусы
 * @param sight Достопримечательность
 */
const renderSightStatus = (sight: ISight): string => [
    (sight.mask & SightMask.VERIFIED) > 0 && '✅',
    (sight.mask & SightMask.ARCHIVED) > 0 && '❌',
    sight.visitState === VisitState.VISITED && '👁',
    sight.visitState === VisitState.DESIRED && '💡',
].filter(Boolean).join(' ');
