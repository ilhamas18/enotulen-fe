"use client";
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { shallowEqual, useSelector } from 'react-redux';
import { State } from '@/store/reducer';
import Breadcrumb from '@/components/global/Breadcrumbs/Breadcrumb';
import { fetchApi } from '@/app/api/request';
import EditForm from '@/components/pages/user/editForm';
import Loading from '@/components/global/Loading/loading';
import Swal from 'sweetalert2';
import withAuth from '@/components/hocs/withAuth';
import { BiSolidUserAccount } from 'react-icons/bi';

const EditUser = ({ params }: { params: { nip: number } }) => {
  const router = useRouter();
  const { nip } = params;
  const [OPD, setOPD] = useState<any>([]);
  const [user, setUser] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { profile } = useSelector((state: State) => ({
    profile: state.profile.profile
  }), shallowEqual);

  useEffect(() => {
    fetchDataUser();
  }, []);

  const fetchDataUser = async () => {
    setLoading(true);
    const response = await fetchApi({
      url: `/pegawai/getPegawai/${nip}`,
      method: 'get',
      type: 'auth'
    })

    if (!response.success) {
      if (response.code == 401) {
        router.push('/unauthorized')
      } else if (response.code == 404) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Data pegawai tidak ditemukan',
        })
        setLoading(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Koneksi bermasalah!',
        })
        setLoading(false);
      }
    } else {
      if (response.data.code == 200) {
        const { data } = response.data;

        setUser({
          nama: data.nama,
          nip: data.nip,
          pangkat: data.pangkat,
          namaPangkat: data.nama_pangkat,
          jabatan: data.jabatan,
          role: data.role
        })

        setOPD({
          label: data.Perangkat_Daerah.nama_opd,
          value: data.Perangkat_Daerah.kode_opd
        });
        setLoading(false);
      }
    }
  }

  const gradientStyle = {
    width: '100%',
    background: 'linear-gradient(to right, #00bcd4, #2196f3)',
  };

  return (
    <div className='form-user-container'>
      <Breadcrumb pageName='Pegawai / Edit' />
      <div className="mt-8">
        {loading ? (
          <Loading loading={loading} setLoading={setLoading} />
        ) : (
          <div className="form-container bg-white rounded-lg">
            <div style={gradientStyle} className='mt-8'>
              <div className='px-4 flex text-white py-4 space-x-6 font-bold items-center'>
                <BiSolidUserAccount size={25} />
                <div className='text-title-xsm'>Form Edit Notulen</div>
              </div>
            </div>
            <EditForm opd={OPD} user={user} />
          </div>
        )}
      </div>
    </div>
  )
}

export default withAuth(EditUser)