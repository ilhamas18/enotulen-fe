"use client";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import TextInput from "@/components/common/text-input/input";
import { Button } from "@/components/common/button/button";
import SignatureCanvas from 'react-signature-canvas';
import dynamic from "next/dynamic";
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { locationList } from "@/components/data/location";

const EditorBlock = dynamic(() => import("../../hooks/editor"));

interface FormValues {
  tagging: any;
  rangeTanggal: any;
  jam: any;
  pendahuluan: any;
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
  signature: any;
  dibuatTanggal: any;
  handleSave?: any;
}

const FormDataSchema = z.object({
  rangeTanggal: z.array(z.string()).refine((arr) => new Set(arr).size === arr.length, {
    message: 'Must be an array of unique strings',
  }),
  jam: z.any().nullable().refine(value => value !== null, {
    message: 'Waktu tidak boleh kosong!',
  }),
  pendahuluan: z.any().refine(value => value !== undefined && value !== null && value !== '', {
    message: 'Harap isi pendahuluan!',
  }),
  pesertaArray: z.array(z.any()).refine(arr => arr.length > 0, {
    message: 'Harap isi peserta!',
  }),
  isiRapat: z.any().refine(value => value !== undefined && value !== null && value !== '', {
    message: 'Harap isi rapat!',
  }),
  tindakLanjut: z.any().refine(value => value !== undefined && value !== null && value !== '', {
    message: 'Harap isi tindak lanjut!',
  }),
  lokasi: z.string().refine(value => value.trim() !== '', {
    message: 'Lokasi tidak boleh kosong!',
  }),
  acara: z.string().refine(value => value.trim() !== '', {
    message: 'Acara tidak boleh kosong!',
  }),
  atasan: z.object({
    label: z.string(),
    value: z.number(),
  }).refine(value => value !== undefined && value !== null, {
    message: 'Bagian dibutuhkan',
  }).nullable(),
  dibuatTanggal: z.any().nullable().refine(value => value !== undefined && value !== null, {
    message: 'Tanggal tidak boleh kosong!',
  }),
})

interface PropTypes {
  step: string;
}

const AddNotulenForm = ({ step }: PropTypes) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    reset,
    watch,
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      tagging: [],
      rangeTanggal: [],
      jam: null,
      pendahuluan: null,
      pesertaArray: [],
      isiRapat: null,
      tindakLanjut: null,
      lokasi: "",
      acara: "",
      atasan: null,
      suratUndangan: null,
      daftarHadir: null,
      spj: null,
      foto: null,
      pendukung: null,
      signature: null,
      dibuatTanggal: null
    },
    resolver: zodResolver(FormDataSchema)
  })
  const { push } = useRouter();
  const dispatch = useDispatch();
  const [openDateRange, setOpenDateRange] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <React.Fragment>
      {loading ? (
        <Loading loading={loading} setLoading={setLoading} />
      ) : (
        <div className="form-container relative bg-white rounded-lg">
          <form className="form-wrapper-general">
            <div className="px-8 flex flex-col space-y-7 mt-4">
              <div className="data flex flex-row mt-4">
                <div
                  className={`flex border-2 ${errors.rangeTanggal ? "border-xl-pink" : "border-light-gray"
                    } rounded-lg w-full py-3 px-4`}
                  onClick={() => step === null && setOpenDateRange(true)}
                >
                  {/* {values?.rangeTanggal[0]?.startDate === null ? (
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
                  )} */}
                </div>
              </div>
            </div>
          </form>

          {/* <DateRangePicker
            isOpen={openDateRange}
            setIsOpen={setOpenDateRange}
            rangeTanggal={watch('rangeTanggal')}
            setRangeTanggal={(e: any) => {
              handleChange({
                target: { name: "rangeTanggal", value: [e.selection] },
              });
            }}
          /> */}
        </div>
      )}
    </React.Fragment>
  )
}