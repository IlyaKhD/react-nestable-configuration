import React, { PropsWithChildren, memo, useCallback, useMemo, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import BaseComponent from './BaseComponent';
import { CollectionItem, ObjectItem } from './ConfigComponents';

function CustomObjectItem() {
  return (
    <ObjectItem values={{ objC: Math.round(Math.random()*1000) }} />
  );
}

export function Component1({ children }: PropsWithChildren) {
  return BaseComponent({ name: 'component-1', children, values: { x: 100 } });
}

export function Component2({ children }: PropsWithChildren) {
  return BaseComponent({ name: 'component-2', children, values: { y: 300 } });
}

// function TestComp({ value }: { value: number }) {
//   const m = useMemo(() => Math.random(), [ ]);
//   return (
//     <div>
//       {value} - {m}
//     </div>
//   );
// }

function rand() {
  return Math.round(Math.random() * 10000);
}


function C1({ value }: { value: number }) {
  const innerValue = useMemo(rand, []);
  console.log(`value: ${value}, innerValue: ${innerValue}`);
  return (
    <>
      <div>value: {value}</div>
      <div>innerValue: {innerValue}</div>
    </>
  );
}


function withConfigWriter<P extends Record<string, any>>(
  Component: React.ComponentType<P & { value: number; }>
) {
  return (props: P) => (
    <Component {...props} value={rand()}></Component>
  );
}



function App() {
  const [state, setState] = useState(0);
  const invalidate = useCallback(() => {
    setState(state + 1);
  }, [state]);


  return (
    <div className="App">
      <div>state:{state}</div>
      <button onClick={invalidate}>invalidate</button>
      <Component1>
        <ObjectItem values={{ obj: state + 1 }}>
          <CollectionItem values={{ arr: state + 2 }} />
          <CollectionItem values={{ arr: state + 3 }}>
            <CustomObjectItem />
          </CollectionItem>
          <ObjectItem values={{ obj: state + 4 }}>
            <CustomObjectItem />
            <Component2>
              <ObjectItem values={{ obj: state + 5 }}>
                <CollectionItem values={{ arr: state + 6 }} />
                <CollectionItem values={{ arr: state + 7 }}>
                  <CollectionItem values={{ arr: state + 8 }} />
                  <CustomObjectItem />
                  <CollectionItem values={{ arr: state + 9 }} />
                </CollectionItem>
                <CollectionItem values={{ arr: state + 10, k: state + 10 }}>
                  <ObjectItem values={{ obj: state + 11 }}/>
                </CollectionItem>
                <CustomObjectItem />
              </ObjectItem>
            </Component2>
          </ObjectItem>
        </ObjectItem>
      </Component1>
    </div>
  );
}

export default App;
