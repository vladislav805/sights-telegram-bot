import { Telegram } from '@apidog/multibot-sdk-ts';
import { ParseMode } from '@apidog/multibot-sdk-ts/dist/telegram';

type ReplyTextOptions = {
    text: string;
    linkPreview?: boolean;
    keyboard?: Telegram.IKeyboardBuilder;
};

export const replyAsText = (bot: Telegram.Bot, message: Telegram.Message, options: ReplyTextOptions) => {
    const {
        text,
        linkPreview = true,
    } = options;

    return bot.sendMessage({
        chat_id: message.chat.id,
        text,
        parse_mode: ParseMode.HTML,
        disable_web_page_preview: linkPreview,
        reply_markup: options.keyboard?.build(),
    });
};
