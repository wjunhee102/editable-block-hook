import { useState, useCallback } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { checkInstanceOfHTMLElement } from './utils/checkInstanceOfElement';
import { keyboardActionHandler } from './utils/keyboardUtils';
import { getSelectionEnd, getSelectionStart, setSelectionRange } from './utils/selectionText';

function useEditableBlock<T extends { value: string }>(initialValue: T) {
  const [ valueList, setValueList ] = useState<T[]>([initialValue]);
  const [ stagedValue, setStatgedValue ] = useState<{ index: number; value: string } | null>(null);
  const [ cursorStart, setCursorStart ] = useState<number>(0);
  const [ cursorEnd, setCursorEnd ] = useState<number>(0);
  const [ currentIndex, setCurrentIndex ] = useState<number | null>(null);

  const commitValue = () => {
    if(!stagedValue) {
      return;
    }

    const { index, value } = stagedValue;

    setValueList(
      valueList.map((preValue, idx) => 
        idx !== index? preValue : { ...preValue, value }
      )
    );

    setStatgedValue(null);
  }

  const addValueInList = useCallback((index?: number) => {
    const newValue = {...initialValue};
    const valueListLength = valueList.length;

    if(index === undefined) {
      setValueList([...valueList, newValue]);
      setCurrentIndex(valueListLength);

      return;
    }

    const newValueList = [...valueList];

    if(index === valueList.length - 1) {
      newValueList.push(newValue);
    } else {
      newValueList.splice(index + 1, 0, newValue);
    }

    setValueList(newValueList);
    setCurrentIndex(index + 1);
  }, [valueList]);

  const deleteValueInList = useCallback((index: number) => () => {
    commitValue();

    if(valueList.length < 2) {
      return;
    }

    setValueList(valueList.filter((value, idx) => index !== idx));
  }, [valueList]);

  const editableBlockKeyUp = useCallback((index: number) => keyboardActionHandler({
    defaultAction: (e: any) => {
      setStatgedValue({ index, value: e.target.innerHTML });
      setCursorStart(getSelectionStart(e.target));
      setCursorEnd(getSelectionEnd(e.target));
    },
    " ": (e: any) => {
      setStatgedValue({ index, value: e.target.innerText });
      setCursorStart(getSelectionStart(e.target));
      setCursorEnd(getSelectionEnd(e.target));
      commitValue();
    },
    Backspace: (e: any) =>{
      if(e.target.innerText.length !== (cursorStart && cursorEnd)) {
        setStatgedValue({ index, value: e.target.innerText });
        setCursorStart(getSelectionStart(e.target));
        setCursorEnd(getSelectionEnd(e.target));
      } 
    },
    Enter: (e: any) => {
      e.preventDefault();
    },
    ArrowUp: (e: any) => {
    },
    ArrowDown: (e: any) => {
    }
  }), [cursorStart, cursorEnd]);

  const editableBlockKeyDown = (index: number) => keyboardActionHandler({
    ArrowUp: (e: any) => {
      e.preventDefault();

      if(cursorStart === 0 && cursorEnd === 0) {
        const valueLength = valueList.length - 1;

        setCurrentIndex(index > 0? index - 1 : valueLength); 

        return;
      } 

      setCursorStart(0);
      setCursorEnd(0);
      setSelectionRange(e.target, 0, 0);
    },
    ArrowDown: (e: any) => {
      e.preventDefault();

      if((cursorEnd && cursorStart) === e.target.innerText.length) {
        const valueLength = valueList.length - 1;

        setCurrentIndex(index < valueLength? index + 1 : 0); 

        return;
      }

      const contentsLength = e.target.innerText.length;
      setCursorStart(contentsLength);
      setCursorEnd(contentsLength);
      setSelectionRange(e.target, contentsLength, contentsLength);
    },
    Backspace: (e: any) => {
  
      const cursorStartPoint = getSelectionStart(e.target);
      const cursorEndPoint   = getSelectionEnd(e.target);
      
      setCursorStart(cursorStartPoint);
      setCursorEnd(cursorEndPoint);

      if(cursorStartPoint === 0 && cursorEndPoint === 0 && index !== 0 && !e.target.innerText) {
        deleteValueInList(index)();
        setCurrentIndex(index - 1);
      }
    }
  });

  const editableBlockKeyPress = (index: number) => keyboardActionHandler({
    Enter: (e: any) => {
      e.preventDefault();

      addValueInList(index);
    }
  });

  const editableBlockFocus = useCallback((index: number, element: HTMLDivElement | null) => {
    if(!checkInstanceOfHTMLElement(element)) return;

      setSelectionRange(element, cursorStart, cursorEnd? cursorEnd : cursorStart);

      if(index !== currentIndex) setCurrentIndex(index); 
    }, [cursorStart, cursorEnd]);

  const editableBlockBlur = useCallback((e: any) => {
    if(e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) {
      setCursorStart(0);
      setCursorEnd(0);
      setCurrentIndex(null);
      commitValue();
    }
  }, []);

  useIdleTimer({
    timeout: 10 * 60 * 1,
    onIdle: commitValue,
    debounce: 500
  });

  return {
    valueList,
    setValueList,
    currentIndex,
    addValueInList,
    deleteValueInList,
    editableBlockKeyDown,
    editableBlockKeyPress,
    editableBlockKeyUp,
    editableBlockFocus,
    editableBlockBlur
  }
}

export default useEditableBlock;