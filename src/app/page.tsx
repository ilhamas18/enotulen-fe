import * as React from 'react';
import type { Metadata } from 'next';
import Home from './index/index';

export const metadata: Metadata = {
  title: 'E-Notulen Kota Madiun',
  description: 'Selamat Datang di Aplikasi E-Notulen Kota Madiun',
  icons: [{ rel: 'icon', url: '/logo/Lambang_Kota_Madiun.png' }]
}

function HomeAuth() {
  return (
    <div className="list-notulen-container relative flex flex-col">
      <Home />
    </div>
  )
}

export default HomeAuth;
