import * as React from "react";
import type { Metadata } from 'next';
import Breadcrumb from '@/components/global/Breadcrumbs/Breadcrumb';
import PesertaDetail from './detail';

export const metadata: Metadata = {
  title: 'Daftar Hadir',
  description: 'Daftar Hadir',
  icons: [{ rel: 'icon', url: '/logo/Lambang_Kota_Madiun.png' }]
}

const Detail = ({ params }: { params: { id: number } }) => {
  const { id } = params;

  return (
    <div className="detail-peserta-container">
      <Breadcrumb pageName="Daftar Hadir / Detail" />
      <PesertaDetail id={id} />
    </div>
  )
}

export default Detail;