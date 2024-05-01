import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Breadcrumb from "@/components/global/Breadcrumbs/Breadcrumb";
import Skeleton from '@/components/global/Skeleton/Skeleton';

export const metadata: Metadata = {
  title: 'Notifikasi Notulen',
  description: 'Notifikasi Notulen',
  icons: [{ rel: 'icon', url: '/logo/Lambang_Kota_Madiun.png' }]
}

const NoticeProps = dynamic(() => import('./notice'), {
  ssr: false,
  loading: () => <Skeleton />
});

const NotulenNotice = async () => {
  return (
    <div className="list-notulen-container relative">
      <Breadcrumb pageName="Notifikasi Notulen" />
      <NoticeProps />
    </div>
  )
}

export default NotulenNotice;