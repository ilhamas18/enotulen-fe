"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { fetchApi } from "@/app/api/request";
import Swal from "sweetalert2";
import LaporanNotulenList from "@/components/pages/notulen/list";
import Breadcrumb from "@/components/global/Breadcrumbs/Breadcrumb";
import { getShortDate, getTime } from "@/components/hooks/formatDate";
import { ImTable2 } from "react-icons/im";
import withAuth from "@/components/hocs/withAuth";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { State } from "@/store/reducer";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Loading from "@/components/global/Loading/loading";
import { setPayload } from "@/store/payload/action";

const LaporanNotulenProps = () => {
  const dispatch = useDispatch();
  const [notulens, setNotulens] = useState<any>([]);
  const [month, setMonth] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
      url: `/notulen/getAuthNotulen/${profile.Perangkat_Daerah.kode_opd}/${month}`,
      method: "get",
      type: "auth",
    });

    if (!response.success) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Koneksi bermasalah!",
      });
    } else {
      if (response.data.code == 200) {
        const { data } = response.data;

        const temp: any = [];
        data.map((el: any, i: number) => {
          temp.push({
            id: i + 1,
            id_notulen: el.id,
            uuid: el.Uuid.uuid,
            index: el.id,
            opd: el.Uuid.Perangkat_Daerah.nama_opd,
            pembuat: el.Uuid.Pegawai.nama,
            tagging: el.Uuid.Taggings.length !== 0 ? el.Uuid.Taggings.map((el: any) => el.nama_tagging) : "-",
            tanggal: el.tanggal[0]?.startDate !== el.tanggal[0]?.endDate
              ? getShortDate(el.tanggal[0]?.startDate) +
              " - " +
              getShortDate(el.tanggal[0]?.endDate)
              : getShortDate(el.tanggal[0]?.startDate),
            waktu: getTime(el.waktu) + " WIB",
            acara: el.acara,
            sasaran: el.Uuid.Sasarans.length !== 0 ? el.Uuid.Sasarans.map((data: any) => data.sasaran) : "-",
            lokasi: el.lokasi,
            status: el.status,
            foto: el.link_img_foto !== null ? "V" : "X",
            daftarHadir: el.link_img_daftar_hadir !== null ? "V" : "X",
            undangan: el.link_img_surat_undangan !== null ? "V" : "X",
            spj: el.link_img_spj !== null ? "V" : "X",
            lainLain: el.link_img_pendukung !== null ? "V" : "X",
          });
        });
        setNotulens(temp);
        setLoading(false);
      }
    }
  };

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

  return (
    <div>
      <div className="bg-white dark:bg-meta-4 shadow-card flex flex-col gap-2 py-4 text-center font-bold text-title-sm rounded rounded-lg border-none">
        <div>DAFTAR LAPORAN NOTULEN</div>
        {profile.role == 1 && <div>PEMERINTAH KOTA MADIUN</div>}
        {profile.role == 2 || profile.role == 3 ? <div>{profile.Perangkat_Daerah?.nama_opd}</div> : null}
        {profile.role == 4 && <div className="text-title-xsm2">{profile.nama} <br /> <span>{month}</span></div>}
      </div>
      {/* <div className='md:w-[30%] w-full md:absolute md:right-0 md:top-[10em] top-[13em] bg-white'> */}
      <div className="flex md:justify-between justify-center">
        <div></div>
        <div className="bg-white mt-10">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'DatePicker', 'DatePicker']}>
              <DatePicker label={'Bulan & Tahun'} views={['month', 'year']} onChange={handleDatePicked} />
            </DemoContainer>
          </LocalizationProvider>
        </div>
      </div>
      <div style={gradientStyle} className="md:mt-[1em]">
        <div className="px-4 flex text-white py-4 space-x-6 font-bold items-center">
          <ImTable2 size={20} />
          <div className="text-title-xsm">Notulen</div>
        </div>
      </div>
      {loading ? (
        <Loading loading={loading} setLoading={setLoading} />
      ) : (
        <LaporanNotulenList data={notulens} profile={profile} fetchData={fetchData} />
      )}
    </div>
  );
};

export default withAuth(LaporanNotulenProps);
