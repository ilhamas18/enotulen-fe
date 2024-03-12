"use client"
import * as React from 'react';
import { useEffect, useState } from 'react';
import { fetchApi } from '@/app/api/request';
import Loading from '@/components/global/Loading/loading';
import Swal from 'sweetalert2';
import withAuth from '@/components/hocs/withAuth';
import { shallowEqual, useSelector } from 'react-redux';
import { State } from '@/store/reducer';
import DetailPeserta from '@/components/pages/peserta/detail';

interface PropTypes {
  id: number
}

const DetailProps = ({ id }: PropTypes) => {
  const [peserta, setPeserta] = useState<any>([]);
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
      url: `/peserta/getPesertaDetail/${id}`,
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
      setPeserta(data);
      setLoading(false);
    }
  }

  return (
    <div className='detail-peseta-container'>
      <div className="bg-white dark:bg-meta-4 flex flex-col gap-2 shadow-lg py-4 text-center font-bold text-title-sm rounded rounded-lg border-none">
        <div className='uppercase'>
          Daftar Hadir
        </div>
        <div className='text-title-xsm2'>{peserta?.Uuid?.Pegawai?.nama}</div>
      </div>
      {loading ? (
        <Loading loading={loading} setLoading={setLoading} />
      ) : (
        peserta.length == 0 ? (
          <div>Maaf, Data Daftar Hadir Kosong !</div>
        ) : (
          <DetailPeserta
            id={id}
            profile={profile}
            peserta={peserta}
            setPeserta={setPeserta}
          />
        )
      )}
    </div>
  )
}

export default withAuth(DetailProps);