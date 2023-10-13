'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { fetchApi } from '@/components/mixins/request';
import LaporanNotulen from '@/components/pages/laporan/laporanNotulen';
import withAuth from '@/components/hocs/withAuth'
import Swal from 'sweetalert2';
import { shallowEqual, useSelector } from 'react-redux';
import { State } from '@/store/reducer';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import WelcomeBanner from '@/components/global/Banner/WelcomeBanner';

function Home() {
  const [notulens, setNotulens] = useState<any>([]);
  const [month, setMonth] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { profile } = useSelector(
    (state: State) => ({
      profile: state.profile.profile,
    }),
    shallowEqual
  );

  useEffect(() => {
    fetchData();
    if (month === null) {
      const currentDate = new Date();
      const currentShortMonth = currentDate.getMonth() + 1;
      const currentMonth = currentDate.toLocaleString("id-ID", { month: "long", });
      const currentYear = currentDate.getFullYear();

      setMonth({ month: currentShortMonth, year: currentYear })
    }
  }, [month])

  const fetchData = async () => {
    console.log(month, '....');

    setLoading(true)
    const response = await fetchApi({
      url: `/notulen/getAuthNotulen/${profile.Perangkat_Daerah.kode_opd}/${profile.nip}/${month.month}/${month.year}`,
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

  const handleDatePicked = (val: any) => {
    let temp: any = {
      month: val.$M + 1,
      year: val.$y
    }
    setMonth(temp)
  }

  return (
    <div className="list-notulen-container relative flex flex-col">
      <WelcomeBanner />
      <div className='md:w-[30%] w-full md:absolute md:right-0 md:top-[10em] bg-white'>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker', 'DatePicker', 'DatePicker']}>
            <DatePicker label={'"month" and "year"'} views={['month', 'year']} onChange={handleDatePicked} />
          </DemoContainer>
        </LocalizationProvider>
      </div>
      <div className="mt-14 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ..."></div>
      <LaporanNotulen data={notulens} loading={loading} profile={profile} />
    </div>
  )
}

export default withAuth(Home)
