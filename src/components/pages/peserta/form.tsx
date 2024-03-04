"use client";
import * as React from 'react';
import { useState, useRef } from 'react';
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
  id: number;
  rangeDate: any;
  index: number;
  type: string;
  peserta: any;
  setPeserta: any;
}

const AddPesertaForm = ({
  profile,
  undangan,
  id,
  rangeDate,
  index,
  type,
  peserta,
  setPeserta
}: PropTypes) => {
  const printRef: any = useRef();
  const [openAddPeserta, setOpenAddPeserta] = useState<boolean>(false);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const hanleAddParticipant = () => setOpenAddPeserta(true);

  const mappedPeserta = peserta.map((item: any) => ({
    ...item,
    jumlah_peserta: Array.from({ length: item.jumlah_peserta }, (_, index) => index + 1)
  }));


  return (
    <div className='p-8 dark:bg-meta-4 w-full'>
      <div className='flex justify-between mt-6'>
        <button
          className="border border-xl-base rounded-md w-[10%] px-4 py-1 flex items-center gap-2 bg-white dark:bg-meta-4 dark:text-white mb-2 hover:shadow-md hover:cursor-pointer"
          onClick={handlePrint}
        >
          <BsPrinter size={20} />
          <div>Cetak</div>
        </button>
        <div>
          <button className='bg-xl-base rounded-lg px-4 py-2 text-white hover:shadow-lg' onClick={hanleAddParticipant}><IoPersonAdd size={18} /></button>
        </div>
      </div>
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
              Hari
            </div>
            <div className="w-[2%]">:</div>
            <div className="w-[85%]">{rangeDate}</div>
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
              <TableHead className='border-b-2 border-black'>
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
          <div className="flex flex-col items-center justify-between text-center w-[45%] h-[12em]">
            <div>
              <div className="font-bold text-black dark:text-white text-title-ss mt-1">
                Pembuat
              </div>
            </div>
            {undangan.signature !== "-" && undangan.signature !== null ? (
              <img src={undangan.signature} className="w-[270px] h-[180px]" alt="TTD" />
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
      {/* <div className="btn-submit mx-8 flex flex-row justify-between pb-4 mt-10 space-x-3">
        <div className="w-[8em]">
          <CancelBtn
            title="Keluar"
            data={undangan}
            url="/undangan/addUndangan"
            setLoading={setLoading}
          />
        </div>
        <div className="w-[8em]">
          <Button
            variant="xl"
            className="button-container"
            onClick={handleNext}
            loading={loading}
            rounded
          >
            <div className="flex justify-center items-center text-white">
              <span className="button-text">{step !== null ? 'Lanjut' : 'Simpan'}</span>
            </div>
          </Button>
        </div>
      </div> */}

      <XAddPeserta
        index={index}
        openAddPeserta={openAddPeserta}
        setOpenAddPeserta={setOpenAddPeserta}
        peserta={peserta}
        setPeserta={setPeserta}
      />
    </div>
  )
}

export default AddPesertaForm;