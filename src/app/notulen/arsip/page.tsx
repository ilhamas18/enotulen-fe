import * as React from 'react';
import type { Metadata } from 'next';
import Breadcrumb from "@/components/global/Breadcrumbs/Breadcrumb";
import ArsipNotulenProps from "./arsip";

export const metadata: Metadata = {
  title: 'Arsip Notulen',
  description: 'Arsip Notulen',
  icons: [{ rel: 'icon', url: '/logo/Lambang_Kota_Madiun.png' }]
}

const ArsipNotulen = () => {
  return (
    <div className="list-notulen-container relative">
      <Breadcrumb pageName="Arsip Notulen" />
      <ArsipNotulenProps />
    </div>
  );
};

export default ArsipNotulen;
