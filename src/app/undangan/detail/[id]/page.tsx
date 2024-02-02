import * as React from 'react';
import type { Metadata } from 'next';
import Breadcrumb from '@/components/global/Breadcrumbs/Breadcrumb';
import DetailProps from './detail';

export const metadata: Metadata = {
  title: 'Undangan',
  description: 'Undangan',
  icons: [{ rel: 'icon', url: '/logo/Lambang_Kota_Madiun.png' }]
}

const UndanganDetail = ({ params }: { params: { id: number } }) => {
  const { id } = params;

  return (
    <div className='detail-undangan-container'>
      <Breadcrumb pageName="Undangan / Detail" />
      <DetailProps id={id} />
    </div>
  )
}

export default UndanganDetail;