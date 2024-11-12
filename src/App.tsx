import React, { PropsWithChildren, memo, useCallback, useMemo, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import BaseComponent from './BaseComponent';
import { CollectionItem, ObjectItem } from './ConfigComponents';

function CustomObjectItem() {
  return (
    <ObjectItem values={{ d: 99999 }} />
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
        <ObjectItem values={{ a: state + 1 }}>
          <CollectionItem values={{ i: state + 2 }} />
          <CollectionItem values={{ k: state + 3 }} />
          <ObjectItem values={{ b: state + 4 }}>
            <CustomObjectItem />
            <Component2>
              <ObjectItem values={{ aaaaa: state + 5 }}>
                <CollectionItem values={{ i: state + 6 }} />
                <CollectionItem values={{ i: state + 7, k: state + 7 }}>
                  {/* <ObjectItem values={{ p: state + 8 }}/> */}
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
