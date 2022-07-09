import React, { ChangeEventHandler, useState } from 'react';

export interface ITextInputProps{
  onChange?: (value: string)=> void
  text?: string
}

function TextInput({ onChange, text }: ITextInputProps) {
  const [value, setValue] = useState(text || '');
  const change: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { currentTarget: { value: v } } = e;
    console.log(v);
    setValue(v);
    if (onChange) onChange(v);
  };
  return (
    <>
      <div>
        <input type="text" value={value} onChange={change} />
      </div>
    </>
  );
}

export default TextInput;
