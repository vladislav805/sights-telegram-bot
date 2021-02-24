import { Telegram } from '@apidog/multibot-sdk-ts';
import { renderSight } from '../render/sight-item';
import type { MessageProperties } from './types';
import type { ListOfSightsWithDistances } from '../api/types/sight';

const DISTANCE = 1000;

export const commandSearchNearby = async({ bot, api, message }: MessageProperties) => {
    const { items, distances } = await api.call<ListOfSightsWithDistances>('sights.getNearby', {
        latitude: message.location!.latitude,
        longitude: message.location!.longitude,
        distance: DISTANCE,
        count: 7,
        fields: 'visitState',
    });

    const mapDistance = new Map<number, number>();

    for (const { sightId, distance } of distances) {
        mapDistance.set(sightId, distance);
    }

    const text = items.map(sight => renderSight(sight, {
        distance: mapDistance.get(sight.sightId),
        showCommandLink: true,
        showSightStatus: true,
    })).join('\n\n');

    await bot.sendMessage({
        chat_id: message.chat.id,
        text,
        disable_web_page_preview: true,
        reply_to_message_id: message.message_id,
        parse_mode: Telegram.ParseMode.HTML,
    });
};
