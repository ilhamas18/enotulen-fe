import * as React from "react";
import type { Metadata } from 'next'
import Breadcrumb from "@/components/global/Breadcrumbs/Breadcrumb";
import PesertaProps from "./peserta";

export const metadata: Metadata = {
  title: 'Undangan',
  description: 'Undangan',
  icons: [{ rel: 'icon', url: '/logo/Lambang_Kota_Madiun.png' }]
}

const Peserta = () => {
  return (
    <div className="form-peserta-container">
      <Breadcrumb pageName="Daftar Hadir" />
      <PesertaProps />
    </div>
  )
}

export default Peserta;