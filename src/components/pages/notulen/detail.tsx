import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { OutputData } from "@editorjs/editorjs";
import { BsPrinter } from "react-icons/bs";
import { fetchApi } from "@/components/mixins/request";
import { shallowEqual, useSelector } from "react-redux";
import { State } from "@/store/reducer";
import { useState } from "react";
import XConfirmStatus from "../laporan/x-modal/XConfirmStatus";
import Swal from "sweetalert2";
import { getTime } from "@/components/hooks/formatDate";
import { formatDate } from "@/components/hooks/formatDate";
import EditNotulenForm from "./edit";
import { Button } from "@/components/common/button/button";
import Blocks from 'editorjs-blocks-react-renderer';
import Loading from "@/components/global/Loading/loading";

const editorJsHtml = require("editorjs-html");
const EditorJsToHtml = editorJsHtml();

type Props = {
  data: OutputData;
};
type ParsedContent = string | JSX.Element;

interface DetailProps {
  data: any;
  listTagging: any;
}

const NotulenDetailProps = ({ data }: DetailProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [openConfirmSubmit, setOpenConfirmSubmit] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { profile } = useSelector(
    (state: State) => ({
      profile: state.profile.profile,
    }),
    shallowEqual
  );

  const handlePrint = () => router.push(`${pathname}/cetak`);

  const handleDownloadFile = async (val: any, e: any) => {
    e.preventDefault();
    router.push(`${process.env.BASE_URL}/notulen/getFile?pathname=${val}`)
  }

  const handleBack = () => {
    if (data.atasan?.nip !== profile.nip) {
      router.push('/notulen/laporan')
    } else {
      router.push('/notulen/verifikasi')
    }
  };

  const handleChangeStatus = async (val: string) => {
    setOpenConfirmSubmit(true);
    setStatus(val);
  };

  const handleArchieve = () => {
    Swal.fire({
      title: `Permintaan Hapus Notulen "${data.acara}" ?`,
      showDenyButton: true,
      confirmButtonText: 'Hapus',
      denyButtonText: `Batal`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const response = await fetchApi({
          url: `/notulen/archieve/${data.id}`,
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
            title: `Sukses hapus notulen`,
            showConfirmButton: false,
            timer: 1500,
          });
          if (data.atasan?.nip !== profile.nip) {
            router.push('/notulen/laporan')
          } else {
            router.push('/notulen/verifikasi')
          }
        }
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

  const handleDelete = async () => {
    Swal.fire({
      title: `Yakin Hapus Permanen Notulen "${data.acara}" ?`,
      showDenyButton: true,
      confirmButtonText: 'Hapus',
      denyButtonText: `Batal`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const response = await fetchApi({
          url: `/notulen/deleteNotulen/${data.id}`,
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
            title: `Sukses hapus notulen`,
            showConfirmButton: false,
            timer: 1500,
          });
          router.push('/notulen/arsip')
        }
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

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
                  <div className={`${data.Pegawai?.nip === profile.nip ? 'block' : 'hidden'} border border-none rounded-lg px-8 py-1 hover:shadow-lg bg-warning text-white hover:cursor-pointer`} onClick={() => setIsOpenEdit(true)}>
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
              <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  Tagging / Tematik
                </div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="flex border-2 border-light-gray rounded-lg w-full py-3 px-10">
                    <ul>
                      {data.Taggings?.map((el: any, i: number) => (
                        <li className="list-decimal" key={i}>
                          <div>{el.nama_tagging} <span className="px-8">{el.kode_opd !== '1234567890' ? '(Tagging OPD)' : '(Tagging Kota)'}</span></div>
                        </li>
                      ))}
                    </ul>
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
                    {data.lokasi}
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
                  Pimpinan Rapat
                </div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="flex border-2 border-light-gray rounded-lg w-full py-3 px-4">
                    {data.pimpinan_rapat}
                  </div>
                </div>
              </div>
              <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  Peserta Rapat
                </div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="flex border-2 border-light-gray rounded-lg w-full py-3 px-4">
                    <ul className="flex flex-col gap-2">
                      {data.peserta_rapat.map((el: any, i: number) => (
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
                  Isi Rapat
                </div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="border-2 border-light-gray rounded-lg w-full py-3 px-4">
                    {data?.isi_rapat !== undefined && <Blocks data={JSON.parse(data?.isi_rapat)} config={{
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
                  Tindak Lanjut
                </div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="border-2 border-light-gray rounded-lg w-full py-3 px-4">
                    {data?.tindak_lanjut !== undefined && <Blocks data={JSON.parse(data?.tindak_lanjut)} config={{
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
                  Sasaran
                </div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="flex border-2 border-light-gray rounded-lg w-full py-3 px-10">
                    <ul>
                      {data.Sasarans?.map((el: any, i: number) => (
                        <li className="list-decimal" key={i}>
                          {el.sasaran}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
                <div className="text-label md:w-[20%] w-full md:text-left text-center">
                  Atasan
                </div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="flex border-2 border-light-gray rounded-lg w-full py-3 px-4">
                    <div className="flex flex-col w-full">
                      <div className="flex gap-3">
                        <div className="w-[15%]">Nama</div>
                        <div className="w-[5%]">:</div>
                        <div className="w-[80%]">{data.atasan.nama}</div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-[15%]">NIP</div>
                        <div className="w-[5%]">:</div>
                        <div className="w-[80%]">{data.atasan.nip}</div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-[15%]">Pangkat</div>
                        <div className="w-[5%]">:</div>
                        <div className="w-[80%]">{data.atasan.pangkat}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
                <div className="w-[15%]">Surat Undangan</div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="flex border-2 border-light-gray rounded-lg w-full py-3 px-4 hover:cursor-pointer">
                    {data.link_img_surat_undangan !== null ? (
                      <button onClick={(e: any) => handleDownloadFile(data.link_img_surat_undangan?.value, e)}>
                        {data.link_img_surat_undangan?.name}
                      </button>
                    ) : (
                      <div>-</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
                <div className="w-[15%]">Daftar Hadir</div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="flex border-2 border-light-gray rounded-lg w-full py-3 px-4">
                    {data.link_img_daftar_hadir !== null ? (
                      <button onClick={(e: any) => handleDownloadFile(data.link_img_daftar_hadir?.value, e)}>
                        {data.link_img_daftar_hadir?.name}
                      </button>
                    ) : (
                      <div>-</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
                <div className="w-[15%]">SPJ</div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="flex border-2 border-light-gray rounded-lg w-full py-3 px-4">
                    {data.link_img_spj !== null ? (
                      <div onClick={(e: any) => handleDownloadFile(data.link_img_spj?.value, e)}>
                        <div className="text-blue-500 underline">
                          {data.link_img_spj?.name}
                        </div>
                      </div>
                    ) : (
                      <div>-</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
                <div className="w-[15%]">Foto</div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="flex border-2 border-light-gray rounded-lg w-full py-3 px-4">
                    {data.link_img_foto !== null ? (
                      <div onClick={(e: any) => handleDownloadFile(data.link_img_foto?.value, e)}>
                        <div className="text-blue-500 underline">
                          {data.link_img_foto?.name}
                        </div>
                      </div>
                    ) : (
                      <div>-</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
                <div className="w-[15%]">Pendukung</div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="flex border-2 border-light-gray rounded-lg w-full py-3 px-4">
                    {data.link_img_pendukung !== null ? (
                      <div onClick={(e: any) => handleDownloadFile(data.link_img_pendukung?.value, e)}>
                        <div className="text-blue-500 underline">
                          {data.link_img_pendukung?.name}
                        </div>
                      </div>
                    ) : (
                      <div>-</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
                <div className="w-[15%]">Tanda Tangan</div>
                <div className="md:mt-0 mt-2 md:w-[75%] w-full">
                  <div className="flex border-2 border-light-gray md:h-[200px] h-[130px] rounded-lg w-full py-3 px-4">
                    {data.signature !== '-' ? (
                      <div>
                        <img src={data.signature} />
                      </div>
                    ) : (
                      <div>-</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`${data.status === '-' || data.status === 'editted' ? 'block' : 'hidden'} flex justify-between`}>
            <div className={`${profile.role == 3 && data.atasan?.nip === profile.nip ? 'block' : 'hidden'}`}>
              <div>
                <Button
                  variant="error"
                  className="button-container mb-2 mt-5"
                  rounded
                  onClick={() => handleChangeStatus("Ditolak")}
                >
                  <div className="flex justify-center items-center text-white px-10">
                    <span className="button-text">Tolak</span>
                  </div>
                </Button>
              </div>
            </div>
            <div className={`w-[8em]`}>
              {profile.role == 3 && data.atasan?.nip === profile.nip ? (
                <div>
                  <Button
                    variant="xl"
                    className="button-container mb-2 mt-5"
                    rounded
                    onClick={() => handleChangeStatus("Disetujui")}
                  >
                    <div className="flex justify-center items-center text-white">
                      <span className="button-text">Setujui</span>
                    </div>
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
          <div className={`${isOpenEdit ? 'block' : 'hidden'}`}>
            <EditNotulenForm dataNotulen={data} />
          </div>
        </>
      )}

      <XConfirmStatus
        openConfirmSubmit={openConfirmSubmit}
        setOpenConfirmSubmit={setOpenConfirmSubmit}
        status={status}
        data={data}
      />
    </React.Fragment>
  );
};

export default NotulenDetailProps;
