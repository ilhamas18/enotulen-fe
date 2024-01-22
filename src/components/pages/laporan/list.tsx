import * as React from 'react';
import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

interface PropTypes {
  data: any,
  profile: any,
  fetchData?: any
}

const LaporanList = ({ data, profile, fetchData }: PropTypes) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper>
      <TableContainer sx={{ maxHeight: 600, overflow: 'auto' }}>
        {profile.role == 1 ? (
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ minWidth: 80 }}>NO</TableCell>
                <TableCell align="center" style={{ minWidth: 100 }}>TANGGAL</TableCell>
                <TableCell align="center" style={{ minWidth: 220 }}>OPD</TableCell>
                <TableCell align="center" style={{ minWidth: 220 }}>PEMBUAT</TableCell>
                <TableCell align="center" style={{ minWidth: 220 }}>ACARA</TableCell>
                <TableCell align="center" style={{ minWidth: 180 }}>UNDANGAN</TableCell>
                <TableCell align="center" style={{ minWidth: 180 }}>NOTULEN</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .sort((a: any, b: any) => b.id - a.id)
                .map((row: any, index: number) => {
                  return (
                    <React.Fragment>
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell align='center'>{index + 1}</TableCell>
                        <TableCell align='center'>{row.tanggal}</TableCell>
                        <TableCell align='center'>{row.opd}</TableCell>
                        <TableCell align='center'>{row.pembuat}</TableCell>
                        <TableCell align='center'>{row.acara}</TableCell>
                        <TableCell align='center'>
                          {row.undangan === null ? (
                            <div className='flex items-center justify-center text-meta-1'><RxCross2 size={24} /></div>
                          ) : (
                            <div className='flex items-center justify-center text-meta-3'><FaCheck size={18} /></div>
                          )}
                        </TableCell>
                        <TableCell align='center'>
                          {row.notulen === null ? (
                            <div className='flex items-center justify-center text-meta-1'><RxCross2 size={24} /></div>
                          ) : (
                            <div className='flex items-center justify-center text-meta-3'><FaCheck size={18} /></div>
                          )}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
            </TableBody>
          </Table>
        ) : profile.role == 2 ? (
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ minWidth: 80 }}>NO</TableCell>
                <TableCell align="center" style={{ minWidth: 100 }}>TANGGAL</TableCell>
                <TableCell align="center" style={{ minWidth: 220 }}>PEMBUAT</TableCell>
                <TableCell align="center" style={{ minWidth: 220 }}>ACARA</TableCell>
                <TableCell align="center" style={{ minWidth: 180 }}>UNDANGAN</TableCell>
                <TableCell align="center" style={{ minWidth: 180 }}>NOTULEN</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .sort((a: any, b: any) => b.id - a.id)
                .map((row: any, index: number) => {
                  return (
                    <React.Fragment>
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell align='center'>{index + 1}</TableCell>
                        <TableCell align='center'>{row.pembuat}</TableCell>
                        <TableCell align='center'>{row.tanggal}</TableCell>
                        <TableCell align='center'>{row.acara}</TableCell>
                        <TableCell align='center'>
                          {row.undangan === null ? (
                            <div
                              className='border border-meta-1 text-meta-1 rounded-md hover:shadow-lg hover:cursor-pointer text-title-ss2 text-center py-1 px-4 w-[50%]'
                            >Tambah</div>
                          ) : (
                            <div className='flex items-center justify-center text-meta-3'><FaCheck size={18} /></div>
                          )}
                        </TableCell>
                        <TableCell align='center'>
                          {row.notulen === null ? (
                            <div
                              className='border border-meta-1 text-meta-1 rounded-md hover:shadow-lg hover:cursor-pointer text-title-ss2 text-center py-1 px-4'
                            >Tambah</div>
                          ) : (
                            <div className='flex items-center justify-center text-meta-3'><FaCheck size={18} /></div>
                          )}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
            </TableBody>
          </Table>
        ) : profile.role == 3 || profile.role == 4 ? (
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ minWidth: 80 }}>NO</TableCell>
                <TableCell align="center" style={{ minWidth: 100 }}>TANGGAL</TableCell>
                <TableCell align="center" style={{ minWidth: 220 }}>ACARA</TableCell>
                <TableCell align="center" style={{ minWidth: 180 }}>UNDANGAN</TableCell>
                <TableCell align="center" style={{ minWidth: 180 }}>NOTULEN</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .sort((a: any, b: any) => b.id - a.id)
                .map((row: any, index: number) => {
                  return (
                    <React.Fragment>
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell align='center'>{index + 1}</TableCell>
                        <TableCell align='center'>{row.tanggal}</TableCell>
                        <TableCell align='center'>{row.acara}</TableCell>
                        <TableCell align='center'>
                          {row.undangan === null ? (
                            <div
                              className='border border-meta-1 text-meta-1 rounded-md hover:shadow-lg hover:cursor-pointer text-title-ss2 text-center py-1 px-4'
                            >Tambah</div>
                          ) : (
                            <div className='flex items-center justify-center text-meta-3'><FaCheck size={18} /></div>
                          )}
                        </TableCell>
                        <TableCell align='center'>
                          {row.notulen === null ? (
                            <div
                              className='border border-meta-1 text-meta-1 rounded-md hover:shadow-lg hover:cursor-pointer text-title-ss2 text-center py-1 px-4'
                            >Tambah</div>
                          ) : (
                            <div className='flex items-center justify-center text-meta-3'><FaCheck size={18} /></div>
                          )}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
            </TableBody>
          </Table>
        ) : null}
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
  )
}

export default LaporanList;