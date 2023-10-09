'use client'
import * as React from 'react';
import { useState, useEffect } from 'react';
import { UseSelector } from 'react-redux/es/hooks/useSelector';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import withAuth from "@/components/hocs/withAuth"
import TematikForm from "@/components/pages/tematik/form"
import Swal from 'sweetalert2';
import { fetchApi } from '@/components/mixins/request';
import Loading from '@/components/global/Loading/loading';
import { shallowEqual, useSelector } from 'react-redux';
import { State } from '@/store/reducer';

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

const TambahTematik = () => {
  const { profile } = useSelector((state: State) => ({
    profile: state.profile.profile
  }), shallowEqual);

  const [tagging, setTagging] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [flagFilled, setFlagFilled] = useState<boolean>(false);

  useEffect(() => {
    fetchTagging();
  }, [flagFilled]);

  const fetchTagging = async () => {
    const response = await fetchApi({
      url: `/tagging/getAllTagging`,
      method: 'get',
      type: "auth"
    })

    if (!response.success) {
      if (response.data.code == 500) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Koneksi bermasalah!',
        })
      }
      setLoading(false);
    } else {
      setTagging(response.data.data);
      setLoading(false);
    }
  }

  return (
    <div className="px-4">
      {profile.role == 1 && <TematikForm setFlagFilled={setFlagFilled} />}
      
      <div className='body table w-full'>
        {loading ? (
          <Loading loading={loading} setLoading={setLoading} />
        ) : (
          <TableContainer component={Paper} className='w-[100%] mt-6'>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">No</StyledTableCell>
                  <StyledTableCell align="center">Tagging</StyledTableCell>
                </TableRow>
              </TableHead>
              {tagging.length == 0 ? (
                <div className='text-center mt-6'>Data Tagging kosong</div>
              ) : (
                <TableBody>
                  {tagging.map((row: any, i: number) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">{i + 1}</StyledTableCell>
                      <StyledTableCell align="center">{row.nama_tagging}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  )
}

export default withAuth(TambahTematik)