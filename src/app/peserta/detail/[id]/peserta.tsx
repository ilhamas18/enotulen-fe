"use client";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import withAuth from "@/components/hocs/withAuth";
import { shallowEqual, useSelector } from "react-redux";
import { State } from "@/store/reducer";
import StepsWrapper from "@/components/global/Steps";
import { FaWpforms } from "react-icons/fa";
import AddPesertaForm from "@/components/pages/peserta/form";
import { fetchApi } from "../../../api/request";

interface PropTypes {
  id: number
}

const PesertaProps = ({ id }: PropTypes) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>([]);
  const [kepalaOPD, setKepalaOPD] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const step: any = searchParams.get('step');

  const { profile, payload } = useSelector((state: State) => ({
    profile: state.profile.profile,
    payload: state.payload.payload
  }), shallowEqual);

  useEffect(() => {
    if (profile.role != 2 && profile.role != 3 && profile.role != 4) {
      router.push('/unauthorized')
    }
    if (payload.step2 !== undefined) setData(payload.step2);
    else if (payload.step1 !== undefined) setData(payload.step1);
  }, []);

  const gradientStyle = {
    width: '100%',
    background: 'linear-gradient(to right, #00bcd4, #2196f3)',
  };

  return (
    <div className="form-peserta-container">
      {step !== null && <StepsWrapper step={step} />}
      <div style={gradientStyle} className='mt-8'>
        <div className='px-4 flex text-white py-4 space-x-6 font-bold items-center'>
          <FaWpforms size={20} />
          <div className='text-title-xsm'>Form Tambah Daftar Hadir</div>
        </div>
      </div>
      {data.length != 0 && <AddPesertaForm payload={data} profile={profile} id={id} />}
    </div>
  )
}

export default withAuth(PesertaProps);