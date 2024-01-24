'use client';
import { useRouter, useSearchParams } from "next/navigation";
import { shallowEqual, useSelector } from "react-redux";
import { State } from "@/store/reducer";
import { useEffect, useState } from "react";
import { FaWpforms } from "react-icons/fa";
import withAuth from "@/components/hocs/withAuth";
import { fetchApi } from "@/app/api/request";
import Swal from "sweetalert2";
import AddUndanganForm from "@/components/pages/undangan/add";
import Loading from "@/components/global/Loading/loading";
import StepsWrapper from "@/components/global/Steps";

const TambahUndangan = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dataAtasan, setDataAtasan] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const step: any = searchParams.get('step');

  const { profile } = useSelector((state: State) => ({
    profile: state.profile.profile
  }), shallowEqual);

  useEffect(() => {
    if (profile.role != 2 && profile.role != 3 && profile.role != 4) {
      router.push('/unauthorized')
    }
    fetchDataAtasan();
  }, []);

  const fetchDataAtasan = async () => {
    setLoading(true);
    const response = await fetchApi({
      url: `/pegawai/getPelapor/${profile.Perangkat_Daerah.kode_opd}/atasan`,
      method: "get",
      type: "auth",
    });

    if (!response.success) {
      if (response.data.code == 500) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal memuat data atasan",
        });
        setLoading(false);
      }
      setLoading(false);
    } else {
      const { data } = response.data;
      const filtered = data.filter((el: any) => el.role == 3);
      let temp: any = [];
      filtered.forEach((item: any) => {
        temp.push({
          label: item.nama,
          value: item.nip,
          data: {
            nama: item.nama,
            nip: item.nip,
            pangkat: item.pangkat,
            namaPangkat: item.nama_pangkat,
            jabatan: item.jabatan
          },
        });
      });
      setDataAtasan(temp);
      setLoading(false);
    }
  };

  const gradientStyle = {
    width: '100%',
    background: 'linear-gradient(to right, #00bcd4, #2196f3)',
  };

  return (
    <div className="form-undangan-containe">
      {step !== null && (
        <StepsWrapper step={step} />
      )}
      <div style={gradientStyle} className='mt-8'>
        <div className='px-4 flex text-white py-4 space-x-6 font-bold items-center'>
          <FaWpforms size={20} />
          <div className='text-title-xsm'>Form Tambah Undangan</div>
        </div>
      </div>
      {loading ? (
        <Loading loading={loading} setLoading={setLoading} />
      ) : (
        <AddUndanganForm
          profile={profile}
          dataAtasan={dataAtasan}
          step={step}
        />
      )}
    </div>
  )
}

export default withAuth(TambahUndangan);

