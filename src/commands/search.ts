import { Telegram } from '@apidog/multibot-sdk-ts';
import { ParseMode } from '@apidog/multibot-sdk-ts/dist/telegram';
import ApiInstance from '../api';
import { siteUrl } from '../render/common';
import { renderSightPage } from '../render/sight-page';
import type { IApiList } from '../api/types/api';
import type { ISight } from '../api/types/sight';

export const inlineSearch = async(bot: Telegram.Bot, api: ApiInstance, query: Telegram.InlineQuery) => {
    const q = query.query.trim();

    if (!q) {
        await bot.answerInlineQuery({
            inline_query_id: query.id,
            cache_time: 3600,
            is_personal: false,
            results: [],
        });
        return;
    }

    const result = await api.call<IApiList<ISight>>('sights.search', {
        query: q,
        count: 30,
        offset: query.offset,
        fields: 'photo,city,author',
    });

    const end = +query.offset + result.items.length;

    await bot.answerInlineQuery({
        inline_query_id: query.id,
        cache_time: 3600,
        is_personal: false,
        next_offset: end < result.count! ? String(end + 1) : undefined,
        results: result.items.map(sight => {
            const kb = new Telegram.InlineKeyboardBuilder();
            kb.addRow().addButton(new Telegram.InlineButton('Открыть', {
                url: siteUrl(`sight/${sight.sightId}?s=tgs`),
            }));
            return ({
                type: 'venue',
                id: `sight${sight.sightId}`,
                latitude: sight.latitude,
                longitude: sight.longitude,
                title: sight.title,
                address: sight.city?.name ?? 'unknown',
                reply_markup: kb.build(),
                input_message_content: {
                    message_text: renderSightPage(sight, {
                        showSiteLink: true,
                        showMapLink: true,
                    }),
                    parse_mode: ParseMode.HTML,
                },
                thumb_url: sight.photo?.photo200,
                thumb_width: sight.photo?.width,
                thumb_height: sight.photo?.height,
            });
        }),
    });
};

