"use client";
import * as React from 'react';
import { useState, useEffect } from 'react';
import Loading from '@/components/global/Loading/loading';
import TambahOPDForm from '@/components/pages/opd/tambahOPDForm';
import { State } from '@/store/reducer';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'react-redux';
import Breadcrumb from '@/components/global/Breadcrumbs/Breadcrumb';
import { fetchApi } from '@/app/api/request';
import Swal from 'sweetalert2';

const TambahOPD = ({ params }: { params: { id: number } }) => {
  const { opd } = useSelector((state: State) => ({
    opd: state.opd
  }), shallowEqual);
  const [dataPegawai, setDataPegawai] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = params;

  useEffect(() => {
    fetchPegawai();
  }, []);

  const fetchPegawai = async () => {
    setLoading(true);
    const response = await fetchApi({
      url: `/pegawai/getAllPegawai/${id}`,
      method: 'get',
      type: 'auth'
    })

    if (!response.success) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Koneksi bermasalah!',
      })
      setLoading(false);
    } else {
      const { data } = response.data;
      let temp: any = [];
      data.forEach((el: any) => {
        temp.push({
          label: el.nama,
          value: el.nip,
          data: {
            nama: el.nama,
            nip: el.nip,
            pangkat: el.pangkat,
            namaPangkat: el.nama_pangkat,
            jabatan: el.jabatan
          }
        })
      })
      setDataPegawai(temp);
      setLoading(false);
    }
  }

  return (
    <div className="form-opd-container">
      <Breadcrumb pageName="Perangkat Daerah / Tambah" />
      <div className="bg-white py-4 flex items-center font-bold justify-center">
        FORM TAMBAH DATA PERANGKAT DAERAH
      </div>
      <div className="mt-8">
        {loading ? (
          <Loading loading={loading} setLoading={setLoading} />
        ) : (
          <div className="form-container bg-white rounded-lg">
            <div className='flex flex-col pt-6'>
              <div className='mx-8 px-4 border border-light-gray rounded-lg py-3'>{opd.opd.kode_opd}   -   {opd.opd.nama_opd}</div>
            </div>
            <TambahOPDForm dataOPD={opd} dataPegawai={dataPegawai} />
          </div>
        )}
      </div>
    </div>
  )
}

export default TambahOPD