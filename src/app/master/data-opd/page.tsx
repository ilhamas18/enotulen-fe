"use client";
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from "@/components/global/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { fetchApi } from '@/components/mixins/request';
import Swal from 'sweetalert2';
import { shallowEqual, useSelector } from 'react-redux';
import { State } from '@/store/reducer';
import { BsPeopleFill } from "react-icons/bs";
import ListOPD from '@/components/pages/opd/listOPD';
import { FaSync } from 'react-icons/fa';
import withAuth from '@/components/hocs/withAuth';

const DataMasterOPD = () => {
  const router = useRouter();
  const [listOPD, setListOPD] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { profile } = useSelector((state: State) => ({
    profile: state.profile.profile
  }), shallowEqual)

  useEffect(() => {
    fetchOPD();
  }, []);

  const fetchOPD = async () => {
    setLoading(true);
    const response = await fetchApi({
      url: `/opd/getAllOPD`,
      method: "get",
      type: "auth"
    })

    if (!response.success) {
      setLoading(false);
      if (response.code == 401) {
        router.push('/unauthorized')
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Koneksi bermasalah!',
        })
      }
    } else {
      if (response.data.code == 200) {
        const { data } = response.data;

        let temp: any = [];
        data.forEach((el: any, i: number) => {
          temp.push({
            id: i + 1,
            kode_opd: el.kode_opd,
            nama_opd: el.nama_opd,
            singkatan: el.singkatan,
            alamat: el.alamat,
            telepon: el.telepon,
            faximile: el.faximile,
            website: el.website
          })
        })
        setListOPD(temp);
        setLoading(false);
      }
    }
  }

  const handleSync = async () => {
    Swal.fire({
      title: 'Apakah Anda yakin sinkron data OPD?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Sinkron',
      denyButtonText: `Batal`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const response = await fetchApi({
          url: '/opd/syncOPD',
          method: 'post',
          type: 'auth'
        })
        if (!response.success) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: response.data.message,
          })
          setLoading(false);
          fetchOPD();
        } 
        else {
          setLoading(false);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Data berhasil tersinkron',
            showConfirmButton: false,
            timer: 1500
          })
          fetchOPD();
        }
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

  const gradientStyle = {
    width: '100%',
    background: 'linear-gradient(to right, #00bcd4, #2196f3)',
  };

  return (
    <div className="list-notulen-container">
      <Breadcrumb pageName="Perangkat Daerah" />

      <div className="bg-white dark:bg-meta-4 dark:text-white shadow-card flex flex-col gap-2 py-6 text-center font-bold text-title-sm rounded rounded-lg border-none">
        <div>Daftar Satuan Kerja Perangkat Daerah</div>
      </div>
      <div className='body relative'>
        <button className='bg-xl-base flex gap-3 px-4 py-1 items-center justify-center rounded-md w-[120px] text-center text-white mt-10 mb-2 hover:bg-dark-xl' onClick={handleSync}>
          <div><FaSync size={16} /></div>
          <div>Sinkron</div>
        </button>
        <div style={gradientStyle}>
          <div className='px-4 flex text-white py-4 space-x-6 font-bold items-center'>
            <BsPeopleFill size={20} />
            <div className='text-title-xsm'>Daftar OPD</div>
          </div>
        </div>
        <ListOPD data={listOPD} />
      </div>
    </div>
  )
}

export default withAuth(DataMasterOPD)
