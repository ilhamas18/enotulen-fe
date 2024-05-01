import { CommonModal } from '@/components/common/common-modal/modal';
import { FiCheckCircle } from "react-icons/fi";
import { Button } from '@/components/common/button/button';
import { useRouter } from 'next/navigation';
import TextInput from '@/components/common/text-input/input';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const EditorBlock = dynamic(() => import("../../../hooks/editor"));

interface PropTypes {
  openLampiran: boolean;
  setOpenLampiran: any;
  values: any;
  handleChange: any;
}

const XLampiran = ({
  openLampiran,
  setOpenLampiran,
  values,
  handleChange
}: PropTypes) => {
  const [lampiran, setLampiran] = useState<any>('');

  const handleSave = (e: any) => {
    e.preventDefault();
    setOpenLampiran(false);

    if (lampiran !== '') {
      let temp = values.lampiran;
      temp.push(lampiran);
      handleChange({
        target: { name: 'lampiran', value: temp }
      })
    }
    setLampiran('');
  }

  const handleCancel = () => setOpenLampiran(false);

  return (
    <CommonModal isOpen={openLampiran} onClose={setOpenLampiran} size="md">
      <div className='flex flex-col w-full py-3'>
        <div className='relative'>
          <div className='text-center md:text-xsm text-title-xsm mb-6 font-medium tracking-wider border-b border-light-gray pb-2'>Lembar Lampiran</div>
        </div>
        <div className="container border-2 border-light-gray rounded-lg">
          <EditorBlock
            data={lampiran}
            onChange={(e: any) => setLampiran(e)}
            holder="editorjs-containers"
          />
        </div>
        <div className="btn-submit flex flex-row justify-between items-center mt-8 space-x-3">
          <div className="w-[8em]">
            <Button
              variant="xl"
              type="secondary"
              className="button-container"
              rounded
              onClick={handleCancel}
            >
              <div className="flex px-6 text-[#002DBB] font-Nunito">
                <span className="button-text">Batal</span>
              </div>
            </Button>
          </div>
          <div className="w-[8em]">
            <Button
              variant="xl"
              className="button-container"
              onClick={handleSave}
              rounded
            >
              <div className="flex justify-center items-center text-white">
                <span className="button-text">Tambah</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </CommonModal>
  )
}

export default XLampiran;