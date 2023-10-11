import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TextInput from "@/components/common/text-input/input";
import { Button } from '@/components/common/button/button';
import { fetchApi } from '@/components/mixins/request';
import Swal from 'sweetalert2';
import { withFormik, FormikProps, FormikBag } from "formik";
import * as Yup from "yup";
import Loading from '@/components/global/Loading/loading';

interface FormValues {
  nama: string;
  nip: string;
  pangkat: string;
  namaPangkat: string;
  jabatan: string;
  role: any;
  opd: any;
}

interface OtherProps {
  title?: string;
  ref?: any;
  dataOPD?: any;
  profile?: any;
}

interface MyFormProps extends OtherProps {
  handleSubmit: (
    values: FormValues,
    formikBag: FormikBag<object, FormValues>
  ) => void;
}

const FormField = (props: OtherProps & FormikProps<FormValues>) => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    isValid,
    dirty,
    ref,
    dataOPD,
    profile
  } = props;

  const [listUser, setListUser] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (profile.role == 2) {
      const val = {
        label: dataOPD[0]?.label,
        value: dataOPD[0]?.value
      }
      handleChangeOPD(val)
    }
  }, []);

  const handleChangeOPD = async (val: any) => {
    setLoading(true);

    handleChange({
      target: { name: "opd", value: val },
    });

    const response = await fetchApi({
      url: `/pegawai/syncDataPegawai/${val.value}`,
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
            namaPangkat: el.namapangkat,
            jabatan: el.jabatan
          }
        })
      })
      setListUser(temp);
      setLoading(false);
    }
  }

  const handleChangeUser = (val: any) => {
    handleChange({
      target: { name: "nama", value: val.data.nama },
    });
    handleChange({
      target: { name: "nip", value: val.data.nip },
    });
    handleChange({
      target: { name: "pangkat", value: val.data.pangkat },
    });
    handleChange({
      target: { name: "namaPangkat", value: val.data.namaPangkat },
    });
    handleChange({
      target: { name: "jabatan", value: val.data.jabatan },
    });
  }

  const listRoleAdmin: any = [
    {
      label: 'Admin OPD',
      value: 1
    },
    {
      label: 'Verifikator',
      value: 2
    },
    {
      label: 'User',
      value: 3
    }
  ]

  const listRoleAdminOPD: any = [
    {
      label: 'Verifikator',
      value: 3
    },
    {
      label: 'User',
      value: 4
    }
  ]

  const handleCancel = () => {
    handleChange({
      target: { name: "nama", value: "" },
    });
  }

  return (
    <div className='relative py-6'>
      <form className='form-wrapper-general px-4'>
        {values.nama.length == 0 ? (
          <div className="px-8 flex flex-col space-y-7 mt-4">
            {profile.role == 1 && (
              <div className="data flex flex-row">
                <TextInput
                  type="dropdown"
                  id="opd"
                  name="opd"
                  label="Nama OPD"
                  placeholder="Ketik dan Cari Perangkat Daerah"
                  options={dataOPD}
                  change={(selectedOption: any) => {
                    handleChangeOPD(selectedOption)
                  }}
                />
              </div>
            )}
            {loading ? (
              <div>Sedang memuat data pegawai . . .</div>
            ) : (
              <div className={`${listUser.length != 0 ? 'block' : 'hidden'}`}>
                <TextInput
                  type="dropdown"
                  id="user"
                  name="user"
                  label="Nama User"
                  placeholder="Ketik dan Cari Pegawai"
                  options={listUser}
                  change={(selectedOption: any) => {
                    handleChangeUser(selectedOption)
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <>
            <div className='flex flex-col gap-4 p-6'>
              <div className='body flex flex-row md:flex-row flex-col items-center justify-between'>
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  Nama Lengkap
                </div>
                <div className='md:w-[5%]'>:</div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <TextInput
                    type="text"
                    id="nama"
                    name="nama"
                    touched={touched.nama}
                    label="Nama Lengkap"
                    change={handleChange}
                    value={values?.nama}
                    handleBlur={handleBlur}
                    errors={errors.nama}
                  />
                </div>
              </div>
              <div className='body flex flex-row md:flex-row flex-col items-center justify-between'>
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  NIP
                </div>
                <div className='md:w-[5%]'>:</div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <TextInput
                    type="text"
                    id="nip"
                    name="nip"
                    touched={touched.nip}
                    label="NIP"
                    change={handleChange}
                    value={values?.nip}
                    handleBlur={handleBlur}
                    errors={errors.nip}
                  />
                </div>
              </div>
              <div className='body flex flex-row md:flex-row flex-col items-center justify-between'>
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  Pangkat
                </div>
                <div className='md:w-[5%]'>:</div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <TextInput
                    type="text"
                    id="pangkat"
                    name="pangkat"
                    touched={touched.pangkat}
                    label="Pangkat"
                    change={handleChange}
                    value={values?.pangkat}
                    handleBlur={handleBlur}
                    errors={errors.pangkat}
                  />
                </div>
              </div>
              <div className='body flex flex-row md:flex-row flex-col items-center justify-between'>
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  Nama Pangkat
                </div>
                <div className='md:w-[5%]'>:</div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <TextInput
                    type="text"
                    id="namaPangkat"
                    name="namaPangkat"
                    touched={touched.namaPangkat}
                    label="Nama Pangkat"
                    change={handleChange}
                    value={values?.namaPangkat}
                    handleBlur={handleBlur}
                    errors={errors.namaPangkat}
                  />
                </div>
              </div>
              <div className='body flex flex-row md:flex-row flex-col items-center justify-between'>
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  Jabatan
                </div>
                <div className='md:w-[5%]'>:</div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <TextInput
                    type="text"
                    id="jabatan"
                    name="jabatan"
                    touched={touched.jabatan}
                    label="Jabatan"
                    change={handleChange}
                    value={values?.jabatan}
                    handleBlur={handleBlur}
                    errors={errors.jabatan}
                  />
                </div>
              </div>
              <div className='body flex flex-row md:flex-row flex-col items-center justify-between'>
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  OPD
                </div>
                <div className='md:w-[5%]'>:</div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="flex border border-light-gray rounded-lg w-full py-3 px-4">
                    {values.opd?.label}
                  </div>
                </div>
              </div>
              <div className='body flex flex-row md:flex-row flex-col items-center justify-between'>
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  Pilih Role
                </div>
                <div className='md:w-[5%]'>:</div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="data flex flex-row">
                    <TextInput
                      type="dropdown"
                      id="role"
                      name="role"
                      label="Nama Role"
                      errors={errors.role}
                      placeholder="Pilih Role"
                      options={profile.role == 1 ? listRoleAdmin : listRoleAdminOPD}
                      change={(selectedOption: any) => {
                        handleChange({
                          target: { name: "role", value: selectedOption },
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="btn-submit mx-8 flex flex-row justify-between pb-4 mt-4 space-x-3">
              <div className="w-[8em] absolute bottom-8 right-8">
                <Button
                  variant="xl"
                  className="button-container mb-2 mt-5"
                  rounded
                  type='button'
                  onClick={handleSubmit}
                >
                  <div className="flex justify-center items-center text-white">
                    <span className="button-text">Tambah</span>
                  </div>
                </Button>
              </div>
            </div>
          </>
        )}
      </form>
      {values.nama.length != 0 && (
        <div className="w-[8em]">
          <Button
            variant="xl"
            type="secondary"
            className="button-container mb-4 mt-2 ml-8"
            rounded
            onClick={() => handleCancel()}
          >
            <div className="flex justify-center items-center text-[#002DBB] font-Nunito">
              <span className="button-text">Batal</span>
            </div>
          </Button>
        </div>
      )}
    </div>
  )
}

function CreateForm({ handleSubmit, dataOPD, profile }: MyFormProps) {
  const FormWithFormik = withFormik({
    mapPropsToValues: () => ({
      nama: "",
      nip: "",
      pangkat: "",
      namaPangkat: "",
      jabatan: "",
      role: null,
      opd: null
    }),
    validationSchema: Yup.object().shape({
      nama: Yup.string()
        .required("Nama pegawai tidak boleh kosong !"),
      nip: Yup.string()
        .required('Bagian dibutuhkan')
        .min(18, 'NIP harus 18 angka')
        .max(18, 'NIP harus 18 angka'),
      pangkat: Yup.string()
        .required("Pangkat tidak boleh kosong !"),
      namaPangkat: Yup.string()
        .required("Nama pangkat tidak boleh kosong !"),
      jabatan: Yup.string()
        .required("Jabatan tidak boleh kosong !"),
      role: Yup.object()
        .shape({
          label: Yup.string(),
          value: Yup.string(),
        })
        .required("Role harus diisi!")
        .nullable(),
      opd: Yup.object()
        .shape({
          label: Yup.string(),
          value: Yup.string(),
        })
        .required("OPD harus diisi!")
        .nullable(),
    }),
    handleSubmit,
  })(FormField);

  return (
    <FormWithFormik dataOPD={dataOPD} profile={profile} />
  )
}

interface PropTypes {
  dataOPD: any;
  profile: any;
}

const EditForm = ({ dataOPD, profile }: PropTypes) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    const payload = {
      nama: values.nama,
      nip: values.nip,
      password: 'Bappeda@123',
      pangkat: values.pangkat,
      nama_pangkat: values.namaPangkat,
      jabatan: values.jabatan,
      role: values.role.value,
      kode_opd: values.opd.value,
    }

    const response = await fetchApi({
      url: '/pegawai/addPegawai',
      method: 'post',
      type: 'auth',
      body: payload
    })

    if (!response.success) {
      if (response.code == 400) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "User telah ditambahkan",
        });
        // setUser([]);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Koneksi bermasalah',
        })
        // setUser([]);
      }
    } else {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "User berhasil ditambahkan",
        showConfirmButton: false,
        timer: 1500,
      });
      // setUser([]);
      router.push("/master/data-user");
    }
  }

  return (
    <div>
      {loading ? (
        <Loading loading={loading} setLoading={setLoading} />
      ) : (
        <CreateForm
          handleSubmit={handleSubmit}
          dataOPD={dataOPD}
          profile={profile}
        />
      )}
    </div>
  )
}

export default EditForm