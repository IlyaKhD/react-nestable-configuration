import { PropsWithChildren, useContext } from "react";
import { ConfigWriterContext } from "./config-writer";


export interface PropsWithConfigWriter {
    writeConfig(value: unknown): void;
}

export function withConfigWriter<P extends PropsWithChildren<PropsWithConfigWriter>>(
    { name, isCollection }: {
        name: string,
        isCollection?: true,
    },
    Component: React.ComponentType<P>
) {

    return ({ children, ...props }: Omit<P, keyof PropsWithConfigWriter>) => {
        const parentConfigWriter = useContext(ConfigWriterContext);
        const configWriter = isCollection
            ? parentConfigWriter.getArrayWriter(name)
            : parentConfigWriter.getObjectWriter(name);

        return children
            ? (
                <Component {...(props as P)} writeConfig={(x) => configWriter.set(x)} >
                    <ConfigWriterContext.Provider value={configWriter as any}>
                        {children}
                    </ConfigWriterContext.Provider>
                </Component>
            )
            : (<Component {...(props as P)} writeConfig={(x) => configWriter.set(x)} />);
    };
}
