import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Hello } from "./test";

let age: number = 30;
let str: string = 'I am';
 let sentence:string= `Hello! ${str}${age}`;


 function add(x: number, y: number): number {
  return x + y;
}

let myAdd: (x: number, y: number) => number =
    function(x: number, y: number): number { return x + y; };
    
const result=myAdd(5,7)

ReactDOM.render(
<div>{result}</div>,
  /*   <Hello compiler="TypeScript" framework="React" />, */
    document.querySelector("#root")
);