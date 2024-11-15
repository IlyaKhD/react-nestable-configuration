import { PropsWithChildren } from "react";
import { PropsWithConfigWriter, withConfigWriter } from "./config/withConfigWriter";

export interface Props extends PropsWithConfigWriter {
    values: Record<string, number>;
}

export const CollectionItem = withConfigWriter({
    name: 'collection-items',
    isCollection: true,
}, ({ values, children, writeConfig }: PropsWithChildren<Props>) => {
    writeConfig(values);
    return (
        <div style={{ margin: 10, border: '1px dashed blue' }}>
            <span>{JSON.stringify(values)}</span>
            {children}
        </div>
    );
});


export const ObjectItem = withConfigWriter(
    {
        name: 'object-item'
    },
    ({ values, children, writeConfig }: PropsWithChildren<Props>) => {
        writeConfig(values);

        return (
            <div style={{ margin: 10, border: '1px solid blue' }}>
                <span>{JSON.stringify(values)}</span>
                {children}
            </div>
        );
    });