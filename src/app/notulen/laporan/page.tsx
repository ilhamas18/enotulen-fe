import * as React from "react";
import type { Metadata } from 'next';
import Breadcrumb from "@/components/global/Breadcrumbs/Breadcrumb";
import LaporanNotulenProps from "./notulen";

export const metadata: Metadata = {
  title: 'Notulen',
  description: 'Notulen',
  icons: [{ rel: 'icon', url: '/logo/Lambang_Kota_Madiun.png' }]
}

const LaporanNotulen = () => {

  return (
    <div className="list-notulen-container relative">
      <Breadcrumb pageName="Laporan" />
      <LaporanNotulenProps />
    </div>
  );
};

export default LaporanNotulen;
