'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { fetchApi } from '@/components/mixins/request';
import LaporanNotulen from '@/components/pages/laporan/laporanNotulen';
import Swal from 'sweetalert2';

export default function Home() {
  const [notulens, setNotulens] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, [])

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('id-ID', { month: 'long' });
  const currentMonthInNumber = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();


  const fetchData = async () => {
    setLoading(true)
    const response = await fetchApi({
      url: `/notulen/getAllNotulens`,
      method: "get",
      type: "auth",
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
        setNotulens(data)
        setLoading(false);
      }
    }
  }
  return (
    <div className="list-notulen-container">
       <div className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ..."></div>
       <LaporanNotulen data={notulens} loading={loading} />
    </div>
  )
}
