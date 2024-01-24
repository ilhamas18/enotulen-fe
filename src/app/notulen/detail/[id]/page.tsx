'use client';
import { fetchApi } from '@/app/api/request';
import * as React from 'react';
import { useState, useEffect } from 'react';
import NotulenDetailProps from '@/components/pages/notulen/detail';
import Loading from '@/components/global/Loading/loading';
import Swal from 'sweetalert2';
import Breadcrumb from '@/components/global/Breadcrumbs/Breadcrumb';
import withAuth from '@/components/hocs/withAuth';
import { shallowEqual, useSelector } from 'react-redux';
import { State } from '@/store/reducer';

const NotulenDetail = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  const [notulenDetail, setNotulenDetail] = useState<any>(null);
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
      url: `/notulen/getNotulenDetail/${id}`,
      method: "get",
      type: "auth"
    })

    if (!response.success) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Koneksi bermasalah!',
      })
      setLoading(false);
    } else {
      if (response.data.code == 200) {
        const { data } = response.data;

        setNotulenDetail(data)
        setLoading(false);
      }
    }
  }

  return (
    <div className="detail-notulen-container">
      <Breadcrumb pageName="Laporan / Detail" />
      <div className="bg-white dark:bg-meta-4 flex flex-col gap-2 shadow-lg py-4 text-center font-bold text-title-sm rounded rounded-lg border-none">
        <div className='uppercase'>
          {notulenDetail?.status === 'archieve' ? (
            <div>Hapus Notulen</div>
          ) : notulenDetail?.atasan?.nip !== profile.nip ? (
            <div>Laporan Notulen</div>
          ) : (
            <div>Verifikasi Notulen</div>
          )}
        </div>
        <div className='text-title-xsm2'><div>{notulenDetail?.Uuid?.Pegawai?.nama}</div>
        </div>
        {/* <div className='text-title-xsm'>PEMERINTAH KOTA MADIUN</div> */}
      </div>
      {loading ? (
        <Loading loading={loading} setLoading={setLoading} />
      ) : (
        notulenDetail === null ? (
          <div>Maaf, Data Notulen Kosong !</div>
        ) : (
          <NotulenDetailProps data={notulenDetail} />
        )
      )}
    </div>
  )
}

export default withAuth(NotulenDetail);