import { Telegram } from '@apidog/multibot-sdk-ts';
import ApiInstance from '../api';
import type { IUserStateCtl } from '../state';

type ActionProperties<T> = {
    bot: Telegram.Bot;
    api: ApiInstance;
    state: IUserStateCtl;
} & T;

export type MessageProperties = ActionProperties<{
    message: Telegram.Message;
}>;

export type CallbackProperties = ActionProperties<{
    query: Telegram.CallbackQuery;
}>;

export type UniversalProperties = ActionProperties<({
    message?: Telegram.Message;
} & {
    query?: Telegram.CallbackQuery;
})>;

export type InlineProperties = ActionProperties<{
    query: Telegram.InlineQuery;
}>;

export type BotMessageDefaultCallback = (properties: MessageProperties) => Promise<void>;
