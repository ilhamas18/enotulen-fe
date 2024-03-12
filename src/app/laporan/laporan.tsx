"use client";
import * as React from 'react';
import { useState, useEffect } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
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
import { dateRangeFormat, dateISOFormat } from '@/components/helpers/dateRange';
import { localDateFormat } from '@/components/helpers/formatMonth';
import { setPayload } from '@/store/payload/action';

const LaporanPage = () => {
  const dispatch = useDispatch();
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
    dispatch(setPayload([]));
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
      let tanggalArr: any = []
      let temp: any = [...filtered]
      filtered.forEach((el: any, index: number) => {
        const dateRange = dateRangeFormat(el.Undangan !== null ? el.Undangan.tanggal !== null && el.Undangan.tanggal[0] : el.Notulens[0].tanggal[0])
        const tanggal = dateRange.map((date: any) => ({
          tanggal: date,
        }))
        tanggalArr.push(tanggal);
        if (el.Undangan !== null) {
          temp[index] = {
            uuid: el.uuid,
            hari: el.hari,
            bulan: el.bulan,
            tahun: el.tahun,
            kode_opd: el.kode_opd,
            nip_pegawai: el.nip_pegawai,
            Perangkat_Daerah: el.Perangkat_Daerah,
            Pegawai: el.Pegawai,
            Sasarans: el.Sasarans,
            Taggings: el.Taggings,
            Undangan: el.Undangan,
            Peserta: tanggalArr[index],
            Notulens: tanggalArr[index]
          }
        } else if (el.Notulens.length != 0) {
          temp[index] = {
            uuid: el.uuid,
            hari: el.hari,
            bulan: el.bulan,
            tahun: el.tahun,
            kode_opd: el.kode_opd,
            nip_pegawai: el.nip_pegawai,
            Perangkat_Daerah: el.Perangkat_Daerah,
            Pegawai: el.Pegawai,
            Sasarans: el.Sasarans,
            Taggings: el.Taggings,
            Undangan: el.Undangan,
            Peserta: tanggalArr[index],
            Notulens: el.Notulens
          }
        }
      })
      handleSetPeserta(filtered, temp);
      setLoading(false);
    }
  }

  const handleSetPeserta = (filtered: any, arr: any) => {
    const updatedLaporan = arr.map((item: any) => {
      const matchingResponseItem = filtered.find((responseItem: any) => responseItem.uuid === item.uuid);

      if (matchingResponseItem) {
        const updatedPeserta = item.Peserta.map((peserta: any) => {
          const matchingData = matchingResponseItem.Peserta.find(
            (responsePeserta: any) => responsePeserta.tanggal === peserta.tanggal
          );

          return matchingData ? { ...matchingData } : peserta;
        });

        const newPeserta = matchingResponseItem.Peserta
          .filter((responsePeserta: any) => !item.Peserta.some((peserta: any) => peserta.tanggal === responsePeserta.tanggal))
          .map((responsePeserta: any) => ({ ...responsePeserta }));

        const updatedNotulen = item.Notulens.map((notulen: any) => {
          const matchingData = matchingResponseItem.Notulens.find(
            (responseNotulen: any) => localDateFormat(responseNotulen.tanggal[0].startDate) === notulen.tanggal
          )

          return matchingData ? { ...matchingData } : notulen
        })

        const newNotulen = matchingResponseItem.Notulens
          .filter((filtered: any) => !item.Notulens?.some((el: any) => el.tanggal === localDateFormat(filtered.tanggal[0].startDate)))
          .map((responseNotulen: any) => ({ ...responseNotulen }));

        return {
          ...item,
          Peserta: [...updatedPeserta, ...newPeserta],
          Notulens: [...updatedNotulen, ...newNotulen]
        };
      }

      return item;
    });
    setLaporan(updatedLaporan);
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
  };

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

// const [laporan, setLaporan] = useState(
//   [
//     {
//       "uuid": "8ed7b48c-e481-41b3-91f7-ecde3e54403b",
//       "Perangkat_Daerah": {
//         "nama_opd": "BADAN PERENCANAAN, PENELITIAN DAN PEMBANGUNAN DAERAH"
//       },
//       "Pegawai": {
//         "nama": " ALI YOGA UTAMA ,S.STP",
//         "nip": "198605162004121002"
//       },
//       "Peserta": [
//         {
//           "tanggal": "8"
//         },
//         {
//           "tanggal": "9"
//         }
//       ]
//     },
//     {
//       "uuid": "df99355e-6ac1-43e8-8e01-41949ee077f6",
//       "Perangkat_Daerah": {
//         "nama_opd": "BADAN PERENCANAAN, PENELITIAN DAN PEMBANGUNAN DAERAH"
//       },
//       "Pegawai": {
//         "nama": " ALI YOGA UTAMA ,S.STP",
//         "nip": "198605162004121002"
//       },
//       "Peserta": [
//         {
//           "tanggal": "7 Maret 2024"
//         },
//         {
//           "tanggal": "8 Maret 2024"
//         },
//         {
//           "tanggal": "9 Maret 2024"
//         }
//       ]
//     }
//   ]
// )

// const response = [
//   {
//     "uuid": "8ed7b48c-e481-41b3-91f7-ecde3e54403b",
//     "Perangkat_Daerah": {
//       "nama_opd": "BADAN PERENCANAAN, PENELITIAN DAN PEMBANGUNAN DAERAH"
//     },
//     "Pegawai": {
//       "nama": " ALI YOGA UTAMA ,S.STP",
//       "nip": "198605162004121002"
//     },
//     "Peserta": [],
//   },
//   {
//     "uuid": "df99355e-6ac1-43e8-8e01-41949ee077f6",
//     "Perangkat_Daerah": {
//       "nama_opd": "BADAN PERENCANAAN, PENELITIAN DAN PEMBANGUNAN DAERAH"
//     },
//     "Pegawai": {
//       "nama": " ALI YOGA UTAMA ,S.STP",
//       "nip": "198605162004121002"
//     },
//     "Peserta": [
//       {
//         "id": 19,
//         "uuid": "df99355e-6ac1-43e8-8e01-41949ee077f6",
//         "jumlah_peserta": 5,
//         "jenis_peserta": "eksternal",
//         "tanggal": "9 Maret 2024",
//         "createdAt": "2024-03-07T07:48:26.664Z",
//         "updatedAt": "2024-03-07T07:48:26.664Z"
//       },
//       {
//         "id": 18,
//         "uuid": "df99355e-6ac1-43e8-8e01-41949ee077f6",
//         "jumlah_peserta": 10,
//         "jenis_peserta": "internal",
//         "tanggal": "7 Maret 2024",
//         "createdAt": "2024-03-07T07:48:18.129Z",
//         "updatedAt": "2024-03-07T07:48:18.129Z"
//       }
//     ]
//   }
// ]




// [
//   {
//     "uuid": "8ed7b48c-e481-41b3-91f7-ecde3e54403b",
//     "Perangkat_Daerah": {
//       "nama_opd": "BADAN PERENCANAAN, PENELITIAN DAN PEMBANGUNAN DAERAH"
//     },
//     "Pegawai": {
//       "nama": " ALI YOGA UTAMA ,S.STP",
//       "nip": "198605162004121002"
//     },
//     "Peserta": [
//       {
//         "tanggal": "8 Maret 2024"
//       },
//       {
//         "tanggal": "9 Maret 2024"
//       }
//     ]
//   },
//   {
//     "uuid": "df99355e-6ac1-43e8-8e01-41949ee077f6",
//     "Perangkat_Daerah": {
//       "nama_opd": "BADAN PERENCANAAN, PENELITIAN DAN PEMBANGUNAN DAERAH"
//     },
//     "Pegawai": {
//       "nama": " ALI YOGA UTAMA ,S.STP",
//       "nip": "198605162004121002"
//     },
//     "Peserta": [
//       {
//         "id": 18,
//         "uuid": "df99355e-6ac1-43e8-8e01-41949ee077f6",
//         "jumlah_peserta": 10,
//         "jenis_peserta": "internal",
//         "tanggal": "7 Maret 2024",
//         "createdAt": "2024-03-07T07:48:18.129Z",
//         "updatedAt": "2024-03-07T07:48:18.129Z"
//       },
//       {
//         "tanggal": "8 Maret 2024"
//       },
//       {
//         "id": 19,
//         "uuid": "df99355e-6ac1-43e8-8e01-41949ee077f6",
//         "jumlah_peserta": 5,
//         "jenis_peserta": "eksternal",
//         "tanggal": "9 Maret 2024",
//         "createdAt": "2024-03-07T07:48:26.664Z",
//         "updatedAt": "2024-03-07T07:48:26.664Z"
//       },
//     ]
//   }
// ]
