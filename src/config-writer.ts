import { createContext } from "react";

interface ConfigWriter {
    set(key: string, value: number): void;
    createChild(name: string): ConfigWriter;
}

type Values = Record<string, any>; // any?
export function createConfigWriter(target: Values): ConfigWriter {
    return {
        set(key, value) {
            target[key] = value;
        },
        createChild(name) {
            const childTarget = target[name] ?? {};
            target[name] = childTarget;
            const childNode = createConfigWriter(childTarget);
            return childNode;
        }
    };
};

const emptyConfig = undefined as any as ConfigWriter;
export const ConfigWriterContext = createContext<ConfigWriter>(emptyConfig);