'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/app/api/request';
import LaporanNotulen from '@/components/pages/laporan/laporanNotulen';
import withAuth from '@/components/hocs/withAuth'
import Swal from 'sweetalert2';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
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
import { setPayload } from '@/store/payload/action';

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
  const dispatch = useDispatch();
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

  const labels = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  useEffect(() => {
    fetchData();
    if (month === null) {
      const currentDate = new Date();
      const currentMonthIndex = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const currentMonthName = labels[currentMonthIndex];
      const currentMonthAndYear = currentMonthName + ' ' + currentYear;
      setMonth(currentMonthAndYear);
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
    dispatch(setPayload([]));
  }, [month]);

  const fetchData = async () => {
    setLoading(true)
    const response = await fetchApi({
      url: `/notulen/getAllNotulens/${profile.Perangkat_Daerah.kode_opd}/${month}`,
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
            data.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Januari").length,
            data.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Februari").length,
            data.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Maret").length,
            data.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "April").length,
            data.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Mei").length,
            data.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Juni").length,
            data.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Juli").length,
            data.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Agustus").length,
            data.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "September").length,
            data.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Oktober").length,
            data.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "November").length,
            data.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Desember").length,
          ];
          setNotulenLength(temp);
          setNotulens(data);
        } else {
          let temp: any = [
            data.data.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Januari").length,
            data.data.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Februari").length,
            data.data.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Maret").length,
            data.data.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "April").length,
            data.data.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Mei").length,
            data.data.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Juni").length,
            data.data.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Juli").length,
            data.data.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Agustus").length,
            data.data.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "September").length,
            data.data.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Oktober").length,
            data.data.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "November").length,
            data.data.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Desember").length,
          ];
          let temp2: any = [
            data.verif.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Januari").length,
            data.verif.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Februari").length,
            data.verif.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Maret").length,
            data.verif.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "April").length,
            data.verif.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Mei").length,
            data.verif.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Juni").length,
            data.verif.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Juli").length,
            data.verif.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Agustus").length,
            data.verif.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "September").length,
            data.verif.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Oktober").length,
            data.verif.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "November").length,
            data.verif.filter((el: any) => el.tanggal_surat.split(', ')[1].split(' ')[1] === "Desember").length,
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
    <div>
      <WelcomeBanner />
      <div
        className={`absolute right-0 top-[9em] py-2 px-4 rounded-md bg-gradient-to-r from-[#6366f1] from-10% via-[#0ea5e9] via-30% to-[#10b981] to-90% text-white font-bold text-center mb-3 animate-pulse hover:shadow-lg hover:cursor-pointer hover:scale-102 ${profile.role != 4 ? 'hidden' : 'show'}`}
        onClick={handleGoToForm}
      >Tambah Undangan & Notulen</div>
      <div className='bg-white h-[400px] w-full relative flex mt-[5em]'>
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
                <DateCalendar value={dayjs(`${new Date().getFullYear()}-0${new Date().getMonth() + 1}-${new Date().getDate()}`)} disabled />
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
