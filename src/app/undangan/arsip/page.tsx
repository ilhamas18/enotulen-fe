import * as React from 'react';
import type { Metadata } from 'next';
import Breadcrumb from "@/components/global/Breadcrumbs/Breadcrumb";
import ArsipUndanganProps from "./arsip";

export const metadata: Metadata = {
  title: 'Arsip Undangan',
  description: 'Arsip Undangan',
  icons: [{ rel: 'icon', url: '/logo/Lambang_Kota_Madiun.png' }]
}

const ArsipUndangan = () => {
  return (
    <div className="list-undangan-container relative">
      <Breadcrumb pageName="Arsip Undangan" />
      <ArsipUndanganProps />
    </div>
  );
};

export default ArsipUndangan;
