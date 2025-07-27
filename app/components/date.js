'use client';

import { getTanggal, getTanggalToInput } from '@/lib/func';
import { useRef, useState } from 'react';
import { MdCalendarMonth } from 'react-icons/md';

export function InputDate({
  inputRef = null,
  onChange = () => {},
  required = false,
}) {
  const dateInput = useRef();
  const [activeDate, setActiveDate] = useState(getTanggal());

  return (
    <>
      <label className="input validator w-full">
        <input
          onClick={() => dateInput.current?.showPicker()}
          value={activeDate}
          onChange={() => {}}
          ref={inputRef}
          required={required}
        />
        <MdCalendarMonth />
      </label>
      <input
        type="date"
        className=" invisible h-0"
        required
        ref={dateInput}
        defaultValue={getTanggalToInput()}
        onChange={(e) => {
          setActiveDate(getTanggal(new Date(e.currentTarget.value)));
          onChange(getTanggal(new Date(e.currentTarget.value)));
        }}
      />
    </>
  );
}
