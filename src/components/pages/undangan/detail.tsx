import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { OutputData } from "@editorjs/editorjs";
import { BsPrinter } from "react-icons/bs";
import { fetchApi } from "@/app/api/request";
import { shallowEqual, useSelector } from "react-redux";
import { State } from "@/store/reducer";
import { useState } from "react";
import XConfirmStatus from "../laporan/x-modal/XConfirmStatus";
import Swal from "sweetalert2";
import { getTime } from "@/components/hooks/formatDate";
import { formatDate } from "@/components/hooks/formatDate";
import { Button } from "@/components/common/button/button";
import Blocks from 'editorjs-blocks-react-renderer';
import Loading from "@/components/global/Loading/loading";
import { formatMonth } from "@/components/helpers/formatMonth";
import EditUndanganForm from "./edit";

const editorJsHtml = require("editorjs-html");

interface DetailProps {
  data: any;
  profile: any;
}

const UndanganDetailProps = ({ data, profile }: DetailProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePrint = () => router.push(`${pathname}/cetak`);

  const handleArchieve = () => {
    Swal.fire({
      title: `Permintaan Hapus Undangan "${data.acara}" ?`,
      showDenyButton: true,
      confirmButtonText: 'Hapus',
      denyButtonText: `Batal`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const response = await fetchApi({
          url: `/undangan/archieve/${data.id}`,
          method: 'put',
          type: 'auth'
        })

        if (!response.success) {
          setLoading(false);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Koneksi bermasalah!",
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "success",
            title: `Sukses hapus undangan`,
            showConfirmButton: false,
            timer: 1500,
          });
          if (data.atasan?.nip !== profile.nip) {
            router.push('/undangan/laporan')
          } else {
            router.push('/undangan/verifikasi')
          }
        }
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  };

  const handleDelete = async () => {
    Swal.fire({
      title: `Yakin Hapus Permanen Undangan "${data.acara}" ?`,
      showDenyButton: true,
      confirmButtonText: 'Hapus',
      denyButtonText: `Batal`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const response = await fetchApi({
          url: `/undangan/deleteUndangan/${data.id}`,
          method: 'delete',
          type: 'auth'
        })

        if (!response.success) {
          setLoading(false);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Koneksi bermasalah!",
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "success",
            title: `Sukses hapus undangan`,
            showConfirmButton: false,
            timer: 1500,
          });
          router.push('/undangan/arsip')
        }
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

  const handleBack = () => {
    if (data.atasan?.nip !== profile.nip) {
      router.push('/undangan/laporan')
    } else {
      router.push('/undangan/verifikasi')
    }
  };

  return (
    <React.Fragment>
      {loading ? (
        <Loading loading={loading} setLoading={setLoading} />
      ) : (
        <>
          <div className="flex items-center justify-between mt-8 mb-2">
            <div
              className="border border-xl-base rounded-md w-[10%] px-4 py-1 flex items-center gap-2 bg-white hover:shadow-md hover:cursor-pointer"
              onClick={handlePrint}
            >
              <BsPrinter size={20} />
              <div>Cetak</div>
            </div>
            <div className={`${data.status === "Disetujui" ? 'hidden' : 'block'}`}>
              {isOpenEdit ? (
                <div className="border bg-danger text-white hover:bg-xl-pink rounded-lg px-8 py-1 hover:shadow-lg hover:cursor-pointer" onClick={() => setIsOpenEdit(false)}>
                  Tutup
                </div>
              ) : (
                <div className="flex space-x-4">
                  <div className="border bg-white border-danger text-danger hover:shadow-lg rounded-lg px-8 py-1 hover:shadow-lg hover:cursor-pointer" onClick={handleBack}>
                    Kembali
                  </div>
                  <div className={`${data.Uuid.Pegawai.nip === profile.nip ? 'block' : 'hidden'} border border-none rounded-lg px-8 py-1 hover:shadow-lg bg-warning text-white hover:cursor-pointer`} onClick={() => setIsOpenEdit(true)}>
                    Edit
                  </div>
                  <div className={`border border-none rounded-lg px-8 py-1 hover:shadow-lg bg-danger text-white hover:cursor-pointer`} onClick={() => data.status !== 'archieve' ? handleArchieve() : handleDelete()}>
                    Hapus
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={`detail-wrap bg-white dark:bg-meta-4 rounded-lg p-8 ${!isOpenEdit ? 'block' : 'hidden'}`}>
            <div className="flex flex-col gap-4">
              <div className={`body flex flex-row md:flex-row flex-col items-center justify-between ${data.keterangan != '' && data.status === "Ditolak" ? 'block' : 'hidden'}`}>
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  Alasan ditolak :
                </div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="flex border-2 border-light-gray rounded-lg w-full py-3 px-6">
                    {data.keterangan}
                  </div>
                </div>
              </div>
              <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  Tagging / Tematik
                </div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="flex border-2 border-light-gray rounded-lg w-full py-3 px-10">
                    <ul>
                      {data.Uuid.Taggings.length != 0 ? (
                        data.Uuid.Taggings?.map((el: any, i: number) => (
                          <li className="list-decimal" key={i}>
                            <div>{el.nama_tagging} <span className="px-8">{el.kode_opd !== '1234567890' ? '(Tagging OPD)' : '(Tagging Kota)'}</span></div>
                          </li>
                        ))
                      ) : (
                        <div>-</div>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="body flex md:flex-row flex-col items-center justify-between">
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  Nama Pembuat
                </div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="flex border-2 border-light-gray rounded-lg w-full py-3 px-4">
                    <div className="flex gap-4">
                      <div className="flex gap-4">
                        <span>{data.Uuid.Pegawai.nama}</span>
                        <span>({data.Uuid.Pegawai.nip})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="body flex md:flex-row flex-col items-center justify-between">
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  Hari / Tanggal
                </div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="flex border-2 border-light-gray rounded-lg w-full py-3 px-4">
                    <div className="flex gap-4">
                      {data.tanggal[0]?.startDate !== null && (
                        <span>{formatDate(data.tanggal[0]?.startDate)}</span>
                      )}
                      {data.tanggal[0]?.endDate !== null &&
                        data.tanggal[0]?.endDate !== data.tanggal[0]?.startDate && (
                          <>
                            <span>-</span>
                            <span>{formatDate(data.tanggal[0]?.endDate)}</span>
                          </>
                        )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  Nomor
                </div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="flex border-2 border-light-gray rounded-lg w-full py-3 px-4">
                    {data.nomor_surat}
                  </div>
                </div>
              </div>
              <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  Sifat
                </div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="flex border-2 border-light-gray rounded-lg w-full py-3 px-4">
                    {data.sifat}
                  </div>
                </div>
              </div>
              <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  Perihal
                </div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="flex border-2 border-light-gray rounded-lg w-full py-3 px-4">
                    {data.perihal}
                  </div>
                </div>
              </div>
              <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  Ditujukan Kepada
                </div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="flex border-2 border-light-gray rounded-lg w-full py-3 px-4">
                    <ul className="flex flex-col gap-2">
                      {data.ditujukan.map((el: any, i: number) => (
                        <li className="flex gap-3">
                          <div>{i + 1}.</div>
                          <div>{el.nama}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  Pendahuluan
                </div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="border-2 border-light-gray rounded-lg w-full py-3 px-4">
                    {data?.pendahuluan !== undefined && <Blocks data={JSON.parse(data?.pendahuluan)} config={{
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
              </div>
              <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  Isi Undangan
                </div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="border-2 border-light-gray rounded-lg w-full py-3 px-4">
                    {data?.isi_undangan !== undefined && <Blocks data={JSON.parse(data?.isi_undangan)} config={{
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
              </div>
              <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  Waktu
                </div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="flex border-2 border-light-gray rounded-lg w-full py-3 px-4">
                    {getTime(data.waktu)}
                  </div>
                </div>
              </div>
              <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  Acara
                </div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="flex border-2 border-light-gray rounded-lg w-full py-3 px-4">
                    {data.acara}
                  </div>
                </div>
              </div>
              <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  Tempat / Lokasi
                </div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="flex border-2 border-light-gray rounded-lg w-full py-3 px-4">
                    <div className="flex flex-col">
                      {data.lokasi.split(', ').map((el: any, i: number) => (
                        <div>{el}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  Catatan
                </div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="border-2 border-light-gray rounded-lg w-full py-3 px-4">
                    {data?.catatan !== null && <Blocks data={JSON.parse(data?.catatan)} config={{
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
              </div>
              <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  Penutup
                </div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="border-2 border-light-gray rounded-lg w-full py-3 px-4">
                    {data?.penutup !== undefined && <Blocks data={JSON.parse(data?.penutup)} config={{
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
              </div>
              <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  Dibuat tanggal
                </div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="flex border-2 border-light-gray rounded-lg w-full py-3 px-4">
                    {data.Uuid.hari} {formatMonth[data.Uuid.bulan - 1]} {data.Uuid.tahun}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isOpenEdit && <EditUndanganForm profile={profile} undangan={data} />}
        </>
      )}
    </React.Fragment>
  )
}

export default UndanganDetailProps;