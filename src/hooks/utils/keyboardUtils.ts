import React from 'react';
import { setSelectionRange } from './selectionText';

interface DefalutKeyboardActionTable {
  defaultAction?: (e: React.KeyboardEvent<any>) => void;
  startAction?: (e: React.KeyboardEvent<any>) => boolean | void;
  finallyAction?: (e: React.KeyboardEvent<any>) => void;
}

export type KeyboardActionTable = DefalutKeyboardActionTable & {
  [P: string]: (e: React.KeyboardEvent<any>) => void;
};

/**
 * startAction에서 true가 리턴되면 함수 종료
 * @param actionTable 
 */
export function keyboardActionHandler(actionTable: KeyboardActionTable) {
  return (e: React.KeyboardEvent<any>) => {
    if(actionTable.startAction) {
      if(actionTable.startAction(e)) return;
    }
      
    if(actionTable.hasOwnProperty(e.key)) {
      actionTable[e.key](e);
    } else {
      if(actionTable.defaultAction) actionTable.defaultAction(e);
    }

    if(actionTable.finallyAction) actionTable.finallyAction(e);
  }
} 

export function setCursorPoint<T = HTMLDivElement>(element: T, start: number, end: number) {
  if(element instanceof HTMLElement) {
    setSelectionRange(element, start, end);
  }
}