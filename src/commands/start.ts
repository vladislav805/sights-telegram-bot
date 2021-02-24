import { Telegram } from '@apidog/multibot-sdk-ts';
import { siteUrl } from '../render/common';
import type { MessageProperties } from './types';

export const commandStart = async({ bot, api, message }: MessageProperties) => {
    const user = await api.getUser();

    if (user) {
        const kb = new Telegram.ReplyKeyboardBuilder({
            resize_keyboard: true,
        });
        kb.addRow().addButton(new Telegram.ReplyButton('Места рядом', {
            request_location: true,
        }));

        await bot.sendMessage({
            chat_id: message.chat.id,
            text: `Привет, ${user.firstName}!`,
            reply_markup: kb.build(),
        });
    } else {
        const connectUrl = siteUrl('island/settings?tab=social');
        const kb = new Telegram.InlineKeyboardBuilder();
        kb.addRow().addButton(new Telegram.InlineButton('Открыть', {
            url: connectUrl,
        }));

        await bot.sendMessage({
            chat_id: message.chat.id,
            text: `Привет!\n\nДля того, чтобы пользоваться ботом нужно связать аккаунт на сайте с аккаунтом Telegram. Это можно сделать на [этой странице в настройках](${connectUrl}).\n\nПосле этого ботом можно будет пользоваться.`,
            reply_markup: kb.build(),
        });
    }
};
