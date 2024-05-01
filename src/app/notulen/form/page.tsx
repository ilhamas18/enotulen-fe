import type { Metadata } from 'next'
import Breadcrumb from "@/components/global/Breadcrumbs/Breadcrumb";
import AddNotulenProps from "./tambah";

export const metadata: Metadata = {
  title: 'Tambah Undangan',
  description: 'Tambah Undangan',
  icons: [{ rel: 'icon', url: '/logo/Lambang_Kota_Madiun.png' }]
}

const AddNotulen = () => {
  return (
    <div className="form-notulen-container">
      <Breadcrumb pageName="Tambah Notulen" />
      <AddNotulenProps />
    </div>
  )
}

export default AddNotulen;