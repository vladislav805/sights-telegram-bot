import fetch from 'node-fetch';
import { Telegram } from '@apidog/multibot-sdk-ts/';
import type { IApiParams } from './types/api';
import type { IApiError } from './types/base';
import type { IUser } from './types/user';

type IApiInstanceProps = {
    telegramUser: Telegram.User;
};

type IApiResult<T> = { result: T } | { error: IApiError };

export default class ApiInstance {
    private readonly telegramUser: Telegram.User;

    public constructor(props: IApiInstanceProps) {
        this.telegramUser = props.telegramUser;
    }

    public getUser = (): Promise<IUser | undefined> =>
        this.call<IUser[]>('users.get').then(result => {
            return result?.[0]?.userId ? result[0] : undefined;
        });

    public call = <T>(method: string, props: IApiParams = {}): Promise<T> => {
        props.__trustKey = String(process.env.SECRET_TRUST_KEY);
        props.__telegramId = this.telegramUser.id;

        return fetch(`http://localhost:${process.env.PORT_MAIN}/api/${method}`, {
            method: 'post',
            mode: 'cors',
            cache: 'no-cache',
            redirect: 'follow',
            body: JSON.stringify(props),
            headers: {
                'content-type': 'application/json; charset=utf-8',
            },
        })
            .then(res => res.json())
            .then((res: IApiResult<T>) => {
                if ('error' in res) {
                    throw res.error;
                }

                return res.result;
            });
    };
}
