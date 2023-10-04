import { useRouter, usePathname } from "next/navigation";
import { formatDate } from "@/components/hooks/formatDate"
import { getTime } from "@/components/hooks/formatDate"
import { OutputData } from "@editorjs/editorjs"
import { BsPrinter } from "react-icons/bs";
import TextInput from "@/components/common/text-input/input";
import Select from 'react-select'

const editorJsHtml = require("editorjs-html");
const EditorJsToHtml = editorJsHtml();

type Props = {
  data: OutputData;
};
type ParsedContent = string | JSX.Element;

interface DetailProps {
  data: any,
  tagging: any
}

const NotulenDetailProps = ({ data, tagging }: DetailProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const htmlIsiRapat = EditorJsToHtml.parse(JSON.parse(data?.isi_rapat)) as ParsedContent[];
  const htmlTindakLanjut = EditorJsToHtml.parse(JSON.parse(data?.tindak_lanjut)) as ParsedContent[];

  const handlePrint = () => router.push(`${pathname}/cetak`);

  const handleChange = (data: any) => {
    console.log(data);

  }

  return (
    <>
      <div className="border border-xl-base rounded-md w-[10%] px-4 py-1 flex items-center gap-2 bg-white mb-2 hover:shadow-md hover:cursor-pointer mt-8" onClick={handlePrint}>
        <BsPrinter size={20} />
        <div>Cetak</div>
      </div>
      <div className="detail-wrap bg-white dark:bg-meta-4 rounded-lg p-8">
        <div className="data flex flex-row mb-8">
          <Select
            isMulti
            name="colors"
            options={tagging}
            className="basic-multi-select w-full"
            classNamePrefix="select"
          />
          {/* <TextInput
            type="dropdown"
            id="pelapor"
            name="pelapor"
            label="Nama Pelapor"
            placeholder="Ketik dan pilih tagging"
            options={tagging}
            change={(selectedOption: any) => {
              handleChange({
                target: { name: "pelapor", value: selectedOption }
              })
            }}
          /> */}
        </div>
        <div className="flex flex-col gap-4">
          <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
            <div className="text-label md:w-[20%] w-full md:text-left text-center">Pembuat Notulen</div>
            <div className="md:mt-0 mt-2 md:w-[75%] w-full">
              <div className='flex border-2 border-light-gray rounded-lg w-full py-3 px-4'>
                {data.Pegawai?.nama}
              </div>
            </div>
          </div>
          <div className="body flex md:flex-row flex-col items-center justify-between">
            <div className="text-label md:w-[20%] w-full md:text-left text-center">Hari / Tanggal</div>
            <div className="md:mt-0 mt-2 md:w-[75%] w-full">
              <div className='flex border-2 border-light-gray rounded-lg w-full py-3 px-4'>
                <div className='flex gap-4'>
                  {data.tanggal[0]?.startDate !== null && <span>{formatDate(data.tanggal[0]?.startDate)}</span>}
                  {data.tanggal[0]?.endDate !== null && data.tanggal[0]?.endDate !== data.tanggal[0]?.startDate && (
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
            <div className="text-label md:w-[20%] w-full md:text-left text-center">Waktu</div>
            <div className="md:mt-0 mt-2 md:w-[75%] w-full">
              <div className='flex border-2 border-light-gray rounded-lg w-full py-3 px-4'>
                {getTime(data.waktu)}
              </div>
            </div>
          </div>
          <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
            <div className="text-label md:w-[20%] w-full md:text-left text-center">Acara</div>
            <div className="md:mt-0 mt-2 md:w-[75%] w-full">
              <div className='flex border-2 border-light-gray rounded-lg w-full py-3 px-4'>
                {data.acara}
              </div>
            </div>
          </div>
          <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
            <div className="text-label md:w-[20%] w-full md:text-left text-center">Tempat / Lokasi</div>
            <div className="md:mt-0 mt-2 md:w-[75%] w-full">
              <div className='flex border-2 border-light-gray rounded-lg w-full py-3 px-4'>
                {data.lokasi}
              </div>
            </div>
          </div>
          <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
            <div className="text-label md:w-[20%] w-full md:text-left text-center">Pendahuluan</div>
            <div className="md:mt-0 mt-2 md:w-[75%] w-full">
              <div className='flex border-2 border-light-gray rounded-lg w-full py-3 px-4'>
                {data.pendahuluan}
              </div>
            </div>
          </div>
          <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
            <div className="text-label md:w-[20%] w-full md:text-left text-center">Pimpinan Rapat</div>
            <div className="md:mt-0 mt-2 md:w-[75%] w-full">
              <div className='flex border-2 border-light-gray rounded-lg w-full py-3 px-4'>
                {data.pimpinan_rapat}
              </div>
            </div>
          </div>
          <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
            <div className="text-label md:w-[20%] w-full md:text-left text-center">Peserta Rapat</div>
            <div className="md:mt-0 mt-2 md:w-[75%] w-full">
              <div className='flex border-2 border-light-gray rounded-lg w-full py-3 px-4'>
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
            <div className="text-label md:w-[20%] w-full md:text-left text-center">Isi Rapat</div>
            <div className="md:mt-0 mt-2 md:w-[75%] w-full">
              <div className='flex border-2 border-light-gray rounded-lg w-full py-3 px-4'>
                <div dangerouslySetInnerHTML={{ __html: htmlIsiRapat }}></div>
              </div>
            </div>
          </div>
          <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
            <div className="text-label md:w-[20%] w-full md:text-left text-center">Isi Rapat</div>
            <div className="md:mt-0 mt-2 md:w-[75%] w-full">
              <div className='flex border-2 border-light-gray rounded-lg w-full py-3 px-4'>
                <div dangerouslySetInnerHTML={{ __html: htmlTindakLanjut }}></div>
              </div>
            </div>
          </div>
          <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
            <div className="text-label md:w-[20%] w-full md:text-left text-center">Pelapor</div>
            <div className="md:mt-0 mt-2 md:w-[75%] w-full">
              <div className='flex border-2 border-light-gray rounded-lg w-full py-3 px-4'>
                <div className="flex flex-col w-full">
                  <div className="flex gap-3">
                    <div className="w-[15%]">Nama</div>
                    <div className="w-[5%]">:</div>
                    <div className="w-[80%]">{data.pelapor.nama}</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-[15%]">NIP</div>
                    <div className="w-[5%]">:</div>
                    <div className="w-[80%]">{data.pelapor.nip}</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-[15%]">Pangkat</div>
                    <div className="w-[5%]">:</div>
                    <div className="w-[80%]">{data.pelapor.pangkat}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="body flex flex-row md:flex-row flex-col items-center justify-between">
            <div className="text-label md:w-[20%] w-full md:text-left text-center">Atasan</div>
            <div className="md:mt-0 mt-2 md:w-[75%] w-full">
              <div className='flex border-2 border-light-gray rounded-lg w-full py-3 px-4'>
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
        </div>
      </div>
    </>
  )
}

export default NotulenDetailProps