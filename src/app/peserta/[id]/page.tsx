import * as React from "react";
import type { Metadata } from 'next'
import Breadcrumb from "@/components/global/Breadcrumbs/Breadcrumb";
import PesertaProps from "./peserta";
import axios from "axios";
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Peserta',
  description: 'Peserta',
  icons: [{ rel: 'icon', url: '/logo/Lambang_Kota_Madiun.png' }]
}

const Peserta = ({ params }: { params: { id: number } }) => {
  const { id } = params;

  return (
    <div className="form-peserta-container">
      <Breadcrumb pageName="Daftar Hadir" />
      <PesertaProps id={id} />
    </div>
  )
}

export default Peserta;