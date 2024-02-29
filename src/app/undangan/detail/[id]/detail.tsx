"use client"
import * as React from 'react';
import { useEffect, useState } from 'react';
import { fetchApi } from '@/app/api/request';
import NotulenDetailProps from '@/components/pages/notulen/detail';
import Loading from '@/components/global/Loading/loading';
import Swal from 'sweetalert2';
import Breadcrumb from '@/components/global/Breadcrumbs/Breadcrumb';
import withAuth from '@/components/hocs/withAuth';
import { shallowEqual, useSelector } from 'react-redux';
import { State } from '@/store/reducer';
import UndanganDetailProps from '@/components/pages/undangan/detail';

interface PropTypes {
  id: number
}

const DetailProps = ({ id }: PropTypes) => {
  const [undangan, setUndangan] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { profile } = useSelector((state: State) => ({
    profile: state.profile.profile
  }), shallowEqual);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const response = await fetchApi({
      url: `/undangan/getUndanganDetail/${id}`,
      method: 'get',
      type: 'auth'
    });

    if (!response.success) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Koneksi bermasalah!",
      });
    } else {
      const { data } = response.data;
      setUndangan(data);
      setLoading(false);
    }
  }

  return (
    <div className='detail-undangan-container'>
      <div className="bg-white dark:bg-meta-4 flex flex-col gap-2 shadow-lg py-4 text-center font-bold text-title-sm rounded rounded-lg border-none">
        <div className='uppercase'>
          {undangan?.status === 'archieve' ? (
            <div>Hapus Undangan</div>
          ) : undangan?.atasan?.nip !== profile.nip ? (
            <div>Laporan Undangan</div>
          ) : (
            <div>Verifikasi Undangan</div>
          )}
        </div>
        <div className='text-title-xsm2'>{undangan?.Uuid?.Pegawai?.nama}</div>
      </div>
      {loading ? (
        <Loading loading={loading} setLoading={setLoading} />
      ) : (
        undangan.length == 0 ? (
          <div>Maaf, Data Undangan Kosong !</div>
        ) : (
          <UndanganDetailProps data={undangan} profile={profile} />
        )
      )}
    </div>
  )
}

export default withAuth(DetailProps);