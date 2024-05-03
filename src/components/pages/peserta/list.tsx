import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { darken, lighten, styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Loading from '@/components/global/Loading/loading';
import { fetchApi } from '@/app/api/request';
import Swal from 'sweetalert2';

interface PropTypes {
  data: any,
}

const LaporanPesertaList = ({ data }: PropTypes) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const getBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.7) : lighten(color, 0.7);

  const getHoverBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

  const getSelectedBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

  const getSelectedHoverBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.4) : lighten(color, 0.4);

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .super-app-theme--drafted': {
      backgroundColor: getBackgroundColor(theme.palette.secondary.light, theme.palette.mode),
      '&:hover': {
        backgroundColor: getHoverBackgroundColor(
          theme.palette.secondary.light,
          theme.palette.secondary.light,
        ),
      },
      '&.Mui-selected': {
        backgroundColor: getSelectedBackgroundColor(
          theme.palette.secondary.light,
          theme.palette.secondary.light,
        ),
        '&:hover': {
          backgroundColor: getSelectedHoverBackgroundColor(
            theme.palette.secondary.light,
            theme.palette.secondary.light,
          ),
        },
      },
    },
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
        theme.palette.error.dark,
        theme.palette.mode,
      ),
      '&:hover': {
        backgroundColor: getHoverBackgroundColor(
          theme.palette.error.dark,
          theme.palette.mode,
        ),
      },
      '&.Mui-selected': {
        backgroundColor: getSelectedBackgroundColor(
          theme.palette.error.dark,
          theme.palette.mode,
        ),
        '&:hover': {
          backgroundColor: getSelectedHoverBackgroundColor(
            theme.palette.error.dark,
            theme.palette.mode,
          ),
        },
      },
    },
    '& .super-app-theme--unread': {
      backgroundColor: getBackgroundColor(
        grey[500],
        theme.palette.mode,
      ),
      '&:hover': {
        backgroundColor: getHoverBackgroundColor(
          grey[500],
          theme.palette.mode,
        ),
      },
      '&.Mui-selected': {
        backgroundColor: getSelectedBackgroundColor(
          grey[500],
          theme.palette.mode,
        ),
        '&:hover': {
          backgroundColor: getSelectedHoverBackgroundColor(
            grey[500],
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
        "field": "pelapor",
        "headerName": "Pelapor",
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
        "field": "lokasi",
        "headerName": "Lokasi",
        "width": 230,
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

  const handleOnCellClick = (params: any) => router.push(`/peserta/detail/${params.row.id_peserta}`);

  return (
    <React.Fragment>
      {loading ? (
        <Loading loading={loading} setLoading={setLoading} />
      ) : (
        <div style={{ height: 400, width: '100%' }} className='bg-white dark:bg-meta-4 dark:text-white'>
          <div className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ..."></div>
          <Box sx={{ height: 400, width: '100%' }}>
            <StyledDataGrid
              {...dataRows}
              onCellClick={handleOnCellClick}
              getRowClassName={(params) => `super-app-theme--${params.row.status}`}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
            />
          </Box>
        </div>
      )}
    </React.Fragment>
  )
}

export default LaporanPesertaList;

