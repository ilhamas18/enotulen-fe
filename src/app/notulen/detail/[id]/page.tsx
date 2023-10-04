'use client';
import { fetchApi } from '@/components/mixins/request';
import * as React from 'react';
import { useState, useEffect } from 'react';
import NotulenDetailProps from '@/components/pages/notulen/detail';
import Loading from '@/components/global/Loading/loading';
import Swal from 'sweetalert2';
import Breadcrumb from '@/components/global/Breadcrumbs/Breadcrumb';

const NotulenDetail = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  const [notulenDetail, setNotulenDetail] = useState<any>(null);
  const [listTagging, setListTagging] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
    fetchTagging();
  }, [])

  const fetchData = async () => {
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
    } else {
      if (response.data.code == 200) {
        const { data } = response.data;
        setNotulenDetail(data)
        setLoading(false);
      }
    }
  }

  const fetchTagging = async () => {
    const response = await fetchApi({
      url: '/tagging/getAllTagging',
      method: 'get',
      type: 'auth'
    })

    if (!response.success) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Koneksi bermasalah!',
      })
    } else {
      if (response.data.code == 200) {
        const { data } = response.data;
        let temp: any = [];
        data.forEach((el: any) => {
          temp.push({
            label: el.nama_tagging,
            value: el.id
          })
        })
        setListTagging(temp);
        setLoading(false);
      }
    }
  }

  return (
    <div className="detail-notulen-container">
      <Breadcrumb pageName="Laporan / Detail" />
      <div className="bg-white dark:bg-meta-4 flex flex-col gap-2 shadow-lg py-4 text-center font-bold text-title-sm rounded rounded-lg border-none">
        <div>Laporan Notulen</div>
        <div>{notulenDetail?.Pegawai?.Perangkat_Daerah?.nama_opd}</div>
        <div className='text-title-xsm'>PEMERINTAH KOTA MADIUN</div>
      </div>
      {loading ? (
        <Loading loading={loading} setLoading={setLoading} />
      ) : (
        notulenDetail === null ? (
          <div>Maaf, Data Notulen Kosong !</div>
        ) : (
          <NotulenDetailProps data={notulenDetail} tagging={listTagging} />
        )
      )}
    </div>
  )
}

export default NotulenDetail;