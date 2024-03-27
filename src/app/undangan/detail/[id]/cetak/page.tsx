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
import Loading from "@/components/global/Loading/loading";
import { shallowEqual, useSelector } from "react-redux";
import { State } from "@/store/reducer";

const CetakUndangan = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  const [laporan, setLaporan] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const printRef: any = useRef();

  const { profile } = useSelector((state: State) => ({
    profile: state.profile.profile,
  }), shallowEqual);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const response = await fetchApi({
      url: `/undangan/getUndanganDetail/${id}`,
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

  function getDayOfWeek(dateString: string) {
    const date = new Date(dateString);
    const options: any = { weekday: "long" };
    return date.toLocaleDateString("id-ID", options);
  }

  return (
    <React.Fragment>
      {loading ? (
        <Loading loading={loading} setLoading={setLoading} />
      ) : (
        laporan.length != 0 && (
          <>
            <button
              className="border border-xl-base rounded-md px-4 py-1 flex items-center gap-2 bg-white dark:bg-meta-4 dark:text-white mb-2 hover:shadow-md hover:cursor-pointer mt-8"
              onClick={handlePrint}
            >
              <BsPrinter size={20} />
            </button>
            <div
              className="cetak-wrapper bg-white dark:bg-meta-4 px-8"
              id="container"
              ref={printRef}
            >
              <div className="main-layer">
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
                  <div className="flex justify-between mt-8">
                    <div></div>
                    <div className="text-right">
                      <div className="text-black dark:text-white text-title-ss2">
                        Madiun, {laporan.Uuid.hari} {formatMonth[laporan.Uuid.bulan - 1]} {laporan.Uuid.tahun}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-6 text-title-ss2 text-black font-medium">
                    <div className="flex flex-col w-[50%]">
                      <div className="flex gap-2 w-full">
                        <div className="w-[20%]">
                          Nomor
                        </div>
                        <div className="w-[5%]">:</div>
                        <div className="w-[70%]">
                          {laporan.nomor_surat !== null ? (
                            <div className="flex">
                              <div>{laporan.nomor_surat.split('/')[0]}/</div>
                              <div className="ml-10">{laporan.nomor_surat.split('/')[1]}/</div>
                              <div>{laporan.nomor_surat.split('/')[2]}/</div>
                              <div>{laporan.nomor_surat.split('/')[3]}</div>
                            </div>
                          ) : '-'}
                        </div>
                      </div>
                      <div className="flex gap-2 w-full">
                        <div className="w-[20%]">
                          Sifat
                        </div>
                        <div className="w-[5%]">:</div>
                        <div className="w-[70%]">
                          {laporan.sifat !== null ? laporan.sifat : '-'}
                        </div>
                      </div>
                      <div className="flex gap-2 w-full">
                        <div className="w-[20%]">
                          Lampiran
                        </div>
                        <div className="w-[5%]">:</div>
                        <div className="w-[70%]">
                          {JSON.parse(laporan.lampiran).length != 0 ? `${JSON.parse(laporan.lampiran).length} lembar` : '-'}
                        </div>
                      </div>
                      <div className="flex gap-2 w-full">
                        <div className="w-[20%]">
                          Perihal
                        </div>
                        <div className="w-[5%]">:</div>
                        <div className="w-[70%]">
                          {laporan.perihal !== null ? laporan.perihal : '-'}
                        </div>
                      </div>
                    </div>
                    {laporan.ditujukan !== null ? (
                      <div className="flex flex-col w-[50%] pl-[10%] text-left">
                        <div className="pl-[31px]">Kepada</div>
                        <div className="flex gap-2">
                          <div>Yth.</div>
                          <div>
                            {laporan.ditujukan.map((el: any, i: number) => (
                              <>
                                {laporan.ditujukan.length > 1 ? (
                                  <div className="flex space-x-2">
                                    <div className="mr-1">{i + 1}</div>
                                    <div>{el.nama}</div>
                                  </div>
                                ) : (
                                  <div>{el.nama}</div>
                                )}
                              </>
                            ))}
                          </div>
                        </div>
                        <div className="pl-[36px]">di -</div>
                        <div className="pl-[60px]">MADIUN</div>
                      </div>
                    ) : '-'}
                  </div>
                  <div className="body mt-8 text-title-ss2">
                    <div className="text-black dark:text-white mt-3 ml-4 text-justify indent-10 ml-[12%]">
                      {laporan?.pendahuluan !== null && <Blocks data={JSON.parse(laporan?.pendahuluan)} config={{
                        list: {
                          className: "list-decimal ml-10 text-title-ss2"
                        },
                        paragraph: {
                          className: "text-base text-title-ss2 text-opacity-75",
                          actionsClassNames: {
                            alignment: "text-justify",
                          }
                        }
                      }} />}
                    </div>
                    <div className="text-black dark:text-white mt-3 ml-4 text-justify indent-10 ml-[12%]">
                      {laporan?.isi_undangan !== null && <Blocks data={JSON.parse(laporan?.isi_undangan)} config={{
                        list: {
                          className: "list-decimal ml-10 text-title-ss2"
                        },
                        paragraph: {
                          className: "text-base text-title-ss2 text-opacity-75",
                          actionsClassNames: {
                            alignment: "text-justify",
                          }
                        }
                      }} />}
                    </div>
                    <div className="flex flex-col mt-4 text-black ml-[12%]">
                      <div className="flex gap-2 w-full">
                        <div className="w-[25%]">
                          Hari/Tanggal
                        </div>
                        <div className="w-[5%]">:</div>
                        <div className="w-[70%]">
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
                      <div className="flex gap-2 w-full">
                        <div className="w-[25%]">
                          Waktu
                        </div>
                        <div className="w-[5%]">:</div>
                        <div className="w-[70%]">
                          {getTime(laporan.waktu)} WIB
                        </div>
                      </div>
                      <div className="flex gap-2 w-full">
                        <div className="w-[25%]">
                          Tempat :
                        </div>
                        <div className="w-[5%]">:</div>
                        <div className="w-[70%]">
                          <div className="flex flex-col">
                            {laporan.lokasi.split(', ').map((el: any, i: number) => (
                              <div>{el}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full">
                        <div className="w-[25%]">
                          Acara
                        </div>
                        <div className="w-[5%]">:</div>
                        <div className="w-[70%]">
                          {laporan.acara}
                        </div>
                      </div>
                      {laporan?.catatan !== null && (
                        <div className="flex gap-2 w-full">
                          <div className="w-[25%]">
                            Catatan
                          </div>
                          <div className="w-[5%]">:</div>
                          <div className="w-[70%]">
                            <div className="text-black dark:text-white text-title-xsm text-justify indent-10">
                              {laporan?.catatan !== null && <Blocks data={JSON.parse(laporan?.catatan)} config={{
                                list: {
                                  className: "list-decimal text-title-ss2 text-title-ss"
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
                        </div>
                      )}
                    </div>
                    <div className="text-black dark:text-white text-title-xsm mt-3 ml-4 text-justify indent-10 ml-[12%] mt-4">
                      {laporan?.penutup !== null && <Blocks data={JSON.parse(laporan?.penutup)} config={{
                        list: {
                          className: "list-decimal text-title-ss2 ml-10"
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
                  <div className="footer flex justify-between mt-10">
                    <div></div>
                    <div className="flex flex-col items-center justify-between text-center w-[45%] h-[13em]">
                      <div>
                        <div className="font-bold text-black dark:text-white text-title-ss2 mt-1">
                          {profile.Perangkat_Daerah.kepala_opd.jabatan}
                        </div>
                      </div>
                      {laporan.signature_atasan !== "-" || laporan.signature_atasan !== null && (
                        <img src={laporan.signature_atasan} className="w-[270px]" alt="TTD" />
                      )}
                      <div>
                        <div className="font-bold text-black dark:text-white text-title-ss2 border-b border-black">
                          {profile.Perangkat_Daerah.kepala_opd.nama}
                        </div>
                        <div className="text-black dark:text-white text-title-ss2 mt-1">
                          {" "}
                          {profile.Perangkat_Daerah.kepala_opd.namaPangkat}{" "}
                        </div>
                        <div className="font-bold text-black dark:text-white text-title-ss2 mt-1">
                          NIP. {profile.Perangkat_Daerah.kepala_opd.nip}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {laporan.lampiran && (
                <div className="second-layer text-black">
                  {JSON.parse(laporan.lampiran).map((el: any, i: number) => (
                    <div className="pagebreak" key={i}>
                      <div className="text-title-xsm font-bold uppercase text-center">Lampiran</div>
                      <div className="text-black dark:text-white text-title-xsm text-justify indent-10 mt-8">
                        {<Blocks data={el} config={{
                          list: {
                            className: "list-decimal text-title-ss2 ml-14 text-black"
                          },
                          paragraph: {
                            className: "text-base text-title-ss2 text-opacity-75 my-3 text-black",
                            actionsClassNames: {
                              alignment: "text-justify",
                            }
                          }
                        }} />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )
      )}
    </React.Fragment>
  )
}

export default withAuth(CetakUndangan);