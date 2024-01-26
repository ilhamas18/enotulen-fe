import * as React from 'react';
import { CommonModal } from '@/components/common/common-modal/modal';
import { FiCheckCircle } from "react-icons/fi";
import { Button } from '@/components/common/button/button';

interface PropTypes {
  openModal: boolean;
  setOpenModal: any;
  condition?: any;
  title: string;
  text: string;
  handleCancel?: any;
  handleNext?: any;
}

const ModalConfirm = ({
  openModal,
  setOpenModal,
  condition,
  title,
  text,
  handleCancel,
  handleNext,
}: PropTypes) => {
  return (
    <CommonModal isOpen={openModal} onClose={setOpenModal} animate={true}>
      <div className="relative items-center flex flex-col justify-between space-y-4 gap-2 pt-2">
        {condition === "success" ? (
          <>
            <div className='text-success'><FiCheckCircle size={60} /></div>
            <div className='font-bold text-title-md text-meta-3 tracking-wider'>{title}</div>
          </>
        ) : (
          <>
            <div className='text-success'><FiCheckCircle size={60} /></div>
            <div className='font-bold text-title-md text-meta-3 tracking-wider'>{title}</div>
          </>
        )}
        <div className='body mt-2 text-title-xsm text-deep-gray'>{text}</div>
        <div className='button mt-2 flex justify-between items-center w-full'>
          <div className="w-[8em]">
            <Button
              variant="xl"
              type="secondary"
              className="button-container"
              rounded
              onClick={handleCancel}
            >
              <div className="flex justify-center items-center text-[#002DBB] font-Nunito">
                <span className="button-text">Tidak</span>
              </div>
            </Button>
          </div>
          <div className="w-[8em]">
            <Button
              type="button"
              variant="xl"
              className="button-container"
              rounded
              onClick={handleNext}
            >
              <div className="flex justify-center items-center text-white font-Nunito">
                <span className="button-text">Lanjut</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </CommonModal>
  )
}

export default ModalConfirm