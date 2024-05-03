"use client";
import * as React from 'react';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
import { getTime } from '@/components/hooks/formatDate';
import { BsPrinter } from "react-icons/bs";
import XAddPeserta from './x-modal/addPeserta';
import { IoIosSave } from "react-icons/io";
import { fetchApi } from '@/app/api/request';
import Swal from 'sweetalert2';

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
  profile: any;
  undangan: any;
  step: string;
  rangeDate: any;
  index: number;
  type: string;
  peserta: any;
  setPeserta: any;
  setTrigger: any;
}

const AddPesertaForm = ({
  profile,
  undangan,
  step,
  rangeDate,
  index,
  peserta,
  setPeserta,
  setTrigger,
  type
}: PropTypes) => {
  const printRef: any = useRef();
  const router = useRouter();
  const [openAddPeserta, setOpenAddPeserta] = useState<boolean>(false);
  const [storedUser, setStoredUser] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const hanleAddParticipant = () => setOpenAddPeserta(true);

  const mappedPeserta = peserta.map((item: any) => ({
    ...item,
    jumlah_peserta: Array.from({ length: item.jumlah_peserta }, (_, index) => index + 1)
  }));

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      uuid: undangan.uuid,
      jumlah_peserta: peserta[index].jumlah_peserta,
      jenis_peserta: peserta[index].jenis_peserta,
      tanggal: getDay(rangeDate),
      penanggungjawab: storedUser.length != 0 ? storedUser : null,
      nip_penanggungjawab: storedUser.length != 0 ? storedUser.nip : null
    }

    const response = await fetchApi({
      url: '/peserta/addPeserta',
      method: 'post',
      type: 'auth',
      body: payload
    })

    if (!response.success) {
      setLoading(false);
      if (response.data.code == 401) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Unauthorize as user!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Koneksi bermasalah!",
        });
      }
    } else {
      Swal.fire({
        position: "center",
        icon: "success",
        title: `${peserta[index].jumlah_peserta} Peserta ditambahkan`,
        showConfirmButton: false,
        timer: 1500,
      });
      setLoading(false);
      setTrigger(true);
    }
  }

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

  return (
    <div className='py-8 dark:bg-meta-4 w-full'>
      {peserta[index].uuid !== undefined ? (
        <div className='flex justify-between'>
          <button
            className="border border-xl-base rounded-md px-4 py-1 flex items-center gap-2 bg-white dark:bg-meta-4 dark:text-white mb-2 hover:shadow-md hover:cursor-pointer"
            onClick={handlePrint}
          >
            <BsPrinter size={20} />
            <div>Cetak</div>
          </button>
          <div></div>
        </div>
      ) : (
        <div className='flex justify-between'>
          <div></div>
          <div>
            <button className='bg-xl-base rounded-lg px-4 py-2 text-white hover:shadow-lg' onClick={hanleAddParticipant}><IoPersonAdd size={18} /></button>
          </div>
        </div>
      )}
      <div
        className="cetak-wrapper bg-white dark:bg-meta-4 px-8"
        id="container"
        ref={printRef}
      >
        <div className='title flex flex-col text-center font-bold gap-2 text-title-xsm'>
          <div className='uppercase'>Daftar Hadir</div>
          <div className='uppercase'>{undangan.perihal}</div>
        </div>
        <div className='text-black mt-[4em] text-ss font-medium'>
          <div className="flex gap-2 w-full">
            <div className="w-[10%]">
              Hari / Tanggal
            </div>
            <div className="w-[2%]">:</div>
            <div className="w-[85%]">
              {/* {formatDateHandle(undangan.tanggal)} */}
              {getDay(peserta[index].tanggal)}
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <div className="w-[10%]">
              Waktu
            </div>
            <div className="w-[2%]">:</div>
            <div className="w-[85%]">
              {getTime(undangan.waktu)} WIB
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <div className="w-[10%]">
              Tempat
            </div>
            <div className="w-[2%]">:</div>
            <div className="w-[85%]">
              <div className='flex flex-col'>
                {undangan.lokasi.split(', ').map((el: any, i: number) => (
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
                  <StyledTableCell align="center" width={250} className='border border-black'>{peserta[index].jenis_peserta === 'internal' ? 'JABATAN' : 'INSTANSI'}</StyledTableCell>
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
                {mappedPeserta.length != 0 && mappedPeserta[index].jumlah_peserta.map((number: number, i: number) => (
                  <StyledTableRow key={i} className='border border-black'>
                    <StyledTableCell className='border border-black'>{number}</StyledTableCell>
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
          <div>
            {peserta[index].penanggungjawab !== undefined && (
              <div className='flex flex-col items-center justify-between text-center w-[45%] h-[8em]'>
                <div className="font-bold text-black dark:text-white text-title-ss mt-1">
                  Pembuat
                </div>
                <div>
                  {undangan.signature !== "-" && undangan.signature !== null ? (
                    <img src={undangan.signature} className="w-[270px] h-[100px]" alt="TTD" />
                  ) : <></>}
                </div>
                <div>
                  {peserta[index].penanggungjawab !== null && peserta[index].penanggungjawab?.length != 0 ? (
                    <>
                      <div className="font-bold text-black dark:text-white text-title-ss2 border-b border-black">
                        {peserta[index].penanggungjawab?.nama}
                      </div>
                      <div className="text-black dark:text-white text-title-ss mt-1">
                        {" "}
                        {peserta[index].penanggungjawab?.golongan}{" "}
                      </div>
                      <div className="flex flex-row font-bold text-black dark:text-white text-title-ss mt-1">
                        <div>NIP.</div>
                        <div className='ml-2'>{peserta[index].penanggungjawab?.nip}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-bold text-black dark:text-white text-title-ss2 border-b border-black">
                        {profile.nama}
                      </div>
                      <div className="text-black dark:text-white text-title-ss mt-1">
                        {" "}
                        {profile.nama_pangkat}{" "}
                      </div>
                      <div className="flex flex-row font-bold text-black dark:text-white text-title-ss mt-1">
                        <div>NIP.</div>
                        <div className='ml-2'>{profile?.nip}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {peserta[index].jumlah_peserta != 0 && peserta[index].uuid === undefined && (
          <div className='flex justify-between mt-8'>
            <div></div>
            <div className='w-full'>
              {loading ? (
                <div className='rounded-md px-4 py-1 bg-light-gray text-white flex gap-2 items-center justify-center'>
                  <div><img src="/loading.gif" alt="Loading" className='w-6 h-6' /></div>
                  <div>Loading . . .</div>
                </div>
              ) : (
                <div
                  className='rounded-md px-4 py-1 bg-xl-base text-white flex gap-2 items-center justify-center hover:cursor-pointer'
                  onClick={handleSave}
                ><IoIosSave size={20} /> Save</div>
              )}
            </div>
          </div>
        )}
      </div>

      <XAddPeserta
        index={index}
        openAddPeserta={openAddPeserta}
        setOpenAddPeserta={setOpenAddPeserta}
        peserta={peserta}
        setPeserta={setPeserta}
        profile={profile}
        storedUser={storedUser}
        setStoredUser={setStoredUser}
      />
    </div>
  )
}

export default AddPesertaForm;