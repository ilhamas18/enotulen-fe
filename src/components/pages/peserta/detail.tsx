"use client";
import * as React from 'react';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useReactToPrint } from "react-to-print";
import { styled } from '@mui/material/styles';
import { IoPersonAdd } from "react-icons/io5";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { formatDate, getTime } from '@/components/hooks/formatDate';
import { BsPrinter } from "react-icons/bs";
import XAddPeserta from './x-modal/addPeserta';
import { IoIosSave } from "react-icons/io";
import { fetchApi } from '@/app/api/request';
import Swal from 'sweetalert2';
import { formattedDate } from '@/components/helpers/formatMonth';
import { Button } from '@/components/common/button/button';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    fontSize: 12,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface PropTypes {
  id: number;
  profile: any;
  peserta: any;
  setPeserta: any;
}

const DetailPeserta = ({
  id,
  profile,
  peserta,
  setPeserta,
}: PropTypes) => {
  const printRef: any = useRef();
  const router = useRouter();
  const [openAddPeserta, setOpenAddPeserta] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const hanleAddParticipant = () => setOpenAddPeserta(true);

  const getDay = (dateString: string) => {
    var dateParts = dateString.split(" ");
    var day = parseInt(dateParts[0]);
    var month = dateParts[1];
    var year = parseInt(dateParts[2]);
    var date = new Date(year, ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].indexOf(month), day);
    var days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    var dayName = days[date.getDay()];
    var formattedDate = dayName + ", " + dateString;

    return formattedDate;
  }

  const mappedPeserta = Array.from({ length: peserta.jumlah_peserta }, (_, index) => index + 1);

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      uuid: peserta.uuid,
      jumlah_peserta: peserta.jumlah_peserta,
      jenis_peserta: peserta.jenis_peserta,
    }
    const response = await fetchApi({
      url: `/peserta/editPeserta/${id}`,
      method: 'put',
      type: 'auth',
      body: payload
    })

    if (!response.success) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Koneksi bermasalah!",
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Berhasil Edit Daftar Hadir",
        showConfirmButton: false,
        timer: 1500,
      });
      router.push('/laporan');
    }
  }

  const handleDelete = async () => {
    Swal.fire({
      title: `Yakin Hapus Permanen ${peserta.jumlah_peserta} Daftar Hadir ?`,
      showDenyButton: true,
      confirmButtonText: 'Hapus',
      denyButtonText: `Batal`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const response = await fetchApi({
          url: `/peserta/deletePeserta/${id}`,
          method: 'delete',
          type: 'auth'
        })

        if (!response.success) {
          setLoading(false);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Koneksi bermasalah!",
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "success",
            title: `Sukses hapus daftar hadir`,
            showConfirmButton: false,
            timer: 1500,
          });
          router.push('/laporan');
        }
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

  const handleCancel = () => router.push('/laporan');

  return (
    <div className='py-8 dark:bg-meta-4 w-full'>
      <div className='flex justify-between'>
        <button
          className="border border-xl-base rounded-md px-4 py-1 flex items-center gap-2 bg-white dark:bg-meta-4 dark:text-white mb-2 hover:shadow-md hover:cursor-pointer"
          onClick={handlePrint}
        >
          <BsPrinter size={20} />
          <div>Cetak</div>
        </button>
        <div className='flex gap-2'>
          <div>
            <button
              className='border border-none rounded-lg px-8 py-1 hover:shadow-lg bg-danger text-white hover:cursor-pointer'
              onClick={handleDelete}
            >
              Hapus
            </button>
          </div>
          <div>
            <button className='bg-xl-base rounded-lg px-4 py-2 text-white hover:shadow-lg' onClick={hanleAddParticipant}><IoPersonAdd size={18} /></button>
          </div>
        </div>
      </div>

      <div
        className="cetak-wrapper bg-white dark:bg-meta-4 px-8"
        id="container"
        ref={printRef}
      >
        <div className='title flex flex-col text-center font-bold gap-2 text-title-xsm'>
          <div className='uppercase'>Daftar Hadir</div>
          <div className='uppercase'>{peserta.Uuid.Undangan.perihal}</div>
        </div>
        <div className='text-black mt-[4em] text-ss font-medium'>
          <div className="flex gap-2 w-full">
            <div className="w-[10%]">
              Hari
            </div>
            <div className="w-[2%]">:</div>
            <div className="w-[85%]">{getDay(peserta.tanggal)}</div>
          </div>
          <div className="flex gap-2 w-full">
            <div className="w-[10%]">
              Waktu
            </div>
            <div className="w-[2%]">:</div>
            <div className="w-[85%]">
              {getTime(peserta.Uuid.Undangan.waktu)} WIB
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <div className="w-[10%]">
              Tempat
            </div>
            <div className="w-[2%]">:</div>
            <div className="w-[85%]">
              <div className='flex flex-col'>
                {peserta.Uuid.Undangan.lokasi.split(', ').map((el: any, i: number) => (
                  <div key={i}>{el}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className='mt-4 body'>
          <TableContainer component={Paper} className='dark:bg-meta-4'>
            <Table sx={{ minWidth: '100%' }} aria-label="customized table">
              <TableHead className='border-b-2 border-black '>
                <TableRow>
                  <StyledTableCell align="center" width={2} className='border border-black'>No</StyledTableCell>
                  <StyledTableCell align="center" width={250} className='border border-black'>NAMA</StyledTableCell>
                  <StyledTableCell align="center" width={10} className='border border-black'>LAKI-LAKI</StyledTableCell>
                  <StyledTableCell align="center" width={10} className='border border-black'>PEREM PUAN</StyledTableCell>
                  <StyledTableCell align="center" width={250} className='border border-black'>{peserta.jenis_peserta === 'internal' ? 'JABATAN' : 'INSTANSI'}</StyledTableCell>
                  <StyledTableCell align="center" width={300} className='border border-black'>TANDA TANGAN</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow className='border-b-2 border-light-gray max-h-1'>
                  <StyledTableCell align="center" width={2} className='border border-black italic'>1</StyledTableCell>
                  <StyledTableCell align="center" width={250} className='border border-black italic'>2</StyledTableCell>
                  <StyledTableCell align="center" width={10} className='border border-black italic'>3</StyledTableCell>
                  <StyledTableCell align="center" width={10} className='border border-black italic'>4</StyledTableCell>
                  <StyledTableCell align="center" width={250} className='border border-black italic'>5</StyledTableCell>
                  <StyledTableCell align="center" width={300} className='border border-black italic'>6</StyledTableCell>
                </TableRow>
                {mappedPeserta.length != 0 && mappedPeserta.map((number: number, i: number) => (
                  <StyledTableRow key={i} className='border border-black'>
                    <StyledTableCell className='border border-black'>{i + 1}</StyledTableCell>
                    <StyledTableCell className='border border-black'></StyledTableCell>
                    <StyledTableCell className='border border-black'></StyledTableCell>
                    <StyledTableCell className='border border-black'></StyledTableCell>
                    <StyledTableCell className='border border-black'></StyledTableCell>
                    <StyledTableCell className='border border-black'>
                      {number % 2 == 0 ? (
                        <div className='text-right pr-[50%]'>{number}</div>
                      ) : (
                        <div className='text-left'>{number}</div>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className='signature mt-14 flex justify-between'>
          <div></div>
          <div className="flex flex-col items-center justify-between text-center w-[45%] h-[12em]">
            <div>
              <div className="font-bold text-black dark:text-white text-title-ss mt-1">
                Pembuat
              </div>
            </div>
            {peserta.Uuid.Undangan.signature !== "-" && peserta.Uuid.Undangan.signature !== null ? (
              <img src={peserta.Uuid.Undangan.signature} className="w-[270px] h-[180px]" alt="TTD" />
            ) : <></>}
            <div>
              <div className="font-bold text-black dark:text-white text-title-ss2 border-b border-black">
                {profile.nama}
              </div>
              <div className="text-black dark:text-white text-title-ss mt-1">
                {" "}
                {profile.nama_pangkat}{" "}
              </div>
              <div className="font-bold text-black dark:text-white text-title-ss mt-1">
                NIP. {profile?.nip}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="btn-submit flex flex-row justify-between mt-10 space-x-3">
        <div className="w-[8em]">
          <Button
            variant="xl"
            type="secondary"
            className="button-container"
            onClick={handleCancel}
            rounded
          >
            <div className="flex justify-center items-center text-[#002DBB] font-Nunito">
              <span className="button-text">Batal</span>
            </div>
          </Button>
        </div>
        <div className="w-[8em]">
          <Button
            variant="xl"
            className="button-container"
            onClick={handleSubmit}
            loading={loading}
            disabled={!peserta.isFilled ? true : false}
            rounded
          >
            <div className="flex justify-center items-center text-white">
              <span className="button-text">Simpan</span>
            </div>
          </Button>
        </div>
      </div>

      <XAddPeserta
        openAddPeserta={openAddPeserta}
        setOpenAddPeserta={setOpenAddPeserta}
        peserta={peserta}
        setPeserta={setPeserta}
      />
    </div>
  )
}

export default DetailPeserta;