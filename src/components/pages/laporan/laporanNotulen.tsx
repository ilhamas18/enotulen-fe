'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getTime, getShortDate } from '@/components/hooks/formatDate';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { FaEdit } from 'react-icons/fa'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

interface LaporanNotulenProps {
  data: any;
  loading: boolean;
  profile: any;
}

const LaporanNotulen = ({ data, loading, profile }: LaporanNotulenProps) => {
  const router = useRouter();

  const handleClickDetail = (id: number) => router.push(`/notulen/detail/${id}`);

  return (
    <div className='mt-8'>
      <TableContainer component={Paper} className='dark:bg-meta-4'>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">No</StyledTableCell>
              <StyledTableCell align="center">Hari/Tgl</StyledTableCell>
              <StyledTableCell align="center">Waktu</StyledTableCell>
              <StyledTableCell align="center">Acara</StyledTableCell>
              <StyledTableCell align="center">Lokasi</StyledTableCell>
              {profile.role == 1 ? (
                <StyledTableCell align="center">OPD Pembuat</StyledTableCell>
              ) : profile.role == 2 || profile.role == 3 ? (
                <StyledTableCell align="center">Nama Pembuat</StyledTableCell>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <div className='mt-6 text-center'>Sedang memuat data . . .</div>
            ) : (
              data.length == 0 ? (
                <div className='text-center my-6 text-xsm'>Data Notulen Kosong</div>
              ) : (
                data.map((row: any, i: number) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="center" className='dark:text-white' style={{ width: '40px' }}>{i + 1}</StyledTableCell>
                    <StyledTableCell align="center" className='dark:text-white' style={{ width: '40px' }}>
                      <div className='flex gap-2'>
                        {row.tanggal[0]?.startDate !== null && <span>{getShortDate(row.tanggal[0]?.startDate)}</span>}
                        {row.tanggal[0]?.endDate !== null && row.tanggal[0]?.endDate !== row.tanggal[0]?.startDate && (
                          <>
                            <span>-</span>
                            <span> {getShortDate(row.tanggal[0]?.endDate)}</span>
                          </>
                        )}
                      </div></StyledTableCell>
                    <StyledTableCell align="center" className='dark:text-white' style={{ width: '40px' }}>{getTime(row.waktu)}</StyledTableCell>
                    <StyledTableCell align="center" className='dark:text-white'>{row.acara}</StyledTableCell>
                    <StyledTableCell align="center" className='dark:text-white'>{row.lokasi}</StyledTableCell>
                    {profile.role == 1 ? (
                      <StyledTableCell align="center" className='dark:text-white'>{row.Uuid.Perangkat_Daerah?.nama_opd}</StyledTableCell>
                    ) : profile.role == 2 || profile.role == 3 ? (
                      <StyledTableCell align="center" className='dark:text-white'>{row.Uuid.Pegawai.nama}</StyledTableCell>
                    ) : null}
                    {/* <StyledTableCell align="center" className='dark:text-white'>
                      <div className='flex gap-2'>
                        <button onClick={() => handleClickDetail(row.id)}>
                          <FaEdit size={18} />
                        </button>
                      </div>
                    </StyledTableCell> */}
                  </StyledTableRow>
                ))
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default LaporanNotulen;