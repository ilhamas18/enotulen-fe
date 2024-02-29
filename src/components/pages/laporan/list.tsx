import * as React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { FaCheck } from "react-icons/fa";
import { getShortDate } from '@/components/hooks/formatDate';
import { setPayload } from '@/store/payload/action';
import { MdBookmarkAdd } from "react-icons/md";
import XAddTagging from './x-modal/XAddTagging';
import XAddSasaran from './x-modal/XAddSasaran';

interface PropTypes {
  data: any,
  profile: any,
  fetchData?: any
}

const LaporanList = ({ data, profile, fetchData }: PropTypes) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openAddTagging, setOpenAddTagging] = useState<boolean>(false);
  const [openAddSasaran, setOpenAddSasaran] = useState<boolean>(false);
  const [notulen, setNotulen] = useState<number>(0);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClickAddForm = (data: any, url: string) => {
    if (data.Notulen !== null) {
      let temp: any = data.Notulen;
      temp.hari = data.hari;
      temp.bulan = data.bulan;
      temp.tahun = data.tahun;
      const stored = { step1: temp };
      dispatch(setPayload(stored));
      router.push(url)
    } else if (data.Undangan !== null) {
      let temp: any = data.Undangan;
      temp.hari = data.hari;
      temp.bulan = data.bulan;
      temp.tahun = data.tahun;
      const stored = { step2: temp };
      dispatch(setPayload(stored));
      router.push(url);
    }
  }

  const handleAddTags = (data: any) => {
    if (profile.role == 1 || profile.role == 2) {
      setNotulen(data);
      setOpenAddTagging(true);
    } else if (profile.role == 3 || profile.role == 4) {
      setNotulen(data);
      setOpenAddSasaran(true);
    }
  }

  const trimText = (text: string) => {
    if (text.length > 23) {
      const trimmedText = text.substring(0, 23) + "...";
      return trimmedText
    } else {
      return text;
    }
  }

  const handleDetail = (id: number, type: string) => {
    switch (type) {
      case 'undangan':
        router.push(`/undangan/detail/${id}`);
        break;
      case 'peserta':
        router.push(`/peserta/detail/${id}`);
        break;
      case 'notulen':
        router.push(`/notulen/detail/${id}`);
        break;
      default:
        null;
    }
  }

  return (
    <React.Fragment>
      <Paper>
        <TableContainer sx={{ maxHeight: 600, overflow: 'auto' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ maxWidth: 40 }}>NO</TableCell>
                <TableCell align="center" style={{ maxWidth: 100 }}>TANGGAL</TableCell>
                <TableCell align="center" style={{ maxWidth: 150 }}>TAGS</TableCell>
                {profile.role == 1 && <TableCell align="center" style={{ maxWidth: 220 }}>OPD</TableCell>}
                {profile.role == 1 || profile.role == 2 && <TableCell align="center" style={{ maxWidth: 220 }}>PEMBUAT</TableCell>}
                <TableCell align="center" style={{ maxWidth: 220 }}>ACARA</TableCell>
                <TableCell align="center" style={{ maxWidth: 180 }}>UNDANGAN</TableCell>
                <TableCell align="center" style={{ maxWidth: 180 }}>DAFTAR HADIR</TableCell>
                <TableCell align="center" style={{ maxWidth: 180 }}>NOTULEN</TableCell>
                <TableCell align="center" style={{ maxWidth: 180 }}>PILIH REKIN</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .sort((a: any, b: any) => b.id - a.id)
                  .map((row: any, index: number) => (
                    <React.Fragment>
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="center">
                          {row.Undangan !== null ? (
                            row.Undangan.tanggal[0]?.startDate !== row.Undangan.tanggal[0]?.endDate
                              ? getShortDate(row.Undangan.tanggal[0]?.startDate) + "-" + getShortDate(row.Undangan.tanggal[0]?.endDate)
                              : getShortDate(row.Undangan.tanggal[0]?.startDate)
                          ) : row.Notulen !== null ? (
                            row.Notulen.tanggal[0]?.startDate !== row.Notulen.tanggal[0]?.endDate
                              ? getShortDate(row.Notulen.tanggal[0]?.startDate) + "-" + getShortDate(row.Notulen.tanggal[0]?.endDate)
                              : getShortDate(row.Notulen.tanggal[0]?.startDate)
                          ) : null}
                        </TableCell>
                        <TableCell align="center" width={150}>
                          <div className='flex gap-2 items-center justify-center'>
                            {row.Taggings.length !== 0 ? (row.Taggings.map((el: any, i: number) => (
                              <div key={i} className={`${row.Taggings.length != 1 && 'bg-[#6b7280] text-white px-4 rounded-xl'}`}>{el.nama_tagging}</div>
                            ))
                            ) : "-"}
                          </div>
                        </TableCell>
                        {profile.role == 1 && <TableCell align="center">{trimText(row.Perangkat_Daerah.nama_opd)}</TableCell>}
                        {profile.role == 1 || profile.role == 2 && <TableCell align="center">{row.Pegawai.nama}</TableCell>}
                        <TableCell align="center">
                          {row.Undangan !== null
                            ? row.Undangan.acara
                            : row.Notulen !== null ? row.Notulen.acara : null
                          }
                        </TableCell>
                        <TableCell align="center" className='flex items-center justify-center'>
                          <div className='flex items-center justify-center'>
                            {row.Undangan === null ? (
                              <div
                                className='border border-xl-base p-2 text-xl-base rounded-md hover:shadow-lg hover:cursor-pointer text-title-ss2 text-center py-1'
                                onClick={() => handleClickAddForm(row, '/undangan/tambah')}
                              >+</div>
                            ) : (
                              <div
                                className='flex items-center justify-center text-meta-3 w-6 h-6 rounded-full border border-meta-3 hover:cursor-pointer hover:bg-meta-3 hover:text-white duration-300'
                                onClick={() => handleDetail(row.Undangan?.id, 'undangan')}><FaCheck size={14}
                                /></div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          <div className='flex items-center justify-center'>
                            {row.Undangan === null ? (
                              <div>Undangan belum dibuat</div>
                            ) : (
                              row.Undangan.jumlah_peserta !== null ? (
                                <div
                                  className='flex items-center justify-center text-meta-3 w-6 h-6 rounded-full border border-meta-3 hover:cursor-pointer hover:bg-meta-3 hover:text-white duration-300'
                                  onClick={() => handleDetail(row.Undangan?.id, 'peserta')}><FaCheck size={14}
                                  /></div>
                              ) : (
                                <div
                                  className='border border-xl-base p-2 text-xl-base rounded-md hover:shadow-lg hover:cursor-pointer text-title-ss2 text-center py-1'
                                  onClick={() => handleClickAddForm(row, `/peserta/detail/${row.Undangan?.id}`)}
                                >+</div>
                              )
                            )}
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          <div className='flex items-center justify-center'>
                            {row.Notulen === null ? (
                              <div
                                className='border border-xl-base p-2 text-xl-base rounded-md hover:shadow-lg hover:cursor-pointer text-title-ss2 text-center py-1'
                                onClick={() => handleClickAddForm(row, '/notulen/form')}
                              >+</div>
                            ) : (
                              <div
                                className='flex items-center justify-center text-meta-3 w-6 h-6 rounded-full border border-meta-3 hover:cursor-pointer hover:bg-meta-3 hover:text-white duration-300'
                                onClick={() => handleDetail(row.Notulen?.id, 'notulen')}><FaCheck size={14}
                                /></div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          <button onClick={() => handleAddTags(row)}>
                            <MdBookmarkAdd size={22} />
                          </button>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))
              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {openAddTagging && (
        <XAddTagging
          openAddTagging={openAddTagging}
          setOpenAddTagging={setOpenAddTagging}
          data={notulen}
          fetchData={fetchData}
        />
      )}
      {openAddSasaran && (
        <XAddSasaran
          openAddSasaran={openAddSasaran}
          setOpenAddSasaran={setOpenAddSasaran}
          data={notulen}
          fetchData={fetchData}
        />
      )}
    </React.Fragment>
  )
}

export default LaporanList;