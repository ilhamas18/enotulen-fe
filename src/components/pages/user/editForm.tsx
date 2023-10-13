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
import { shallowEqual, useSelector } from 'react-redux';
import { State } from '@/store/reducer';
import XDeleteConfirm from './x-modal/XDeleteConfirm';

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
  opd?: any;
  user?: any;
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
  } = props;

  const router = useRouter();
  const [listUser, setListUser] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openConfirmDelete, setXConfirmDelete] = useState<boolean>(false);

  const { profile } = useSelector((state: State) => ({
    profile: state.profile.profile
  }), shallowEqual)

  const listRoleAdmin: any = [
    {
      label: 'Admin OPD',
      value: 2
    },
    {
      label: 'Verifikator',
      value: 3
    },
    {
      label: 'User',
      value: 5
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

  const handleCancel = () => router.push('/master/data-user');

  return (
    <div className='relative py-6'>
      <form className='form-wrapper-general px-4'>
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
                {values.opd.label}
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
                  value={values.role}
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
          <div className="w-[8em] absolute bottom-10 right-8">
            <Button
              variant="xl"
              className="button-container"
              rounded
              disabled={values.role == null}
              type='button'
              onClick={handleSubmit}
            >
              <div className="flex justify-center items-center text-white">
                <span className="button-text">Edit</span>
              </div>
            </Button>
          </div>
        </div>
      </form>
      {values.nama.length != 0 && (
        <div className='flex justify-between mr-8'>
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
          <div className="w-[8em] mr-[10em] mt-2 md:block hidden">
            <Button
              variant="error"
              className="button-container"
              rounded
              type='button'
              onClick={() => setXConfirmDelete(true)}
            >
              <div className="flex justify-center items-center text-white">
                <span className="button-text">Hapus</span>
              </div>
            </Button>
          </div>
        </div>
      )}

      <XDeleteConfirm openConfirmDelete={openConfirmDelete} setXConfirmDelete={setXConfirmDelete} user={profile} />
    </div >
  )
}

function CreateForm({ handleSubmit, opd, user }: MyFormProps) {
  const listRole: any = [
    {
      label: 'Admin',
      value: 1
    },
    {
      label: 'Admin OPD',
      value: 2
    },
    {
      label: 'Verifikator',
      value: 3
    },
    {
      label: 'User',
      value: 5
    }
  ]

  const FormWithFormik = withFormik({
    mapPropsToValues: () => ({
      nama: user.length != 0 ? user.nama : "",
      nip: user.length != 0 ? user.nip : "",
      pangkat: user.length != 0 ? user.pangkat : "",
      namaPangkat: user.length != 0 ? user.namaPangkat : "",
      jabatan: user.length != 0 ? user.jabatan : "",
      role: user.role !== null ? listRole[user.role - 1] : null,
      opd: opd.length != 0 ? opd : ""
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
    }),
    handleSubmit,
  })(FormField);

  return <FormWithFormik />
}

interface PropTypes {
  opd: any;
  user?: any;
  type?: string;
}

const EditForm = ({ opd, user, type }: PropTypes) => {
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
      status: 'editted'
    }

    const response = await fetchApi({
      url: `/pegawai/editPegawai/${user.nip}`,
      method: 'put',
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
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Koneksi bermasalah',
        })
      }
    } else {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Berhasil update data user",
        showConfirmButton: false,
        timer: 1500,
      });
      router.push("/master/data-user");
    }
  }

  return (
    <div>
      {loading ? (
        <Loading loading={loading} setLoading={setLoading} />
      ) : (
        <CreateForm handleSubmit={handleSubmit} opd={opd} user={user} />
      )}
    </div>
  )
}

export default EditForm