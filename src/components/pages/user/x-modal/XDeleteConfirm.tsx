import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, shallowEqual } from 'react-redux';
import { CommonModal } from '@/components/common/common-modal/modal';
import { Button } from '@/components/common/button/button';
import { fetchApi } from '@/components/mixins/request';
import TextInput from '@/components/common/text-input/input';
import Swal from 'sweetalert2';
import Select from "react-select";
import { State } from '@/store/reducer';
import { GrClose } from 'react-icons/gr';

interface PropTypes {
  openConfirmDelete: boolean,
  setXConfirmDelete: any,
  user: any;
}

const XDeleteConfirm = ({
  openConfirmDelete,
  setXConfirmDelete,
  user,
}: PropTypes) => {
  const router = useRouter();
  const [agree, setAgree] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onClose = () => setXConfirmDelete(false);

  const handleDelete = () => { }

  return (
    <CommonModal isOpen={openConfirmDelete} onClose={setXConfirmDelete} animate={true}>
      <div className='flex flex-col w-full py-3'>
        <div className='relative'>
          <div className='text-center font-medium text-title-xsm'>Apakah Anda Yakin Hapus Data Pegawai ?</div>
          <div className='text-center font-medium md:text-xsm text-xsm2 mt-6 mb-4 text-danger'>Menghapus data pegawai dapat mengakibatkan data notulen yang dibuat oleh {user.nama} akan hilang !</div>
          {/* <div className='mt-5 mb-2 flex'>
            <div>
              <TextInput
                type="checkbox"
                name="consent"
                id="consent"
                placeholder="Masukkan consent"
              // value={values.consent}
              // change={handleChange}
              />
            </div>
            <div>
              <p className="ml-2 mt-[9px] mt-md-1 text-[#68788A] text-Nunito text-xs">
                Saya telah menyetujui
              </p>
            </div>
          </div> */}
          <div className='mt-[2em] flex justify-between'>
            <div className="btn-cancel">
              <Button
                variant="error"
                type="secondary"
                className="button-container mb-2 mt-2"
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
                variant="error"
                className="button-container mb-2 mt-5"
                rounded
                onClick={handleDelete}
                loading={loading}
              >
                <div className="flex px-6 text-white font-Nunito">
                  <span className="button-text">Hapus</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CommonModal >
  )
}

export default XDeleteConfirm;