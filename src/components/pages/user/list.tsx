import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { darken, lighten, styled } from '@mui/material/styles';

interface PropTypes {
  dataPegawai: any;
}

const DataListUser = ({ dataPegawai }: PropTypes) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const getBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.7) : lighten(color, 0.7);

  const getHoverBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

  const getSelectedBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

  const getSelectedHoverBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.4) : lighten(color, 0.4);

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
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
        "field": "nama",
        "headerName": "Nama",
        "width": 300,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "nip",
        "headerName": "NIP",
        "width": 180,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "pangkat",
        "headerName": "Pangkat",
        "width": 180,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "opd",
        "headerName": "OPD",
        "width": 250,
        "headerAlign": "center",
        "align": "center"
      },
      {
        "field": "role",
        "headerName": "Role",
        "width": 120,
        "headerAlign": "center",
        "align": "center"
      },
    ],
    "rows": dataPegawai,
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


  const handleOnCellClick = (params: any) => {
    router.push(`/master/data-user/edit/${params.row.nip}`)
  }

  return (
    <div style={{ height: 500, width: '100%' }} className='bg-white dark:bg-meta-4 dark:text-white'>
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

export default DataListUser;