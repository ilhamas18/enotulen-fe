"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { fetchApi } from "@/components/mixins/request";
import LaporanNotulen from "@/components/pages/laporan/laporanNotulen";
import Swal from "sweetalert2";
import LaporanNotulenAuth from "@/components/pages/laporan/laporanAuth";
import Breadcrumb from "@/components/global/Breadcrumbs/Breadcrumb";
import { getShortDate, getTime } from "@/components/hooks/formatDate";
import { ImTable2 } from "react-icons/im";
import withAuth from "@/components/hocs/withAuth";
import { shallowEqual, useSelector } from "react-redux";
import { State } from "@/store/reducer";
import Loading from "@/components/global/Loading/loading";

const Laporan = () => {
  const [notulens, setNotulens] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { profile } = useSelector(
    (state: State) => ({
      profile: state.profile.profile,
    }),
    shallowEqual
  );

  useEffect(() => {
    fetchData();
  }, []);

  const currentDate = new Date();
  const currentShortMonth = currentDate.getMonth() + 1;
  const currentMonth = currentDate.toLocaleString("id-ID", { month: "long", });
  const currentYear = currentDate.getFullYear();

  const fetchData = async () => {
    setLoading(true);
    // let response;
    // if (profile.role == 4) {
    const response = await fetchApi({
      url: `/notulen/getAuthNotulen/${profile.Perangkat_Daerah.kode_opd}/${profile.nip}/${currentShortMonth}/${currentYear}`,
      method: "get",
      type: "auth",
    });
    // }

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
            index: el.id,
            tagging: el.tagging !== null ? el.tagging.map((el: any) => el.label) : "-",
            tanggal: el.tanggal[0]?.startDate !== el.tanggal[0]?.endDate
              ? getShortDate(el.tanggal[0]?.startDate) +
              " - " +
              getShortDate(el.tanggal[0]?.endDate)
              : getShortDate(el.tanggal[0]?.startDate),
            waktu: getTime(el.waktu) + " WIB",
            acara: el.acara,
            lokasi: el.lokasi,
            status: el.status,
            foto: el.link_img_foto !== null ? "Ada" : "-",
            daftarHadir: el.link_img_daftar_hadir !== null ? "Ada" : "-",
            undangan: el.link_img_surat_undangan !== null ? "Ada" : "-",
            spj: el.link_img_spj !== null ? "Ada" : "-",
            lainLain: el.link_pendukung !== null ? "Ada" : "-",
          });
        });
        setNotulens(temp);
        setLoading(false);
      }
    }
  };

  const gradientStyle = {
    width: "100%",
    background: "linear-gradient(to right, #00bcd4, #2196f3)",
  };

  return (
    <div className="list-notulen-container">
      <Breadcrumb pageName="Laporan" />
      <div className="bg-white dark:bg-meta-4 shadow-card flex flex-col gap-2 py-4 text-center font-bold text-title-sm rounded rounded-lg border-none">
        <div>DAFTAR LAPORAN NOTULEN</div>
        {profile.role == 2 || profile.role == 3 ? <div>{profile.Perangkat_Daerah.nama_opd}</div> : null}
        <div>Bulan {currentMonth} {currentYear}</div>
      </div>
      <div style={gradientStyle} className="mt-10">
        <div className="px-4 flex text-white py-4 space-x-6 font-bold items-center">
          <ImTable2 size={20} />
          <div className="text-title-xsm">Notulen</div>
        </div>
      </div>
      {loading ? (
        <Loading loading={loading} setLoading={setLoading} />
      ) : (
        <LaporanNotulenAuth data={notulens} profile={profile} />
      )}
    </div>
  );
};

export default withAuth(Laporan);
