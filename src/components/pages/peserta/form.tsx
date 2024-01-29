"use client";
import * as React from 'react';
import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useReactToPrint } from "react-to-print";
import { styled } from '@mui/material/styles';
import { Button } from '@/components/common/button/button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Swal from 'sweetalert2';
import { formatDate, getTime } from '@/components/hooks/formatDate';
import { BsPrinter } from "react-icons/bs";
import { setPayload } from '@/store/payload/action';
import CancelBtn from '@/components/hooks/cancelBtn';

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
  payload: any;
}

const AddPesertaForm = ({ profile, payload }: PropTypes) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const printRef: any = useRef();
  const [peserta, setPeserta] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  function formatDateRange(startDate: any, endDate: any) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startDay = start.getDate();
    const endDay = end.getDate();
    const month = start.toLocaleString("default", { month: "long" });
    const year = start.getFullYear();

    if (startDay === endDay) {
      return `${startDay} ${month} ${year}`;
    } else {
      return `${startDay} - ${endDay} ${month} ${year}`;
    }
  }

  const hanleAddParticipant = () => {
    Swal.fire({
      title: "Masukkan jumlah peserta",
      input: "number",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonText: "OK",
      showLoaderOnConfirm: true,
      preConfirm: async (number) => {
        const maxNumber = parseInt(number, 10);

        if (!isNaN(maxNumber) && maxNumber > 0) {
          const newArray = Array.from({ length: maxNumber }, (_, index) => index + 1);
          setPeserta(newArray);
        } else {
          alert('Please enter a valid positive number.');
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {

    });
  }

  const handleNext = () => router.push('/notulen/form?step=3');

  return (
    <div className='p-8 bg-white dark:bg-meta-4 w-full'>
      <div className='flex justify-between mt-6'>
        <button
          className="border border-xl-base rounded-md w-[10%] px-4 py-1 flex items-center gap-2 bg-white dark:bg-meta-4 dark:text-white mb-2 hover:shadow-md hover:cursor-pointer"
          onClick={handlePrint}
        >
          <BsPrinter size={20} />
          <div>Cetak</div>
        </button>
        <div>
          <button className='bg-xl-base rounded-lg px-4 py-2 text-white hover:shadow-lg' onClick={hanleAddParticipant}>+ Jumlah Peserta</button>
        </div>
      </div>
      <div
        className="cetak-wrapper bg-white dark:bg-meta-4 px-8"
        id="container"
        ref={printRef}
      >
        <div className='title flex flex-col text-center font-bold gap-2 text-title-xsm'>
          <div className='uppercase'>Daftar Hadir</div>
          <div className='uppercase'>{payload.perihal}</div>
        </div>
        <div className='text-black mt-[4em] text-ss font-medium'>
          <div className="flex gap-2 w-full">
            <div className="w-[10%]">
              Hari
            </div>
            <div className="w-[2%]">:</div>
            <div className="w-[85%]">
              {payload.tanggal[0]?.startDate !== null &&
                payload.tanggal[0]?.endDate !== null &&
                payload.tanggal[0]?.startDate ===
                payload.tanggal[0]?.endDate && (
                  <span>
                    {formatDate(payload.tanggal[0]?.startDate)}
                  </span>
                )}
              {payload.tanggal[0]?.startDate !== null &&
                payload.tanggal[0]?.endDate !== null &&
                payload.tanggal[0]?.startDate !==
                payload.tanggal[0]?.endDate && (
                  <span>
                    {formatDateRange(
                      payload.tanggal[0]?.startDate,
                      payload.tanggal[0]?.endDate
                    )}
                  </span>
                )}
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <div className="w-[10%]">
              Waktu
            </div>
            <div className="w-[2%]">:</div>
            <div className="w-[85%]">
              {getTime(payload.waktu)} WIB
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <div className="w-[10%]">
              Tempat
            </div>
            <div className="w-[2%]">:</div>
            <div className="w-[85%]">
              {payload.lokasi}
            </div>
          </div>
        </div>
        <div className='mt-4 body'>
          <TableContainer component={Paper} className='dark:bg-meta-4'>
            <Table sx={{ minWidth: '100%' }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center" width={2} className='border border-black'>No</StyledTableCell>
                  <StyledTableCell align="center" width={250} className='border border-black'>NAMA</StyledTableCell>
                  <StyledTableCell align="center" width={10} className='border border-black'>LAKI-LAKI</StyledTableCell>
                  <StyledTableCell align="center" width={10} className='border border-black'>PEREM PUAN</StyledTableCell>
                  <StyledTableCell align="center" width={250} className='border border-black'>INSTANSI</StyledTableCell>
                  <StyledTableCell align="center" width={300} className='border border-black'>TANDA TANGAN</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {peserta.map((number: number, i: number) => (
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
          <div className="flex flex-col items-center justify-between text-center w-[45%] h-[12em]">
            <div>
              <div className="font-bold text-black dark:text-white text-title-ss mt-1">
                Pembuat
              </div>
            </div>
            {payload.signature !== "-" && (
              <img src={payload.signature} className="w-[270px]" alt="TTD" />
            )}
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
      <div className="btn-submit mx-8 flex flex-row justify-between pb-4 mt-10 space-x-3">
        <div className="w-[8em]">
          <CancelBtn
            title="Keluar"
            data={payload}
            url="/undangan/addUndangan"
            setLoading={setLoading}
          />
        </div>
        <div className="w-[8em]">
          <Button
            variant="xl"
            className="button-container"
            onClick={handleNext}
            rounded
          >
            <div className="flex justify-center items-center text-white">
              <span className="button-text">Lanjut</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddPesertaForm;