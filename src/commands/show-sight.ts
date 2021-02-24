import { Telegram } from '@apidog/multibot-sdk-ts';
import { link, siteUrl } from '../render/common';
import { renderSightPage } from '../render/sight-page';
import { replyAsText } from '../api/helpers';
import { PREFIX_SET_VISIT_STATE } from '../const';
import { VisitState } from '../api/types/sight';
import type { IApiListExtended } from '../api/types/api';
import type { ISight } from '../api/types/sight';
import type { MessageProperties } from './types';

export const renderSightPageKeyboard = (sightId: number, visitState: VisitState): Telegram.InlineKeyboardBuilder => {
    const kb = new Telegram.InlineKeyboardBuilder();

    const visitRow = kb.addRow();

    const label = (title: string, value: VisitState): string => value === visitState
        ? `• ${title} •`
        : title;

    const buttons: [string, VisitState][] = [
        ['Не посетил', VisitState.NOT_VISITED],
        ['Посетил', VisitState.VISITED],
        ['Желаю', VisitState.DESIRED],
    ];

    for (const [text, state] of buttons) {
        visitRow.addButton(new Telegram.InlineButton(label(text, state), {
            callback_data: `${PREFIX_SET_VISIT_STATE}/${sightId}/${state}`,
        }));
    }

    const linksRow = kb.addRow();

    linksRow.addButton(new Telegram.InlineButton('На сайте', {
        url: siteUrl(`sight/${sightId}?s=tg`),
    }));

    linksRow.addButton(new Telegram.InlineButton('Поделиться', {
        switch_inline_query: 'test',
    }));

    return kb;
}

export const commandShowSight = async({ bot, api, message, sightId }: MessageProperties & { sightId: number }): Promise<void> => {
    const currentUser = await api.getUser();

    const { items, users } = await api.call<IApiListExtended<ISight>>('sights.getById', {
        sightIds: sightId,
        fields: 'photo,visitState,rating',
        extended: true,
    });

    if (!items.length) {
        await bot.sendMessage({
            chat_id: message.chat.id,
            text: `Странно, достопримечательность под номером #${sightId} не найдена. Попробовать открыть ${link('на сайте', siteUrl(`sight/${sightId}`))}?`,
        });
        return;
    }

    const [sight] = items;
    const [author] = users;

    let kb: Telegram.InlineKeyboardBuilder | undefined;

    if (currentUser) {
        kb = renderSightPageKeyboard(sightId, sight.visitState!);
    }

    await replyAsText(bot, message, {
        text: renderSightPage(sight, { author }),
        keyboard: kb,
    });
};
