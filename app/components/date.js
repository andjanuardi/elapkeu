'use client';

import {
  getTanggal,
  getTanggalJam,
  getTanggalJamToInput,
  getTanggalToInput,
} from '@/lib/func';
import { useEffect, useRef, useState } from 'react';
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

export function InputDateTime({
  inputRef = null,
  onBlur = () => {},
  onChange = () => {},
  required = false,
  className = '',
  defaultValue = getTanggalJamToInput(),
}) {
  const dateInput = useRef();
  const [activeDate, setActiveDate] = useState(
    getTanggalJam(new Date(defaultValue)) || getTanggalJam()
  );
  return (
    <>
      <label className="input validator w-full ">
        <input
          onClick={() => dateInput.current?.showPicker()}
          value={activeDate}
          onChange={onChange}
          ref={inputRef}
          onBlur={onBlur}
          required={required}
          className={className}
        />
        <MdCalendarMonth />
      </label>
      <input
        type="datetime-local"
        className=" invisible h-0"
        required
        ref={dateInput}
        defaultValue={defaultValue}
        onChange={(e) => {
          setActiveDate(getTanggalJam(new Date(e.currentTarget.value)));
          // setActiveDate(getTanggal(new Date(e.currentTarget.value)));
          onChange(getTanggalJam(new Date(e.currentTarget.value)));
        }}
      />
    </>
  );
}
