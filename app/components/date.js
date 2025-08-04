'use client';

import {
  getTanggal,
  getTanggalJam,
  getTanggalJamToInput,
  getTanggalToInput,
} from '@/lib/func';
import { useEffect, useRef, useState } from 'react';
import { MdCalendarMonth } from 'react-icons/md';

import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

export function InputDate({
  inputRef = null,
  onChange = () => {},
  required = false,
}) {
  const dateInput = useRef();
  // const [activeDate, setActiveDate] = useState(getTanggal());

  return (
    <>
      <label className="input validator w-full flex justify-between">
        <Datetime
          dateFormat="DD MMMM YYYY"
          initialValue={new Date()}
          inputProps={{ required: { required }, className: 'w-full' }}
          timeFormat={false}
          locale="id"
          onChange={(e) => {
            // setActiveDate(getTanggal(new Date(e._d)));
            onChange(getTanggal(new Date(e._d)));
          }}
        />
        <MdCalendarMonth />
      </label>
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
  return (
    <>
      <label className="input validator w-full flex justify-between ">
        <Datetime
          dateFormat="DD MMMM YYYY"
          initialValue={new Date(defaultValue)}
          inputProps={{
            required: { required },
            className: 'w-full',
          }}
          onClose={onBlur}
          locale="id"
          onChange={(e) => {
            onChange(getTanggalJam(new Date(e._d)));
          }}
        />
        <MdCalendarMonth />
      </label>
    </>
  );
}
