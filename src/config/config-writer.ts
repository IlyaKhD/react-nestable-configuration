import { createContext } from "react";

type Obj = Record<string, any>;

interface ConfigWriter<T extends Obj> {
    set(value: T): void;
    getArrayWriter<T2 extends Obj>(name: keyof T): ConfigWriter<T2>;
    getObjectWriter<T2 extends Obj>(name: keyof T): ConfigWriter<T2>;
}

function createWriter<T extends Obj>({ get, set }: {
    get: <TKey extends keyof T>(key: TKey) => T[TKey] | undefined,
    set: (value: T) => void,
}): ConfigWriter<T> {
    return {
        set,
        getObjectWriter<T2 extends Record<string, any>>(name: keyof T): ConfigWriter<T2> {
            const nestedTarget: T2 = {} as any; // any?
            set({ [name]: nestedTarget } as any); // any?

            return createWriter({
                get<TKey extends keyof T2>(key: TKey): T2[TKey] | undefined {
                    return nestedTarget[key];
                },
                set(fields: T2) {
                    mutate(nestedTarget, fields)
                },
            });
        },
        getArrayWriter<T2 extends Record<string, any>>(name: keyof T): ConfigWriter<T2> {
            let nestedTarget: any = get(name); // any?
            if (nestedTarget == undefined) {
                nestedTarget = [];
                set({
                    [name]: nestedTarget
                } as any); // any?
            }

            let index: number | undefined = undefined;

            return createWriter<T2>({
                get<TKey extends keyof T2>(key: TKey): T2[TKey] | undefined {
                    return index == undefined
                        ? undefined
                        : nestedTarget[index][key];
                },
                set(values: T2) {
                    index == undefined
                        ? index = nestedTarget.push(values) - 1
                        : nestedTarget[index] = { ...nestedTarget[index], ...values };
                },
            });
        }
    }
}

function mutate(target: Obj, fields: Obj) {
    for (const [key, value] of Object.entries(fields)) {
        target[(key)] = value;
    }
}

export function createConfigWriter<T extends Record<string, any>>(target: T) {
    return createWriter({
        get(key: string) {
            return target[key];
        },
        set(fields: Obj) {
            mutate(target, fields);
        },
    });
}

const emptyConfig = undefined as any as ConfigWriter<Record<string, any>>;
export const ConfigWriterContext = createContext<ConfigWriter<Record<string, any>>>(emptyConfig);