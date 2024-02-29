import * as React from 'react';
import { useState, useEffect } from 'react';
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
  openAddPeserta: boolean;
  setOpenAddPeserta: any;
  id: number;
  peserta: any;
  jenis: string;
}

const XAddPeserta = ({ openAddPeserta, setOpenAddPeserta, id, peserta, jenis }: PropTypes) => {
  const [jumlahPeserta, setJumlahPeserta] = useState<number>(peserta.length != 0 ? peserta.length : 0);
  const [jenisPeserta, setJenisPeserta] = useState<string>(jenis !== '' ? jenis : '');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJenisPeserta((event.target as HTMLInputElement).value);
  };

  const handleAddPeserta = async () => {
    setLoading(true);
    const payload = {
      jumlah_peserta: jumlahPeserta,
      jenis_peserta: jenisPeserta
    }
    const response = await fetchApi({
      url: `/undangan/addJumlahPeserta/${id}`,
      method: 'post',
      type: 'auth',
      body: payload
    })

    if (!response.success) {
      setLoading(false);
      setOpenAddPeserta(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Koneksi bermasalah!",
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "success",
        title: `${jumlahPeserta} Peserta ditambahkan`,
        showConfirmButton: false,
        timer: 1500,
      });
      setLoading(false);
      setOpenAddPeserta(false);
    }
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
              value={jumlahPeserta}
              change={(e: any) => setJumlahPeserta(e.target.value)}
            />
          </div>
          <div className='mt-10'>
            <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">Asal Peserta :</FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={jenisPeserta}
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
              onClick={handleAddPeserta}
              rounded
            >
              <div className="flex justify-center items-center text-white">
                <span className="button-text">Lanjut</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </CommonModal>
  )
}

export default XAddPeserta;