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
import { AiFillPlusCircle, AiOutlineClose } from "react-icons/ai";

const EditorBlock = dynamic(() => import("../../hooks/editor"));

interface FormValues {
  ditujukan: any;
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
  sifat?: any;
  atasan?: any;
  payload?: any;
  dibuatTanggal?: any;
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
  const [pesertaRapat, setPesertaRapat] = useState<string>("");
  const [idPesertaRapat, setIdPesertaRapat] = useState<number>(1);
  const [openAddParticipant, setOpenAddParticipant] = useState<boolean>(false);

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

  const handleAddParticipant = (e: any) => {
    e.preventDefault();
    setOpenAddParticipant(false);

    if (pesertaRapat !== "") {
      let temp = values.ditujukan;
      temp.push({ id: idPesertaRapat, nama: pesertaRapat });
      handleChange({
        target: { name: "ditujukan", value: temp },
      });
    }
    setPesertaRapat("");
  };

  const handleDeletePesertaArray = (e: any, nama: string) => {
    e.preventDefault();
    const newArray = values.ditujukan.filter(
      (item: any) => item.nama !== nama
    );
    handleChange({
      target: { name: "ditujukan", value: newArray },
    });
  };

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
          <div className="flex flex-col justify-center mb-2">
            <div>
              <div className="flex flex-col w-full">
                <TextInput
                  type="text"
                  id="ditujukan"
                  name="ditujukan"
                  label="Ditujukan Kepada"
                  change={(e: any) => setPesertaRapat(e.target.value)}
                  value={pesertaRapat}
                  errors={errors.ditujukan}
                  placeholder="Kepada Yth."
                  handleBlur={handleBlur}
                />
                <div className="flex justify-center items-center md:gap-8 md:mx-10 mt-3">
                  <button
                    className="text-xl-pink"
                    onClick={(e) => handleAddParticipant(e)}
                  >
                    Batal
                  </button>
                  <button
                    className="text-xl-base"
                    onClick={(e) => handleAddParticipant(e)}
                  >
                    Tambah
                  </button>
                </div>
              </div>
            </div>
            <ul className="mt-4 ml-4">
              {values.ditujukan.map((el: any, i: number) => (
                <li className="font flex flex-col gap-2" key={i}>
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <div
                        className={`${values.ditujukan.length > 1 ? "block" : "hidden"
                          }`}
                      >
                        {i + 1} .
                      </div>
                      <div>{el.nama}</div>
                    </div>
                    <div>
                      <button
                        onClick={(e: any) =>
                          handleDeletePesertaArray(e, el.nama)
                        }
                      >
                        <AiOutlineClose size={18} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
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
              value={values.sifat}
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
              value={values.atasan}
              handleBlur={handleBlur}
              setValueSelected={handleChange}
              change={(selectedOption: any) => {
                handleChange({
                  target: { name: "atasan", value: selectedOption },
                });
              }}
            />
          </div>
          {values.tanggalSurat !== null ? (
            <div className="data items-center flex md:flex-row flex-col md:gap-4 w-full">
              <div className="data flex flex-row mt-4 md:mt-0 md:w-[25%] w-full">
                <div className="flex border-2 border-light-gray rounded-lg w-full py-3 px-4">
                  <span>{formatDate(values.tanggalSurat)}</span>
                </div>
              </div>
              <div className="w-[15%] text-right">Edit Waktu Pembuatan: </div>
              <div className="w-[60%] mb-2">
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
                  errors={errors.tanggalSurat}
                />
              </div>
            </div>
          ) : (
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
              errors={errors.tanggalSurat}
            />
          )}
        </div>
        <div className="btn-submit mx-8 flex flex-row justify-between pb-4 mt-4 space-x-3">
          <div className="w-[8em]">
            <Button
              variant="xl"
              type="secondary"
              className="button-container"
              onClick={handleCancel}
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

function CreateForm({ handleSubmit, sifat, atasan, dibuatTanggal, payload, ...otherProps }: MyFormProps) {
  const FormWithFormik = withFormik({
    mapPropsToValues: () => ({
      ditujukan: payload?.length != 0 ? payload?.ditujukan !== null ? payload?.ditujukan : [] : [],
      tanggalSurat: dibuatTanggal !== null ? dibuatTanggal : null,
      nomorSurat: payload?.length != 0 ? payload?.nomor_surat !== null ? payload?.nomor_surat : null : null,
      sifat: payload?.sifat !== null ? sifat : null,
      perihal: payload?.length != 0 ? payload?.perihal !== null ? payload?.perihal : null : null,
      pendahuluan: payload?.length != 0 ? payload?.pendahuluan !== null ? JSON.parse(payload?.pendahuluan) : "" : "",
      isiUndangan: payload?.length != 0 ? payload?.isi_undangan !== null ? JSON.parse(payload?.isi_undangan) : "" : "",
      rangeTanggal: [
        {
          startDate: payload?.length != 0 ? payload?.tanggal[0]?.startDate != null ? new Date(payload?.tanggal[0]?.startDate) : null : null,
          endDate: payload?.length != 0 ? payload?.tanggal[0]?.endDate != null ? new Date(payload?.tanggal[0]?.endDate) : null : null,
          key: "selection",
        },
      ],
      jam: payload?.length != 0 ? payload?.waktu !== null ? payload?.waktu : null : null,
      tempat: payload?.length != 0 ? payload?.tempat !== null ? payload?.tempat : null : null,
      acara: payload?.length != 0 ? payload?.acara !== null ? payload?.acara : null : null,
      penutup: payload?.length != 0 ? payload?.penutup !== null ? JSON.parse(payload?.penutup) : "" : "",
      atasan: payload?.atasan !== null ? atasan : null,
    }),
    validationSchema: Yup.object().shape({
      ditujukan: Yup.array()
        .required("Harap isi peserta !"),
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
  undangan: any;
}

const AddUndanganForm = ({
  profile,
  dataAtasan,
  step,
  undangan
}: PropTypes) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [atasan, setAtasan] = useState<any>(null);
  const [sifat, setSifat] = useState<any>(null);
  const [dataPayload, setDataPayload] = useState<any>([]);
  const [dibuatTanggal, setDibuatTanggal] = useState<any>(null);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  React.useEffect(() => {
    if (undangan.length != 0) {
      setAtasan({
        label: undangan.atasan.nama,
        value: undangan.atasan.nip,
        data: {
          nama: undangan.atasan.nama,
          nip: undangan.atasan.nip,
          pangkat: undangan.atasan.pangkat,
          namaPangkat: undangan.atasan.nama_pangkat,
          jabatan: undangan.atasan.jabatan
        },
      })
      setSifat({
        label: undangan.sifat,
        value: undangan.sifat
      })
      formattedDate();
    }
  }, []);

  const formattedDate = () => {
    let tempDate: any = undangan.hari + '/' + Number(undangan.bulan - 1) + '/' + undangan.tahun;
    const dateParts = tempDate.split('/');
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10); // Months are 0-based (0 = January, 1 = February, etc.)
    const year = parseInt(dateParts[2], 10);
    // Create a Date object with the parsed values
    const formattedDate = new Date(year, month, day);

    // Define a formatting option for the date
    const options: any = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'long',
      timeZone: 'Asia/Jakarta' // Set the desired time zone
    };

    // Format the date using the Intl.DateTimeFormat API
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const formattedDateString = formatter.format(formattedDate);
    setDibuatTanggal(formattedDate);
  }

  const handleSubmmit = async (values: FormValues) => {
    setOpenConfirm(true);
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
    setDataPayload(payload);
  }
  console.log(undangan);

  const handleNext = () => {
    const storedData = {
      step1: dataPayload
    }
    dispatch(setPayload(storedData));
    router.push('/notulen/form?step=2');
  }

  const handleNo = async () => {
    setLoading(true);
    const response = await fetchApi({
      url: '/undangan/addUndangan',
      method: 'post',
      type: 'auth',
      body: dataPayload
    })

    if (!response.success) {
      if (response.data.code == 400) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Periksa kembali data Undangan!",
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
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Berhasil menambahkan undangan",
        showConfirmButton: false,
        timer: 1500,
      });
      dispatch(setPayload([]));
      router.push("/undangan/laporan");
    }
  }

  const handleCancel = async () => dispatch(setPayload([]));

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
          atasan={atasan}
          dibuatTanggal={dibuatTanggal}
          payload={undangan}
          step={step}
          sifat={sifat}
        />
      )}
      <ModalConfirm
        openModal={openConfirm}
        setOpenModal={setOpenConfirm}
        condition="success"
        title="Berhasil Simpan Undangan"
        text="Ingin Menambah Notulen ?"
        handleCancel={handleNo}
        handleNext={handleNext}
        payload={dataPayload}
        setLoading={setLoading}
      />
    </React.Fragment>
  )
}

export default AddUndanganForm