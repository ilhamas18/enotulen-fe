'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { fetchApi } from '@/components/mixins/request';
import LaporanNotulen from '@/components/pages/laporan/laporanNotulen';
import Swal from 'sweetalert2';
import LaporanNotulenAuth from '@/components/pages/laporan/laporanAuth';
import Breadcrumb from '@/components/global/Breadcrumbs/Breadcrumb';
import { getShortDate, getTime } from '@/components/hooks/formatDate';
import { ImTable2 } from 'react-icons/im';
import withAuth from '@/components/hocs/withAuth';

const Laporan = () => {
  const [notulens, setNotulens] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, [])

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('id-ID', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  const fetchData = async () => {
    setLoading(true)
    const response = await fetchApi({
      url: `/notulen/getAllNotulens`,
      method: "get",
      type: "auth"
    })

    if (!response.success) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Koneksi bermasalah!',
      })
    } else {
      if (response.data.code == 200) {
        const { data } = response.data;
        const temp: any = []
        data.map((el: any, i: number) => {
         console.log(data);
         
          temp.push({
            id: i+1,
            index: el.id,
            tagging: el.tagging.map((el: any) => el.label),
            tanggal: el.tanggal[0]?.startDate !== el.tanggal[0]?.endDate ? getShortDate(el.tanggal[0]?.startDate) + ' - ' + getShortDate( el.tanggal[0]?.endDate) : getShortDate(el.tanggal[0]?.startDate),
            waktu: getTime(el.waktu) + ' WIB',
            acara: el.acara,
            lokasi: el.lokasi,
            foto: '-',
            daftarHadir: '-',
            undangan: '-',
            spj: '-',
            lainLain: '-'
          })
        })
        setNotulens(temp);
        setLoading(false);
      }
    }
  }

  const gradientStyle = {
    width: '100%',
    background: 'linear-gradient(to right, #00bcd4, #2196f3)',
  };

  return (
    <div className="list-notulen-container">
      <Breadcrumb pageName="Laporan" />
      <div className="bg-white dark:bg-meta-4 shadow-card flex flex-col gap-2 py-4 text-center font-bold text-title-sm rounded rounded-lg border-none">
        <div>Daftar Laporan Notulen</div>
        <div>Bulan {currentMonth} {currentYear}</div>
      </div>
      <div style={gradientStyle} className='mt-10'>
        <div className='px-4 flex text-white py-4 space-x-6 font-bold items-center'>
          <ImTable2 size={20} />
          <div className='text-title-xsm'>Notulen</div>
        </div>
      </div>
      <LaporanNotulenAuth data={notulens} loading={loading} />
    </div>
  )
}

export default withAuth(Laporan);