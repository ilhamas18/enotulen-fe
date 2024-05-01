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
import SignatureCanvas from 'react-signature-canvas';
import Swal from 'sweetalert2';
import { FaPersonCircleQuestion } from "react-icons/fa6";

interface PropTypes {
  openConfirm: boolean;
  setOpenConfirm: any;
  values: any;
  handleChange: any;
  handleSubmit: any;
  notulens: any;
  index: any;
  profile: any;
}

const ModalConfirm = ({
  openConfirm,
  setOpenConfirm,
  values,
  handleChange,
  handleSubmit,
  notulens,
  index,
  profile,
}: PropTypes) => {
  const [storedPembuat, setStoredPembuat] = useState<string>('otomatis');
  const [listUser, setListUser] = useState<any>([]);
  const [storedUser, setStoredUser] = useState<any>([]);
  const [sign, setSign] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleChangePembuat = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStoredPembuat((event.target as HTMLInputElement).value);
    if ((event.target as HTMLInputElement).value) setStoredUser([]);
    fetchPegawai();
  };

  const fetchPegawai = async () => {
    setLoading(true);
    const response = await fetchApi({
      url: `/pegawai/getAllPegawai/${profile.kode_opd}`,
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
            namaPangkat: el.nama_pangkat,
            eselon: el.eselon,
            jabatan: el.jabatan
          }
        })
      })
      setListUser(temp);
      setLoading(false);
    }
  }

  const handleClear = (e: any) => {
    e.preventDefault();
    sign.clear()
  }

  const handleGenerate = (e: any) => {
    e.preventDefault();
    // setSignUrl(sign.getTrimmedCanvas().toDataURL('image/png'));
    handleChange({
      target: { name: "signature", value: sign.getTrimmedCanvas().toDataURL('image/png') },
    });
  }

  const handleDeleteSignature = () => {
    handleChange({
      target: { name: "signature", value: '' },
    });
  }

  const handleChangeUser = (val: any) => {
    handleChange({
      target: { name: "penanggungjawab", value: val.target.value.data },
    });
  }

  const handleCancel = () => setOpenConfirm(false);

  return (
    <CommonModal isOpen={openConfirm} onClose={setOpenConfirm} size='md'>
      <div className='flex flex-col w-full py-3'>
        <div className='relative container'>
          <div className='flex gap-3 items-center justify-center w-full bg-meta-6 py-2 text-white'>
            <div><FaPersonCircleQuestion size={24} /></div>
            <div className="uppercase text-title-xsm2 font-bold tracking-wider">Konfirmasi Simpan</div>
          </div>
          <div className='flex items-center justify-center text-center mt-6'>
            <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">Penanggungjawab :</FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={storedPembuat}
                onChange={handleChangePembuat}
              >
                <div className='flex gap-4'>
                  <FormControlLabel value="otomatis" control={<Radio />} label="Otomatis" />
                  <FormControlLabel value="manual" control={<Radio />} label="Manual" />
                </div>
              </RadioGroup>
            </FormControl>
          </div>
          {storedPembuat === 'otomatis' ? (
            <div className="signature px-8 mt-6">
              {values.signature === null ? (
                <div className='flex flex-col items-center justify-center'>
                  <div className="text-title-xsm2 mb-2">Bubuhkan Tanda tangan (opsional)</div>
                  <div className="md:w-[50%] w-full md:h-[200px] h-[130px] border-2 border-light-gray rounded rounded-lg">
                    <SignatureCanvas
                      canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
                      ref={(data: any) => setSign(data)}
                    />
                  </div>
                  <div className='flex'>
                    <button style={{ height: "30px", width: "200px" }} className="text-meta-1" onClick={(e: any) => handleClear(e)}>BERSIHKAN</button>
                    <button style={{ height: "30px", width: "200px" }} className="text-xl-base font-bold" onClick={(e: any) => handleGenerate(e)}>SIMPAN</button>
                  </div>
                </div>
              ) : (
                <div className="flex md:flex-row md:items-center md:justify-between flex-col mb-2 md:mb-0">
                  <img src={values.signature} />
                  {index !== undefined && notulens[index].uuid === undefined && (
                    <div className="text-danger text-title-xsm2 hover:cursor-pointer" onClick={handleDeleteSignature}>Hapus</div>
                  )}
                </div>
              )}
            </div>
          ) : storedPembuat === 'manual' && (
            <div className='mt-2 flex gap-2 my-10 mb-8 items-center justify-center'>
              {listUser.length != 0 ? (
                loading ? (
                  <div className='italic mt-8'>Sedang memuat data pegawai . . .</div>
                ) : (
                  <div className='fixed md:w-1/2 w-full mt-[3em] z-99'>
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
                )
              ) : (
                <div className='text-meta-1 mt-14'>User belum terdaftar. Silakan hubungi Admin untuk pengajuan !</div>
              )}
            </div>
          )}
        </div>
        <div className={`flex flex-col gap-2 ${storedPembuat === 'otomatis' ? 'button mt-6 w-full' : 'mt-14'}`}>
          <div>
            <Button
              type="button"
              variant="xl"
              className="button-container px-8 py-2"
              loading={loading}
              rounded
              onClick={handleSubmit}
            >
              <div className="flex gap-2 justify-center items-center text-white font-Nunito">
                <span className="button-text">Submit</span>
              </div>
            </Button>
          </div>
          <div>
            <Button
              type="secondary"
              variant="xl"
              className="button-container px-8 py-2"
              loading={loading}
              rounded
              onClick={handleCancel}
            >
              Batal
            </Button>
          </div>
        </div>
      </div>
    </CommonModal>
  )
}

export default ModalConfirm;