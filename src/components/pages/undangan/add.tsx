"use client";
import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import TextInput from "@/components/common/text-input/input";
import { Button } from "@/components/common/button/button";
import dynamic from "next/dynamic";
import { fetchApi } from "@/app/api/request";
import Swal from "sweetalert2";
import DateRangePicker from "../laporan/x-modal/XDateRangePicker";
import { formatDate } from "@/components/hooks/formatDate";
import Loading from "@/components/global/Loading/loading";
import { withFormik, FormikProps, FormikBag } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from 'uuid';
import { setPayload } from "@/store/payload/action";
import ModalConfirm from "@/components/global/Modal/confirm";
import { FiCheckCircle } from "react-icons/fi";

const EditorBlock = dynamic(() => import("../../hooks/editor"));

interface FormValues {
  ditujukan: string;
  tanggalSurat: any;
  nomorSurat: string;
  sifat: any;
  perihal: string;
  pendahuluan: any;
  isiUndangan: any;
  rangeTanggal: any;
  jam: any;
  tempat: string;
  acara: string;
  penutup: any;
  atasan: any;
}

interface OtherProps {
  title?: string;
  ref?: any;
  handleSave?: any;
  handleCancel?: any;
  dataAtasan?: any;
  loading?: boolean;
  step?: string;
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
    handleCancel,
    isSubmitting,
    ref,
    dataAtasan,
    loading
  } = props;

  const [openDateRange, setOpenDateRange] = useState<boolean>(false);

  const dataSifat = [
    {
      label: 'Biasa',
      value: 'Biasa'
    },
    {
      label: 'Penting',
      value: 'Penting'
    },
    {
      label: 'Segera',
      value: 'Segera'
    },
    {
      label: 'Rahasia',
      value: 'Rahasia'
    }
  ]

  return (
    <div className="form-container relative bg-white rounded-lg">
      <div className="form-wrapper-general">
        <div className="px-8 flex flex-col space-y-7 mt-4 py-8">
          <div className="data flex flex-row w-full">
            <TextInput
              type="text"
              id="nomorSurat"
              name="nomorSurat"
              touched={touched.nomorSurat}
              label="Nomor Surat"
              change={handleChange}
              value={values.nomorSurat}
              handleBlur={handleBlur}
              errors={errors.nomorSurat}
            />
          </div>
          <div className="data flex flex-row w-full">
            <TextInput
              type="text"
              id="ditujukan"
              name="ditujukan"
              touched={touched.ditujukan}
              label="Ditujukan Kepada"
              placeholder="Kepada Yth."
              change={handleChange}
              value={values.ditujukan}
              handleBlur={handleBlur}
              errors={errors.ditujukan}
            />
          </div>
          <div className="data flex flex-row">
            <TextInput
              type="dropdown"
              id="sifat"
              name="sifat"
              label="Nama sifat"
              touched={touched.sifat}
              errors={errors.sifat}
              placeholder="Sifat"
              options={dataSifat}
              handleBlur={handleBlur}
              setValueSelected={handleChange}
              change={(selectedOption: any) => {
                handleChange({
                  target: { name: "sifat", value: selectedOption },
                });
              }}
            />
          </div>
          <div className="data flex flex-row w-full">
            <TextInput
              type="text"
              id="perihal"
              name="perihal"
              touched={touched.perihal}
              label="Perihal"
              change={handleChange}
              value={values.perihal}
              handleBlur={handleBlur}
              errors={errors.perihal}
            />
          </div>
          <div>
            <div className="text-deep-gray">Pendahuluan</div>
            <div className="container border-2 border-light-gray rounded-lg">
              <EditorBlock
                data={values.pendahuluan}
                onChange={(e) => {
                  handleChange({
                    target: { name: "pendahuluan", value: e },
                  });
                }}
                holder="editorjs-containe"
              />
            </div>
          </div>
          <div>
            <div className="text-deep-gray">Isi Undangan</div>
            <div className="container border-2 border-light-gray rounded-lg">
              <EditorBlock
                data={values.isiUndangan}
                onChange={(e) => {
                  handleChange({
                    target: { name: "isiUndangan", value: e },
                  });
                }}
                holder="editorjs-container"
              />
            </div>
          </div>
          <div className="data flex flex-row mt-4">
            <div
              className={`flex border-2 ${errors.rangeTanggal ? "border-xl-pink" : "border-light-gray"
                } rounded-lg w-full py-3 px-4`}
              onClick={() => setOpenDateRange(true)}
            >
              {values?.rangeTanggal[0]?.startDate === null ? (
                <span>Pilih Hari / Tanggal</span>
              ) : (
                <div className="flex gap-4">
                  {values?.rangeTanggal[0]?.startDate !== null && (
                    <span>
                      {formatDate(values?.rangeTanggal[0]?.startDate)}
                    </span>
                  )}
                  {values?.rangeTanggal[0]?.endDate !== null &&
                    values?.rangeTanggal[0]?.endDate !==
                    values?.rangeTanggal[0]?.startDate && (
                      <span>
                        {" "}
                        - {formatDate(values.rangeTanggal[0]?.endDate)}
                      </span>
                    )}
                </div>
              )}
            </div>
          </div>
          <div className="data flex flex-row w-full mt-2">
            <div className="flex flex-col gap-3">
              <div>Waktu :</div>
              <TextInput
                type="time"
                id="jam"
                name="jam"
                touched={touched.jam}
                label="Masukkan Jam"
                change={(e: any) => {
                  handleChange({
                    target: { name: "jam", value: e.$d },
                  });
                  // dispatch(setNotulen({ 'jam': e.$d }))
                }}
                value={values.jam}
                errors={errors.jam}
              />
            </div>
          </div>
          <div className="data flex flex-row w-full">
            <TextInput
              type="text"
              id="tempat"
              name="tempat"
              touched={touched.tempat}
              label="Tempat"
              change={handleChange}
              value={values.tempat}
              handleBlur={handleBlur}
              errors={errors.tempat}
            />
          </div>
          <div className="data flex flex-row w-full">
            <TextInput
              type="text"
              id="acara"
              name="acara"
              touched={touched.acara}
              label="Acara"
              change={handleChange}
              value={values.acara}
              handleBlur={handleBlur}
              errors={errors.acara}
            />
          </div>
          <div>
            <div className="text-deep-gray">Penutup</div>
            <div className="container border-2 border-light-gray rounded-lg">
              <EditorBlock
                data={values.penutup}
                onChange={(e) => {
                  handleChange({
                    target: { name: "penutup", value: e },
                  });
                }}
                holder="editorjs-container3"
              />
            </div>
          </div>
          <div className="data flex flex-row">
            <TextInput
              type="dropdown"
              id="atasan"
              name="atasan"
              label="Nama Atasan"
              touched={touched.atasan}
              errors={errors.atasan}
              placeholder="Ketik dan pilih atasan"
              options={dataAtasan}
              handleBlur={handleBlur}
              setValueSelected={handleChange}
              change={(selectedOption: any) => {
                handleChange({
                  target: { name: "atasan", value: selectedOption },
                });
              }}
            />
          </div>
          <div className="data flex flex-row w-full mt-2">
            <div className="flex flex-col gap-3">
              <div>Undangan ini dibuat pada tanggal :</div>
              <TextInput
                type="date-picker"
                id="tanggalSurat"
                name="tanggalSurat"
                touched={touched.tanggalSurat}
                change={(e: any) => {
                  handleChange({
                    target: { name: "tanggalSurat", value: e.$d },
                  });
                }}
                value={values.tanggalSurat}
                errors={errors.tanggalSurat}
              />
            </div>
          </div>
        </div>
        <div className="btn-submit mx-8 flex flex-row justify-between pb-4 mt-4 space-x-3">
          <div className="w-[8em]">
            <Button
              variant="xl"
              type="secondary"
              className="button-container"
              rounded
            >
              <div className="flex justify-center items-center text-[#002DBB] font-Nunito" onClick={handleCancel}>
                <span className="button-text">Batal</span>
              </div>
            </Button>
          </div>
          <div className="w-[8em]">
            <Button
              type="button"
              variant="xl"
              className="button-container"
              loading={loading}
              rounded
              onClick={handleSubmit}
            >
              <div className="flex justify-center items-center text-white font-Nunito">
                <span className="button-text">Simpan</span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      <DateRangePicker
        isOpen={openDateRange}
        setIsOpen={setOpenDateRange}
        rangeTanggal={values.rangeTanggal}
        setRangeTanggal={(e: any) => {
          handleChange({
            target: { name: "rangeTanggal", value: [e.selection] },
          });
        }}
      />
    </div>
  )
}

function CreateForm({ handleSubmit, ...otherProps }: MyFormProps) {
  const FormWithFormik = withFormik({
    mapPropsToValues: () => ({
      ditujukan: "",
      tanggalSurat: null,
      nomorSurat: "",
      sifat: null,
      perihal: "",
      pendahuluan: null,
      isiUndangan: null,
      rangeTanggal: [
        {
          startDate: null,
          endDate: null,
          key: "selection",
        },
      ],
      jam: null,
      tempat: "",
      acara: "",
      penutup: null,
      atasan: null,
    }),
    validationSchema: Yup.object().shape({
      ditujukan: Yup.string()
        .required("Bagian diperlukan"),
      tanggalSurat: Yup.mixed()
        .nullable()
        .required("Tanggal tidak boleh kosong !"),
      nomorSurat: Yup.string()
        .required("Harap isi nomor surat"),
      sifat: Yup.object()
        .shape({
          label: Yup.string(),
          value: Yup.string(),
        })
        .nullable()
        .required("Harap isi sifat surat"),
      perihal: Yup.string()
        .required("Harap isi perihal"),
      pendahuluan: Yup.mixed()
        .required("Harap isi pendahuluan !"),
      isiUndangan: Yup.mixed()
        .required("Harap mengisi isi rapat !"),
      rangeTanggal: Yup.mixed()
        .nullable()
        .required("Tanggal tidak boleh kosong !"),
      jam: Yup.mixed()
        .nullable()
        .required("Waktu tidak boleh kosong !"),
      tempat: Yup.string()
        .required("Harap isi tempat"),
      acara: Yup.string()
        .required("Harap isi acara"),
      penutup: Yup.mixed()
        .required("Harap isi penutup !"),
      atasan: Yup.object()
        .shape({
          label: Yup.string(),
          value: Yup.number(),
        })
        .required("Bagian dibutuhkan")
        .nullable(),
    }),
    handleSubmit
  })(FormField);

  return <FormWithFormik {...otherProps} />
}

interface PropTypes {
  profile: any;
  dataAtasan: any;
  step: string;
}

const AddUndanganForm = ({
  profile,
  dataAtasan,
  step
}: PropTypes) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [response, setResponse] = useState<any>([]);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  const handleSubmmit = async (values: FormValues) => {
    setLoading(true);
    const payload = {
      uuid: uuidv4(),
      ditujukan: values.ditujukan,
      nomor_surat: values.nomorSurat,
      sifat: values.sifat.value,
      perihal: values.perihal,
      pendahuluan: JSON.stringify(values.pendahuluan),
      isi_undangan: JSON.stringify(values.isiUndangan),
      tanggal: values.rangeTanggal,
      waktu: values.jam,
      tempat: values.tempat,
      acara: values.acara,
      atasan: values.atasan.data,
      penutup: JSON.stringify(values.penutup),
      status: "-",
      hari: new Date(values.tanggalSurat).getDate(),
      bulan: new Date(values.tanggalSurat).getMonth() + 1,
      tahun: new Date(values.tanggalSurat).getFullYear(),
      signature: "-",
      kode_opd: profile.Perangkat_Daerah.kode_opd,
      nip_pegawai: profile.nip,
      nip_atasan: values.atasan.value
    }

    const response = await fetchApi({
      url: `/undangan/addUndangan`,
      method: "post",
      body: payload,
      type: "auth",
    })

    if (!response.success) {
      if (response.data.code == 400) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Periksa kembali data undangan!",
        });
      } else if (response.data.code == 400) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Periksa kembali data Anda!",
        });
      } else if (response.data.code == 500) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Koneksi bermasalah!",
        });
      }
    } else {
      if (step !== null) {
        setLoading(false);
        setResponse(response);
        setOpenConfirm(true);
      } else {
        router.push('/undangan/laporan');
      }
    }
  }

  const handleNext = () => {
    router.push('/notulen/form?step=2');
    dispatch(setPayload(response.data.data));
  }

  const handleCancel = () => router.push('/undangan/laporan');

  return (
    <React.Fragment>
      {loading ? (
        <Loading loading={loading} setLoading={setLoading} />
      ) : (
        <CreateForm
          handleSubmit={handleSubmmit}
          handleCancel={handleCancel}
          dataAtasan={dataAtasan}
          loading={loading}
          step={step}
        />
      )}
      <ModalConfirm
        openModal={openConfirm}
        setOpenModal={setOpenConfirm}
        condition="success"
        title="Berhasil Simpan Undangan"
        text="Ingin Menambah Notulen ?"
        handleCancel={handleCancel}
        handleNext={handleNext}
      />
    </React.Fragment>
  )
}

export default AddUndanganForm