import { BotMessageDefaultCallback } from './types';
import { commandStart } from './start';
import { commandCreate } from './create';
import { commandCancel } from './cancel';

const commands: Record<string, BotMessageDefaultCallback> = {
    '/start': commandStart,
    '/create': commandCreate,
    '/cancel': commandCancel,
};

export default commands;
