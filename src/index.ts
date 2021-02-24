import * as dotenv from 'dotenv';
import { Bot, MatchType } from '@apidog/multibot-sdk-ts/dist/telegram-only';
import ApiInstance from './api';
import { commandSearchNearby } from './commands/search-nearby';
import { commandShowSight } from './commands/show-sight';
import { inlineSearch } from './commands/search';
import commands from './commands';
import getUserStateCtl  from './state';
import { commandCreate } from './commands/create';
import { PREFIX_CREATE, PREFIX_SET_VISIT_STATE } from './const';
import { commandSetVisitState } from './commands/set-visit-state';

dotenv.config({
    path: '../.env',
});

const secret = process.env.TELEGRAM_BOT_TOKEN;

if (!secret) {
    throw new Error('Not specified TELEGRAM_BOT_TOKEN');
}

const bot = new Bot({ secret });

bot.on(MatchType.Command, async({ message, command, starts }) => {
    if (!starts) {
        return;
    }

    const api = new ApiInstance({ telegramUser: message.from! });
    const state = getUserStateCtl(message.from.id);

    if (command in commands) {
        await commands[command]({ bot, api, message, state });
        return;
    }

    if (/^\/sight(\d+)$/i.test(command)) {
        const [, sightId] = /^\/sight(\d+)$/i.exec(command)!;
        await commandShowSight({ bot, api, message, state, sightId: +sightId });
        return;
    }
});

bot.on(MatchType.Message, async message => {
    const api = new ApiInstance({ telegramUser: message.from! });
    const state = getUserStateCtl(message.from.id);

    if (message.text === '/cancel') {
        return;
    }

    switch (state.get().type) {
        case 'create': {
            await commandCreate({ bot, api, message, state });
            return;
        }

        default: {
            if (message.location) {
                await commandSearchNearby({ bot, api, message, state });
            }
        }
    }
});

bot.on(MatchType.CallbackQuery, async query => {
    const api = new ApiInstance({ telegramUser: query.from });
    const state = getUserStateCtl(query.from.id);

    const [prefix] = query.data!.split('/');

    switch (prefix) {
        case PREFIX_CREATE: {
            if (state.get().type === 'create') {
                await commandCreate({ bot, api, query, state });
            }
            return;
        }

        case PREFIX_SET_VISIT_STATE: {
            await commandSetVisitState({ bot, api, query, state });
            return;
        }
    }
});

bot.on(MatchType.InlineQuery, async query => {
    const api = new ApiInstance({ telegramUser: query.from });

    await inlineSearch(bot, api, query);
});

bot.startPolling();
console.log('Started');
