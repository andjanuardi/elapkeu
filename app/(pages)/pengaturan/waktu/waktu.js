'use client';
import { InputDateTime } from '@/app/components/date';
import fetchData from '@/lib/fetch';
import {
  getTanggalJam,
  getTanggalJamToInput,
  getTanggalJamToSQL,
} from '@/lib/func';
import { tahap } from '@/models/staticData';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MdCheck, MdEdit, MdTimelapse, MdTimer } from 'react-icons/md';

export default function Waktu() {
  const [dataWaktu, setDataWaktu] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const getData = useCallback(async () => {
    setLoading(true);
    const { data } = await fetchData('/api/pengaturan', 'POST', { a: 'waktu' });
    data && setDataWaktu(data[0] || []);
    setLoading(false);
  }, []);

  const updateWaktu = useCallback(
    async (val, tahap) => {
      await fetchData('/api/pengaturan', 'POST', {
        a: 'ubahitem',
        data: { c: `batas_tahap${tahap}`, val: getTanggalJamToSQL(val) },
      });
      setEditMode(null);
      getData();
    },
    [getData]
  );

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      {isLoading ? (
        <>
          <div className="skeleton h-50"></div>
          <div className="skeleton h-50"></div>
          <div className="skeleton h-50"></div>
        </>
      ) : (
        <>
          {tahap.map((item, key) => (
            <div key={key} className="card shadow bg-base-100">
              <div className="card-title p-4">Batas Waktu Tahap {item}</div>
              <div className="card-body">
                {editMode !== item ? (
                  <div className="flex text-xl items-center gap-2">
                    <MdTimer className="text-3xl" />
                    <div className="grow">
                      {getTanggalJam(new Date(dataWaktu[`batas_tahap${item}`]))}
                    </div>
                    <button
                      className="btn"
                      onClickCapture={() => setEditMode(item)}
                    >
                      <MdEdit />
                    </button>
                  </div>
                ) : (
                  <div className="flex">
                    <div className="grow ">
                      <InputDateTime
                        defaultValue={getTanggalJamToInput(
                          new Date(dataWaktu[`batas_tahap${item}`])
                        )}
                        className="text-xl"
                        onBlur={(e) => updateWaktu(e._d, item)}
                      />
                    </div>
                    <button
                      className="btn"
                      onClickCapture={() => setEditMode(null)}
                    >
                      <MdCheck />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}
