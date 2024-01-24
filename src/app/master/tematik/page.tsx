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
import TematikForm from "@/components/pages/tematik/form";
import TematikDetail from '@/components/pages/tematik/detail';
import TematikEditForm from '@/components/pages/tematik/edit';
import Swal from 'sweetalert2';
import { fetchApi } from '@/app/api/request';
import Loading from '@/components/global/Loading/loading';
import { shallowEqual, useSelector } from 'react-redux';
import { State } from '@/store/reducer';
import { FaEdit, FaRegEye } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

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

  const [listTagging, setListTagging] = useState<any>([]);
  const [tagging, setTagging] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openSee, setOpenSee] = useState<boolean>(false);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);

  useEffect(() => {
    fetchTagging();
  }, [openAdd, openEdit]);

  const fetchTagging = async () => {
    const response = await fetchApi({
      url: `/tagging/getAllTagging/${profile.Perangkat_Daerah.kode_opd}`,
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
      setListTagging(response.data.data);
      setLoading(false);
    }
  }

  const handleDetail = async (id: number) => {
    setLoading(true);
    const response = await fetchApi({
      url: `/tagging/getOneTagging/${id}`,
      method: 'get',
      type: "auth"
    })

    if (!response.success) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Koneksi bermasalah!',
      })
      setLoading(false);
    } else {
      setTagging(response.data.data);
      setOpenSee(true);
      setLoading(false);
    }
  }

  const handleEdit = async (id: number) => {
    setLoading(true);
    const response = await fetchApi({
      url: `/tagging/getOneTagging/${id}`,
      method: 'get',
      type: "auth"
    })

    if (!response.success) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Koneksi bermasalah!',
      })
      setLoading(false);
    } else {
      if (response.data.code == 200) {
        setTagging(response.data.data);
        setOpenEdit(true);
        setLoading(false);
      }
    }
  }

  const handleDelete = async (id: number, name: string) => {
    Swal.fire({
      title: `Apakah Anda yakin hapus tagging "${name}" ?`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Hapus',
      denyButtonText: `Batal`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const response = await fetchApi({
          url: `/tagging/deleteTagging/${id}`,
          method: 'delete',
          type: 'auth'
        })
        if (!response.success) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: response.data.message,
          })
          setLoading(false);
          fetchTagging();
        }
        else {
          setLoading(false);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Tagging berhasil dihapus',
            showConfirmButton: false,
            timer: 1500
          })
          fetchTagging();
        }
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

  return (
    <div className="px-4">
      <TematikForm profile={profile} openAdd={openAdd} setOpenAdd={setOpenAdd} />
      {openEdit && <TematikEditForm dataTagging={tagging} openEdit={openEdit} setopenEdit={setOpenEdit} />}
      <TematikDetail dataTagging={tagging} openDetail={openSee} setOpenDetail={setOpenSee} />

      <div className='body table md:w-full w-screen relative'>
        {loading ? (
          <Loading loading={loading} setLoading={setLoading} />
        ) : (
          <>
            <div className='bg-xl-base px-4 py-2 md:w-[10%] w-full flex md:absolute md:right-0 items-center justify-center rounded-xl text-white hover:cursor-pointer' onClick={() => setOpenAdd(true)}>Tambah</div>
            <TableContainer component={Paper} className='w-[100%] mt-14'>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">No</StyledTableCell>
                    <StyledTableCell align="center">Tagging</StyledTableCell>
                    {profile.role == 1 && <StyledTableCell align="center">OPD</StyledTableCell>}
                    <StyledTableCell align="center">Notulen</StyledTableCell>
                    <StyledTableCell align="center">Aksi</StyledTableCell>
                  </TableRow>
                </TableHead>
                {listTagging?.length == 0 ? (
                  <div className='text-center mt-6'>Data Tagging kosong</div>
                ) : (
                  <TableBody>
                    {listTagging?.map((row: any, i: number) => (
                      <StyledTableRow key={i}>
                        <StyledTableCell align="center">{i + 1}</StyledTableCell>
                        <StyledTableCell align="center">{row.nama_tagging}</StyledTableCell>
                        {profile.role == 1 && <StyledTableCell align="center">{row.Perangkat_Daerah.nama_opd}</StyledTableCell>}
                        <StyledTableCell align="center">{row.Uuids.length} Notulen</StyledTableCell>
                        <StyledTableCell align="center">
                          <div className='flex space-x-4 items-center justify-center'>
                            <div onClick={() => handleDetail(row.id)}><FaRegEye size={20} /></div>
                            <div onClick={() => handleEdit(row.id)}><FaEdit size={20} /></div>
                            {row.kode_opd === profile.Perangkat_Daerah.kode_opd && <div onClick={() => handleDelete(row.id, row.nama_tagging)}><MdDelete size={20} /></div>}
                          </div>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </>
        )}
      </div>
    </div>
  )
}

export default withAuth(TambahTematik)