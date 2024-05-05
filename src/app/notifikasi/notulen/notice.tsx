"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fetchApi } from "@/app/api/request";
import Swal from "sweetalert2";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import LaporanNotulenList from "@/components/pages/notulen/list";
import { getShortDate, getTime } from "@/components/hooks/formatDate";
import { ImTable2 } from "react-icons/im";
import withAuth from "@/components/hocs/withAuth";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { State } from "@/store/reducer";
import Loading from "@/components/global/Loading/loading";
import { setPayload } from "@/store/payload/action";

const NoticeNotulenProps = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [notulens, setNotulens] = useState<any>([]);
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
      url: `/notulen/showResponsible/${month}`,
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
            id_notulen: el.Notulen.id,
            index: el.Notulen.id,
            pelapor: el.Pelapor.nama,
            tanggal: el.Notulen.tanggal[0]?.startDate !== el.Notulen.tanggal[0]?.endDate
              ? getShortDate(el.Notulen.tanggal[0]?.startDate) +
              " - " +
              getShortDate(el.Notulen.tanggal[0]?.endDate)
              : getShortDate(el.Notulen.tanggal[0]?.startDate),
            waktu: getTime(el.Notulen.waktu) + " WIB",
            acara: el.Notulen.acara,
            // sasaran: el.Notulen.Uuid.Sasarans.length !== 0 ? el.Notulen.Uuid.Sasarans.map((data: any) => data.sasaran) : "-",
            lokasi: el.Notulen.lokasi,
            status: el.status,
          });
        });
        setNotulens(temp);
        setLoading(false);
      }
    }
  };

  const handleDatePicked = (val: any) => {
    const date = new Date(val);
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const formattedDate = `${month} ${year}`;
    setMonth(formattedDate);
  }

  const gradientStyle = {
    width: "100%",
    background: "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
  };

  return (
    <div>
      <div className="bg-white dark:bg-meta-4 shadow-card flex flex-col gap-2 py-4 text-center font-bold text-title-sm rounded-lg border-none">
        <div>NOTIFIKASI NOTULEN</div>
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
        <LaporanNotulenList
          data={notulens}
          profile={profile}
          pathname={pathname}
        />
      )}
    </div>
  )
}

export default withAuth(NoticeNotulenProps);