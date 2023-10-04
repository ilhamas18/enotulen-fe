import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTime, getShortDate } from '@/components/hooks/formatDate';
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { fetchApi } from '@/components/mixins/request';
import Swal from 'sweetalert2';

const columns: GridColDef[] = [
  { 
    field: 'id', 
    headerName: 'No', 
    maxWidth: 40, 
    flex: 1,
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align: 'center'
  },
  { 
    field: 'tanggal', 
    headerName: 'Hari/Tgl', 
    width: 180, 
    flex: 1,
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align: 'center'
  },
  { 
    field: 'waktu', 
    headerName: 'Waktu', 
    width: 130, 
    flex: 1,
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align: 'center'
  },
  {
    field: 'acara',
    headerName: 'Acara',
    width: 280,
    flex: 1,
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align: 'center'
  },
  {
    field: 'lokasi',
    headerName: 'Lokasi',
    width: 230,
    flex: 1,
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align: 'center'
  },
];

interface LaporanNotulenAuthType {
  data: any,
  loading: boolean
}

const LaporanNotulenAuth = ({ data, loading }: LaporanNotulenAuthType) => {
  const router = useRouter();

  const handleOnCellClick = (params: any) => {
    router.push(`/notulen/detail/${params.row.index}`)
  }

  return (
    <div style={{ height: 400, width: '100%' }} className='bg-white dark:bg-meta-4 dark:text-white'>
      <div className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ..."></div>
      <Box sx={{ 
        height: 400,
        width: '100%',
      }}>
        <DataGrid
          rows={data}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          onCellClick={handleOnCellClick}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </div>
  )
}

export default LaporanNotulenAuth