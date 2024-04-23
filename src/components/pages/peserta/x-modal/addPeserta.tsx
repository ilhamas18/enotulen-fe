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
  index?: number;
  openAddPeserta: boolean;
  setOpenAddPeserta: any;
  peserta: any;
  setPeserta: any;
  user: any;
  setUser: any;
}

const XAddPeserta = ({
  index,
  openAddPeserta,
  setOpenAddPeserta,
  peserta,
  setPeserta,
  user,
  setUser
}: PropTypes) => {
  const router = useRouter();
  const [storedNumber, setStoredNumber] = useState<number>(0);
  const [storedParticipant, setStoredParticipant] = useState<string>('');
  const [storedPembuat, setStoredPembuat] = useState<string>('');
  const [listOPD, setListOPD] = useState<any>([]);
  const [OPD, setOPD] = useState<any>([]);
  const [listUser, setListUser] = useState<any>([]);
  const [storedUser, setStoredUser] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  console.log(storedUser);

  const handleChangePeserta = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStoredParticipant((event.target as HTMLInputElement).value);
  };

  const handleChangePembuat = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStoredPembuat((event.target as HTMLInputElement).value);
    if ((event.target as HTMLInputElement).value) setStoredUser([]);
    fetchOPD();
  };

  const fetchOPD = async () => {
    setLoading(true);
    const response = await fetchApi({
      url: '/opd/getAllOPD',
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
          label: el.nama_opd,
          value: el.kode_opd
        })
      })
      setListOPD(temp);
      setLoading(false);
    }
  }

  const handleChangeOPD = async (val: any) => {
    setLoading(true);
    setOPD(val.target.value);
    const response = await fetchApi({
      url: `/pegawai/getAllPegawai/${val.target.value.value}`,
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

  const handleChangeUser = (val: any) => setStoredUser(val.target.value.data);

  const handleSave = () => {
    if (index !== undefined) {
      if (!isNaN(storedNumber)) {
        const newArr1 = [...peserta];
        newArr1[index].jumlah_peserta = +storedNumber
        setPeserta(newArr1);
        setUser(storedUser);
      }
      const newArr2 = [...peserta];
      newArr2[index].jenis_peserta = storedParticipant;
      setPeserta(newArr2)
    } else {
      const temp = peserta;
      temp.jumlah_peserta = +storedNumber;
      temp.jenis_peserta = storedParticipant;
      temp.isFilled = true;
      setPeserta(temp);
    }
    setOpenAddPeserta(false);
    setStoredNumber(0);
    setStoredParticipant('');
    setStoredPembuat('');
  }

  const handleCancel = () => setOpenAddPeserta(false);

  return (
    <CommonModal isOpen={openAddPeserta} onClose={setOpenAddPeserta} animate={true}>
      <div className='flex flex-col w-full py-3'>
        <div className='relative container'>
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
          <div className='mt-8 w-full'>
            <div className='flex lg:flex-row md:justify-between flex-col'>
              <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">Asal Peserta :</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={storedParticipant}
                  onChange={handleChangePeserta}
                >
                  <div className='flex gap-4'>
                    <FormControlLabel value="eksternal" control={<Radio />} label="Eksternal" />
                    <FormControlLabel value="internal" control={<Radio />} label="Internal" />
                  </div>
                </RadioGroup>
              </FormControl>
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
            {storedPembuat === 'manual' && (
              <div className='mt-6 flex flex-col my-14 mb-14'>
                {loading ? (
                  <div className='italic'>Loading . . .</div>
                ) : (
                  <div className='fixed md:w-1/4 w-1/2 z-99'>
                    <TextInput
                      type="dropdown"
                      id="pembuat"
                      name="pembuat"
                      label="Pilih Pegawai"
                      placeholder="Pilih Pegawai"
                      value={OPD}
                      options={listOPD}
                      change={(selectedOption: any) => {
                        handleChangeOPD({
                          target: { name: "role", value: selectedOption },
                        });
                      }}
                    />
                  </div>
                )}
                {listUser.length != 0 ? (
                  loading ? (
                    <div className='italic mt-4'>Sedang memuat data pegawai . . .</div>
                  ) : (
                    <div className='fixed md:w-1/4 w-1/2 mt-14 z-80'>
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
        </div>
        <div className="btn-submit flex flex-row justify-between items-center mt-14 space-x-3">
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
              disabled={
                storedPembuat === 'otomatis' ? storedNumber == 0 || storedParticipant == '' ? true : false
                  : OPD.length == 0 || storedUser.length == 0 ? true : false
              }
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
