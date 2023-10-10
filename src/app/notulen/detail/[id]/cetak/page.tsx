"use client";
import React from "react";
import { useEffect, useState, useRef } from "react";
import generatePDF, { Resolution, Margin, Options } from "react-to-pdf";
import { useReactToPrint } from "react-to-print";
import { fetchApi } from "@/components/mixins/request";
import { OutputData } from "@editorjs/editorjs";
import Swal from "sweetalert2";
import { BsPrinter } from "react-icons/bs";
import { formatDate, getTime } from "@/components/hooks/formatDate";
import Laporan from "@/app/notulen/laporan/page";
import withAuth from "@/components/hocs/withAuth";
import edjsHTML from "editorjs-html";
import Blocks from 'editorjs-blocks-react-renderer';

const editorJsHtml = require("editorjs-html");
const EditorJsToHtml = editorJsHtml();



type ParsedContent = string | JSX.Element;

const CetakNotulen = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  const [laporan, setLaporan] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const edjsParser = edjsHTML();
  let htmlIsiRapat = laporan.isi_rapat !== undefined && edjsParser.parse(JSON.parse(laporan.isi_rapat));
  // const blocks = (EditorJsToHtml.parse(htmlIsiRapat.blocks) as ParsedContent[])
  // if (laporan.isi_rapat !== undefined) {
  //   htmlIsiRapat = 
  //   // console.log(HTML, '<<<<');

  // }


  const htmlTindakLanjut = laporan?.tindak_lanjut !== undefined && (EditorJsToHtml.parse(JSON.parse(laporan?.tindak_lanjut)) as ParsedContent[]);
  // const edjsParser = edjsHTML();
  // const htmlParse = edjsParser.parse(laporan.isi_rapat);
  // console.log(laporan.isi_rapat, '>>>>>');


  const printRef: any = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const html = laporan.length != 0 && (EditorJsToHtml.parse(JSON.parse(laporan?.isi_rapat)) as ParsedContent[]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetchApi({
      url: `/notulen/getNotulenDetail/${id}`,
      method: "get",
      type: "auth",
    });
    console.log(response);

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

  const options: Options = {
    filename: "laporan-notulen.pdf",
    method: "save",
    // default is Resolution.MEDIUM = 3, which should be enough, higher values
    // increases the image quality but also the size of the PDF, so be careful
    // using values higher than 10 when having multiple pages generated, it
    // might cause the page to crash or hang.
    resolution: Resolution.EXTREME,
    page: {
      // margin is in MM, default is Margin.NONE = 0
      margin: Margin.SMALL,
      // default is 'A4'
      format: "A4",
      // default is 'portrait'
      orientation: "portrait",
    },
    canvas: {
      // default is 'image/jpeg' for better size performance
      mimeType: "image/jpeg",
      qualityRatio: 1,
    },
    // Customize any value passed to the jsPDF instance and html2canvas
    // function. You probably will not need this and things can break,
    // so use with caution.
    overrides: {
      // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
      pdf: {
        compress: true,
      },
      // see https://html2canvas.hertzen.com/configuration for more options
      canvas: {
        useCORS: true,
      },
    },
  };

  const getTargetElement = () => document.getElementById("container");

  const downloadPdf = () => generatePDF(getTargetElement, options);

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
      {laporan.length != 0 && (
        <>
          <button
            className="border border-xl-base rounded-md w-[10%] px-4 py-1 flex items-center gap-2 bg-white dark:bg-meta-4 dark:text-white mb-2 hover:shadow-md hover:cursor-pointer mt-8"
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
                    className="w-[110px] h-auto"
                  />
                </div>
                <div className="title text-center flex-col space-y-[1px] w-[80%]">
                  <div className="text-black dark:text-white font-bold text-title-sm">
                    PEMERINTAH KOTA MADIUN
                  </div>
                  <div className="text-black dark:text-white font-bold text-title-ss uppercase">
                    {/* {laporan?.Pegawai?.Perangkat_Daerah?.nama_opd} */}
                    BADAN PERENCANAAN, PENELITIAN DAN PEMBANGUNAN DAERAH
                  </div>
                  <div className="text-black dark:text-white font-bold text-title-xsm tracking-widest">
                    {/* ({laporan?.Pegawai?.Perangkat_Daerah?.singkatan}) */}
                    (BAPPELITBANGDA)
                  </div>
                  <div className="text-black dark:text-white font-bold text-title-ss">
                    {/* {laporan?.Pegawai?.Perangkat_Daerah?.alamat} */}
                    Jl Mayjen Panjaitan No. 17 Lt II, Kode Pos: 63137, Jawa
                    Timur
                  </div>
                  <div className="text-black dark:text-white font-bold text-title-ss">
                    TELP : ( 0351 ) 471535 / FAX: ( 0351 ) 471535
                    {/* TELP : {laporan?.Pegawai?.Perangkat_Daerah?.telepon}/FAX. {laporan?.Pegawai?.Perangkat_Daerah?.faximile} */}
                  </div>
                  <div className="text-black dark:text-white text-title-ss">
                    {/* Website : {laporan?.Pegawai?.Perangkat_Daerah?.website} */}
                    Website : http://www. madiunkota.go.id
                  </div>
                </div>
              </div>
            </div>
            <div className="line border-2 border-black mt-[2px]"></div>
            <div className="body border-t border-black mt-[2px] flex flex-col">
              <div className="title font-bold text-title-sm flex flex-col space-y-2 py-12 text-black dark:text-white text-center">
                <div>LAPORAN</div>
                <div>{laporan.acara}</div>
              </div>
              <div className="body">
                <div className="pendahuluan flex-col">
                  <div className="text-black dark:text-white text-title-sm">
                    I. Pendahuluan
                  </div>
                  <div className="text-black dark:text-white text-title-xsm mt-3 ml-4 text-justify">
                    {laporan.pendahuluan}
                  </div>
                </div>
                <div className="pendahuluan flex-col">
                  <div className="text-black dark:text-white text-title-sm mt-12">
                    II. Isi Laporan
                  </div>
                  <div className="text-black dark:text-white text-title-xsm mt-3 ml-4">
                    Rapat dilaksanakan pada :
                    <div className="flex flex-col space-y-1 mt-2">
                      <div className="flex">
                        <div className="title w-[20%]">Hari</div>
                        <div className="title w-[5%]">:</div>
                        <div className="title w-[75%]">
                          {getDayOfWeek(laporan.tanggal[0]?.startDate)}
                        </div>
                      </div>
                      <div className="flex">
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
                      </div>
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
                        <div className="title w-[75%]">{laporan.lokasi}</div>
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
                  <div className="title font-bold text-black dark:text-white text-title-sm mt-12 ml-4">
                    Penjelasan Rapat
                  </div>
                  <div className="body text-black dark:text-white text-title-xsm mt-4 ml-4 ">
                    {laporan.isi_rapat !== undefined && <Blocks data={JSON.parse(laporan.isi_rapat)} config={{
                      list: {
                        className: "list-decimal"
                      },
                      paragraph: {
                        className: "text-base text-opacity-75",
                        actionsClassNames: {
                          alignment: "text-{alignment}",
                        }
                      }
                    }} />}
                  </div>
                </div>
                <div className="penjelasan-rapat flex-col">
                  <div className="title font-bold text-black dark:text-white text-title-sm mt-12 ml-4">
                    Tindak Lanjut
                  </div>
                  <div className="body text-black dark:text-white text-title-xsm mt-4 ml-4 ">
                    {laporan.tindak_lanjut !== undefined && <Blocks data={JSON.parse(laporan.tindak_lanjut)} config={{
                      list: {
                        className: "list-decimal"
                      },
                      paragraph: {
                        className: "text-base text-opacity-75",
                        actionsClassNames: {
                          alignment: "text-{alignment}",
                        }
                      }
                    }} />}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right mt-12">
              <div className="text-black dark:text-white text-title-xsm">
                Madiun, {formatDate(laporan.createdAt).split(", ")[1]}
              </div>
            </div>
            <div className="flex items-center justify-between px-4">
              <div className="flex flex-col text-center">
                <div className="font-bold text-black dark:text-white text-title-ss mt-12">
                  Mengetahui,
                </div>
                <div className="font-bold text-black dark:text-white text-title-ss mt-1">
                  {laporan.atasan?.jabatan}
                </div>
                <div className="font-bold text-black dark:text-white text-title-ss mt-[120px] border-b border-black">
                  {laporan.atasan?.nama}
                </div>
                <div className="text-black dark:text-white text-title-ss mt-1">
                  {" "}
                  {laporan.atasan?.nama_pangkat}{" "}
                </div>
                <div className="font-bold text-black dark:text-white text-title-ss mt-1">
                  NIP. {laporan.atasan?.nip}
                </div>
              </div>
              <div className="flex flex-col text-center">
                <div className="font-bold text-black dark:text-white text-title-ss mt-[60px]">
                  Yang Melapor,
                </div>
                <div className="font-bold text-black dark:text-white text-title-ss mt-[120px] border-b border-black">
                  {laporan.pelapor?.nama}
                </div>
                <div className="text-black dark:text-white text-title-ss mt-1">
                  {laporan.pelapor?.nama_pangkat}
                </div>
                <div className="font-bold text-black dark:text-white text-title-ss mt-1">
                  NIP. {laporan.pelapor?.nip}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </React.Fragment>
  );
};

export default withAuth(CetakNotulen);
