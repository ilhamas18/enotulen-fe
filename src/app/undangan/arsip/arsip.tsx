"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/app/api/request";
import LaporanUndanganList from "@/components/pages/undangan/list";
import { getShortDate, getTime } from "@/components/hooks/formatDate";
import { ImTable2 } from "react-icons/im";
import withAuth from "@/components/hocs/withAuth";
import { shallowEqual, useSelector } from "react-redux";
import { State } from "@/store/reducer";
import Swal from "sweetalert2";
import Loading from "@/components/global/Loading/loading";

const ArsipUndanganProps = () => {
  const router = useRouter();
  const [undangan, setUndangan] = useState<any>([]);
  const [month, setMonth] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
      const currentMonth = month !== null ? month.toLocaleString("id-ID", { month: "long", }) : currentDate.toLocaleString("id-ID", { month: "long", });
      const currentYear = currentDate.getFullYear();

      setMonth({ month: currentShortMonth, year: currentYear })
    }
  }, [month]);

  const fetchData = async () => {
    setLoading(true);
    const response = await fetchApi({
      url: `/undangan/getArchieve`,
      method: "get",
      type: "auth",
    });

    if (!response.success) {
      if (response.code == 401) {
        router.push('/unauthorized');
      } else {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Koneksi bermasalah!",
        });
      }
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

  return (
    <div>
      <div className="bg-white dark:bg-meta-4 shadow-card flex flex-col gap-2 py-4 text-center font-bold text-title-sm rounded rounded-lg border-none">
        <div>ARSIP UNDANGAN</div>
        {profile.role == 1 && <div>PEMERINTAH KOTA MADIUN</div>}
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

export default withAuth(ArsipUndanganProps);