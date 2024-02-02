import * as React from 'react';
import type { Metadata } from 'next';
import Breadcrumb from '@/components/global/Breadcrumbs/Breadcrumb';
import LaporanPage from './laporan';

export const metadata: Metadata = {
  title: 'Laporan',
  description: 'Laporan',
  icons: [{ rel: 'icon', url: '/logo/Lambang_Kota_Madiun.png' }]
}

const Laporan = () => {

  return (
    <div className='laporan-container'>
      <Breadcrumb pageName="Laporan" />
      <LaporanPage />
    </div>
  )
}

export default Laporan;