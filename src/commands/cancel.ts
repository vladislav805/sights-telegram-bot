import { MessageProperties } from './types';
import { replyAsText } from '../api/helpers';

export const commandCancel = async({ bot, message, state }: MessageProperties) => {
    state.set({ type: 'none' });

    await replyAsText(bot, message, {
        text: 'Действие отменено.',
    });
};
