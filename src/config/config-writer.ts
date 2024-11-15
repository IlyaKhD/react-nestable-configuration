import { createContext } from "react";

type Obj = Record<string, any>;

interface ConfigWriter<T extends Obj> {
    set(value: T): void;
    getArrayWriter<T2 extends Obj>(name: keyof T): ConfigWriter<T2>;
    getObjectWriter<T2 extends Obj>(name: keyof T): ConfigWriter<T2>;
}

function createWriter<T extends Obj>(
    set: (value: T) => void,
    get: <TKey extends keyof T>(key: TKey) => T[TKey] | undefined,
): ConfigWriter<T> {
    return {
        set,
        getObjectWriter<T2 extends Record<string, any>>(name: keyof T): ConfigWriter<T2> {
            const nestedTarget = {}
            set({ [name]: nestedTarget } as any); // any?

            const writer = createObjectWriter({
                target: nestedTarget,
            });

            return writer;
        },
        getArrayWriter<T2 extends Record<string, any>>(name: keyof T): ConfigWriter<T2> {
            let nestedTarget: any = get(name); // any?
            if (nestedTarget == undefined) {
                nestedTarget = [];
                set({
                    [name]: nestedTarget
                } as any); // any?
            }

            const writer = createArrayWriter({
                target: nestedTarget,
            });
        
            return writer;
        }
    }
}

interface ArrayWriterCfg<T> {
    target: T[];
}
function createArrayWriter<T extends Record<string, any>>({ target }: ArrayWriterCfg<T>) {
    let index: number | undefined = undefined;

    const set = (values: T) => index == undefined
        ? index = target.push(values) - 1
        : target[index] = { ...target[index], ...values };

    const get = <TKey extends keyof T>(key: TKey): T[TKey] | undefined => index == undefined
    ? undefined
    : target[index][key];

    return createWriter(set, get);
}

function mutate(target: Obj, fields: Obj) {
    for (const [key, value] of Object.entries(fields)) {
        target[(key)] = value;
    }
}

interface ObjectWriterCfg<T> {
    target: T;
}
function createObjectWriter<T extends Obj>({ target }: ObjectWriterCfg<T>) {

    const set = (fields: T) => mutate(target, fields);

    const get = <TKey extends keyof T>(key: TKey): T[TKey] | undefined => {
        return target[key];
    }

    return createWriter(set, get);
}

export function createConfigWriter<T extends Record<string, any>>(target: T) {
    return createObjectWriter({
        target
    });
}

const emptyConfig = undefined as any as ConfigWriter<Record<string, any>>;
export const ConfigWriterContext = createContext<ConfigWriter<Record<string, any>>>(emptyConfig);