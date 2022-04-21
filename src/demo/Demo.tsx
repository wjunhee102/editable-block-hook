import React, { useEffect, useRef } from 'react';
// import { useIdleTimer } from 'react-idle-timer';
import useEditableBlock from '../hooks/useEditableBlock';

interface ContentsEditableDivProps {
  index: number;
  value: { value: string };
  currentIndex: number | null;
  deleteValueInList: (index: number) => () => void;
  blockFocus: (index: number, element: HTMLDivElement | null) => void;
  editableBlockKeyDown: (index: number) => (e: React.KeyboardEvent<any>) => void;
  editableBlockKeyPress: (index: number) => (e: React.KeyboardEvent<any>) => void;
  editableBlockKeyUp: (index: number) => (e: React.KeyboardEvent<any>) => void;
  editableBlockFocus: (index: number) => (e: React.FocusEvent<HTMLDivElement>) => void;
  editableBlockBlur: (e: any) => void;
}

const ContentsEditableDiv: React.FC<ContentsEditableDivProps> = ({
  currentIndex,
  value,
  index,
  deleteValueInList,
  blockFocus,
  editableBlockKeyDown,
  editableBlockKeyPress,
  editableBlockKeyUp,
  editableBlockFocus,
  editableBlockBlur
}) => {
  const editableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(index !== currentIndex) {
      return;
    }

    blockFocus(index, editableRef.current);
  }, [currentIndex]);

  useEffect(() => {
    const focused = document.activeElement;
    
    if(!editableRef.current || focused !== editableRef.current) {
      return;
    }
    
    editableRef.current.blur();
    editableRef.current.focus();
    blockFocus(index, editableRef.current);
  }, [value]);

  return (
    <li className="flex justify-between w-full border border-gray-300 border-solid">
      <div 
        ref={editableRef}
        className="w-full px-4 py-2"
        contentEditable="true"
        onKeyDown={editableBlockKeyDown(index)}
        onKeyUp={editableBlockKeyUp(index)}
        onKeyPress={editableBlockKeyPress(index)}
        onBlur={editableBlockBlur}
        onFocus={editableBlockFocus(index)}
        dangerouslySetInnerHTML={{
          __html: value.value
        }}
      >
      </div>
      <button 
        className="w-5 h-5 rounded-full bg-slate-300"
        onClick={deleteValueInList(index)}
      >
        X
      </button>
    </li>
  );
}
 
const Demo: React.FC = () => {

  const {
    valueList,
    setValueList,
    currentIndex,
    commitValue,
    addValueInList,
    deleteValueInList,
    blockFocus,
    editableBlockKeyDown,
    editableBlockKeyPress,
    editableBlockKeyUp,
    editableBlockFocus,
    editableBlockBlur
  } = useEditableBlock({ value: "", id: "1" });

  return (
    <ul className="overflow-auto border border-gray-300 border-solid rounded w-[500px] h-[500px] p-4">
      {
        valueList.map((value, idx) => (
          <ContentsEditableDiv
            key={value.id}
            currentIndex={currentIndex}
            index={idx}
            value={value}
            deleteValueInList={deleteValueInList}
            blockFocus={blockFocus}
            editableBlockKeyDown={editableBlockKeyDown}
            editableBlockKeyPress={editableBlockKeyPress}
            editableBlockKeyUp={editableBlockKeyUp}
            editableBlockFocus={editableBlockFocus}
            editableBlockBlur={editableBlockBlur}
          />
        ))
      }
    </ul>
  );
}

export default Demo;