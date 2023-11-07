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
  openAddTagging: boolean,
  setOpenAddTagging: any,
  notulen: any;
  fetchData?: any;
}

const XAddTagging = ({
  openAddTagging,
  setOpenAddTagging,
  notulen,
  fetchData
}: PropTypes) => {
  const router = useRouter();
  const [reason, setReason] = useState<string>('');
  const [agree, setAgree] = useState<boolean>(false);
  const [listTagging, setListTagging] = useState<any>([]);
  const [dataTagging, setDataTagging] = useState<any>([]);
  const [tagging, setTagging] = useState<any>([]);
  const [idTagging, setIdTagging] = useState<any>([]);
  const [isOnFocus, setIsOnFocus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAddTagging, setIsAddTagging] = useState<boolean>(false);

  const { profile } = useSelector((state: State) => ({
    profile: state.profile.profile
  }), shallowEqual);

  useEffect(() => {
    fetchDataTagging();
    fetchTagging();
  }, []);

  const fetchDataTagging = async () => {
    const response = await fetchApi({
      url: `/tagging/getAllTagging/${profile.Perangkat_Daerah.kode_opd}`,
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

  const fetchTagging = async () => {
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

        setDataTagging(data?.Taggings)
        setLoading(false);
      }
    }
  }

  const onClose = () => {
    setOpenAddTagging(false);
    setIsAddTagging(false);
    setAgree(false);
  }

  const handleChange = (data: any) => setTagging(data.target.value);

  const handleSeeDetail = () => router.push(`/notulen/detail/${notulen.index}`);

  const handleDeleteTagging = (e: any, id: number) => {
    e.preventDefault();
    const newArray = dataTagging.filter(
      (item: any) => item.id != id
    )
    setDataTagging(newArray);

    let temp: any = idTagging;
    temp.push(id);
    setIdTagging(temp);
  }

  const handleSubmit = async () => {
    setLoading(true);

    if (tagging.length != 0) {
      let payload: any = {
        id_notulen: notulen.id_notulen,
        id_tagging: tagging.value
      };

      const response = await fetchApi({
        url: '/notulen/addTagging',
        method: "post",
        body: payload,
        type: "auth"
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
        if (idTagging != 0) {
          const payload2 = {
            id_tagging: idTagging,
            id_notulen: notulen.id_notulen
          }

          const response2 = await fetchApi({
            url: '/notulen/deleteTagging',
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
              title: "Tagging berhasil diupdate",
              showConfirmButton: false,
              timer: 1500,
            });
            fetchTagging();
            fetchData();
            onClose();
          }
        } else {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Tagging berhasil ditambahkan",
            showConfirmButton: false,
            timer: 1500,
          });
          fetchTagging();
          fetchData();
          onClose();
        }
      }
    } else {
      if (idTagging != 0) {
        const payload2 = {
          id_tagging: idTagging,
          id_notulen: notulen.id_notulen
        }

        const response2 = await fetchApi({
          url: '/notulen/deleteTagging',
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
            title: "Tagging berhasil diupdate",
            showConfirmButton: false,
            timer: 1500,
          });
          fetchTagging();
          fetchData();
          onClose();
        }
      } else {
        onClose();
      }
    }
  };

  return (
    <CommonModal isOpen={openAddTagging} onClose={setOpenAddTagging} animate={true}>
      {!isAddTagging ? (
        <div className="relative items-center flex flex-col justify-between space-y-4 gap-4 pt-2">
          <div className='w-[100%]'>
            <div className='flex items-center justify-between bg-meta-6'>
              <div></div>
              <div className='text-center font-medium md:text-xsm text-xsm2 py-2'>{notulen.acara}</div>
              <div className='mr-2 p-1 bg-white' onClick={onClose}>
                <GrClose size={17} />
              </div>
            </div>
            <div className="btn my-6">
              {notulen.status !== 'archieve' ? (
                <div className='flex items-center justify-between'>
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
                      onClick={() => setIsAddTagging(true)}
                      loading={loading}
                    >
                      <div className="flex px-6 text-white font-Nunito">
                        <span className="button-text">Tambah Tagging</span>
                      </div>
                    </Button>
                  </div>
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className='flex flex-col w-full py-3'>
          <div className='relative'>
            <div className='text-center font-medium md:text-xsm text-title-xsm mb-6'>Masukkan Tagging</div>
            <div className='data flex flex-row w-full'>
              {/* <Select
                isMulti
                name="tagging"
                options={listTagging}
                className="basic-multi-select bg-white w-full"
                classNamePrefix="select"
                onFocus={() => setIsOnFocus(true)}
                onBlur={() => setIsOnFocus(false)}
                onChange={(selectedOption: any) => {
                  handleChange({
                    target: { name: "tagging", value: selectedOption },
                  });
                }}
              /> */}
              <TextInput
                type="dropdown"
                id="sasaran"
                name="sasaran"
                label="Sasaran"
                placeholder="Ketik dan pilih atasan"
                options={listTagging}
                handleFocus={() => setIsOnFocus(true)}
                handleBlur={() => setIsOnFocus(false)}
                setValueSelected={tagging}
                change={(selectedOption: any) => {
                  handleChange({
                    target: { name: "tagging", value: selectedOption },
                  });
                }}
              />
            </div>
            <div>
              <ul className="mt-[5em] ml-4">
                {dataTagging?.length > 0 && dataTagging?.map((el: any, i: number) => (
                  <li className="font flex flex-col gap-2" key={i}>
                    <div className="flex justify-between">
                      <div className="flex gap-2">
                        <div
                          className={`${dataTagging.length > 1 ? "block" : "hidden"
                            }`}
                        >
                          {i + 1} .
                        </div>
                        <div>{el.nama_tagging}</div>
                      </div>
                      {el.kode_opd === profile.Perangkat_Daerah.kode_opd && (
                        <div>
                          <button
                            onClick={(e: any) =>
                              handleDeleteTagging(e, el.id)
                            }
                          >
                            <AiOutlineClose size={18} />
                          </button>
                        </div>
                      )}
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
              <div className='flex space-x-4'>
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
        </div>
      )}
    </CommonModal >
  )
}

export default XAddTagging;