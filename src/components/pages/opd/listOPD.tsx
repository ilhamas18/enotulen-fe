import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { setOPD } from '@/store/opd/action';

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
    field: 'kode_opd', 
    headerName: 'Kode', 
    width: 180, 
    // flex: 1,
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align: 'center'
  },
  { 
    field: 'nama_opd', 
    headerName: 'Nama OPD', 
    width: 180, 
    // flex: 1,
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align: 'center'
  },
  { 
    field: 'singkatan', 
    headerName: 'Singkatan', 
    width: 180, 
    // flex: 1,
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align: 'center'
  },
  { 
    field: 'alamat', 
    headerName: 'Alamat', 
    width: 180, 
    // flex: 1,
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align: 'center'
  },
  { 
    field: 'telepon', 
    headerName: 'Telp', 
    width: 180, 
    // flex: 1,
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align: 'center'
  },
  { 
    field: 'faximile', 
    headerName: 'Fax', 
    width: 180, 
    // flex: 1,
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align: 'center'
  },
  { 
    field: 'website', 
    headerName: 'Web', 
    width: 180, 
    // flex: 1,
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align: 'center'
  },
];

interface PropTypes {
  data: any
}

const ListOPD = ({ data }: PropTypes) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleOnCellClick = (params: any) => {
    dispatch(setOPD(params.row));
    router.push(`/master/data-opd/tambah/${params.row.kode_opd}`)
  }

  return (
    <div style={{ height: 400, width: '100%' }} className='bg-white dark:bg-meta-4 dark:text-white'>
      <div className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ..."></div>
      <Box sx={{ 
        height: 500,
        width: '100%',
      }}>
        <DataGrid
          rows={data}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          onCellClick={handleOnCellClick}
          disableRowSelectionOnClick
        />
      </Box>
    </div>
  )
}

export default ListOPD;