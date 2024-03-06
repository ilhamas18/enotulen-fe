import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/button/button';
import { CommonModal } from '@/components/common/common-modal/modal';
import TextInput from '@/components/common/text-input/input';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { fetchApi } from '@/app/api/request';
import Swal from 'sweetalert2';

interface PropTypes {
  index: number;
  openAddPeserta: boolean;
  setOpenAddPeserta: any;
  peserta: any;
  setPeserta: any
}

const XAddPeserta = ({
  index,
  openAddPeserta,
  setOpenAddPeserta,
  peserta,
  setPeserta
}: PropTypes) => {
  const router = useRouter();
  const [storedNumber, setStoredNumber] = useState<number>(0);
  const [storedParticipant, setStoredParticipant] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStoredParticipant((event.target as HTMLInputElement).value);
  };

  const handleSave = () => {
    if (!isNaN(storedNumber)) {
      const newArr1 = [...peserta];
      newArr1[index].jumlah_peserta = +storedNumber
      setPeserta(newArr1)
    }
    const newArr2 = [...peserta];
    newArr2[index].jenis_peserta = storedParticipant;
    setPeserta(newArr2)
    setOpenAddPeserta(false);
  }

  const handleCancel = () => setOpenAddPeserta(false);

  return (
    <CommonModal isOpen={openAddPeserta} onClose={setOpenAddPeserta} animate={true}>
      <div className='flex flex-col w-full py-3'>
        <div className='relative'>
          <div className='text-center md:text-xsm text-title-xsm mb-6 font-bold'>Masukkan Jumlah Peserta</div>
          <div>
            <TextInput
              type="tel"
              id="jumlahPeserta"
              name="jumlahPeserta"
              label="Jumlah Peserta"
              placeholder="Jumlah Peserta"
              value={storedNumber}
              change={(e: any) => setStoredNumber(e.target.value)}
            />
          </div>
          <div className='mt-10'>
            <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">Asal Peserta :</FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={storedParticipant}
                onChange={handleChange}
              >
                <div className='flex gap-4'>
                  <FormControlLabel value="eksternal" control={<Radio />} label="Eksternal" />
                  <FormControlLabel value="internal" control={<Radio />} label="Internal" />
                </div>
              </RadioGroup>
            </FormControl>
          </div>
        </div>
        <div className="btn-submit flex flex-row justify-between items-center mt-10 space-x-3">
          <div className="w-[8em]">
            <button
              className="text-danger"
              onClick={handleCancel}
            >
              Batal
            </button>
          </div>
          <div className="w-[8em]">
            <Button
              variant="xl"
              className="button-container"
              onClick={handleSave}
              disabled={storedNumber == 0 || storedParticipant == '' ? true : false}
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

export default XAddPeserta;

function dispatch(arg0: { payload: any; type: "payload/setPayload"; }) {
  throw new Error('Function not implemented.');
}
