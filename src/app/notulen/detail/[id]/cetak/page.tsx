"use client";
import React from "react";
import { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { fetchApi } from "@/app/api/request";
import Swal from "sweetalert2";
import { BsPrinter } from "react-icons/bs";
import { formatDate, getTime } from "@/components/hooks/formatDate";
import withAuth from "@/components/hocs/withAuth";
import Blocks from 'editorjs-blocks-react-renderer';
import { formatMonth } from "@/components/helpers/formatMonth";

const CetakNotulen = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  const [laporan, setLaporan] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const printRef: any = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetchApi({
      url: `/notulen/getNotulenDetail/${id}`,
      method: "get",
      type: "auth",
    });

    if (!response.success) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Koneksi bermasalah!",
      });
    } else {
      if (response.data.code == 200) {
        const { data } = response.data;
        setLaporan(data);
        setLoading(false);
      }
    }
  };

  function formatDateRange(startDate: any, endDate: any) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startDay = start.getDate();
    const endDay = end.getDate();
    const month = start.toLocaleString("default", { month: "long" });
    const year = start.getFullYear();

    if (startDay === endDay) {
      return `${startDay} ${month} ${year}`;
    } else {
      return `${startDay} - ${endDay} ${month} ${year}`;
    }
  }

  return (
    <React.Fragment>
      {laporan.length != 0 && (
        <>
          <button
            className="border border-xl-base rounded-md px-4 py-1 flex items-center gap-2 bg-white dark:bg-meta-4 dark:text-white mb-2 hover:shadow-md hover:cursor-pointer mt-8"
            onClick={handlePrint}
          >
            <BsPrinter size={20} />
            <div>Cetak</div>
          </button>
          <div
            className="cetak-wrapper bg-white dark:bg-meta-4 px-8"
            id="container"
            ref={printRef}
          >
            <div className="header py-2 text-center border-b border-black">
              <div className="flex flex-row gap-2 text-center justify-center relative h-auto">
                <div className="w-[20%]">
                  <img
                    src="/logo/Lambang_Kota_Madiun.png"
                    className="w-[100px] h-auto"
                  />
                </div>
                <div className="title text-center flex-col space-y-[1px] w-[80%]">
                  <div className="text-black dark:text-white font-bold text-title-xsm">
                    PEMERINTAH KOTA MADIUN
                  </div>
                  <div className="text-black dark:text-white font-bold text-title-ss uppercase">
                    {laporan?.Uuid.Perangkat_Daerah?.nama_opd}
                    {/* BADAN PERENCANAAN, PENELITIAN DAN PEMBANGUNAN DAERAH */}
                  </div>
                  <div className="text-black dark:text-white font-bold text-title-xsm tracking-widest">
                    ({laporan?.Uuid.Perangkat_Daerah?.singkatan})
                    {/* (BAPPELITBANGDA) */}
                  </div>
                  <div className="text-black dark:text-white font-bold text-title-ss">
                    {laporan?.Uuid.Perangkat_Daerah?.alamat}
                    {/* Jl Mayjen Panjaitan No. 17 Lt II, Kode Pos: 63137, Jawa
                    Timur */}
                  </div>
                  <div className="text-black dark:text-white font-bold text-title-ss">
                    {/* TELP : ( 0351 ) 471535 / FAX: ( 0351 ) 471535 */}
                    TELP : {laporan?.Uuid.Perangkat_Daerah?.telepon}/Email. {laporan?.Uuid.Perangkat_Daerah?.faximile}
                  </div>
                  <div className="text-black dark:text-white text-title-ss">
                    Website : {laporan?.Uuid.Perangkat_Daerah?.website}
                    {/* Website : http://www. madiunkota.go.id */}
                  </div>
                </div>
              </div>
            </div>
            <div className="line border-2 border-black mt-[2px]"></div>
            <div className="body border-t border-black mt-[2px] flex flex-col">
              <div className="title font-bold text-title-xsm2 flex flex-col space-y-2 py-12 text-black dark:text-white text-center">
                <div>LAPORAN</div>
                <div>{laporan.acara}</div>
              </div>
              <div className="body">
                <div className="pendahuluan flex-col">
                  <div className="text-black dark:text-white text-title-ss">
                    I. Pendahuluan
                  </div>
                  <div className="text-black dark:text-white text-title-ss2 mt-3 ml-4 text-justify">
                    {laporan?.pendahuluan !== undefined && <Blocks data={JSON.parse(laporan?.pendahuluan)} config={{
                      list: {
                        className: "list-decimal ml-10"
                      },
                      paragraph: {
                        className: "text-base text-title-ss2 text-opacity-75",
                        actionsClassNames: {
                          alignment: "text-justify",
                        }
                      }
                    }} />}
                  </div>
                </div>
                <div className="pendahuluan flex-col">
                  <div className="text-black dark:text-white text-title-ss mt-12">
                    II. Isi Laporan
                  </div>
                  <div className="text-black dark:text-white text-title-ss2 mt-3 ml-4">
                    Rapat dilaksanakan pada :
                    <div className="flex flex-col space-y-1 mt-2">
                      <div className="flex">
                        <div className="title w-[20%]">Hari / Tanggal</div>
                        <div className="title w-[5%]">:</div>
                        <div className="title w-[75%]">
                          {laporan.tanggal[0]?.startDate !== null &&
                            laporan.tanggal[0]?.endDate !== null &&
                            laporan.tanggal[0]?.startDate ===
                            laporan.tanggal[0]?.endDate && (
                              <span>
                                {formatDate(laporan.tanggal[0]?.startDate)}
                              </span>
                            )}
                          {laporan.tanggal[0]?.startDate !== null &&
                            laporan.tanggal[0]?.endDate !== null &&
                            laporan.tanggal[0]?.startDate !==
                            laporan.tanggal[0]?.endDate && (
                              <span>
                                {formatDateRange(
                                  laporan.tanggal[0]?.startDate,
                                  laporan.tanggal[0]?.endDate
                                )}
                              </span>
                            )}
                        </div>
                      </div>
                      {/* <div className="flex">
                        <div className="title w-[20%]">Tanggal</div>
                        <div className="title w-[5%]">:</div>
                        <div className="title w-[75%]">
                          {laporan.tanggal[0]?.startDate !== null &&
                            laporan.tanggal[0]?.endDate !== null &&
                            laporan.tanggal[0]?.startDate ===
                            laporan.tanggal[0]?.endDate && (
                              <span>
                                {formatDate(laporan.tanggal[0]?.startDate)}
                              </span>
                            )}
                          {laporan.tanggal[0]?.startDate !== null &&
                            laporan.tanggal[0]?.endDate !== null &&
                            laporan.tanggal[0]?.startDate !==
                            laporan.tanggal[0]?.endDate && (
                              <span>
                                {formatDateRange(
                                  laporan.tanggal[0]?.startDate,
                                  laporan.tanggal[0]?.endDate
                                )}
                              </span>
                            )}
                        </div>
                      </div> */}
                      <div className="flex">
                        <div className="title w-[20%]">Jam</div>
                        <div className="title w-[5%]">:</div>
                        <div className="title w-[75%]">
                          {getTime(laporan.waktu)} WIB
                        </div>
                      </div>
                      <div className="flex">
                        <div className="title w-[20%]">Tempat</div>
                        <div className="title w-[5%]">:</div>
                        <div className="title w-[75%]">
                          {laporan.lokasi.split(', ').map((el: any, i: number) => (
                            <div>{el}</div>
                          ))}
                        </div>
                      </div>
                      <div className="flex">
                        <div className="title w-[20%]">Pimpinan</div>
                        <div className="title w-[5%]">:</div>
                        <div className="title w-[75%]">
                          {laporan.pimpinan_rapat}
                        </div>
                      </div>
                      <div className="flex">
                        <div className="title w-[20%]">Peserta Rapat</div>
                        <div className="title w-[5%]">:</div>
                        <div className="title w-[75%]">
                          {laporan.peserta_rapat.map((el: any, i: number) => (
                            <>
                              {laporan.peserta_rapat.length > 1 ? (
                                <div className="flex space-x-2">
                                  <div className="mr-3">{i + 1} .</div>
                                  <div>{el.nama}</div>
                                </div>
                              ) : (
                                <div>{el.nama}</div>
                              )}
                            </>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="penjelasan-rapat flex-col">
                  <div className="title font-bold text-black dark:text-white text-title-ss mt-12 ml-4">
                    Hasil Rapat
                  </div>
                  <div className="body text-black dark:text-white text-title-xsm mt-4 ml-4 ">
                    {laporan.isi_rapat !== undefined && <Blocks data={JSON.parse(laporan.isi_rapat)} config={{
                      list: {
                        className: "list-decimal text-title-ss2 ml-10"
                      },
                      paragraph: {
                        className: "text-base text-title-ss2 text-opacity-75",
                        actionsClassNames: {
                          alignment: "text-{alignment}",
                        }
                      }
                    }} />}
                  </div>
                </div>
                <div className="penjelasan-rapat flex-col">
                  <div className="title font-bold text-black dark:text-white text-title-ss mt-12 ml-4">
                    Rencana Tindak Lanjut
                  </div>
                  <div className="body text-black dark:text-white text-title-xsm mt-4 ml-4 ">
                    {laporan.tindak_lanjut !== undefined && <Blocks data={JSON.parse(laporan.tindak_lanjut)} config={{
                      list: {
                        className: "list-decimal text-title-ss2 ml-10"
                      },
                      paragraph: {
                        className: "text-base text-title-ss2 text-opacity-75",
                        actionsClassNames: {
                          alignment: "text-{alignment}",
                        }
                      }
                    }} />}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-4">
              <div className="flex flex-col items-center justify-between text-center w-[45%] h-[20em]">
                <div className="mt-[10em]">
                  <div className="font-bold text-black dark:text-white text-title-ss2">
                    Mengetahui,
                  </div>
                  <div className="font-bold text-black dark:text-white text-title-ss2 mt-1">
                    {laporan.atasan?.jabatan}
                  </div>
                </div>
                {laporan.signature_atasan !== null && (
                  <img src={laporan.signature_atasan} className="max-w-[180px] max-h-[60px]" alt="TTD" />
                )}
                <div>
                  <div className="font-bold text-black dark:text-white text-title-ss2 border-b border-black">
                    {laporan.atasan.nama}
                  </div>
                  <div className="text-black dark:text-white text-title-ss2 mt-1">
                    {" "}
                    {laporan.atasan?.namaPangkat}{" "}
                  </div>
                  <div className="font-bold text-black dark:text-white text-title-ss2 mt-1">
                    NIP. {laporan.atasan?.nip}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-between text-center w-[45%] h-[20em]">
                <div className="text-right mt-12">
                  <div className="text-black dark:text-white text-title-ss2">
                    Madiun, {laporan.tanggal_surat.split(', ')[1]}
                  </div>
                </div>
                <div className="">
                  <div className="font-bold text-black dark:text-white text-title-ss2">
                    Yang Melapor,
                  </div>
                </div>
                {laporan.Pegawai === null ? (
                  <div>
                    {laporan.signature !== '-' || laporan.signature !== null && (
                      <div>
                        <img src={laporan.signature} className="max-w-[180px] max-h-[60px]" alt="TTD" />
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-black dark:text-white text-title-ss2 border-b border-black">
                        {laporan.Uuid.Pegawai?.nama}
                      </div>
                      <div className="text-black dark:text-white text-title-ss mt-1">
                        {" "}
                        {laporan.Uuid.Pegawai?.nama_pangkat}{" "}
                      </div>
                      <div className="font-bold text-black dark:text-white text-title-ss mt-1">
                        NIP. {laporan.Uuid.Pegawai?.nip}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {laporan.signature !== '-' || laporan.signature !== null && (
                      <div>
                        <img src={laporan.signature} className="max-w-[180px] max-h-[60px]" alt="TTD" />
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-black dark:text-white text-title-ss2 border-b border-black">
                        {laporan.Pegawai?.nama}
                      </div>
                      <div className="text-black dark:text-white text-title-ss mt-1">
                        {" "}
                        {laporan.Pegawai?.nama_pangkat}{" "}
                      </div>
                      <div className="font-bold text-black dark:text-white text-title-ss mt-1">
                        NIP. {laporan.Pegawai?.nip}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </React.Fragment>
  );
};

export default withAuth(CetakNotulen);
