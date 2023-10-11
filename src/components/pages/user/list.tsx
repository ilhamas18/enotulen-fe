import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';
// import { setOPD } from '@/store/opd/action';

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
    field: 'nama',
    headerName: 'Nama',
    width: 300,
    // flex: 1,
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align: 'center'
  },
  {
    field: 'nip',
    headerName: 'NIP',
    width: 180,
    // flex: 1,
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align: 'center'
  },
  {
    field: 'pangkat',
    headerName: 'Pangkat',
    width: 180,
    // flex: 1,
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align: 'center'
  },
  {
    field: 'opd',
    headerName: 'OPD',
    width: 250,
    // flex: 1,
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align: 'center'
  },
  {
    field: 'role',
    headerName: 'Role',
    width: 120,
    // flex: 1,
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align: 'center'
  },
];

interface PropTypes {
  dataPegawai: any;
}

const DataListUser = ({ dataPegawai }: PropTypes) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleOnCellClick = (params: any) => {
    router.push(`/master/data-user/edit/${params.row.nip}`)
  }

  return (
    <div style={{ height: 500, width: '100%' }} className='bg-white dark:bg-meta-4 dark:text-white'>
      <div className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ..."></div>
      <Box sx={{
        height: 500,
        width: '100%',
      }}>
        <DataGrid
          rows={dataPegawai}
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

export default DataListUser;