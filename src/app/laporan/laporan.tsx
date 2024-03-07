"use client";
import * as React from 'react';
import { useState, useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { State } from '@/store/reducer';
import withAuth from '@/components/hocs/withAuth';
import { fetchApi } from '@/app/api/request';
import Swal from 'sweetalert2';
import LaporanList from '@/components/pages/laporan/list';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ImTable2 } from 'react-icons/im';
import Loading from '@/components/global/Loading/loading';

const LaporanPage = () => {
  const [laporan, setLaporan] = useState<any>([]);
  const [month, setMonth] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { profile } = useSelector(
    (state: State) => ({
      profile: state.profile.profile,
    }),
    shallowEqual
  );

  useEffect(() => {
    fetchLaporan();
    if (month === null) {
      const currentDate = new Date();
      const currentShortMonth = currentDate.getMonth() + 1;
      const currentMonth = month !== null ? month.toLocaleString("id-ID", { month: "long", }) : currentDate.toLocaleString("id-ID", { month: "long", });
      const currentYear = currentDate.getFullYear();

      setMonth({ month: currentShortMonth, year: currentYear })
    }
  }, [month]);

  const fetchLaporan = async () => {
    setLoading(true);
    const response = await fetchApi({
      url: `/laporan/getAuthLaporan/${profile.Perangkat_Daerah.kode_opd}/${month.month}/${month.year}`,
      method: "get",
      type: "auth",
    })

    if (!response.success) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Koneksi bermasalah!",
      });
    } else {
      const { data } = response.data;
      const filtered: any = data.filter((el: any) => el.Notulen !== null || el.Undangan !== null);
      setLaporan(filtered);
      setLoading(false);
    }
  }

  const gradientStyle = {
    width: "100%",
    background: "linear-gradient(to right, #4fd1c5, #4299e1)",
  };

  const handleDatePicked = (val: any) => {
    let temp: any = {
      month: val.$M + 1,
      year: val.$y
    }
    setMonth(temp)
  }
  console.log(laporan);

  return (
    <div className='list-laporan-container relative'>
      <div className="bg-white dark:bg-meta-4 shadow-card flex flex-col gap-2 py-4 text-center font-bold text-title-sm rounded rounded-lg border-none">
        <div>REKAP LAPORAN UNDANGAN, DAFTAR HADIR, DAN NOTULEN</div>
        {profile.role == 1 && <div>PEMERINTAH KOTA MADIUN</div>}
        {profile.role == 2 || profile.role == 3 ? <div>{profile.Perangkat_Daerah?.nama_opd}</div> : null}
      </div>
      <div className="flex md:justify-between justify-center">
        <div></div>
        <div className="bg-white mt-10">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'DatePicker', 'DatePicker']}>
              <DatePicker label={'"Bulan" & "Tahun"'} views={['month', 'year']} onChange={handleDatePicked} />
            </DemoContainer>
          </LocalizationProvider>
        </div>
      </div>
      <div style={gradientStyle} className="md:mt-[1em]">
        <div className="px-4 flex text-white py-4 space-x-6 font-bold items-center">
          <ImTable2 size={20} />
          <div className="text-title-xsm">Undangan & Notulen</div>
        </div>
      </div>
      {loading ? (
        <Loading loading={loading} setLoading={setLoading} />
      ) : (
        <LaporanList data={laporan} profile={profile} fetchData={fetchLaporan} />
      )}
    </div>
  )
}

export default withAuth(LaporanPage);