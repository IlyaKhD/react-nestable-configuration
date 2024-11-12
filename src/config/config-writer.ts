import { createContext } from "react";

// interface ConfigWriterBase {
//     id: Symbol;
//     createChild(name: string): ScalarConfigWriter;
//     createCollectionChild(name: string): CollectionConfigWriter;
// }

// interface ScalarConfigWriter extends ConfigWriterBase {
//     set(key: string, value: number): void;
// }

// interface CollectionConfigWriter extends ConfigWriterBase {
//     add(value: Record<string, any>): void;
// }

// interface WriterContext {
//     id: Symbol;
//     target: Values;
//     cache: Record<string, any>; // any?
// };

// function createChild(this: WriterContext, name: string) {
//     const childTarget = {};
//     this.target[name] = childTarget;
//     const child = this.cache[name] ?? createScalarConfigWriter(this.id, childTarget);
//     this.cache[name] = child;
//     return child;
// }

// function createCollectionChild(this: WriterContext, name: string) {
//     const childTarget = this.target[name] ?? [];
//     this.target[name] = childTarget;
//     console.log(this.cache[name]);
//     const child = this.cache[name] ?? createCollectionConfigWriter(this.id, childTarget);
//     this.cache[name] = child;
//     return child;
// }

interface WriterBaseCfg {
    // transactionId: Symbol;
}

class WriterBase {

    // protected _transactionId: Symbol;

    // constructor(cfg: WriterBaseCfg) {
        // this._transactionId = cfg.transactionId;
    // }
}

interface Writer<T> {
    set(value: T): void;
}
interface ArrayWriterCfg<T> extends WriterBaseCfg {
    target: T[];
}

function createArrayWriter<T>({ target }: ArrayWriterCfg<T>) {
    let index: number | undefined = undefined;

    return {
        set(value: T): void {
            if (index == undefined){
                index = target.push(value) - 1;
            } else {
                target[index] = value;
            }
        }
    };
}

interface ObjectWriter<T> extends WriterBaseCfg {
    set(value: T): void;
    getArrayWriter<T2>(name: keyof T): Writer<T2>;
    getObjectWriter<T2 extends Record<string, any>>(name: keyof T): ObjectWriter<T2>;
}

interface ObjectWriterCfg<T> extends WriterBaseCfg {
    target: T;
}

function createObjectWriter<T extends Record<string, any>>({ target }: ObjectWriterCfg<T>) {
    
    return {
        set(values: T): void {
            for (const [key, value] of Object.entries(values)){
                target[(key as keyof T)] = value;
            }
        },
        getArrayWriter<T2>(name: keyof T): Writer<T2> {

            target[name] = target[name] ?? [] as any; // any?
    
            const writer = createArrayWriter({
                target: target[name],
            });
    
            return writer;
        },
        getObjectWriter<T2 extends Record<string, any>>(name: keyof T): ObjectWriter<T2> {

            target[name] = {} as any; // any?
    
            const writer = createObjectWriter({
                target: target[name],
            });
    
            return writer;
        }
    };
}

export function createConfigWriter<T extends Record<string, any>>(target: T) {
    return createObjectWriter({
        target
    });
}


export type ConfigWriter = Writer<any> | ObjectWriter<any>;

const emptyConfig = undefined as any as ObjectWriter<Record<string, any>>;
export const ConfigWriterContext = createContext<ObjectWriter<Record<string, any>>>(emptyConfig);