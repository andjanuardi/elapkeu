'use client';

function puluhan(e) {
  return e < 10 ? `0${e}` : e;
}

const bulan = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];
export function getTanggal(date = new Date()) {
  const today = date;
  const day = puluhan(today.getDate());
  const month = today.getMonth();
  const year = today.getFullYear();

  return `${day} ${bulan[month]} ${year}`;
}

export function getTanggalToInput(date = new Date()) {
  const today = date;
  const day = puluhan(today.getDate());
  const month = puluhan(today.getMonth() + 1);
  const year = today.getFullYear();
  return `${year}-${month}-${day}`;
}
