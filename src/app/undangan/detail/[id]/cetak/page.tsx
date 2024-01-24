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

const CetakUndangan = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  const [laporan, setLaporan] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  console.log(laporan, '???');

  const printRef: any = useRef();

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
                  <div className="text-black dark:text-white text-title-xsm">
                    Madiun, {laporan.Uuid.hari} {formatMonth[laporan.Uuid.bulan - 1]} {laporan.Uuid.tahun}
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-6 text-title-xsm2 text-black font-medium">
                <div className="flex flex-col w-[50%]">
                  <div className="flex gap-2 w-full">
                    <div className="w-[25%]">
                      Nomor :
                    </div>
                    <div className="w-[70%]">
                      {laporan.nomor_surat}
                    </div>
                  </div>
                  <div className="flex gap-2 w-full">
                    <div className="w-[25%]">
                      Sifat :
                    </div>
                    <div className="w-[70%]">
                      {laporan.sifat}
                    </div>
                  </div>
                  <div className="flex gap-2 w-full">
                    <div className="w-[25%]">
                      Lampiran :
                    </div>
                    <div className="w-[70%]">
                      -
                    </div>
                  </div>
                  <div className="flex gap-2 w-full">
                    <div className="w-[25%]">
                      Nomor :
                    </div>
                    <div className="w-[70%]">
                      {laporan.perihal}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-[50%] pl-[20%] text-left">
                  <div className="pl-[30px]">Kepada</div>
                  <div>Yth. {laporan.ditujukan}</div>
                  <div className="pl-[30px]">di -</div>
                  <div className="pl-[60px]">MADIUN</div>
                </div>
              </div>
              <div className="body mt-8">
                <div className="text-black dark:text-white text-title-xsm mt-3 ml-4 text-justify">
                  {laporan?.pendahuluan !== undefined && <Blocks data={JSON.parse(laporan?.pendahuluan)} config={{
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
          </div>
        </>
      )}
    </React.Fragment>
  )
}

export default withAuth(CetakUndangan);