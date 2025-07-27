"use client";

import { SwalError } from "@/app/components/alert";

export default async function fetchData(
  url,
  method = "GET",
  data = [],
  errorCallback = () => {}
) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (method !== "GET") {
    options.body = JSON.stringify(data);
  }

  try {
    const res = await fetch(url, options);

    if (res.status === 404) {
      throw new Error(
        "Gagal mengambil data dari server. Periksa koneksi internet Anda."
      );
    }
    const ret = await res.json();

    if (!ret.status) {
      throw new Error(ret.data);
    }

    return ret;
  } catch (error) {
    console.error(error);
    SwalError(errorCallback, error);
    return [];
  }
}
