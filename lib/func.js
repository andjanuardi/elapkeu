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

export function getTanggalJam(date = new Date()) {
  const today = date;
  const day = puluhan(today.getDate());
  const month = today.getMonth();
  const year = today.getFullYear();
  const hour = puluhan(today.getHours());
  const minute = puluhan(today.getMinutes());

  return `${day} ${bulan[month]} ${year} ${hour}:${minute}`;
}

export function getTanggalJamToInput(date = new Date()) {
  const today = date;
  const day = puluhan(today.getDate());
  const month = puluhan(today.getMonth() + 1);
  const year = today.getFullYear();
  const hour = puluhan(today.getHours());
  const minute = puluhan(today.getMinutes());
  return `${year}-${month}-${day}T${hour}:${minute}:00`;
}

export function getTanggalJamToSQL(dateStr) {
  const d = dateStr.split(' ');
  return `${d[2]}-${bulan.indexOf(d[1]) + 1}-${d[0]} ${d[3]}:00`;
}

export function getTanggalToInput(date = new Date()) {
  const today = date;
  const day = puluhan(today.getDate());
  const month = puluhan(today.getMonth() + 1);
  const year = today.getFullYear();
  return `${year}-${month}-${day} `;
}

export function parseID(str) {
  return parseFloat(str.replace(/\./g, '').replace(',', '.') || 0);
}
