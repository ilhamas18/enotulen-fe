import * as React from 'react';
import type { Metadata } from 'next';
import Breadcrumb from "@/components/global/Breadcrumbs/Breadcrumb";
import VerifikasiProps from "./verifikasi";

export const metadata: Metadata = {
  title: 'Verifikasi Notulen',
  description: 'Verifikasi Notulen',
  icons: [{ rel: 'icon', url: '/logo/Lambang_Kota_Madiun.png' }]
}

const Verifikasi = () => {
  return (
    <div className="list-notulen-container relative">
      <Breadcrumb pageName="Verifikasi" />
      <VerifikasiProps />
    </div>
  )
}

export default Verifikasi;