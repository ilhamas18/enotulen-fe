import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, shallowEqual } from 'react-redux';
import { CommonModal } from '@/components/common/common-modal/modal';
import TextInput from '@/components/common/text-input/input';
import { Button } from '@/components/common/button/button';
import { fetchApi } from '@/components/mixins/request';
import Swal from 'sweetalert2';
import Select from "react-select";
import { State } from '@/store/reducer';
import { GrClose } from 'react-icons/gr';
import { AiOutlineClose } from 'react-icons/ai';

interface PropTypes {
  openAddSasaran: boolean,
  setOpenAddSasaran: any,
  notulen: any;
  fetchData?: any;
}

const XAddSasaran = ({
  openAddSasaran,
  setOpenAddSasaran,
  notulen,
  fetchData
}: PropTypes) => {
  const router = useRouter();
  const [listSasaran, setListSasaran] = useState<any>([]);
  const [sasaran, setSasaran] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAddSasaran, setIsAddSasaran] = useState<boolean>(false);
  const [dataSasaran, setDataSasaran] = useState<any>([]);
  const [idSasaran, setIdSasaran] = useState<any>([]);
  const [isOnFocus, setIsOnFocus] = useState<boolean>(false);

  const { profile } = useSelector((state: State) => ({
    profile: state.profile.profile
  }), shallowEqual);

  useEffect(() => {
    fetchDataSasaran();
    fetchSasaran();
  }, [])

  const fetchDataSasaran = async () => {
    setLoading(true);
    const payload = {
      nip: profile.nip,
      tahun: 2023
    }

    const response = await fetchApi({
      url: '/notulen/syncSasaran',
      method: 'post',
      type: 'auth',
      body: payload
    })

    if (!response.success) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal memuat data sasaran!",
      });
      setLoading(false);
    } else {
      const { data } = response.data;

      let temp: any = [];
      data.data.sasaran_asn.map((el: any) => {
        temp.push({
          label: el.sasaran + ' ' + '/' + ' ' + 2023,
          value: el.id_sasaran,
          data: {
            label: el.sasaran,
            value: el.id_sasaran,
            nama_pembuat: data.data.nama_asn
          }
        })
      })
      setListSasaran(temp);
      setLoading(false);
    }
  }

  const fetchSasaran = async () => {
    setLoading(true);
    const response = await fetchApi({
      url: `/notulen/getNotulenDetail/${notulen.id_notulen}`,
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
        setDataSasaran(data?.Sasarans)
        setLoading(false);
      }
    }
  }

  const handleChange = (data: any) => {
    setSasaran(data.target.value);
  };

  const onClose = () => {
    setOpenAddSasaran(false);
    setIsAddSasaran(false);
    setSasaran([]);
  }


  const handleSeeDetail = () => router.push(`/notulen/detail/${notulen.index}`);

  const handleSubmit = async () => {
    setLoading(true);
    if (sasaran.length != 0) {
      let payload: any = []
      sasaran.forEach((el: any) => {
        payload.push({
          id_sasaran: el.value,
          id_notulen: notulen.id_notulen,
          sasaran: el.data.label,
          nama_pembuat: el.data.nama_pembuat
        })
      })

      const response = await fetchApi({
        url: `/notulen/addSasaran`,
        method: "post",
        body: payload,
        type: "auth",
      });

      if (!response.success) {
        if (response.data.code == 500) {
          onClose();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Koneksi bermasalah!",
          });
        }
        setLoading(false);
      } else {
        if (idSasaran != 0) {
          const payload2 = {
            id_sasaran: idSasaran
          }
          const response2 = await fetchApi({
            url: '/notulen/deleteSasaran',
            method: "delete",
            body: payload2,
            type: "auth",
          })

          if (!response2.success) {
            onClose();
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Koneksi bermasalah!",
            });
          } else {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Sasaran berhasil diupdate",
              showConfirmButton: false,
              timer: 1500,
            });
            fetchData();
            onClose();
          }
        } else {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Sasaran berhasil ditambahkan",
            showConfirmButton: false,
            timer: 1500,
          });
          fetchData();
          onClose();
        }
      }
    } else {
      if (idSasaran != 0) {
        const payload2 = {
          id_sasaran: idSasaran
        }
        const response2 = await fetchApi({
          url: '/notulen/deleteSasaran',
          method: "delete",
          body: payload2,
          type: "auth",
        })

        if (!response2.success) {
          onClose();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Koneksi bermasalah!",
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Sasaran berhasil diupdate",
            showConfirmButton: false,
            timer: 1500,
          });
          fetchData();
          onClose();
        }
      } else {
        onClose();
      }
    }
  };

  const handleDeleteSasaran = (e: any, id: number) => {
    e.preventDefault();
    const newArray = dataSasaran.filter(
      (item: any) => item.id_sasaran !== id
    );
    setDataSasaran(newArray)

    let temp: any = idSasaran;
    temp.push(id);
    setIdSasaran(temp);
  }

  return (
    <CommonModal isOpen={openAddSasaran} onClose={setOpenAddSasaran} animate={true}>
      {!isAddSasaran ? (
        <div className="relative items-center flex flex-col justify-between space-y-4 gap-4 pt-2">
          <div className='w-[100%]'>
            <div className='flex items-center justify-between bg-meta-6'>
              <div></div>
              <div className='text-center font-medium md:text-xsm text-xsm2 py-2'>{notulen.acara}</div>
              <div className='mr-2 p-1 bg-white' onClick={onClose}>
                <GrClose size={17} />
              </div>
            </div>
            <div className="btn my-6 flex items-center justify-between">
              <div className="btn-cancel">
                <Button
                  variant="xl"
                  type="secondary"
                  className="button-container mb-2 mt-5"
                  rounded
                  onClick={handleSeeDetail}
                  loading={loading}
                >
                  <div className="flex px-6 text-[#002DBB] font-Nunito">
                    <span className="button-text text-xl-base">Lihat Detail</span>
                  </div>
                </Button>
              </div>
              <div className="btn-cancell">
                <Button
                  variant="xl"
                  className="button-container mb-2 mt-5"
                  rounded
                  onClick={() => setIsAddSasaran(true)}
                  loading={loading}
                >
                  <div className="flex px-6 text-white font-Nunito">
                    <span className="button-text">Update Sasaran / Rencana Kenerja</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex flex-col w-full py-3'>
          <div className='relative'>
            <div className='text-center font-medium md:text-title-xsm text-title-xsm2 mb-6 bg-meta-6 py-2'>Masukkan Sasaran</div>
            <div className={`${isOnFocus ? 'data flex flex-row fixed z-999 bg-white w-[520px]' : 'data flex flex-row w-full'}`}>
              <Select
                isMulti
                name="tagging"
                options={listSasaran}
                className="basic-multi-select bg-white w-full"
                classNamePrefix="select"
                onFocus={() => setIsOnFocus(true)}
                onBlur={() => setIsOnFocus(false)}
                // defaultValue={notulen.sasaran}
                onChange={(selectedOption: any) => {
                  handleChange({
                    target: { name: "tagging", value: selectedOption },
                  });
                }}
              />
            </div>
            <div>
              <ul className="mt-[5em] ml-4">
                {dataSasaran?.length > 0 && dataSasaran?.map((el: any, i: number) => (
                  <li className="font flex flex-col gap-2" key={i}>
                    <div className="flex justify-between">
                      <div className="flex gap-2">
                        <div
                          className={`${dataSasaran.length > 1 ? "block" : "hidden"
                            }`}
                        >
                          {i + 1} .
                        </div>
                        <div>{el.sasaran}</div>
                      </div>
                      <div>
                        <button
                          onClick={(e: any) =>
                            handleDeleteSasaran(e, el.id_sasaran)
                          }
                        >
                          <AiOutlineClose size={18} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className='mt-[5em] flex justify-between'>
              <div className="btn-cancel">
                <Button
                  variant="xl"
                  type="secondary"
                  className="button-container mb-2 mt-5"
                  rounded
                  onClick={onClose}
                >
                  <div className="flex px-6 text-[#002DBB] font-Nunito">
                    <span className="button-text text-xl-base">Batal</span>
                  </div>
                </Button>
              </div>
              <div className="btn-cancell">
                <Button
                  variant="xl"
                  className="button-container mb-2 mt-5"
                  rounded
                  onClick={handleSubmit}
                  loading={loading}
                >
                  <div className="flex px-6 text-white font-Nunito">
                    <span className="button-text">Tambah / Update</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CommonModal >
  )
}

export default XAddSasaran;