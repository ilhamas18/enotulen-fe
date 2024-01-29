"use client";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import withAuth from "@/components/hocs/withAuth";
import { shallowEqual, useSelector } from "react-redux";
import { fetchApi } from "@/app/api/request";
import Swal from "sweetalert2";
import Loading from "@/components/global/Loading/loading";
import { State } from "@/store/reducer";
import { getShortDate, getTime } from "@/components/hooks/formatDate";
import Breadcrumb from "@/components/global/Breadcrumbs/Breadcrumb";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ImTable2 } from "react-icons/im";
import StepsWrapper from "@/components/global/Steps";
import { FaWpforms } from "react-icons/fa";
import AddPesertaForm from "@/components/pages/peserta/form";

const Peserta = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>([]);

  const step: any = searchParams.get('step');

  const { profile, payload } = useSelector((state: State) => ({
    profile: state.profile.profile,
    payload: state.payload.payload
  }), shallowEqual);

  useEffect(() => {
    // if (step === null) {
    //   router.push('/unauthorized');
    // } else {
    //   if (profile.role != 2 && profile.role != 3 && profile.role != 4) {
    //     router.push('/unauthorized')
    //   }
    // }
    if (payload.step2 !== undefined) setData(payload.step2);
    else if (payload.step1 !== undefined) setData(payload.step1);
  }, []);

  const gradientStyle = {
    width: '100%',
    background: 'linear-gradient(to right, #00bcd4, #2196f3)',
  };

  return (
    <div className="form-peserta-container">
      <StepsWrapper step={step} />
      <div style={gradientStyle} className='mt-8'>
        <div className='px-4 flex text-white py-4 space-x-6 font-bold items-center'>
          <FaWpforms size={20} />
          <div className='text-title-xsm'>Form Tambah Daftar Hadir</div>
        </div>
      </div>
      {data.length != 0 && <AddPesertaForm payload={data} />}
    </div>
  )
}

export default withAuth(Peserta);