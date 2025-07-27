-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 172.18.0.3
-- Waktu pembuatan: 27 Jul 2025 pada 18.35
-- Versi server: 10.3.39-MariaDB-1:10.3.39+maria~ubu2004
-- Versi PHP: 8.2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `elapkeu`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `trx_realisasi`
--

CREATE TABLE `trx_realisasi` (
  `kode` bigint(200) NOT NULL,
  `kode_opd` varchar(200) NOT NULL,
  `kode_subkegiatan` varchar(200) NOT NULL,
  `rencana_anggaran` double NOT NULL,
  `realisasi` double DEFAULT NULL,
  `rencana_output` varchar(200) DEFAULT NULL,
  `output` double DEFAULT NULL,
  `tahap` int(200) NOT NULL,
  `tahun` year(4) NOT NULL,
  `kode_user` varchar(200) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `ket_anggaran` text DEFAULT NULL,
  `ket_perben` text DEFAULT NULL,
  `keterangan` text DEFAULT NULL,
  `penyaluran` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `trx_realisasi`
--
ALTER TABLE `trx_realisasi`
  ADD PRIMARY KEY (`kode`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `trx_realisasi`
--
ALTER TABLE `trx_realisasi`
  MODIFY `kode` bigint(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1393;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
