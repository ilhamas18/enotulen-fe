'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/components/mixins/request';
import LaporanNotulen from '@/components/pages/laporan/laporanNotulen';
import withAuth from '@/components/hocs/withAuth'
import Swal from 'sweetalert2';
import { shallowEqual, useSelector } from 'react-redux';
import { State } from '@/store/reducer';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Line } from 'react-chartjs-2';
import WelcomeBanner from '@/components/global/Banner/WelcomeBanner';
import SEO from '@/components/global/seo';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Home() {
  const router = useRouter();
  const [notulens, setNotulens] = useState<any>([]);
  const [notulenLength, setNotulenLength] = useState<any>([]);
  const [notulensVerifLength, setNotulensVerifLength] = useState<any>([]);
  const [month, setMonth] = useState<any>(null);
  const [title, setTitle] = useState<string>('');
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

    switch (profile.role) {
      case 1:
        setTitle(`LAPORAN NOTULEN ${new Date().getFullYear()}`);
        break;
      case 2:
        setTitle(`LAPORAN NOTULEN ${profile.Perangkat_Daerah.nama_opd} ${new Date().getFullYear()}`);
        break;
      case 3:
        setTitle(`LAPORAN NOTULEN ${profile.Perangkat_Daerah.nama_opd} ${new Date().getFullYear()}`);
        break;
      case 4:
        setTitle(`LAPORAN NOTULEN ${profile.nama}`);
        break;
      default:
        setTitle('');
    }
  }, [month]);

  const fetchData = async () => {
    setLoading(true)
    const response = await fetchApi({
      url: `/notulen/getAllNotulens/${profile.Perangkat_Daerah.kode_opd}`,
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
        if (profile.role != 3) {
          let temp: any = [
            data.filter((el: any) => el.bulan === "1").length,
            data.filter((el: any) => el.bulan === "2").length,
            data.filter((el: any) => el.bulan === "3").length,
            data.filter((el: any) => el.bulan === "4").length,
            data.filter((el: any) => el.bulan === "5").length,
            data.filter((el: any) => el.bulan === "6").length,
            data.filter((el: any) => el.bulan === "7").length,
            data.filter((el: any) => el.bulan === "8").length,
            data.filter((el: any) => el.bulan === "9").length,
            data.filter((el: any) => el.bulan === "10").length,
            data.filter((el: any) => el.bulan === "11").length,
            data.filter((el: any) => el.bulan === "12").length
          ];
          setNotulenLength(temp);
          setNotulens(data);
        } else {
          let temp: any = [
            data.data.filter((el: any) => el.bulan === "1").length,
            data.data.filter((el: any) => el.bulan === "2").length,
            data.data.filter((el: any) => el.bulan === "3").length,
            data.data.filter((el: any) => el.bulan === "4").length,
            data.data.filter((el: any) => el.bulan === "5").length,
            data.data.filter((el: any) => el.bulan === "6").length,
            data.data.filter((el: any) => el.bulan === "7").length,
            data.data.filter((el: any) => el.bulan === "8").length,
            data.data.filter((el: any) => el.bulan === "9").length,
            data.data.filter((el: any) => el.bulan === "10").length,
            data.data.filter((el: any) => el.bulan === "11").length,
            data.data.filter((el: any) => el.bulan === "12").length
          ];
          let temp2: any = [
            data.verif.filter((el: any) => el.bulan === "1").length,
            data.verif.filter((el: any) => el.bulan === "2").length,
            data.verif.filter((el: any) => el.bulan === "3").length,
            data.verif.filter((el: any) => el.bulan === "4").length,
            data.verif.filter((el: any) => el.bulan === "5").length,
            data.verif.filter((el: any) => el.bulan === "6").length,
            data.verif.filter((el: any) => el.bulan === "7").length,
            data.verif.filter((el: any) => el.bulan === "8").length,
            data.verif.filter((el: any) => el.bulan === "9").length,
            data.verif.filter((el: any) => el.bulan === "10").length,
            data.verif.filter((el: any) => el.bulan === "11").length,
            data.verif.filter((el: any) => el.bulan === "12").length
          ];
          setNotulenLength(temp);
          setNotulens(data.verif);
          setNotulensVerifLength(temp2)
        }
        setLoading(false);
      }
    }
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title
      },
    },
  };

  const labels = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Rekap Notulen',
        data: notulenLength,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const dataVerif = {
    labels,
    datasets: [
      {
        label: 'Rekap Notulen',
        data: notulenLength,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Verifikasi Notulen',
        data: notulensVerifLength,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const handleGoToForm = () => router.push('/undangan/tambah?step=1');

  return (
    <div className="list-notulen-container relative flex flex-col relative">
      <WelcomeBanner />
      <div
        className={`absolute right-0 top-[9em] py-2 px-4 rounded-md bg-gradient-to-r from-[#6366f1] from-10% via-[#0ea5e9] via-30% to-[#10b981] to-90% text-white font-bold text-center mb-3 animate-pulse hover:shadow-lg hover:cursor-pointer hover:scale-102 ${profile.role == 1 ? 'hidden' : 'show'}`}
        onClick={handleGoToForm}
      >Tambah Undangan & Notulen</div>
      <div className='bg-white h-[400px] w-full relative flex mt-10'>
        <div className='w-[68%]'>
          <Line
            options={options}
            data={profile.role == 3 ? dataVerif : data}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <div className='w-[30%] bg-[#f5f3ed] my-4 hidden md:block'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateCalendar', 'DateCalendar']}>
              <DemoItem>
                <DateCalendar defaultValue={dayjs(`${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`)} disabled />
              </DemoItem>
            </DemoContainer>
          </LocalizationProvider>
        </div>
      </div>
      <LaporanNotulen data={notulens} loading={loading} profile={profile} />
    </div>
  )
}

export default withAuth(Home)
