import { renderSightPageKeyboard } from './show-sight';
import type { CallbackProperties } from './types';

type ISightSetVisitStateResult = {
    state: boolean;
};

export const commandSetVisitState = async({ bot, api, query }: CallbackProperties) => {
    const [, sightId, visitState] = query.data!.split('/');

    await api.call<ISightSetVisitStateResult>('sights.setVisitState', {
        sightId,
        state: visitState,
    });

    await bot.editMessageReplyMarkup({
        chat_id: query.from.id,
        message_id: query.message!.message_id,
        reply_markup: renderSightPageKeyboard(+sightId, +visitState).build(),
    });
};
