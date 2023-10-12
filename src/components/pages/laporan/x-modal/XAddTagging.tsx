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

interface PropTypes {
  openAddTagging: boolean,
  setOpenAddTagging: any,
  idNotulen: number;
}

const XAddTagging = ({
  openAddTagging,
  setOpenAddTagging,
  idNotulen
}: PropTypes) => {
  const router = useRouter();
  const [reason, setReason] = useState<string>('');
  const [agree, setAgree] = useState<boolean>(false);
  const [listTagging, setListTagging] = useState<any>([]);
  const [tagging, setTagging] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAddTagging, setIsAddTagging] = useState<boolean>(false);

  const { profile } = useSelector((state: State) => ({
    profile: state.profile.profile
  }), shallowEqual);

  useEffect(() => {
    fetchTagging();
  }, []);

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

  const handleChangeAgree = (e: any) => {
    setAgree(e.target.checked)
  }

  const onClose = () => {
    setOpenAddTagging(false);
    setAgree(false);
  }

  const handleChange = (data: any) => {
    setTagging(data.target.value);
  };

  const handleSeeDetail = () => router.push(`/notulen/detail/${idNotulen}`);

  const handleSubmit = async () => {
    // setLoading(true);
    // const payload = {
    //   status: status,
    //   keterangan: reason
    // };

    // const response = await fetchApi({
    //   url: `/notulen/updateStatus/${data.id}`,
    //   method: "put",
    //   body: payload,
    //   type: "auth",
    // });

    // if (!response.success) {
    //   setLoading(false);
    //   if (response.data.code == 500) {
    //     Swal.fire({
    //       icon: "error",
    //       title: "Oops...",
    //       text: "Koneksi bermasalah!",
    //     });
    //   }
    // } else {
    //   setLoading(false);
    //   Swal.fire({
    //     position: "center",
    //     icon: "success",
    //     title: `Status ${status}`,
    //     showConfirmButton: false,
    //     timer: 1500,
    //   });
    //   router.push("/notulen/laporan");
    // }
  }

  return (
    <CommonModal isOpen={openAddTagging} onClose={setOpenAddTagging}>
      {!isAddTagging ? (
        <div className="relative items-center justify-center pt-2">
          <div className='w-[100%]'>
            <div className='absolute right-4 top-0' onClick={onClose}>
              <GrClose size={18} />
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
                  onClick={() => setIsAddTagging(true)}
                  loading={loading}
                >
                  <div className="flex px-6 text-white font-Nunito">
                    <span className="button-text">Tambah Tagging</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex flex-col py-3'>
          <div className="data flex flex-row bg-white w-full">
            <Select
              isMulti
              name="tagging"
              options={listTagging}
              className="basic-multi-select w-full bg-white"
              classNamePrefix="select"
              defaultValue={tagging}
              onChange={(selectedOption: any) => {
                handleChange({
                  target: { name: "tagging", value: selectedOption },
                });
              }}
            />
          </div>
          <div className='mt-3 flex justify-between'>
            <div className="btn-cancel">
              <Button
                variant="xl"
                type="secondary"
                className="button-container mb-2 mt-5"
                rounded
                onClick={onClose}
                loading={loading}
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
                onClick={() => setIsAddTagging(true)}
                loading={loading}
              >
                <div className="flex px-6 text-white font-Nunito">
                  <span className="button-text">Tambah Tagging</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      )}
    </CommonModal >
  )
}

export default XAddTagging;