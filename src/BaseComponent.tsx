import { PropsWithChildren, useContext, useLayoutEffect, useState } from "react";
import { ConfigWriterContext, createConfigWriter } from "./config-writer";

function Monospaced({ text }: { text: string }) {
    return (<pre style={{ textAlign: 'left', margin: 10, border: '1px solid red' }}><code>{text}</code></pre>);
}

export default function BaseComponent({ name, children, values }: PropsWithChildren<{ name: string, values?: Record<string, unknown> }>) {
    const config = { 'component-root': name, ...values };
    const configWriter = createConfigWriter(config);
    const [configString, setConfigString] = useState('');
    useLayoutEffect(() => {
        setConfigString(JSON.stringify(config, undefined, 2));
    });
    return (
        <div style={{ margin: 10, border: '1px solid red' }}>
            <Monospaced text={name} />
            <ConfigWriterContext.Provider value={configWriter}>
                {children}
            </ConfigWriterContext.Provider>
            <Monospaced text={configString} />
        </div>
    );
}
