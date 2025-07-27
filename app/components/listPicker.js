'use client';
import fetchData from '@/lib/fetch';
import { useEffect, useRef, useState } from 'react';

export function ListPicker({
  url,
  defaultValue = '',
  placeholder = 'Ketik sesuatu...',
  labelIndex = 0,
  onItemSelected = () => {},
  inputRef = null,
  required = false,
  className = 'input w-full',
  semua = false,
}) {
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasSelectedItem, setHasSelectedItem] = useState(false);
  const timeoutRef = useRef(null);

  async function cariData(value) {
    // if (!value) {
    //   setListData([]);
    //   setShowDropdown(false);
    //   return;
    // }

    setLoading(true);
    const response = await fetchData(url, 'POST', {
      a: 'carisemua',
      data: value,
      limit: 5,
    });

    const data = Array.isArray(response.data) ? response.data : [];
    setListData(data);
    setLoading(false);
    setShowDropdown(true);
  }

  function getLabel(item) {
    if (Array.isArray(item)) {
      return item[labelIndex] || '';
    } else if (typeof item === 'object' && item !== null) {
      const keys = Object.keys(item);
      return item[keys[labelIndex]] || '';
    } else {
      return String(item);
    }
  }

  function handleChange(e) {
    setLoading(true);
    const val = e.target.value;
    setSelectedValue(val);
    setHasSelectedItem(false);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      cariData(val);
    }, 500);
  }

  function handleBlur() {
    setTimeout(() => {
      setShowDropdown(false);
      if (!hasSelectedItem) {
        setSelectedValue('');
        setSelectedItem(null);
      }
    }, 100);
  }

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className="dropdown w-full relative">
      <div className="relative">
        <input
          required={required}
          ref={inputRef}
          type="text"
          value={selectedValue}
          placeholder={placeholder}
          className={className}
          onChange={handleChange}
          onBlur={handleBlur}
          onClick={() => cariData('')}
          onFocus={() => selectedValue && setShowDropdown(true)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setShowDropdown(false);
            }
          }}
        />
        {selectedValue && (
          <button
            type="button"
            onClick={() => {
              setSelectedValue('');
              setSelectedItem(null);
              setHasSelectedItem(false);
              setListData([]);
              setShowDropdown(false);
              onItemSelected(null); // Clear selection
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
          >
            ✕
          </button>
        )}
      </div>

      {showDropdown && (
        <ul className="dropdown-content menu bg-base-100 rounded-box z-10 p-2 shadow-sm w-full absolute mt-1 max-h-60 overflow-y-auto">
          {semua && (
            <li
              className="cursor-pointer hover:bg-base-200 px-2 py-1 rounded"
              onMouseDown={() => {
                setSelectedValue('Semua');
                setSelectedItem({ value: 'semua' });
                setHasSelectedItem(true);
                setShowDropdown(false);
                onItemSelected({ value: 'semua' }); // Callback dengan item asli
              }}
            >
              Semua
            </li>
          )}
          {loading ? (
            <li className="text-center text-sm text-gray-500">Memuat...</li>
          ) : listData.length === 0 ? (
            <li className="text-center text-sm text-gray-500">
              Data tidak ditemukan
            </li>
          ) : (
            listData.map((item, index) => (
              <li key={index}>
                <a
                  onMouseDown={() => {
                    const label = getLabel(item);
                    setSelectedValue(label);
                    setSelectedItem(item);
                    setHasSelectedItem(true);
                    setShowDropdown(false);
                    onItemSelected(item); // Callback dengan item asli
                  }}
                  className="cursor-pointer hover:bg-base-200 px-2 py-1 rounded"
                >
                  {getLabel(item)}
                </a>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
