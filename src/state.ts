export type IUserState =
    | IUserStateNone
    | IUserStateCreate;

export type IUserStateNone = {
    type: 'none';
};

export type IUserStateCreate = {
    type: 'create';
    step: 'location' | 'title' | 'description' | 'category';
    latitude?: number;
    longitude?: number;
    title?: string;
    description?: string;
    categoryId?: number;
};

export type IUserStateCtl = {
    set: (value: IUserState) => void;
    get: <T extends IUserState>() => T;
};

const store = new Map<number, IUserState>();

const getUserStateCtl = <T>(telegramUserId: number): IUserStateCtl => ({
    set: (value: IUserState): void => void store.set(telegramUserId, value),
    get: <T extends IUserState>(): T => (store.get(telegramUserId) ?? { type: 'none' }) as T,
});

export default getUserStateCtl;
