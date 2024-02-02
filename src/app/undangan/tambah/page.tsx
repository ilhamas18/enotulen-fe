import type { Metadata } from 'next';
import TambahUndanganProps from "./tambah";
import Breadcrumb from '@/components/global/Breadcrumbs/Breadcrumb';

export const metadata: Metadata = {
  title: 'Tambah Undangan',
  description: 'Tambah Undangan',
  icons: [{ rel: 'icon', url: '/logo/Lambang_Kota_Madiun.png' }]
}

const TambahUndangan = () => {
  return (
    <div className="form-undangan-container">
      <Breadcrumb pageName='Tambah Undangan' />
      <TambahUndanganProps />
    </div>
  )
}

export default TambahUndangan;

