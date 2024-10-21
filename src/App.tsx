import React, { PropsWithChildren, useLayoutEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import BaseComponent from './BaseComponent';
import ConfigComponent from './ConfigComponent';

function CustomConfigComponent() {
  return (
    <ConfigComponent name='child-in-custom-config' values={{ d: 4 }} />
  );
}

export function Component1({ children }: PropsWithChildren) {
  return BaseComponent({ name: 'component-1', children, values: { x: 100 } });
}

export function Component2({ children }: PropsWithChildren) {
  return BaseComponent({ name: 'component-2', children, values: { y: 300 } });
}

function App() {
  return (
    <div className="App">
      <Component1>
        <ConfigComponent name='child1' values={{ aa: 1 }} />
        <ConfigComponent name='child1' values={{ ab: 1 }} />
        <ConfigComponent name='child2' values={{ a: 2 }}>
          <ConfigComponent name='grand-child' values={{ b: 2 }}>
            <CustomConfigComponent />
            <Component2>
            <ConfigComponent name='another-child1' values={{ aaaaa: 11111 }}>
              <CustomConfigComponent />
            </ConfigComponent>
            </Component2>
          </ConfigComponent>
        </ConfigComponent>
      </Component1>
    </div>
  );
}

export default App;
