import * as React from 'react';
import { useState, useEffect } from 'react';
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
import { formatDate, getShortDate } from '@/components/hooks/formatDate';
import { setPayload } from '@/store/payload/action';
import { MdBookmarkAdd } from "react-icons/md";
import XAddTagging from './x-modal/XAddTagging';
import XAddSasaran from './x-modal/XAddSasaran';
import { dateISOFormat, dateRangeFormat } from '@/components/helpers/dateRange';

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
  const [rangeDateUndangan, setRangeDateUndangan] = useState<any>([]);
  const [rangeDateNotulen, setRangeDateNotulen] = useState<any>([]);

  useEffect(() => {
    handleSetPeserta();
  }, []);

  const handleSetPeserta = () => {
    let datesUndangan: any = [];
    let datesNotulen: any = [];

    data.forEach((el: any, index: number) => {
      const dateRangeUndangan = dateRangeFormat(el.Undangan !== null && el.Undangan.tanggal !== null && el.Undangan.tanggal[0]);
      const dateRangeNotulen = dateRangeFormat(el.Notulens.length != 0 && el.Notulens[index].tanggal[0]);

      const tempUndangan = dateRangeUndangan.map((date: any) => ({
        tanggal: date,
        jumlah_peserta: 0,
        jenis_peserta: '',
      }))
      datesUndangan.push(tempUndangan);

      const tempNotulen = dateRangeNotulen.map((date: any) => ({
        tanggal: date,
        jumlah_peserta: 0,
        jenis_peserta: '',
      }))
      datesNotulen.push(tempNotulen);
    })

    setRangeDateUndangan(datesUndangan);
    setRangeDateNotulen(datesNotulen);
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClickAddForm = (data: any, index: number, type: string, url: string) => {
    if (data.Undangan !== null) {
      const dateRange = dateRangeFormat(data.Undangan.tanggal[0]);
      const dateFormat = dateISOFormat(dateRange[index]);
      let temp: any = data.Undangan;
      temp.tanggal = new Array(dateFormat);
      temp.hari = data.hari;
      temp.bulan = data.bulan;
      temp.tahun = data.tahun;
      const stored = { step1: temp };

      switch (type) {
        case 'peserta':
          dispatch(setPayload(stored));
          router.push(url);
          break;
        case 'notulen':
          dispatch(setPayload(stored));
          router.push(url);
          break;
        default:
          break;
      }
    }
    // if (data.Notulen !== null) {
    //   let temp: any = data.Notulen;
    //   temp.hari = data.hari;
    //   temp.bulan = data.bulan;
    //   temp.tahun = data.tahun;
    //   const stored = { step1: temp };
    //   dispatch(setPayload(stored));
    //   router.push(url)
    // } else if (data.Undangan !== null) {
    //   let temp: any = data.Undangan;
    //   temp.hari = data.hari;
    //   temp.bulan = data.bulan;
    //   temp.tahun = data.tahun;
    //   const stored = { step2: temp };
    //   dispatch(setPayload(stored));
    //   router.push(url);
    // }
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

  const handleDetail = (data?: any, id?: number, type?: string) => {
    switch (type) {
      case 'undangan':
        router.push(`/undangan/detail/${data.Undangan.id}`);
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
  console.log(data);

  return (
    <React.Fragment>
      <Paper>
        <TableContainer sx={{ maxHeight: 600, overflow: 'auto' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ maxWidth: 40 }}>NO</TableCell>
                <TableCell align="center" style={{ maxWidth: 150 }}>TAGS</TableCell>
                {profile.role == 1 && <TableCell align="center" style={{ maxWidth: 220 }}>OPD</TableCell>}
                {profile.role == 1 || profile.role == 2 && <TableCell align="center" style={{ maxWidth: 220 }}>PEMBUAT</TableCell>}
                <TableCell align="center" style={{ maxWidth: 220 }}>ACARA</TableCell>
                <TableCell align="center" style={{ maxWidth: 100 }}>TANGGAL</TableCell>
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
                    <React.Fragment key={index}>
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell align="center">{index + 1}</TableCell>
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
                            : row.Notulens.length != 0 ? row.Notulens[index].acara : null
                          }
                        </TableCell>
                        <TableCell align='center'>
                          <div className='flex flex-col gap-4 items-center justify-center'>
                            {row.Undangan !== null ? (
                              rangeDateUndangan.length != 0 && rangeDateUndangan[index].map((el: any, i: number) => (
                                <TableRow key={i}>{el.tanggal}</TableRow>
                              ))
                            ) : (
                              <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                                <div className="flex py-3 px-4">
                                  <div className="flex">
                                    {row.Notulens[0].tanggal[0]?.startDate !== null && (
                                      <span>{formatDate(row.Notulens[0].tanggal[0]?.startDate).split(', ')[1]}</span>
                                    )}
                                    {row.Notulens[0].tanggal[0]?.endDate !== null &&
                                      row.Notulens[0].tanggal[0]?.endDate !== row.Notulens[0].tanggal[0]?.startDate && (
                                        <>
                                          <span>-</span>
                                          <span>{formatDate(row.Notulens[0].tanggal[0]?.endDate).split(', ')[1]}</span>
                                        </>
                                      )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell align='center'>
                          <div className='flex flex-col gap-2 items-center justify-center'>
                            <TableRow>
                              {row.Undangan !== null ? (
                                <div
                                  className='flex items-center justify-center text-meta-3 w-6 h-6 rounded-full border border-meta-3 hover:cursor-pointer hover:bg-meta-3 hover:text-white duration-300'
                                  onClick={() => handleDetail(row, row.Undangan?.id, 'undangan')}><FaCheck size={14}
                                  /></div>
                              ) : (
                                <div className='text-danger w-[28px] h-[28px] flex items-center justify-center'><FaCheck size={14} /></div>
                              )}
                            </TableRow>
                          </div>
                        </TableCell>
                        <TableCell align='center'>
                          <div className='flex flex-col gap-2 items-center justify-center'>
                            {row.Peserta.length != 0 && (
                              row.Notulens.find((item: any) => item.uuid === undefined) ? (
                                row.Peserta.map((el: any, i: number) => (
                                  <TableRow key={i}>
                                    {el.uuid !== undefined ? (
                                      <div
                                        className='flex items-center justify-center text-meta-3 w-6 h-6 rounded-full border border-meta-3 hover:cursor-pointer hover:bg-meta-3 hover:text-white duration-300'
                                        onClick={() => handleDetail(row, el.id, 'peserta')}><FaCheck size={14} />
                                      </div>
                                    ) : (
                                      <div
                                        className='rounded-full bg-xl-base w-6 h-6 flex items-center justify-center text-white hover:shadow-lg hover:cursor-pointer duration-300'
                                        onClick={() => handleClickAddForm(row, i, 'peserta', '/peserta/tambah?type=add')}
                                      >+</div>
                                    )}
                                  </TableRow>
                                ))
                              ) : (
                                row.Undangan !== null ? (
                                  row.Peserta.map((el: any, i: number) => (
                                    <TableRow key={i}>
                                      {el.uuid !== undefined ? (
                                        <div
                                          className='flex items-center justify-center text-meta-3 w-6 h-6 rounded-full border border-meta-3 hover:cursor-pointer hover:bg-meta-3 hover:text-white duration-300'
                                          onClick={() => handleDetail(row, el.id, 'peserta')}><FaCheck size={14} />
                                        </div>
                                      ) : (
                                        <div
                                          className='rounded-full bg-xl-base w-6 h-6 flex items-center justify-center text-white hover:shadow-lg hover:cursor-pointer duration-300'
                                          onClick={() => handleClickAddForm(row, i, 'peserta', '/peserta/tambah?type=add')}
                                        >+</div>
                                      )}
                                    </TableRow>
                                  ))
                                ) : (
                                  <div className='text-danger w-[28px] h-[28px] flex items-center justify-center'><FaCheck size={14} /></div>
                                )
                              )
                            )}
                          </div>
                        </TableCell>
                        <TableCell align='center'>
                          <div className='flex flex-col gap-2 items-center justify-center'>
                            {row.Notulens.find((item: any) => item.uuid === undefined) ? (
                              row.Notulens.map((el: any, i: number) => (
                                <TableRow key={i}>
                                  {el.uuid !== undefined ? (
                                    <div
                                      className={`flex items-center justify-center w-6 h-6 rounded-full border hover:cursor-pointer hover:bg-meta-3 hover:text-white duration-300
                                    ${el.status.toLowerCase() === 'disetujui' ? 'text-xl-base border-xl-base' : 'text-meta-3 border-meta-3'}`}
                                      onClick={() => handleDetail(row, el.id, 'notulen')}><FaCheck size={14} />
                                    </div>
                                  ) : (
                                    <div
                                      className='rounded-full bg-xl-base w-6 h-6 flex items-center justify-center text-white hover:shadow-lg hover:cursor-pointer duration-300'
                                      onClick={() => handleClickAddForm(row, i, 'notulen', '/notulen/form?type=add')}
                                    >+</div>
                                  )}
                                </TableRow>
                              ))
                            ) : (
                              row.Undangan !== null ? (
                                row.Notulens.map((el: any, i: number) => (
                                  <TableRow key={i}>
                                    {el.uuid !== undefined ? (
                                      <div
                                        className={`flex items-center justify-center w-6 h-6 rounded-full border hover:cursor-pointer hover:bg-meta-3 hover:text-white duration-300
                                        ${el.status.toLowerCase() === 'disetujui' ? 'text-xl-base border-xl-base' : 'text-meta-3 border-meta-3'}`}
                                        onClick={() => handleDetail(row, el.id, 'notulen')}><FaCheck size={14} />
                                      </div>
                                    ) : (
                                      <div
                                        className='rounded-full bg-xl-base w-6 h-6 flex items-center justify-center text-white hover:shadow-lg hover:cursor-pointer duration-300'
                                        onClick={() => handleClickAddForm(row, i, 'notulen', '/notulen/form?type=add')}
                                      >+</div>
                                    )}
                                  </TableRow>
                                ))
                              ) : (
                                <div
                                  className='flex items-center justify-center text-meta-3 w-6 h-6 rounded-full border border-meta-3 hover:cursor-pointer hover:bg-meta-3 hover:text-white duration-300'
                                  onClick={() => handleDetail(row, row.Notulens[0].id, 'notulen')}><FaCheck size={14} />
                                </div>
                              )
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  )
                  )
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