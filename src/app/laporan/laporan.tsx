"use client";
import * as React from 'react';
import { useState, useEffect } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { State } from '@/store/reducer';
import withAuth from '@/components/hocs/withAuth';
import { fetchApi } from '@/app/api/request';
import Swal from 'sweetalert2';
import LaporanList from '@/components/pages/laporan/list';
import { ImTable2 } from 'react-icons/im';
import Loading from '@/components/global/Loading/loading';
import { dateRangeFormat } from '@/components/helpers/dateRange';
import { localDateFormat } from '@/components/helpers/formatMonth';
import { setPayload } from '@/store/payload/action';

const LaporanPage = () => {
  const dispatch = useDispatch();
  const [laporan, setLaporan] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { profile } = useSelector(
    (state: State) => ({
      profile: state.profile.profile,
    }),
    shallowEqual
  );

  useEffect(() => {
    fetchLaporan();
    dispatch(setPayload([]));
  }, []);

  const fetchLaporan = async () => {
    setLoading(true);
    const response = await fetchApi({
      url: `/laporan/getAuthLaporan/${profile.Perangkat_Daerah.kode_opd}`,
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

      const filtered: any = data.filter((el: any) => el.Notulens.length !== 0 || el.Undangan !== null);

      let tanggalArr: any = []
      let temp: any = [...filtered]
      filtered.forEach((el: any, index: number) => {
        // const dateRange = dateRangeFormat(el.Undangan !== null ? el.Undangan.tanggal !== null ? el.Undangan.tanggal[0] : el.Notulens.length != 0 ? el.Notulens[0].tanggal[0] : null : null);
        const dateRange = dateRangeFormat(el.Undangan !== null ? el.Undangan.tanggal[0] : el.Notulens.length != 0 ? el.Notulens[0].tanggal[0] : null)

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

  return (
    <div className='list-laporan-container relative'>
      <div className="bg-white dark:bg-meta-4 shadow-card flex flex-col gap-2 py-4 text-center font-bold text-title-sm rounded rounded-lg border-none">
        <div>REKAP LAPORAN UNDANGAN, DAFTAR HADIR, DAN NOTULEN</div>
        {profile.role == 1 && <div>PEMERINTAH KOTA MADIUN</div>}
        {profile.role == 2 || profile.role == 3 ? <div>{profile.Perangkat_Daerah?.nama_opd}</div> : null}
        {profile.role == 4 && <div className="text-title-xsm2">{profile.nama}</div>}
      </div>
      <div style={gradientStyle} className="mt-[2.5em]">
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