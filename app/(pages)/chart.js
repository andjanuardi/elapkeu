'use client';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

import { Bar, Line, Pie } from 'react-chartjs-2';
import fetchData from '@/lib/fetch';
import randomColor from 'randomcolor';

const options = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
};

export function getCssVariableValue(variableName) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
}

export function ChartRealisasi() {
  const [isLoading, setLoading] = useState(false);
  const [dataGrafik, setDataGrafik] = useState([]);

  const getData = useCallback(async () => {
    setLoading(true);
    const { data } = await fetchData('/api/dashboard/grafikTahap');
    const { data: penyalurandata } = await fetchData('/api/penyaluran');

    const label = [
      'Total Anggaran',
      'Total Penyaluran',
      'Total Realisasi',
      'Sisa Anggaran',
    ];
    const tempData = [];
    label.map((item) => {
      const tempValue = [];
      for (let i = 0; i < 3; i++) {
        item === 'Total Anggaran' &&
          tempValue.push(data[i]?.rencana_anggaran || 0);
        item === 'Total Penyaluran' &&
          tempValue.push(
            penyalurandata.reduce(
              (acc, item) => (item.tahap === i + 1 ? (acc += item.nilai) : acc),
              0
            )
          );
        item === 'Total Realisasi' && tempValue.push(data[i]?.realisasi || 0);
        item === 'Sisa Anggaran' &&
          tempValue.push(data[i]?.rencana_anggaran - data[i]?.realisasi || 0);
      }
      tempData[item] = tempValue;
    });
    setDataGrafik(tempData);
    setLoading(false);
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const data = {
    labels: ['Tahap 1', 'Tahap 2', 'Tahap 3'],
    datasets: [
      {
        label: 'Total Anggaran',
        data: dataGrafik['Total Anggaran'],
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
      },
      {
        label: 'Total Penyaluran',
        data: dataGrafik['Total Penyaluran'],
        backgroundColor: 'rgba(153, 102, 255, 0.8)',
      },
      {
        label: 'Total Realisasi',
        data: dataGrafik['Total Realisasi'],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
      },
      {
        label: 'Sisa Anggaran',
        data: dataGrafik['Sisa Anggaran'],
        backgroundColor: 'rgba(255, 159, 64, 0.8)',
      },
    ],
  };
  return isLoading ? (
    <div className="skeleton h-100 w-full"></div>
  ) : (
    <Bar options={options} data={data} />
  );
}

export function ChartBidang() {
  const [isLoading, setLoading] = useState(false);
  const [dataGrafik, setDataGrafik] = useState([]);

  const getData = useCallback(async () => {
    setLoading(true);
    const { data } = await fetchData('/api/dashboard/grafikBidang');
    setDataGrafik(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  ChartJS.register(ArcElement, Tooltip, Legend);

  const data = {
    labels: dataGrafik.map((item) => item.bidang),
    datasets: [
      {
        label: 'Realisasi',
        data: dataGrafik.map((item) => item.realisasi),
        backgroundColor: dataGrafik.map((item) =>
          randomColor({ format: 'rgba', alpha: 0.8 })
        ),
        borderWidth: 1,
      },
    ],
  };
  return isLoading ? (
    <div className="skeleton h-100 w-full"></div>
  ) : (
    <Pie data={data} options={options} />
  );
}
