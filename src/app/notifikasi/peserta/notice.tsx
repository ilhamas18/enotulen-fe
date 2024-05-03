"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fetchApi } from "@/app/api/request";
import Swal from "sweetalert2";
import LaporanNotulenList from "@/components/pages/notulen/list";
import { getShortDate, getTime } from "@/components/hooks/formatDate";
import { ImTable2 } from "react-icons/im";
import withAuth from "@/components/hocs/withAuth";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { State } from "@/store/reducer";
import Loading from "@/components/global/Loading/loading";
import { setPayload } from "@/store/payload/action";
import LaporanPesertaList from "@/components/pages/peserta/list";

const NoticePesertaProps = () => {
  const [peserta, setPeserta] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { profile } = useSelector(
    (state: State) => ({
      profile: state.profile.profile,
    }),
    shallowEqual
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const response = await fetchApi({
      url: `/peserta/showResponsible/${profile.nip}`,
      method: 'get',
      type: 'auth'
    })

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
            id_peserta: el.id,
            opd: el.Uuid.Perangkat_Daerah.nama_opd,
            pelapor: el.Uuid.Pegawai.nama,
            tanggal: el.tanggal,
            waktu: getTime(el.Uuid?.Undangan?.waktu) + " WIB",
            acara: el.Uuid?.Undangan?.acara,
            lokasi: el.Uuid?.Undangan?.lokasi,
          })
        })
        setPeserta(temp);
        setLoading(false);
      }
    }
  }

  const gradientStyle = {
    width: "100%",
    background: "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
  };

  return (
    <div>
      <div className="bg-white md:mb-12 mb-4 dark:bg-meta-4 shadow-card flex flex-col gap-2 py-4 text-center font-bold text-title-sm rounded-lg border-none">
        <div>NOTIFIKASI DAFTAR HADIR</div>
      </div>
      <div style={gradientStyle} className="md:mt-[1em]">
        <div className="px-4 flex text-white py-4 space-x-6 font-bold items-center">
          <ImTable2 size={20} />
          <div className="text-title-xsm">Daftar Hadir</div>
        </div>
      </div>
      {loading ? (
        <Loading loading={loading} setLoading={setLoading} />
      ) : (
        <LaporanPesertaList
          data={peserta}
        />
      )}
    </div>
  )
}

export default withAuth(NoticePesertaProps);