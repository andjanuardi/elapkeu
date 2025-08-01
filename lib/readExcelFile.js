import { SwalError } from '@/app/components/alert';
import readXlsxFile from 'read-excel-file';

export default async function readExcel(input, kode_opd = '') {
  const file = input.currentTarget.files[0];

  function jumlahkanUang(arrayStr = []) {
    let ret = 0;
    if (arrayStr && Array.isArray(arrayStr)) {
      arrayStr.forEach((item) => {
        const clean = item?.replace?.(/\./g, '').replace(',', '.') || '0';
        const parsed = parseFloat(clean);
        if (!isNaN(parsed)) {
          ret += parsed;
        }
      });
    }
    return ret;
  }

  function filterExcel(array) {
    if (!array || !array.length) return [];

    const filtered = array.filter((row) => row[2]?.length === 17);

    if (filtered.length === 0) {
      SwalError(() => {}, 'File yang pilih salah / Kosong');
      return [];
    }

    return filtered
      .filter((item) => item[1] === kode_opd)
      .map((item) => ({
        kode_opd: item[1],
        kode_subkegiatan: item[2],
        subkegiatan: item[3],
        rencana_anggaran: jumlahkanUang([item[4], item[6], item[8], item[10]]),
        realisasi: jumlahkanUang([item[5], item[7], item[9], item[11]]),
      }));
  }

  return new Promise((resolve, reject) => {
    if (!file) {
      SwalError(() => {}, 'File tidak ditemukan');
      return resolve([]);
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const fileContent = e.target.result;
        const rows = await readXlsxFile(fileContent);
        if (rows && rows.length > 0) {
          const result = filterExcel(rows);
          resolve(result);
        } else {
          SwalError(() => {}, 'File kosong');
          resolve([]);
        }
      } catch (err) {
        SwalError(() => {}, 'Gagal membaca atau memproses file');
        reject(err);
      }
    };

    reader.onerror = (e) => {
      SwalError(() => {}, 'Kesalahan Membaca File');
      reject(e.target.error);
    };

    reader.readAsArrayBuffer(file);
  });
}
