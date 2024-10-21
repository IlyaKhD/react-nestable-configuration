import { PropsWithChildren, useContext } from "react";
import { ConfigWriterContext } from "./config-writer";

interface Props {
    name: string;
    values: Record<string, number>;
}
export default function ConfigComponent(
    { name, values, children }: PropsWithChildren<Props>
) {
    const parentConfigWriter = useContext(ConfigWriterContext);
    const configWriter = parentConfigWriter.createChild(name);

    for (const [key, value] of Object.entries(values)) {
        configWriter.set(key, value);
    }

    return (
        <div style={{margin: 10, border: '1px solid blue'}}>
            <span>{name}: {JSON.stringify(values)}</span>
            <ConfigWriterContext.Provider value={configWriter}>
                {children}
            </ConfigWriterContext.Provider>
        </div>
    );
};
