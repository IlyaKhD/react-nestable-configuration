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
    transactionId: Symbol;
}

class WriterBase {

    protected _transactionId: Symbol;

    constructor(cfg: WriterBaseCfg) {
        this._transactionId = cfg.transactionId;
    }
}


interface ArrayWriterCfg<T> extends WriterBaseCfg {
    target: T[];
}
class ArrayWriter<T> extends WriterBase {
    public kind = 'array' as const;
    private _target: T[];
    private _index: number | undefined = undefined;

    constructor(cfg: ArrayWriterCfg<T>) {
        super(cfg);

        this._target = cfg.target;
    }

    public set(value: T): void {
        if (this._index == undefined){
            this._index = this._target.push(value) - 1;
        } else {
            this._target[this._index] = value;
        }
    }
}

interface ObjectWriterCfg<T extends Record<string, unknown>> extends WriterBaseCfg {
    target: T;
}
class ObjectWriter<T extends Record<string, unknown>> extends WriterBase {
    public kind = 'object' as const;
    private _target: T;

    constructor(cfg: ObjectWriterCfg<T>) {
        super(cfg);

        this._target = cfg.target;
    }

    public set(values: T): void {
        for (const [key, value] of Object.entries(values)){
            this._target[(key as keyof T)] = value as any; // any?
        }
    }

    public getArrayWriter(name: keyof T): ArrayWriter<any> { // any?

        this._target[name] = this._target[name] ?? [] as any; // any?

        const writer = new ArrayWriter({
            transactionId: this._transactionId,
            target: this._target[name] as any, // any?
        });

        return writer;
    }

    public getObjectWriter(name: keyof T): ObjectWriter<any> { // any?

        const target: Record<string, any> = {}; // any?
        this._target[name] = target as any; // any?

        const writer = new ObjectWriter({
            transactionId: this._transactionId,
            target,
        });

        return writer;
    }

}



// type Values = Record<string, any>; // any?
// type Collection = any[]; // any?

// function createScalarConfigWriter(id: Symbol, target: Values): ScalarConfigWriter {
//     const cache = {};
//     return {
//         id,
//         set(key, value) {
//             target[key] = value;
//         },
//         createChild: createChild.bind({ id, target, cache}),
//         createCollectionChild: createCollectionChild.bind({ id, target, cache})
//     };
// };

// function createCollectionConfigWriter(id: Symbol, target: Collection): CollectionConfigWriter {
//     const cache = {};
//     return {
//         id,
//         add(value) {
//             target.push(value);
//         },
//         createChild: createChild.bind({ id, target, cache}),
//         createCollectionChild: createCollectionChild.bind({ id, target, cache})
//     };
// };

export function createConfigWriter<T extends Record<string, any>>(target: T) {
    return new ObjectWriter({
        transactionId: Symbol('update id:' + Math.round(Math.random() * 1000)),
        target
    });
}


export type ConfigWriter = ArrayWriter<any> | ObjectWriter<any>;

const emptyConfig = undefined as any as ObjectWriter<Record<string, any>>;
export const ConfigWriterContext = createContext<ObjectWriter<Record<string, any>>>(emptyConfig);