"use client";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import TextInput from "@/components/common/text-input/input";
import { Button } from "@/components/common/button/button";
import SignatureCanvas from 'react-signature-canvas';
import dynamic from "next/dynamic";
import { AiFillPlusCircle } from "react-icons/ai";
import { fetchApi } from "@/app/api/request";
import Swal from "sweetalert2";
import DateRangePicker from "../laporan/x-modal/XDateRangePicker";
import { formatDate } from "@/components/hooks/formatDate";
import Loading from "@/components/global/Loading/loading";
import { AiOutlineClose } from "react-icons/ai";
import { withFormik, FormikProps, FormikBag } from "formik";
import * as Yup from "yup";
import { shallowEqual, useSelector } from "react-redux";
import { State } from "@/store/reducer";
import axios from "axios";
import { getCookies } from "cookies-next";
import { IoMdClose } from "react-icons/io";
import { v4 as uuidv4 } from 'uuid';
import ModalConfirm from "@/components/global/Modal/confirm";
import { setPayload } from "@/store/payload/action";
import CancelBtn from "@/components/hooks/cancelBtn";
import Blocks from "editorjs-blocks-react-renderer";

const EditorBlock = dynamic(() => import("../../hooks/editor"));

interface FormValues {
  tagging: any;
  rangeTanggal: any;
  jam: any;
  pendahuluan: any;
  pimpinanRapat: string;
  pesertaArray: any;
  isiRapat: any;
  tindakLanjut: any;
  lokasi: string;
  acara: string;
  atasan: any;
  suratUndangan: any;
  daftarHadir: any;
  spj: any;
  foto: any;
  pendukung: any;
  signature: string;
  dibuatTanggal: any;
  handleSave?: any;
}

interface OtherProps {
  title?: string;
  ref?: any;
  handleSave?: any;
  dataAtasan?: any;
  data?: any;
  atasan?: any;
  payload?: any;
  dibuatTanggal?: any;
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
    isSubmitting,
    dataAtasan,
    data,
    step,
    payload,
    ref,
  } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const [openDateRange, setOpenDateRange] = useState<boolean>(false);
  const [openAddParticipant, setOpenAddParticipant] = useState<boolean>(false);
  const [pesertaRapat, setPesertaRapat] = useState<string>("");
  const [idPesertaRapat, setIdPesertaRapat] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [sign, setSign] = useState<any>()

  const [uploadMsgUndangan, setUploadMsgUndangan] = useState<string>("");
  const [progressUndangan, setProgressUndangan] = useState<any>({
    started: false,
    pc: 0,
  });

  const [uploadMsgDaftarHadir, setUploadMsgDaftarHadir] = useState<string>("");
  const [progressDaftarHadir, setProgressDaftarHadir] = useState<any>({
    started: false,
    pc: 0,
  });

  const [uploadMsgSPJ, setUploadMsgSPJ] = useState<string>("");
  const [progressSPJ, setProgressSPJ] = useState<any>({
    started: false,
    pc: 0,
  });

  const [uploadMsgfoto, setUploadMsgFoto] = useState<string>("");
  const [progressfoto, setProgressFoto] = useState<any>({
    started: false,
    pc: 0,
  });

  const [uploadMsgPendukung, setUploadMsgPendukung] = useState<string>("");
  const [progressPendukung, setProgressPendukung] = useState<any>({
    started: false,
    pc: 0,
  });

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

  const handleOpenAddPeserta = (e: any) => {
    e.preventDefault();
    setOpenAddParticipant(!openAddParticipant);

    if (values.pesertaArray.length)
      setIdPesertaRapat(
        values.pesertaArray[values.pesertaArray.length - 1].id++
      );
    else setIdPesertaRapat(1);
  };

  const handleAddParticipant = (e: any) => {
    e.preventDefault();
    setOpenAddParticipant(false);

    if (pesertaRapat !== "") {
      let temp = values.pesertaArray;
      temp.push({ id: idPesertaRapat, nama: pesertaRapat });
      handleChange({
        target: { name: "pesertaArray", value: temp },
      });
    }
    setPesertaRapat("");
  };

  const handleDeletePesertaArray = (e: any, nama: string) => {
    e.preventDefault();
    const newArray = values.pesertaArray.filter(
      (item: any) => item.nama !== nama
    );
    handleChange({
      target: { name: "pesertaArray", value: newArray },
    });
  };

  const handleUploadSuratUndangan = async (event: any) => {
    let url = `${process.env.BASE_URL}/upload/undangan`;

    event.preventDefault();
    const fileUrl = event.target.files[0];

    setUploadMsgUndangan("Uploading ...");
    setProgressUndangan((prevState: any) => {
      return { ...prevState, started: true };
    });

    let fd = new FormData();
    fd.append("undangan", fileUrl);
    const body: any = fd;

    const response: any = await axios.post(url, body, {
      onUploadProgress: (progressEvent: any) => {
        setProgressUndangan((prevState: any) => {
          return { ...prevState, pc: progressEvent.progress * 100 };
        });
      },
      headers: {
        Authorization: `Bearer ${getCookies()?.refreshSession}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success) {
      const { data } = response.data;

      setUploadMsgUndangan("Upload berhasil");
      handleChange({
        target: { name: "suratUndangan", value: { name: fileUrl.name, value: data.data } },
      });
    } else {
      setUploadMsgUndangan("Upload gagal");
    }
  };

  const handleUploadDaftarHadir = async (event: any) => {
    let url = `${process.env.BASE_URL}/upload/daftarhadir`;
    event.preventDefault();
    const fileUrl = event.target.files[0];

    setUploadMsgDaftarHadir("Uploading ...");
    setProgressDaftarHadir((prevState: any) => {
      return { ...prevState, started: true };
    });

    let fd = new FormData();
    fd.append("daftarhadir", fileUrl);
    const body: any = fd;

    const response: any = await axios.post(url, body, {
      onUploadProgress: (progressEvent: any) => {
        setProgressDaftarHadir((prevState: any) => {
          return { ...prevState, pc: progressEvent.progress * 100 };
        });
      },
      headers: {
        Authorization: `Bearer ${getCookies()?.refreshSession}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success) {
      const { data } = response.data;

      setUploadMsgDaftarHadir("Upload berhasil");
      handleChange({
        target: { name: "daftarHadir", value: { name: fileUrl.name, value: data.data } },
      });
    } else {
      setUploadMsgUndangan("Upload gagal");
    }
  };

  const handleUploadSPJ = async (event: any) => {
    let url = `${process.env.BASE_URL}/upload/spj`;
    event.preventDefault();
    const fileUrl = event.target.files[0];

    setUploadMsgSPJ("Uploading ...");
    setProgressSPJ((prevState: any) => {
      return { ...prevState, started: true };
    });

    let fd = new FormData();
    fd.append("spj", fileUrl);
    const body: any = fd;

    const response: any = await axios.post(url, body, {
      onUploadProgress: (progressEvent: any) => {
        setProgressSPJ((prevState: any) => {
          return { ...prevState, pc: progressEvent.progress * 100 };
        });
      },
      headers: {
        Authorization: `Bearer ${getCookies()?.refreshSession}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success) {
      const { data } = response.data;

      setUploadMsgSPJ("Upload berhasil");
      handleChange({
        target: { name: "spj", value: { name: fileUrl.name, value: data.data } },
      });
    } else {
      setUploadMsgUndangan("Upload gagal");
    }
  };

  const handleUploadFoto = async (event: any) => {
    let url = `${process.env.BASE_URL}/upload/foto`;
    event.preventDefault();
    const fileUrl = event.target.files[0];

    setUploadMsgFoto("Uploading ...");
    setProgressFoto((prevState: any) => {
      return { ...prevState, started: true };
    });

    let fd = new FormData();
    fd.append("foto", fileUrl);
    const body: any = fd;

    const response: any = await axios.post(url, body, {
      onUploadProgress: (progressEvent: any) => {
        setProgressFoto((prevState: any) => {
          return { ...prevState, pc: progressEvent.progress * 100 };
        });
      },
      headers: {
        Authorization: `Bearer ${getCookies()?.refreshSession}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success) {
      const { data } = response.data;

      setUploadMsgFoto("Upload berhasil");
      handleChange({
        target: { name: "foto", value: { name: fileUrl.name, value: data.data } },
      });
    } else {
      setUploadMsgFoto("Upload gagal");
    }
  };

  const handleUploadFilePendukung = async (event: any) => {
    let url = `${process.env.BASE_URL}/upload/pendukung`;
    event.preventDefault();
    const fileUrl = event.target.files[0];

    setUploadMsgPendukung("Uploading ...");
    setProgressPendukung((prevState: any) => {
      return { ...prevState, started: true };
    });

    let fd = new FormData();
    fd.append("pendukung", fileUrl);
    const body: any = fd;

    const response: any = await axios.post(url, body, {
      onUploadProgress: (progressEvent: any) => {
        setProgressPendukung((prevState: any) => {
          return { ...prevState, pc: progressEvent.progress * 100 };
        });
      },
      headers: {
        Authorization: `Bearer ${getCookies()?.refreshSession}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success) {
      const { data } = response.data;

      setUploadMsgPendukung("Upload berhasil");
      handleChange({
        target: { name: "pendukung", value: { name: fileUrl.name, value: data.data } },
      });
    } else {
      setUploadMsgUndangan("Upload gagal");
    }
  };

  const handleDeleteFile = async (key: string, type: string, e: any) => {
    e.preventDefault();
    router.push(`${process.env.BASE_URL}/notulen/deleteFile?pathname=${key}`)
    handleChange({
      target: { name: type, value: null },
    });
    setProgressUndangan({ started: false, pc: 0 });
    setProgressDaftarHadir({ started: false, pc: 0 });
    setProgressSPJ({ started: false, pc: 0 });
    setProgressFoto({ started: false, pc: 0 });
    setProgressPendukung({ started: false, pc: 0 });
    setUploadMsgUndangan('');
    setUploadMsgDaftarHadir('');
    setUploadMsgSPJ('');
    setUploadMsgFoto('');
    setUploadMsgPendukung('');
  };

  const handleDownloadFile = async (val: any, e: any) => router.push(`${process.env.BASE_URL}/notulen/getFile?pathname=${val}`);

  return (
    <React.Fragment>
      {loading ? (
        <Loading loading={loading} setLoading={setLoading} />
      ) : (
        <div className="form-container relative bg-white rounded-lg">
          <div className="form-wrapper-general">
            <div className="px-8 flex flex-col space-y-7 mt-4">
              <div className="data flex flex-row mt-4">
                <div
                  className={`flex border-2 ${errors.rangeTanggal ? "border-xl-pink" : "border-light-gray"
                    } rounded-lg w-full py-3 px-4`}
                  onClick={() => step === null && setOpenDateRange(true)}
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
              <div className="data flex flex-row w-full">
                <TextInput
                  type="time"
                  id="jam"
                  name="jam"
                  touched={touched.rangeTanggal}
                  label="Masukkan Jam"
                  change={(e: any) => {
                    handleChange({
                      target: { name: "jam", value: e.$d },
                    });
                  }}
                  disabled={step !== null ? true : false}
                  value={values.jam}
                  errors={errors.jam}
                />
              </div>
              <div className="data flex flex-row">
                <TextInput
                  type="text"
                  id="acara"
                  name="acara"
                  touched={touched.acara}
                  label="Acara"
                  change={handleChange}
                  value={values.acara}
                  handleBlur={handleBlur}
                  disabled={step !== null ? true : false}
                  errors={errors.acara}
                />
              </div>
              <div className="mt-2 -pb-2 text-title-xsm font-bold">Penjelasan :</div>
              <div>
                <div className="text-deep-gray">Pendahuluan</div>
                {step === null ? (
                  <>
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
                  </>
                ) : (
                  <div className="md:mt-0 mt-2 w-full">
                    <div className="border-2 border-light-gray rounded-lg w-full py-3 px-4">
                      {values.pendahuluan !== null && <Blocks data={JSON.parse(data.pendahuluan)} config={{
                        list: {
                          className: "list-decimal ml-10"
                        },
                        paragraph: {
                          className: "text-base text-opacity-75",
                          actionsClassNames: {
                            alignment: "text-justify",
                          }
                        }
                      }} />}
                    </div>
                  </div>
                )}
              </div>
              <div className="data flex flex-row">
                <TextInput
                  type="text"
                  id="pimpinanRapat"
                  name="pimpinanRapat"
                  touched={touched.pimpinanRapat}
                  label="Pimpinan Rapat"
                  change={handleChange}
                  value={values?.pimpinanRapat}
                  handleBlur={handleBlur}
                  errors={errors.pimpinanRapat}
                />
              </div>
              <div className="flex flex-col justify-center mb-2">
                <div className="flex gap-2">
                  <button onClick={(e) => handleOpenAddPeserta(e)}>
                    <AiFillPlusCircle size={26} />
                  </button>
                  <div>Tambah Peserta</div>
                </div>
                <div>
                  <div className="flex flex-col w-full mt-8">
                    <TextInput
                      type="text"
                      id="pesertaRapat"
                      name="pesertaRapat"
                      label="Peserta Rapat"
                      change={(e: any) => setPesertaRapat(e.target.value)}
                      value={pesertaRapat}
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
                  {values.pesertaArray.map((el: any, i: number) => (
                    <li className="font flex flex-col gap-2" key={i}>
                      <div className="flex justify-between">
                        <div className="flex gap-2">
                          <div
                            className={`${values.pesertaArray.length > 1 ? "block" : "hidden"
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
              <div>
                <div className="text-deep-gray">Tambahkan Isi Rapat</div>
                <div className="container border-2 border-light-gray rounded-lg">
                  <EditorBlock
                    data={values.isiRapat}
                    onChange={(e) => {
                      handleChange({
                        target: { name: "isiRapat", value: e },
                      });
                    }}
                    holder="editorjs-container2"
                  />
                </div>
              </div>
              <div>
                <div className="text-deep-gray">Tindak Lanjut</div>
                <div className="container border-2 border-light-gray rounded-lg">
                  <EditorBlock
                    data={values.tindakLanjut}
                    onChange={(e) => {
                      handleChange({
                        target: { name: "tindakLanjut", value: e },
                      });
                    }}
                    holder="editorjs-container3"
                  />
                </div>
              </div>
              <div className="data flex flex-row">
                <TextInput
                  type="text"
                  id="lokasi"
                  name="lokasi"
                  label="Lokasi / tempat"
                  touched={touched.lokasi}
                  change={handleChange}
                  disabled={step !== null ? true : false}
                  value={values.lokasi}
                  errors={errors.lokasi}
                  handleBlur={handleBlur}
                />
              </div>
              <div className="data flex flex-row">
                <TextInput
                  type="dropdown"
                  id="atasan"
                  name="atasan"
                  label="Nama Atasan"
                  touched={touched.atasan}
                  errors={errors.atasan}
                  value={values.atasan}
                  placeholder="Ketik dan pilih atasan"
                  options={dataAtasan}
                  disabled={step !== null ? true : false}
                  handleBlur={handleBlur}
                  setValueSelected={handleChange}
                  change={(selectedOption: any) => {
                    handleChange({
                      target: { name: "atasan", value: selectedOption },
                    });
                  }}
                />
              </div>
              {values.dibuatTanggal == null ? (
                <div className="data flex flex-row w-full mt-2">
                  <div className="flex flex-col gap-3">
                    <div>Masukkan tanggal pembuatan notulen :</div>
                    <TextInput
                      type="date-picker"
                      id="dibuatTanggal"
                      name="dibuatTanggal"
                      touched={touched.dibuatTanggal}
                      change={(e: any) => {
                        handleChange({
                          target: { name: "dibuatTanggal", value: e.$d },
                        });
                      }}
                      value={values.dibuatTanggal}
                      disabled={step !== null ? true : false}
                      errors={errors.dibuatTanggal}
                    />
                  </div>
                </div>
              ) : (
                <div className="data flex flex-col w-full mt-2 gap-2 justify-center">
                  <div>Waktu pembuatan notulen :</div>
                  <div className="data flex flex-row mt-4 md:mt-0 md:w-[25%] w-full">
                    <div className="flex border-2 border-light-gray rounded-lg w-full py-3 px-4">
                      <span>{formatDate(values.dibuatTanggal)}</span>
                    </div>
                  </div>
                </div>
              )}
              {values.suratUndangan == null ? (
                <div className="data flex flex-col">
                  <label className="block mb-2 text-sm font-medium text-gray-900 text-Nunito dark:text-white">
                    Upload Surat Undangan (opsional)
                  </label>
                  <input
                    className="block w-full text-md text-gray-900 border border-light-gray py-2 rounded-lg cursor-pointer bg-white focus:outline-none"
                    type="file"
                    onChange={(event: any) => {
                      handleUploadSuratUndangan(event);
                    }}
                  />
                  <div className="w-full">
                    {progressUndangan.started && (
                      <progress max="100" value={progressUndangan.pc}></progress>
                    )}
                  </div>
                  {uploadMsgUndangan && <span>{uploadMsgUndangan}</span>}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <div>Surat Undangan</div>
                    <div className="download-click text-xl-base" onClick={(e: any) => handleDownloadFile(values.suratUndangan.value, e)}>
                      {values.suratUndangan.name}
                    </div>
                  </div>
                  <div onClick={(e: any) => handleDeleteFile(values.suratUndangan.value, 'suratUndangan', e)}>
                    <IoMdClose size={20} />
                  </div>
                </div>
              )}
              {values.daftarHadir == null ? (
                <div className="data flex flex-col">
                  <label className="block mb-2 text-sm font-medium text-gray-900 text-Nunito dark:text-white">
                    Upload Daftar Hadir (opsional)
                  </label>
                  <input
                    className="block w-full text-md text-gray-900 border border-light-gray py-2 rounded-lg cursor-pointer bg-white focus:outline-none"
                    type="file"
                    onChange={(event: any) => {
                      handleUploadDaftarHadir(event);
                    }}
                  />
                  <div className="w-full">
                    {progressDaftarHadir.started && (
                      <progress
                        max="100"
                        value={progressDaftarHadir.pc}
                      ></progress>
                    )}
                  </div>
                  {uploadMsgDaftarHadir && <span>{uploadMsgDaftarHadir}</span>}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <div>Daftar Hadir</div>
                    <div className="download-click text-xl-base" onClick={(e: any) => handleDownloadFile(values.daftarHadir.value, e)}>
                      {values.daftarHadir.name}
                    </div>
                  </div>
                  <div onClick={(e: any) => handleDeleteFile(values.daftarHadir.value, 'daftarHadir', e)}>
                    <IoMdClose size={20} />
                  </div>
                </div>
              )}
              {values.spj == null ? (
                <div className="data flex flex-col">
                  <label className="block mb-2 text-sm font-medium text-gray-900 text-Nunito dark:text-white">
                    Upload SPJ (opsional)
                  </label>
                  <input
                    className="block w-full text-md text-gray-900 border border-light-gray py-2 rounded-lg cursor-pointer bg-white focus:outline-none"
                    type="file"
                    onChange={(event: any) => {
                      handleUploadSPJ(event);
                    }}
                  />
                  <div className="w-full">
                    {progressSPJ.started && (
                      <progress max="100" value={progressSPJ.pc}></progress>
                    )}
                  </div>
                  {uploadMsgSPJ && <span>{uploadMsgSPJ}</span>}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <div>SPJ</div>
                    <div className="download-click text-xl-base" onClick={(e: any) => handleDownloadFile(values.spj.value, e)}>
                      {values.spj.name}
                    </div>
                  </div>
                  <div onClick={(e: any) => handleDeleteFile(values.spj.value, 'spj', e)}>
                    <IoMdClose size={20} />
                  </div>
                </div>
              )}
              {values.foto == null ? (
                <div className="data flex flex-col">
                  <label className="block mb-2 text-sm font-medium text-gray-900 text-Nunito dark:text-white">
                    Upload Foto (opsional)
                  </label>
                  <input
                    className="block w-full text-md text-gray-900 border border-light-gray py-2 rounded-lg cursor-pointer bg-white focus:outline-none"
                    type="file"
                    onChange={(event: any) => {
                      handleUploadFoto(event);
                    }}
                  />
                  <div className="w-full">
                    {progressfoto.started && (
                      <progress max="100" value={progressfoto.pc}></progress>
                    )}
                  </div>
                  {uploadMsgfoto && <span>{uploadMsgfoto}</span>}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <div>Foto</div>
                    <div className="download-click text-xl-base" onClick={(e: any) => handleDownloadFile(values.foto.value, e)}>
                      {values.foto.name}
                    </div>
                  </div>
                  <div onClick={(e: any) => handleDeleteFile(values.foto.value, 'foto', e)}>
                    <IoMdClose size={20} />
                  </div>
                </div>
              )}
              {values.pendukung == null ? (
                <div className="data flex flex-col">
                  <label className="block mb-2 text-sm font-medium text-gray-900 text-Nunito dark:text-white">
                    Upload Pendukung (opsional)
                  </label>
                  <input
                    className="block w-full text-md text-gray-900 border border-light-gray py-2 rounded-lg cursor-pointer bg-white focus:outline-none"
                    type="file"
                    onChange={(event: any) => {
                      handleUploadFilePendukung(event);
                    }}
                  />
                  <div className="w-full">
                    {progressPendukung.started && (
                      <progress max="100" value={progressPendukung.pc}></progress>
                    )}
                  </div>
                  {uploadMsgPendukung && <span>{uploadMsgPendukung}</span>}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <div>File Pendukung</div>
                    <div className="download-click text-xl-base" onClick={(e: any) => handleDownloadFile(values.pendukung.value, e)}>
                      {values.pendukung.name}
                    </div>
                  </div>
                  <div onClick={(e: any) => handleDeleteFile(values.pendukung.value, 'pendukung', e)}>
                    <IoMdClose size={20} />
                  </div>
                </div>
              )}
            </div>
            <div className="signature px-8 mt-6">
              {values.signature === null ? (
                <>
                  <div className="text-title-xsm2 mb-2">Bubuhkan Tanda tangan (opsional)</div>
                  <div className="md:w-[500px] w-full md:h-[200px] h-[130px] border-2 border-light-gray rounded rounded-lg">
                    <SignatureCanvas
                      canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
                      ref={(data: any) => setSign(data)}
                    />
                  </div>
                  <button style={{ height: "30px", width: "200px" }} className="text-meta-1" onClick={(e: any) => handleClear(e)}>BERSIHKAN</button>
                  <button style={{ height: "30px", width: "200px" }} className="text-xl-base font-bold" onClick={(e: any) => handleGenerate(e)}>SIMPAN</button>
                </>
              ) : (
                <div className="flex md:flex-row md:items-center md:justify-between flex-col mb-2 md:mb-0">
                  <img src={values.signature} />
                  <div className="text-danger text-title-xsm2 hover:cursor-pointer" onClick={handleDeleteSignature}>Hapus</div>
                </div>
              )}
            </div>
            <div className="text-danger text-title-ss mx-8 mt-3">*Pastikan mengisi seluruh data notulen, (kecuali yang opsional)</div>

            <div className="btn-submit mx-8 flex flex-row justify-between pb-4 mt-4 space-x-3">
              <div className="w-[8em] absolute bottom-6 right-8">
                <Button
                  type="button"
                  variant="xl"
                  className="button-container"
                  loading={loading}
                  rounded
                  disabled={
                    values.rangeTanggal.length == 0 ||
                      values.jam === null ||
                      values.pendahuluan === "" ||
                      values.pimpinanRapat === "" ||
                      values.pesertaArray.length == 0 ||
                      values.isiRapat === null ||
                      values.tindakLanjut === null ||
                      values.lokasi === "" ||
                      values.acara === "" ||
                      values.atasan === null ||
                      values.dibuatTanggal === null ?
                      true : false
                  }
                  onClick={handleSubmit}
                >
                  <div className="flex justify-center items-center text-white font-Nunito">
                    <span className="button-text">Tambah</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
          <div className="w-[8em] pb-6 pt-2 pl-6">
            <CancelBtn
              title="Keluar"
              data={data}
              url="/undangan/addUndangan"
              setLoading={setLoading}
            />
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
      )}
    </React.Fragment>
  );
};

function CreateForm({ handleSubmit, atasan, dibuatTanggal, payload, ...otherProps }: MyFormProps) {
  const FormWithFormik = withFormik({
    mapPropsToValues: () => ({
      tagging: [],
      rangeTanggal: [
        {
          startDate: payload.length != 0 ? payload.tanggal[0]?.startDate != null ? new Date(payload.tanggal[0]?.startDate) : null : null,
          endDate: payload.length != 0 ? payload.tanggal[0]?.endDate != null ? new Date(payload.tanggal[0]?.endDate) : null : null,
          key: "selection",
        },
      ],
      jam: payload.length != 0 ? payload.waktu !== null ? payload.waktu : null : null,
      pendahuluan: payload.length != 0 ? payload.pendahuluan !== null ? JSON.parse(payload.pendahuluan) : null : null,
      pimpinanRapat: payload.length != 0 ? payload.pimpinan_rapat !== null ? payload.pimpinan_rapat : "" : "",
      pesertaArray: payload.length != 0 ? payload.peserta_rapat !== undefined ? payload.peserta_rapat : [] : [],
      isiRapat: payload.length != 0 ? payload?.isi_rapat !== undefined ? JSON.parse(payload?.isi_rapat) : null : null,
      tindakLanjut: payload.length != 0 ? payload.tindak_lanjut !== undefined ? JSON.parse(payload.tindak_lanjut) : null : null,
      lokasi: payload.length != 0 ? payload.lokasi !== "" ? payload.lokasi : "" : "",
      acara: payload.length != 0 ? payload.acara !== "" ? payload.acara : "" : "",
      atasan: payload.length != 0 ? atasan : null,
      suratUndangan: payload.link_img_surat_undangan !== null ? payload.link_img_surat_undangan : null,
      daftarHadir: payload.link_img_daftar_hadir !== null ? payload.link_img_daftar_hadir : null,
      spj: payload.link_img_spj !== null ? payload.link_img_spj : null,
      foto: payload.link_img_foto !== null ? payload.link_img_foto : null,
      pendukung: payload.link_img_pendukung !== null ? payload.link_img_pendukung : null,
      signature: payload.signature !== undefined ? payload.signature !== '-' ? payload.signature : null : null,
      dibuatTanggal: dibuatTanggal !== null ? dibuatTanggal : null
    }),
    validationSchema: Yup.object().shape({
      rangeTanggal: Yup.array()
        .required("Harap isi tanggal pelaksanaan !"),
      jam: Yup.mixed()
        .nullable()
        .required("Waktu tidak boleh kosong !"),
      pendahuluan: Yup.mixed()
        .required("Harap isi pendahuluan !"),
      pimpinanRapat: Yup.string()
        .required("Harap isi nama pimpinan rapat !"),
      pesertaArray: Yup.array()
        .required("Harap isi peserta !"),
      isiRapat: Yup.mixed()
        .required("Harap isi rapat !"),
      tindakLanjut: Yup.mixed()
        .required("Harap isi tindak lanjut !"),
      lokasi: Yup.string()
        .required("Lokasi tidak boleh kosong !"),
      acara: Yup.string()
        .required("Acara tidak boleh kosong !"),
      atasan: Yup.object()
        .shape({
          label: Yup.string(),
          value: Yup.number(),
        })
        .required("Bagian dibutuhkan")
        .nullable(),
      dibuatTanggal: Yup.mixed().nullable().required("Tanggal tidak boleh kosong !"),
    }),
    handleSubmit,
  })(FormField);

  return <FormWithFormik {...otherProps} />;
}

interface PropTypes {
  profile: any;
  payload: any;
  notulen: any;
  dataAtasan: any;
  step: string
}

const AddNotulenForm = ({ profile, payload, notulen, dataAtasan, step }: PropTypes) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [atasan, setAtasan] = useState<any>(null);
  const [dibuatTanggal, setDibuatTanggal] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (notulen.length != 0) {
      setAtasan({
        label: notulen.atasan.nama,
        value: notulen.atasan.nip,
        data: {
          nama: notulen.atasan.nama,
          nip: notulen.atasan.nip,
          pangkat: notulen.atasan.pangkat,
          namaPangkat: notulen.atasan.nama_pangkat,
          jabatan: notulen.atasan.jabatan
        },
      })
      formattedDate();
    }
    setLoading(false);
  }, [])

  const formattedDate = () => {
    let tempDate: any = notulen.hari + '/' + Number(notulen.bulan - 1) + '/' + notulen.tahun;
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

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    const dataNotulen = {
      uuid: notulen.length != 0 ? notulen.uuid : uuidv4(),
      tanggal: values.rangeTanggal,
      waktu: values.jam,
      pendahuluan: JSON.stringify(values.pendahuluan),
      pimpinan_rapat: values.pimpinanRapat,
      peserta_rapat: values.pesertaArray,
      isi_rapat: JSON.stringify(values.isiRapat),
      tindak_lanjut: JSON.stringify(values.tindakLanjut),
      lokasi: values.lokasi,
      acara: values.acara,
      atasan: values.atasan?.data,
      status: "-",
      hari: new Date(values.dibuatTanggal).getDate(),
      bulan: new Date(values.dibuatTanggal).getMonth() + 1,
      tahun: new Date(values.dibuatTanggal).getFullYear(),
      link_img_surat_undangan: values.suratUndangan,
      link_img_daftar_hadir: values.daftarHadir,
      link_img_spj: values.spj,
      link_img_foto: values.foto,
      link_img_pendukung: values.pendukung,
      signature: values.signature !== '' ? values.signature : '-',
      kode_opd: profile.Perangkat_Daerah.kode_opd,
      nip_pegawai: profile.nip,
      nip_atasan: values.atasan.value
    };

    const response = await fetchApi({
      url: `/notulen/addNotulen`,
      method: "post",
      type: "auth",
      body: dataNotulen
    });

    if (!response.success) {
      if (response.data.code == 400) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Periksa kembali data Notulen!",
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
        const response2 = await fetchApi({
          url: '/undangan/addUndangan',
          method: 'post',
          type: 'auth',
          body: payload.step1
        })

        if (!response2.success) {
          if (response2.data.code == 400) {
            setLoading(false);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Periksa kembali data Undangan!",
            });
          } else if (response2.data.code == 500) {
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
            title: "Berhasil menambahkan notulen",
            showConfirmButton: false,
            timer: 1500,
          });
          dispatch(setPayload([]));
          router.push("/notulen/laporan");
        }
      } else {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Berhasil menambahkan notulen",
          showConfirmButton: false,
          timer: 1500,
        });
        dispatch(setPayload([]));
        router.push("/notulen/laporan");
      }
    }

  };

  return (
    <div>
      {loading ? (
        <Loading loading={loading} setLoading={setLoading} />
      ) : (
        <CreateForm
          handleSubmit={handleSubmit}
          dataAtasan={dataAtasan}
          data={notulen}
          atasan={atasan}
          dibuatTanggal={dibuatTanggal}
          payload={notulen}
          step={step}
        />
      )}
    </div>
  );
};

export default AddNotulenForm;

