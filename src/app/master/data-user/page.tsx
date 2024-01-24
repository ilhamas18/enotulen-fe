"use client";
import { State } from '@/store/reducer';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import Breadcrumb from '@/components/global/Breadcrumbs/Breadcrumb';
import { BsPersonFillAdd } from 'react-icons/bs';
import { IoPeopleSharp } from 'react-icons/io5';
import { fetchApi } from '@/app/api/request';
import DataListUser from '@/components/pages/user/list';
import Swal from 'sweetalert2';

const DataUser = () => {
  const router = useRouter();

  const [dataPegawai, setDataPegawai] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { profile } = useSelector((state: State) => ({
    profile: state.profile.profile
  }), shallowEqual);

  useEffect(() => {
    fetchPegawai();
  }, []);

  const listRole: any = [
    {
      role: 'ADMIN KOTA'
    },
    {
      role: 'ADMIN OPD'
    },
    {
      role: 'VERIFIKATOR'
    },
    {
      role: 'USER'
    }
  ]

  const fetchPegawai = async () => {
    setLoading(true);
    const response = await fetchApi({
      url: `/pegawai/getAllPegawai/${profile.Perangkat_Daerah?.kode_opd}`,
      method: 'get',
      type: 'auth'
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
            nama: el.nama,
            nip: el.nip,
            pangkat: el.nama_pangkat + ' ' + (el.pangkat),
            opd: el.Perangkat_Daerah.nama_opd,
            role: listRole[el.role - 1].role,
            status: el.status
          })
        })
        setDataPegawai(temp);
        setLoading(false);
      }
    }
  }

  const handleAddUser = () => router.push('/auth/registrasi');

  const gradientStyle = {
    width: '100%',
    background: 'linear-gradient(to right, #00bcd4, #2196f3)',
  };

  return (
    <div className='list-user-container'>
      <Breadcrumb pageName="Pegawai" />

      <div className="bg-white dark:bg-meta-4 dark:text-white shadow-card flex flex-col gap-2 py-6 text-center font-bold text-title-sm rounded rounded-lg border-none">
        {profile.role == 1 && <div>DAFTAR LIST PEGAWAI</div>}
        {profile.role == 2 && (
          <div className='flex flex-col gap-2'>
            <div>DAFTAR LIST PEGAWAI</div>
            <div>{profile.Perangkat_Daerah?.nama_opd}</div>
          </div>
        )}
      </div>
      <div className='body relative'>
        <button className='bg-xl-base flex gap-3 px-4 py-1 items-center justify-center rounded-md w-[120px] text-center text-white mt-10 mb-2 hover:bg-dark-xl' onClick={handleAddUser}>
          <div><BsPersonFillAdd size={16} /></div>
          <div>Tambah</div>
        </button>
        <div style={gradientStyle}>
          <div className='px-4 flex text-white py-4 space-x-6 font-bold items-center'>
            <IoPeopleSharp size={20} />
            <div className='text-title-xsm'>Daftar Pegawai</div>
          </div>
        </div>
        <DataListUser dataPegawai={dataPegawai} />
      </div>
    </div>
  )
}

export default DataUser;