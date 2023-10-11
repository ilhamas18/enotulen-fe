import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditForm from './editForm';
import TextInput from "@/components/common/text-input/input";
import { Button } from '@/components/common/button/button';
import { fetchApi } from '@/components/mixins/request';
import Swal from 'sweetalert2';

interface PropTypes {
  dataOPD: any;
  profile: any;
}

const RegistrasiForm = ({ dataOPD, profile }: PropTypes) => {
  const router = useRouter();
  const [OPD, setOPD] = useState<any>([]);
  const [listUser, setListUser] = useState<any>([]);
  const [user, setUser] = useState<any>([]);
  const [role, setRole] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [payload, setPayload] = useState<any>([]);

  useEffect(() => {
    if (profile.role == 2) {
      const val = {
        target: {
          value: {
            label: dataOPD[0]?.label,
            value: dataOPD[0]?.value
          }
        }
      }
      handleChangeOPD(val);
    }
  }, []);

  const handleChangeOPD = async (val: any) => {
    setLoading(true);
    setOPD(val.target.value);
    const response = await fetchApi({
      url: `/pegawai/syncDataPegawai/${val.target.value.value}`,
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
          label: el.nama,
          value: el.nip,
          data: {
            nama: el.nama,
            nip: el.nip,
            pangkat: el.pangkat,
            namaPangkat: el.namapangkat,
            jabatan: el.jabatan
          }
        })
      })
      setListUser(temp);
      setLoading(false);
    }
  }

  const handleChangeUser = (val: any) => setUser(val.target.value.data);

  const handleChangeRole = (val: any) => setRole(val.target.value.value);

  const listRoleAdmin: any = [
    {
      label: 'Admin OPD',
      value: 2
    },
    {
      label: 'Verifikator',
      value: 3
    },
    {
      label: 'User',
      value: 4
    }
  ]

  const listRoleAdminOPD: any = [
    {
      label: 'Verifikator',
      value: 3
    },
    {
      label: 'User',
      value: 4
    }
  ]

  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      nama: user.nama,
      nip: user.nip,
      password: 'Bappeda@123',
      pangkat: user.pangkat,
      nama_pangkat: user.namaPangkat,
      jabatan: user.jabatan,
      role: role,
      kode_opd: OPD.value,
    }

    const response = await fetchApi({
      url: '/pegawai/addPegawai',
      method: 'post',
      type: 'auth',
      body: payload
    })

    if (!response.success) {
      if (response.code == 400) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "User telah ditambahkan",
        });
        setUser([]);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Koneksi bermasalah',
        })
        setUser([]);
      }
    } else {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "User berhasil ditambahkan",
        showConfirmButton: false,
        timer: 1500,
      });
      setUser([]);
      router.push("/master/data-user");
    }
  }

  return (
    <div className="relative py-6">
      <div className={`form-wrapper-general px-4 ${!isEdit ? 'block' : 'hidden'}`}>
        {user.length == 0 ? (
          <div className="px-8 flex flex-col space-y-7 mt-4">
            {profile.role == 1 && (
              <div className="data flex flex-row">
                <TextInput
                  type="dropdown"
                  id="opd"
                  name="opd"
                  label="Nama OPD"
                  placeholder="Ketik dan Cari Perangkat Daerah"
                  options={dataOPD}
                  change={(selectedOption: any) => {
                    handleChangeOPD({
                      target: { name: "opd", value: selectedOption },
                    });
                  }}
                />
              </div>
            )}
            {loading ? (
              <div>Sedang memuat data pegawai . . .</div>
            ) : (
              <div className={`${listUser.length != 0 ? 'block' : 'hidden'}`}>
                <TextInput
                  type="dropdown"
                  id="user"
                  name="user"
                  label="Nama User"
                  placeholder="Ketik dan Cari Pegawai"
                  options={listUser}
                  change={(selectedOption: any) => {
                    handleChangeUser({
                      target: { name: "user", value: selectedOption },
                    });
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className='flex flex-col gap-4 p-6'>
            <div className='body flex flex-row md:flex-row flex-col items-center justify-between'>
              <div className="text-label md:w-[20%] w-full md:text-left text-center">
                Nama Lengkap
              </div>
              <div className='md:w-[5%]'>:</div>
              <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                <div className="flex border border-light-gray rounded-lg w-full py-3 px-4">
                  {user.nama}
                </div>
              </div>
            </div>
            <div className='body flex flex-row md:flex-row flex-col items-center justify-between'>
              <div className="text-label md:w-[20%] w-full md:text-left text-center">
                NIP
              </div>
              <div className='md:w-[5%]'>:</div>
              <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                <div className="flex border border-light-gray rounded-lg w-full py-3 px-4">
                  {user.nip}
                </div>
              </div>
            </div>
            <div className='body flex flex-row md:flex-row flex-col items-center justify-between'>
              <div className="text-label md:w-[20%] w-full md:text-left text-center">
                Pangkat
              </div>
              <div className='md:w-[5%]'>:</div>
              <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                <div className="flex border border-light-gray rounded-lg w-full py-3 px-4">
                  {user.namaPangkat} ({user.pangkat})
                </div>
              </div>
            </div>
            <div className='body flex flex-row md:flex-row flex-col items-center justify-between'>
              <div className="text-label md:w-[20%] w-full md:text-left text-center">
                Jabatan
              </div>
              <div className='md:w-[5%]'>:</div>
              <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                <div className="flex border border-light-gray rounded-lg w-full py-3 px-4">
                  {user.jabatan}
                </div>
              </div>
            </div>
            <div className='body flex flex-row md:flex-row flex-col items-center justify-between'>
              <div className="text-label md:w-[20%] w-full md:text-left text-center">
                OPD
              </div>
              <div className='md:w-[5%]'>:</div>
              <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                <div className="flex border border-light-gray rounded-lg w-full py-3 px-4">
                  {OPD.label}
                </div>
              </div>
            </div>
            <div className='body flex flex-row md:flex-row flex-col items-center justify-between'>
              <div className="text-label md:w-[20%] w-full md:text-left text-center">
                Pilih Role
              </div>
              <div className='md:w-[5%]'>:</div>
              <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                <div className="data flex flex-row">
                  <TextInput
                    type="dropdown"
                    id="role"
                    name="role"
                    label="Nama Role"
                    placeholder="Pilih Role"
                    options={profile.role == 1 ? listRoleAdmin : listRoleAdminOPD}
                    change={(selectedOption: any) => {
                      handleChangeRole({
                        target: { name: "role", value: selectedOption },
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="btn-submit mx-6 flex flex-row justify-between pb-2 mt-4 space-x-3">
          <div className="w-[8em]">
            <Button
              variant="xl"
              type="secondary"
              className="button-container mb-2 mt-5"
              rounded
            >
              <div className="flex justify-center items-center text-[#002DBB] font-Nunito">
                <span className="button-text">Batal</span>
              </div>
            </Button>
          </div>
          <div className='flex gap-4'>
            <div className="w-[8em]">
              <Button
                variant="warning"
                className="button-container mb-2 mt-5"
                loading={loading}
                rounded
                disabled={user.length == 0}
                onClick={() => setIsEdit(true)}
              >
                <div className="flex justify-center items-center text-white font-Nunito">
                  <span className="button-text">Edit</span>
                </div>
              </Button>
            </div>
            <div className="w-[8em]">
              <Button
                variant="xl"
                className="button-container mb-2 mt-5"
                loading={loading}
                rounded
                disabled={role == 0}
                onClick={handleSubmit}
              >
                <div className="flex justify-center items-center text-white font-Nunito">
                  <span className="button-text">Tambah</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className={`${isEdit ? 'block' : 'hidden'}`}>
        <EditForm opd={OPD} user={user} type="add" />
      </div>
    </div>
  )
}

export default RegistrasiForm