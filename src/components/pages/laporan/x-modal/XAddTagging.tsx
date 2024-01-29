import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, shallowEqual } from 'react-redux';
import { CommonModal } from '@/components/common/common-modal/modal';
import TextInput from '@/components/common/text-input/input';
import { Button } from '@/components/common/button/button';
import { fetchApi } from '@/app/api/request';
import Swal from 'sweetalert2';
import { State } from '@/store/reducer';
import { AiOutlineClose } from 'react-icons/ai';

interface PropTypes {
  openAddTagging: boolean,
  setOpenAddTagging: any,
  data: any;
  fetchData?: any;
}

const XAddTagging = ({
  openAddTagging,
  setOpenAddTagging,
  data,
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
    setDataTagging(data.Taggings);
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

  const onClose = () => {
    setOpenAddTagging(false);
    setIsAddTagging(false);
    setAgree(false);
  }

  const handleChange = (data: any) => setTagging(data.target.value);

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
        id_uuid: data.uuid,
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
            id_uuid: data.uuid
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
          fetchData();
          onClose();
        }
      }
    } else {
      if (idTagging != 0) {
        const payload2 = {
          id_tagging: idTagging,
          id_uuid: data.uuid
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
      <div className='flex flex-col w-full py-3'>
        <div className='relative'>
          <div className='text-center md:text-xsm text-title-xsm mb-6 font-bold'>Masukkan Tagging</div>
          <div className={`data z-50 ${isOnFocus ? 'fixed w-[46%]' : ''}`}>
            <TextInput
              type="dropdown"
              id="sasaran"
              name="sasaran"
              label="Sasaran"
              placeholder="Ketik dan pilih tagging"
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
              {dataTagging?.length > 0 && dataTagging.map((el: any, i: number) => (
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
    </CommonModal >
  )
}

export default XAddTagging;