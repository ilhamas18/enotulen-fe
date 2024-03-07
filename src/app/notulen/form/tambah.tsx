'use client'
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { State } from "@/store/reducer";
import { useEffect } from "react";
import AddNotulenForm from "@/components/pages/notulen/form"
import { FaWpforms } from "react-icons/fa";
import withAuth from "@/components/hocs/withAuth";
import { fetchApi } from "@/app/api/request";
import Swal from "sweetalert2";
import Loading from "@/components/global/Loading/loading";
import StepsWrapper from "@/components/global/Steps";
import { dateRangeFormat, dateISOFormat } from "@/components/helpers/dateRange";
import { Button } from "@/components/common/button/button";

const AddNotulenProps = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [notulen, setNotulen] = useState<any>([]);
  const [notulens, setNotulens] = useState<any>([]);
  const [dataAtasan, setDataAtasan] = useState<any>([]);
  const [tanggal, setTanggal] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(false);

  const step: any = searchParams.get('step');

  const { profile, payload } = useSelector((state: State) => ({
    profile: state.profile.profile,
    payload: state.payload.payload
  }), shallowEqual);

  useEffect(() => {
    if (profile.role != 2 && profile.role != 3 && profile.role != 4) router.push('/unauthorized');
    fetchDataAtasan();
    if (payload.step3 !== undefined) setNotulen(payload.step3);
    else if (payload.step1 !== undefined) setNotulen(payload.step1);
    const atasan = {
      label: payload.step1.atasan.nama,
      value: payload.step1.atasan.nip,
      data: {
        nama: payload.step1.atasan.nama,
        nip: payload.step1.atasan.nip,
        pangkat: payload.step1.atasan.pangkat,
        namaPangkat: payload.step1.atasan.namaPangkat,
        jabatan: payload.step1.atasan.jabatan
      },
    }

    setStateHandler(payload.step1, atasan);
    handleRangeDate(payload.step1);
  }, [trigger]);

  const setStateHandler = (data: any, atasan: any) => {

    const dateRange = dateRangeFormat(data.tanggal !== undefined && data.tanggal[0]);
    const tempArr = dateRange.map((date: any) => ({
      tagging: [],
      tanggal: dateISOFormat(date),
      waktu: data.length != 0 ? data.waktu !== null ? data.waktu : null : null,
      pendahuluan: data.length != 0 ? data.pendahuluan !== null ? data.pendahuluan : null : null,
      peserta_rapat: data.length != 0 ? data.peserta_rapat !== undefined ? data.peserta_rapat : [] : [],
      isi_rapat: data.length != 0 ? data?.isi_rapat !== undefined ? data?.isi_rapat : null : null,
      tindak_lanjut: data.length != 0 ? data.tindak_lanjut !== undefined ? data.tindak_lanjut : null : null,
      lokasi: data.length != 0 ? data.lokasi !== "" ? data.lokasi : "" : "",
      acara: data.length != 0 ? data.acara !== "" ? data.acara : "" : "",
      atasan: data.length != 0 ? atasan : null,
      status: "-",
      hari: data.length != 0 ? data.hari : null,
      bulan: data.length != 0 ? data.bulan : null,
      tahun: data.length != 0 ? data.tahun : null,
      link_img_surat_undangan: data.link_img_surat_undangan !== null ? data.link_img_surat_undangan : null,
      link_img_daftar_hadir: data.link_img_daftar_hadir !== null ? data.link_img_daftar_hadir : null,
      link_img_spj: data.link_img_spj !== null ? data.link_img_spj : null,
      link_img_foto: data.link_img_foto !== null ? data.link_img_foto : null,
      link_img_pendukung: data.link_img_pendukung !== null ? data.link_img_pendukung : null,
      signature: data.signature !== undefined ? data.signature !== '-' ? data.signature : null : null,
      kode_opd: profile.Perangkat_Daerah.kode_opd,
      nip_pegawai: profile.nip,
      nip_atasan: null,
    }));
    setNotulens(tempArr);
    fetchNotulen(tempArr);
  }

  const rangeDate = dateRangeFormat(notulen?.tanggal !== undefined && notulen?.tanggal[0]);

  const fetchNotulen = async (arr: any) => {
    setLoading(true);
    const response = await fetchApi({
      url: `/laporan/getLaporanDetail/${payload.step1.uuid}`,
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
      const { data } = response.data;
      const updatedState = arr.map((item: any) => {
        const matchingData = data[0].Notulens.find((data: any) => {
          const date = new Date(data.tanggal[0].startDate).getDate();
          return date.toString() === new Date(item.tanggal.startDate).getDate().toString();
        });

        return matchingData
          ? matchingData
          : item;
      });
      const temp = [...arr];
      data[0].Notulens.forEach((el: any, i: number) => {
        temp[i] = el
      })
      if (data[0].Notulens.length != 0) setNotulens(updatedState);
      setLoading(false);
      setTrigger(false);
    }
  }

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
  console.log(notulens);

  const handleRangeDate = (data: any) => {
    const transformedData = data.tanggal.map((item: any) => {
      const start = new Date(item.startDate);
      const end = new Date(item.endDate);
      const dateArray = [];

      while (start <= end) {
        const currentDate = new Date(start);
        dateArray.push({
          startDate: currentDate.toISOString(),
          endDate: currentDate.toISOString(),
          key: item.key
        });

        start.setDate(start.getDate() + 1);
      }

      return dateArray;
    }).flat();
    setTanggal(transformedData);
  }

  const handleFinish = () => router.push('/notulen/laporan');
  const handleCancel = () => router.push('/notulen/laporan');

  const gradientStyle = {
    width: '100%',
    background: 'linear-gradient(to right, #00bcd4, #2196f3)',
  };

  return (
    <div>
      {step !== null && <StepsWrapper step={step} />}
      <div style={gradientStyle} className='mt-8'>
        <div className='px-4 flex text-white py-4 space-x-6 font-bold items-center'>
          <FaWpforms size={20} />
          <div className='text-title-xsm'>Form Tambah Notulen</div>
        </div>
      </div>
      {loading ? (
        <Loading loading={loading} setLoading={setLoading} />
      ) : (
        <div>
          {notulen.length != 0 ? (
            rangeDate.length == notulens.length && notulens.map((el: any, i: number) => (
              <div key={i}>
                <AddNotulenForm
                  profile={profile}
                  payload={payload}
                  notulen={el}
                  notulens={notulens}
                  setNotulens={setNotulens}
                  step={step}
                  index={i}
                  rangeDate={rangeDate}
                  tanggal={tanggal}
                  dataAtasan={dataAtasan}
                  setLoading={setLoading}
                  trigger={trigger}
                  setTrigger={setTrigger}
                />
              </div>
            ))
          ) : null}
          <div className="flex justify-between mt-6">
            <div>
              <Button
                variant="xl"
                type="secondary"
                className="button-container px-8 py-2"
                onClick={handleCancel}
                rounded
              >
                <div className="flex justify-center items-center text-[#002DBB] font-Nunito">
                  <span className="button-text">Batal</span>
                </div>
              </Button>
            </div>
            <div>
              <Button
                type="button"
                variant="xl"
                rounded
                className="button-container px-8 py-2"
                loading={loading}
                onClick={handleFinish}
              >
                <div className="flex gap-2 justify-center items-center text-white font-Nunito">
                  <span className="button-text">Selesai</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default withAuth(AddNotulenProps)


