import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { darken, lighten, styled } from '@mui/material/styles';
import { fetchApi } from '@/components/mixins/request';
import Swal from 'sweetalert2';
import XAddTagging from '../laporan/x-modal/XAddTagging';
import XAddSasaran from '../laporan/x-modal/XAddSasaran';
import Loading from '@/components/global/Loading/loading';

interface PropTypes {
  data: any,
  profile: any,
  fetchData?: any
}

const LaporanNotulenList = ({ data, profile, fetchData }: PropTypes) => {
  const router = useRouter();
  const [openAddTagging, setOpenAddTagging] = useState<boolean>(false);
  const [openAddSasaran, setOpenAddSasaran] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [notulen, setNotulen] = useState<number>(0);

  const handleAddTagging = (params: any) => {
    setNotulen(params.row);
    setOpenAddTagging(true);
  }

  const handleAddSasaran = async (params: any) => {
    setLoading(true);
    const response = await fetchApi({
      url: `/notulen/getNotulenDetail/${params.row.index}`,
      method: "get",
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
      const { data } = response.data;
      setNotulen(data)
      setLoading(false);
      setOpenAddSasaran(true);
    }
  }

  const handleOnCellClick = (params: any) => {
    router.push(`/notulen/detail/${params.row.index}`);
  }

  const getBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.7) : lighten(color, 0.7);

  const getHoverBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

  const getSelectedBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

  const getSelectedHoverBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.4) : lighten(color, 0.4);

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .super-app-theme--Disetujui': {
      backgroundColor: getBackgroundColor(theme.palette.info.main, theme.palette.mode),
      '&:hover': {
        backgroundColor: getHoverBackgroundColor(
          theme.palette.info.main,
          theme.palette.mode,
        ),
      },
      '&.Mui-selected': {
        backgroundColor: getSelectedBackgroundColor(
          theme.palette.info.main,
          theme.palette.mode,
        ),
        '&:hover': {
          backgroundColor: getSelectedHoverBackgroundColor(
            theme.palette.info.main,
            theme.palette.mode,
          ),
        },
      },
    },
    '& .super-app-theme--Ditolak': {
      backgroundColor: getBackgroundColor(
        theme.palette.error.main,
        theme.palette.mode,
      ),
      '&:hover': {
        backgroundColor: getHoverBackgroundColor(
          theme.palette.error.main,
          theme.palette.mode,
        ),
      },
      '&.Mui-selected': {
        backgroundColor: getSelectedBackgroundColor(
          theme.palette.error.main,
          theme.palette.mode,
        ),
        '&:hover': {
          backgroundColor: getSelectedHoverBackgroundColor(
            theme.palette.error.main,
            theme.palette.mode,
          ),
        },
      },
    },
    '& .super-app-theme--editted': {
      backgroundColor: getBackgroundColor(
        theme.palette.warning.main,
        theme.palette.mode,
      ),
      '&:hover': {
        backgroundColor: getHoverBackgroundColor(
          theme.palette.warning.main,
          theme.palette.mode,
        ),
      },
      '&.Mui-selected': {
        backgroundColor: getSelectedBackgroundColor(
          theme.palette.warning.main,
          theme.palette.mode,
        ),
        '&:hover': {
          backgroundColor: getSelectedHoverBackgroundColor(
            theme.palette.warning.main,
            theme.palette.mode,
          ),
        },
      },
    },
    '& .super-app-theme--archieve': {
      backgroundColor: getBackgroundColor(
        theme.palette.error.main,
        theme.palette.mode,
      ),
      '&:hover': {
        backgroundColor: getHoverBackgroundColor(
          theme.palette.error.main,
          theme.palette.mode,
        ),
      },
      '&.Mui-selected': {
        backgroundColor: getSelectedBackgroundColor(
          theme.palette.error.main,
          theme.palette.mode,
        ),
        '&:hover': {
          backgroundColor: getSelectedHoverBackgroundColor(
            theme.palette.error.main,
            theme.palette.mode,
          ),
        },
      },
    },
  }));

  const dataRowsAdmin: any = {
    "columns": [
      {
        "field": "id",
        "headerName": "No",
        "maxWidth": 40,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "tagging",
        "headerName": "Tags",
        "width": 180,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "opd",
        "headerName": "OPD",
        "width": 180,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "tanggal",
        "headerName": "Hari/Tgl",
        "width": 180,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "waktu",
        "headerName": "Waktu",
        "width": 130,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "acara",
        "headerName": "Acara",
        "width": 280,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "sasaran",
        "headerName": "Sasaran",
        "width": 280,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "lokasi",
        "headerName": "Lokasi",
        "width": 230,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "status",
        "headerName": "Status",
        "width": 180,
        "headerAlign": "center",
        "align": "center",
        "valueOptions": [
          "Ditolek",
          "Disetujui",
          "editted",
        ],
      },
      {
        "field": "foto",
        "headerName": "Foto",
        "width": 170,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "daftarHadir",
        "headerName": "Daftar Hadir",
        "width": 170,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "undangan",
        "headerName": "Undangan",
        "width": 170,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "spj",
        "headerName": "SPJ",
        "width": 170,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "lainLain",
        "headerName": "Lain-lain",
        "width": 170,
        "headerAlign": "center",
        "align": "center"
      },
    ],
    "rows": data,
    "initialState": {
      "columns": {
        "columnVisibilityModel": {
          "id": false,
          "brokerId": false
        }
      }
    },
    "experimentalFeatures": {
      "ariaV7": true
    }
  }

  const dataRowsAdmin2: any = {
    "columns": [
      {
        "field": "id",
        "headerName": "No",
        "maxWidth": 40,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "tagging",
        "headerName": "Tags",
        "width": 180,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "pembuat",
        "headerName": "Pembuat",
        "width": 180,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "tanggal",
        "headerName": "Hari/Tgl",
        "width": 180,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "waktu",
        "headerName": "Waktu",
        "width": 130,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "acara",
        "headerName": "Acara",
        "width": 280,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "sasaran",
        "headerName": "Sasaran",
        "width": 280,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "lokasi",
        "headerName": "Lokasi",
        "width": 230,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "status",
        "headerName": "Status",
        "width": 180,
        "headerAlign": "center",
        "align": "center",
        "valueOptions": [
          "Ditolek",
          "Disetujui",
          "editted",
        ],
      },
      {
        "field": "foto",
        "headerName": "Foto",
        "width": 170,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "daftarHadir",
        "headerName": "Daftar Hadir",
        "width": 170,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "undangan",
        "headerName": "Undangan",
        "width": 170,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "spj",
        "headerName": "SPJ",
        "width": 170,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "lainLain",
        "headerName": "Lain-lain",
        "width": 170,
        "headerAlign": "center",
        "align": "center"
      },
    ],
    "rows": data,
    "initialState": {
      "columns": {
        "columnVisibilityModel": {
          "id": false,
          "brokerId": false
        }
      }
    },
    "experimentalFeatures": {
      "ariaV7": true
    }
  }

  const dataRows: any = {
    "columns": [
      {
        "field": "id",
        "headerName": "No",
        "maxWidth": 40,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "tagging",
        "headerName": "Taggs",
        "width": 180,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "tanggal",
        "headerName": "Hari/Tgl",
        "width": 180,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "waktu",
        "headerName": "Waktu",
        "width": 130,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "acara",
        "headerName": "Acara",
        "width": 280,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "sasaran",
        "headerName": "Sasaran",
        "width": 280,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "lokasi",
        "headerName": "Lokasi",
        "width": 230,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "status",
        "headerName": "Status",
        "width": 180,
        "headerAlign": "center",
        "align": "center",
        "valueOptions": [
          "Ditolek",
          "Disetujui",
          "editted",
        ],
      },
      {
        "field": "foto",
        "headerName": "Foto",
        "width": 170,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "daftarHadir",
        "headerName": "Daftar Hadir",
        "width": 170,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "undangan",
        "headerName": "Undangan",
        "width": 170,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "spj",
        "headerName": "SPJ",
        "width": 170,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "lainLain",
        "headerName": "Lain-lain",
        "width": 170,
        "headerAlign": "center",
        "align": "center"
      },
    ],
    "rows": data,
    "initialState": {
      "columns": {
        "columnVisibilityModel": {
          "id": false,
          "brokerId": false
        }
      }
    },
    "experimentalFeatures": {
      "ariaV7": true
    }
  }

  return (
    <React.Fragment>
      {loading ? (
        <Loading loading={loading} setLoading={setLoading} />
      ) : (
        <div style={{ height: 400, width: '100%' }} className='bg-white dark:bg-meta-4 dark:text-white'>
          <div className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ..."></div>
          <Box sx={{ height: 400, width: '100%' }}>
            {profile.role == 1 ? (
              <StyledDataGrid
                {...dataRowsAdmin}
                onCellClick={
                  profile.role == 1 ||
                    profile.role == 2 ? handleAddTagging : profile.role == 3 ||
                      profile.role == 4 ? handleAddSasaran : handleOnCellClick
                }
                getRowClassName={(params) => `super-app-theme--${params.row.status}`}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
              />
            ) : profile.role == 2 ? (
              <StyledDataGrid
                {...dataRowsAdmin2}
                onCellClick={
                  profile.role == 1 ||
                    profile.role == 2 ? handleAddTagging : profile.role == 3 ||
                      profile.role == 4 ? handleAddSasaran : handleOnCellClick
                }
                getRowClassName={(params) => `super-app-theme--${params.row.status}`}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
              />
            ) : (
              <StyledDataGrid
                {...dataRows}
                onCellClick={profile.role == 1 || profile.role == 2 ? handleAddTagging : profile.role == 3 || profile.role == 4 ? handleAddSasaran : handleOnCellClick}
                getRowClassName={(params) => `super-app-theme--${params.row.status}`}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
              />
            )}
          </Box>

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
        </div>
      )}
    </React.Fragment>
  )
}

export default LaporanNotulenList