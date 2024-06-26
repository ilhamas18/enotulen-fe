"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import withAuth from "@/components/hocs/withAuth";
import { shallowEqual, useSelector } from "react-redux";
import { State } from "@/store/reducer";
import StepsWrapper from "@/components/global/Steps";
import { FaWpforms } from "react-icons/fa";
import AddPesertaForm from "@/components/pages/peserta/form";
import { dateRangeFormat } from "@/components/helpers/dateRange";
import CancelBtn from "@/components/hooks/cancelBtn";
import { Button } from "@/components/common/button/button";
import Loading from "@/components/global/Loading/loading";
import { fetchApi } from "@/app/api/request";
import Swal from "sweetalert2";

interface PropTypes {
  id: number
}

const PesertaProps = ({ id }: PropTypes) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>([]);
  const [peserta, setPeserta] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(false);

  const step: any = searchParams.get('step');
  const type: any = searchParams.get('type');

  const { profile, payload } = useSelector((state: State) => ({
    profile: state.profile.profile,
    payload: state.payload.payload
  }), shallowEqual);

  useEffect(() => {
    if (profile.role != 2 && profile.role != 3 && profile.role != 4) {
      router.push('/unauthorized')
    }
    setData(payload.step1);
    const dateRange = dateRangeFormat(payload.step1?.tanggal !== undefined && payload.step1?.tanggal[0]);
    const temp = dateRange.map((date: any) => ({
      tanggal: date,
      jumlah_peserta: 0,
      jenis_peserta: '',
    }));

    setPeserta(temp);
    fetchPeserta(temp)
  }, [trigger]);

  const fetchPeserta = async (arr: any) => {
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
        const matchingData = data[0].Peserta.find((data: any) => {
          return data.tanggal.split(', ')[1] === item.tanggal;
        });

        return matchingData
          ? {
            tanggal: matchingData.tanggal,
            uuid: matchingData.uuid,
            jumlah_peserta: matchingData.jumlah_peserta,
            jenis_peserta: matchingData.jenis_peserta,
            penanggungjawab: matchingData.penanggungjawab
          }
          : item;
      });
      if (data[0].Peserta.length != 0) setPeserta(updatedState);
      setLoading(false);
      setTrigger(false);
    }
  }

  const rangeDate = dateRangeFormat(data?.tanggal !== undefined && data?.tanggal[0]);

  const handleNext = () => {
    if (step !== null) {
      router.push('/notulen/form?step=3');
    } else {
      router.push('/laporan');
    }
  }

  const handleCancel = () => router.push('/laporan');

  const gradientStyle = {
    width: '100%',
    background: 'linear-gradient(to right, #00bcd4, #2196f3)',
  };

  return (
    <div className="form-peserta-container">
      {step !== null && <StepsWrapper step={step} />}
      {loading ? (
        <Loading loading={loading} setLoading={setLoading} />
      ) : (
        <div>
          <div style={gradientStyle} className='mt-8'>
            <div className='px-4 flex text-white py-4 space-x-6 font-bold items-center'>
              <FaWpforms size={20} />
              <div className='text-title-xsm'>Form Tambah Daftar Hadir</div>
            </div>
          </div>
          {data.length != 0 && (
            rangeDate.length == peserta.length && rangeDate.map((el: any, i: number) => (
              <div className="flex flex-col gap-6" key={i}>
                <AddPesertaForm
                  step={step}
                  undangan={data}
                  profile={profile}
                  rangeDate={el}
                  index={i}
                  type={type}
                  peserta={peserta}
                  setPeserta={setPeserta}
                  setTrigger={setTrigger}
                />
              </div>
            ))
          )}
          <div className="btn-submit mx-8 flex flex-row justify-between pb-4 mt-10 space-x-3">
            <div className="w-[8em]">
              <Button
                type="secondary"
                variant="xl"
                className="button-container px-8 py-2"
                loading={loading}
                rounded
                onClick={handleCancel}
              >
                <div className="flex gap-2 justify-center items-center text-white font-Nunito">
                  <span className="button-text text-xl-base">Batal</span>
                </div>
              </Button>
            </div>
            <div className="w-[8em]">
              <Button
                variant="xl"
                className="button-container"
                onClick={handleNext}
                loading={loading}
                rounded
              >
                <div className="flex justify-center items-center text-white">
                  <span className="button-text">{step !== null ? 'Lanjut' : 'Simpan'}</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default withAuth(PesertaProps);



