import * as React from "react";
import type { Metadata } from 'next';
import Breadcrumb from '@/components/global/Breadcrumbs/Breadcrumb';
import NotulenDetail from './detail';

export const metadata: Metadata = {
  title: 'Notulen',
  description: 'Notulen',
  icons: [{ rel: 'icon', url: '/logo/Lambang_Kota_Madiun.png' }]
}

const Detail = ({ params }: { params: { id: number } }) => {
  const { id } = params;

  return (
    <div className="detail-notulen-container">
      <Breadcrumb pageName="Laporan / Detail" />
      <NotulenDetail id={id} />
    </div>
  )
}

export default Detail;