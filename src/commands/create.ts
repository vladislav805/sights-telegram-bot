import { Telegram } from '@apidog/multibot-sdk-ts';
import { replyAsText } from '../api/helpers';
import { PREFIX_CREATE } from '../const';
import type { UniversalProperties } from './types';
import type { IUserStateCreate } from '../state';
import type { IApiList } from '../api/types/api';
import type { ICategory } from '../api/types/category';
import type { IPlace } from '../api/types/place';

export const commandCreate = async(props: UniversalProperties) => {
    const { bot, api, state, message, query } = props;
    const curState = state.get<IUserStateCreate>();

    const cancelStr = '\n\nЕсли передумали добавлять: /cancel';

    // Пользователь хочет добавить место
    if (curState.type !== 'create') {

        // Меняем состояние на "создание", но без координат
        state.set({ type: 'create', step: 'location' });

        // Отвечаем ему
        await replyAsText(bot, message!, {
            text: 'Отправь местоположение этого места.' + cancelStr,
        });
        return;
    }

    switch (curState.step) {
        case 'location': {
            if (message!.location) {
                state.set({
                    type: 'create',
                    step: 'title',
                    latitude: message!.location.latitude,
                    longitude: message!.location.longitude,
                });
                await replyAsText(bot, message!, {
                    text: 'Ага, понял! Теперь дадим название. Кратко, буквально в двух-трёх словах.' + cancelStr,
                });
            } else {
                await replyAsText(bot, message!, {
                    text: 'Отправьте геометку.' + cancelStr,
                });
            }
            return;
        }

        case 'title': {
            state.set({
                ...curState,
                step: 'description',
                title: message!.text,
            });

            await replyAsText(bot, message!, {
                text: 'Опишешь как-нибудь эту достопримечательность?\nПропустить: /skip' + cancelStr,
            });
            return;
        }

        case 'description': {
            state.set({
                ...curState,
                step: 'category',
                description: message!.text === '/skip' ? '' : message!.text,
            });

            const categories = await api.call<IApiList<ICategory>>('categories.get');
            const kb = new Telegram.InlineKeyboardBuilder();
            let i = 0;
            let row: Telegram.KeyboardRow<Telegram.InlineButton>;

            for (const category of categories.items) {
                if ((i++ % 3) === 0) {
                    row = kb.addRow();
                }

                row!.addButton(new Telegram.InlineButton(category.title, {
                    callback_data: `${PREFIX_CREATE}/${category.categoryId}`,
                }));
            }

            await replyAsText(bot, message!, {
                text: 'Ну и последнее... Категория этой достопримечательности?' + cancelStr,
                keyboard: kb,
            });
            return;
        }

        case 'category': {
            const message = query!.message!;
            await bot.editMessageText({
                chat_id: query!.from.id,
                message_id: message.message_id,
                text: 'Категория выбрана.',
                reply_markup: new Telegram.InlineKeyboardBuilder().build(),
            });

            const categoryId = +query!.data!.split('/').pop()!;

            const result = {
                ...curState,
                categoryId: categoryId, // обработка выше
            };

            state.set({ type: 'none' });

            const place = await api.call<IPlace>('map.addPlace', {
                latitude: result.latitude!,
                longitude: result.longitude!,
            });

            const sight = await api.call<{ sightId: number }>('sights.add', {
                placeId: place.placeId,
                title: result.title!,
                description: result.description!,
                categoryId: result.categoryId,
            });

            console.log(state.get(), sight);
            await replyAsText(bot, message, {
                text: `Готово - /sight${sight.sightId}! Спасибо за информацию!`,
            });
            return;
        }
    }
};
