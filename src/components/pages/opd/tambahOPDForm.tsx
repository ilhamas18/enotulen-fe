'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import TextInput from '@/components/common/text-input/input';
import { Button } from '@/components/common/button/button';
import { withFormik, FormikProps, FormikBag } from 'formik';
import * as Yup from 'yup';
import { fetchApi } from '@/app/api/request';
import Swal from 'sweetalert2';

interface FormValues {
  singkatan: string,
  alamat: string,
  telepon: string,
  faximile: string,
  website: string,
  kepalaOPD: any
}

interface OtherProps {
  title?: string;
  ref?: any;
  dataOPD?: any;
  dataPegawai?: any;
}

interface MyFormProps extends OtherProps {
  handleSubmit: (
    values: FormValues,
    // formikBag: FormikBag<object, FormValues>
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
    dataPegawai,
    isSubmitting,
    dataOPD,
    ref,
  } = props;

  const router = useRouter();

  const handleCancel = () => router.push('/master/data-opd');

  return (
    <div className='relative'>
      <form className="form-wrapper-general">
        <div className="px-8 flex flex-col space-y-7 mt-4">
          <div className="data flex flex-row">
            <TextInput
              type="text"
              id="singkatan"
              name="singkatan"
              label="Singkatan"
              touched={touched.singkatan}
              change={handleChange}
              value={values.singkatan}
              errors={errors.singkatan}
              handleBlur={handleBlur}
            />
          </div>
          <div className="data flex flex-row">
            <TextInput
              type="text"
              id="alamat"
              name="alamat"
              label="Alamat"
              touched={touched.alamat}
              change={handleChange}
              value={values.alamat}
              errors={errors.alamat}
              handleBlur={handleBlur}
            />
          </div>
          <div className="data flex flex-row">
            <TextInput
              type="text"
              id="telepon"
              name="telepon"
              label="Telepon"
              touched={touched.telepon}
              change={handleChange}
              value={values.telepon}
              errors={errors.telepon}
              handleBlur={handleBlur}
            />
          </div>
          <div className="data flex flex-row">
            <TextInput
              type="text"
              id="faximile"
              name="faximile"
              label="Email"
              touched={touched.faximile}
              change={handleChange}
              value={values.faximile}
              errors={errors.faximile}
              handleBlur={handleBlur}
            />
          </div>
          <div className="data flex flex-row">
            <TextInput
              type="text"
              id="website"
              name="website"
              label="Website"
              touched={touched.website}
              change={handleChange}
              value={values.website}
              errors={errors.website}
              handleBlur={handleBlur}
            />
          </div>
          <div className="data flex flex-row">
            <TextInput
              type="dropdown"
              id="kepalaOPD"
              name="kepalaOPD"
              label="Nama Kepala"
              touched={touched.kepalaOPD}
              errors={errors.kepalaOPD}
              value={values.kepalaOPD}
              placeholder="Ketik dan pilih Kepala OPD"
              options={dataPegawai}
              handleBlur={handleBlur}
              setValueSelected={handleChange}
              change={(selectedOption: any) => {
                handleChange({
                  target: { name: "kepalaOPD", value: selectedOption },
                });
              }}
            />
          </div>
        </div>
        <div className="btn-submit mx-8 flex flex-row justify-between pb-4 mt-4 space-x-3">
          <div className="w-[8em] absolute bottom-0 right-8">
            <Button
              variant="xl"
              className="button-container mb-2 mt-5"
              rounded
              onClick={handleSubmit}
            >
              <div className="flex justify-center items-center text-white">
                <span className="button-text">Tambah</span>
              </div>
            </Button>
          </div>
        </div>
      </form>
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
    </div>
  )
}

function CreateForm({ handleSubmit, dataOPD, ...otherProps }: MyFormProps) {
  const FormWithFormik = withFormik({
    mapPropsToValues: () => ({
      singkatan: dataOPD.opd.singkatan !== null ? dataOPD.opd.singkatan : "",
      alamat: dataOPD.opd.alamat !== null ? dataOPD.opd.alamat : "",
      telepon: dataOPD.opd.telepon !== null ? dataOPD.opd.telepon : "",
      faximile: dataOPD.opd.faximile !== null ? dataOPD.opd.faximile : "",
      website: dataOPD.opd.website !== null ? dataOPD.opd.website : "",
      kepalaOPD: null
    }),
    validationSchema: Yup.object().shape({
      alamat: Yup.string()
        .required('Harap isi alamat !'),
      telepon: Yup.string()
        .required('Harap isi telepon !'),
      faximile: Yup.string()
        .required('Harap isi faximile !'),
      website: Yup.string()
        .required('Harap isi website !'),
      kepalaOPD: Yup.object()
        .shape({
          label: Yup.string(),
          value: Yup.number(),
        })
        .required("Bagian dibutuhkan")
        .nullable(),
    }),
    handleSubmit
  })(FormField)

  return <FormWithFormik {...otherProps} />
}

interface PropTypes {
  dataOPD: any;
  dataPegawai: any;
}

const TambahOPDForm = ({ dataOPD, dataPegawai }: PropTypes) => {
  const router = useRouter();

  const handleSubmit = async (values: FormValues) => {
    const payload = {
      singkatan: values.singkatan,
      alamat: values.alamat,
      telepon: values.telepon,
      faximile: values.faximile,
      website: values.website,
      kepala_opd: values.kepalaOPD.data
    }

    const response = await fetchApi({
      url: `/opd/addOPD/${dataOPD.opd.kode_opd}`,
      method: 'post',
      body: payload,
      type: "auth"
    })

    if (!response.success) {
      if (response.data.code == 500) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Koneksi bermasalah!',
        })
      }
    } else {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Data tersimpan',
        showConfirmButton: false,
        timer: 1500
      })
      router.push('/master/data-opd')
    }
  }

  return (
    <CreateForm handleSubmit={handleSubmit} dataOPD={dataOPD} dataPegawai={dataPegawai} />
  )
}

export default TambahOPDForm;