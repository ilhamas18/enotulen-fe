"use client";
import * as React from 'react';
import { useState, useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { State } from '@/store/reducer';
import Breadcrumb from '@/components/global/Breadcrumbs/Breadcrumb';
import { fetchApi } from '@/components/mixins/request';
import RegistrasiForm from '@/components/pages/user/registrasiForm';
import EditForm from '@/components/pages/user/editForm';
import Loading from '@/components/global/Loading/loading';
import Swal from 'sweetalert2';
import withAuth from '@/components/hocs/withAuth';
import { BiSolidUserAccount } from 'react-icons/bi';

const TambahUser = () => {
  const [listOPD, setListOPD] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { profile } = useSelector((state: State) => ({
    profile: state.profile.profile
  }), shallowEqual)

  useEffect(() => {
    if (profile.role == 1) fetchOPD();
    if (profile.role == 2) getOPD();
  }, []);

  const fetchOPD = async () => {
    setLoading(true);
    const response = await fetchApi({
      url: '/opd/getAllOPD',
      method: 'get',
      type: 'auth'
    })

    if (!response.success) {
      if (response.data.code == 500) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Koneksi bermasalah!',
        })
      }
      setLoading(false);
    } else {
      const { data } = response.data;
      let temp: any = [];
      data.forEach((el: any) => {
        temp.push({
          label: el.nama_opd,
          value: el.kode_opd
        })
      })
      setListOPD(temp);
      setLoading(false);
    }
  }

  const getOPD = () => {
    let temp: any = [];
    temp.push({
      label: profile.Perangkat_Daerah.nama_opd,
      value: profile.Perangkat_Daerah.kode_opd
    })
    setListOPD(temp);
  }

  const gradientStyle = {
    width: '100%',
    background: 'linear-gradient(to right, #00bcd4, #2196f3)',
  };

  return (
    <div className='form-user-container'>
      <Breadcrumb pageName='Pegawai / Tambah' />
      <div className="bg-white py-4 flex flex-col items-center font-bold justify-center gap-2">
        <div className='md:text-title-sm text-title-xsm'>FORM TAMBAH ROLE PEGAWAI</div>
        <div className={`${profile.role == 2 ? 'block' : 'hidden'} text-title-xsm`}>{profile.Perangkat_Daerah?.nama_opd}</div>
      </div>
      <div className="mt-8">
        {loading ? (
          <Loading loading={loading} setLoading={setLoading} />
        ) : (
          <div className="form-container bg-white rounded-lg">
            {listOPD.length == 0 ? (
              <div className='text-center flex flex-col gap-3 text-danger'>
                <div className='font-bold tracking-wider text-title-xsm'>Data Perangkat Daerah Kosong</div>
                <div className='text'>Mohon sinkronkan terlebih dahulu !</div>
              </div>
            ) : (
              <>
                <div style={gradientStyle} className='mt-8'>
                  <div className='px-4 flex text-white py-4 space-x-6 font-bold items-center'>
                    <BiSolidUserAccount size={25} />
                    <div className='text-title-xsm'>Form Tambah Notulen</div>
                  </div>
                </div>
                <RegistrasiForm dataOPD={listOPD} profile={profile} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default withAuth(TambahUser);