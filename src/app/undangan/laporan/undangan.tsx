"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import withAuth from "@/components/hocs/withAuth";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { fetchApi } from "@/app/api/request";
import Swal from "sweetalert2";
import Loading from "@/components/global/Loading/loading";
import { State } from "@/store/reducer";
import { getShortDate, getTime } from "@/components/hooks/formatDate";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ImTable2 } from "react-icons/im";
import LaporanUndanganList from "@/components/pages/undangan/list";
import { setPayload } from "@/store/payload/action";

const LaporanUndanganProps = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [undangan, setUndangan] = useState<any>([]);
  const [month, setMonth] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { profile } = useSelector(
    (state: State) => ({
      profile: state.profile.profile,
    }),
    shallowEqual
  );

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  useEffect(() => {
    fetchData();
    dispatch(setPayload([]));

    if (month === null) {
      const currentDate = new Date();
      const currentMonthIndex = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const currentMonthName = monthNames[currentMonthIndex];
      const currentMonthAndYear = currentMonthName + ' ' + currentYear;
      setMonth(currentMonthAndYear);
    }
  }, [month]);

  const fetchData = async () => {
    setLoading(true);
    const response = await fetchApi({
      url: `/undangan/getAuthUndangan/${profile.Perangkat_Daerah.kode_opd}/${month}`,
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

      const temp: any = [];
      data.map((el: any, i: number) => {
        temp.push({
          id: i + 1,
          id_undangan: el.id,
          opd: el.Uuid.Perangkat_Daerah.nama_opd,
          pembuat: el.Uuid.Pegawai.nama,
          tagging: el.Uuid.Taggings.length !== 0 ? el.Uuid.Taggings.map((el: any) => el.nama_tagging) : "-",
          sifat: el.sifat,
          perihal: el.perihal,
          tanggal: el.tanggal[0]?.startDate !== el.tanggal[0]?.endDate
            ? getShortDate(el.tanggal[0]?.startDate) +
            " - " +
            getShortDate(el.tanggal[0]?.endDate)
            : getShortDate(el.tanggal[0]?.startDate),
          waktu: getTime(el.waktu) + " WIB",
          acara: el.acara,
          tempat: el.lokasi,
          status: el.status,
        })
      });
      setUndangan(temp);
      setLoading(false);
    }
  }

  const gradientStyle = {
    width: "100%",
    background: "linear-gradient(to right, #4fd1c5, #4299e1)",
  };

  const handleDatePicked = (val: any) => {
    const date = new Date(val);
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const formattedDate = `${month} ${year}`;
    setMonth(formattedDate);
  }

  const goToAddNotulen = () => {
    dispatch(setPayload([]));
    router.push('/undangan/tambah');
  }

  return (
    <div className="list-undangan-container relative">
      <div className="bg-white dark:bg-meta-4 shadow-card flex flex-col gap-2 py-4 text-center font-bold text-title-sm rounded-lg border-none">
        <div>DAFTAR LAPORAN UNDANGAN</div>
        {profile.role == 1 && <div>PEMERINTAH KOTA MADIUN</div>}
        {profile.role == 2 || profile.role == 3 && <div>{profile.Perangkat_Daerah?.nama_opd}</div>}
        {profile.role == 4 && <div className="text-title-xsm2">{profile.nama} <br /> <span>{month}</span></div>}
      </div>
      <div className="flex md:justify-between justify-center">
        <div></div>
        <div className="flex gap-2 mt-10">
          <div className="bg-white">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker', 'DatePicker', 'DatePicker']}>
                <DatePicker label={'Bulan & Tahun'} views={['month', 'year']} onChange={handleDatePicked} />
              </DemoContainer>
            </LocalizationProvider>
          </div>
          {profile.role == 4 && (
            <div
              onClick={goToAddNotulen}
              className="bg-xl-base px-3 mt-2 flex items-center justify-center text-white hover:bg-[#3b82f6] hover:cursor-pointer duration-300 rounded-sm"
            >+</div>
          )}
        </div>
      </div>
      <div style={gradientStyle} className="md:mt-[1em]">
        <div className="px-4 flex text-white py-4 space-x-6 font-bold items-center">
          <ImTable2 size={20} />
          <div className="text-title-xsm">Undangan</div>
        </div>
      </div>
      {loading ? (
        <Loading loading={loading} setLoading={setLoading} />
      ) : (
        <LaporanUndanganList data={undangan} profile={profile} fetchData={fetchData} />
      )}
    </div>
  )
}

export default withAuth(LaporanUndanganProps);