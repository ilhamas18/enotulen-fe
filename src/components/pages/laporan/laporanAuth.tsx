import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTime, getShortDate } from '@/components/hooks/formatDate';
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { fetchApi } from '@/components/mixins/request';
import Swal from 'sweetalert2';
import { darken, lighten, styled } from '@mui/material/styles';

interface LaporanNotulenAuthType {
  data: any,
  profile: any,
}

const LaporanNotulenAuth = ({ data, profile }: LaporanNotulenAuthType) => {
  const router = useRouter();

  const handleOnCellClick = (params: any) => {
    router.push(`/notulen/detail/${params.row.index}`)
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
        "field": "tagging",
        "headerName": "Tagging",
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
      {
        "field": "status",
        "headerName": "Status",
        "width": 180,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "foto",
        "headerName": "Foto",
        "width": 170,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "daftarHadiir",
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
  )
}

export default LaporanNotulenAuth