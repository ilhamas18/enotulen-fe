import * as React from 'react';
import type { Metadata } from 'next';
import Breadcrumb from '@/components/global/Breadcrumbs/Breadcrumb';
import Registrasi from './registrasi';

export const metadata: Metadata = {
  title: 'Registrasi',
  description: 'Registrasi'
}

const TambahUser = () => {
  return (
    <div className='form-user-container'>
      <Breadcrumb pageName='Pegawai / Tambah' />
      <Registrasi />
    </div>
  )
}

export default TambahUser;