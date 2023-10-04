import React, { useState, useEffect } from "react";
import TextInput from "./input";
import { IoIosClose, IoMdCloseCircle } from "react-icons/io";
import { FiMapPin } from "react-icons/fi";
import { useSelector, shallowEqual } from "react-redux";
import { State } from "store/reducer";
interface type {
  change?: any;
  data?: any;
  source?: any;
  label?: string;
  name?: string;
  id?: string;
  value?: string;
  setValue?: any;
  isDelete?: any;
  limit?:number
}
export default function AddressField({
  source,
  change,
  data,
  label,
  name,
  id,
  value,
  setValue,
  isDelete,
  limit=20
}: type) {
  const { delivery } = useSelector(
    (state: State) => ({
      delivery: state.delivery,
    }),
    shallowEqual
  );
  const [hidden, setHidden] = useState<string>("");

  const [active, setActive] = useState<boolean>(false);
  const [warning, setWarning] = useState<boolean>(false);

  const [datasource, setDataSource] = useState<any>();

  useEffect(() => {
    setDataSource(source);
  }, []);

  useEffect(() => {
    setDataSource(source);
    if (datasource?.length) {
      let filter_query = new RegExp(value ?? "", "gi");
      const filter = datasource?.filter((item: any) => {
        let text = item?.text?.toLowerCase();
        text = text?.replaceAll(" ", "");
        return text?.match(filter_query);
      });

      if (filter?.length) {
        setDataSource(filter);
      }
    } else {
      setDataSource(source);
    }
  }, [value]);

  useEffect(() => {
    if (hidden) {
      change(value);
    } else {
      setValue("");
      change("");
    }
  }, [hidden]);

  const handleWarning = () => {
    if (name == "province") {
      if (!datasource) {
        setWarning(true);
      }
    }
    if (name == "city") {
      if (!delivery.province) {
        setWarning(true);
      }
    }
    if (name == "district") {
      if (!delivery?.city?.name) {
        setWarning(true);
      }
    }
    if (name == "sub-district") {
      if (!delivery?.district) {
        setWarning(true);
      }
    }
  };
  console.log
  return (
    <div
      className={`relative border-light-grey border-2 w-full rounded-xl font-Museo text-light-grey`}
    >
      <input type="hidden" value={hidden} />
      <input
        autoComplete={"off"}
        id={id}
        name={name}
        type="text"
        onFocus={(e) => {
          setDataSource(source);
          setActive(true);
          setValue(value);
          change(e);
          handleWarning();
        }}
        placeholder="Silahkan ketik untuk mencari lokasi"
        onBlur={() => {
          if (!hidden) {
            setValue("");
          }
          let timer = setTimeout(() => {
            setActive(false);
            clearTimeout(timer);
          }, 200);
          setWarning(false);
        }}
        value={value}
        className={`block w-full text-base  border-none min-h-[59] p-4 rounded-xl outline-none bg-transparent appearance-none focus:outline-none focus:ring-0 peer text-gray-900 border-gray-300 focus:border-gray-400`}
        onChange={(e: any) => {
          setValue(e.target.value);
          setHidden("");
        }}
      />
      {value && (
        <button
          type="button"
          className="btn-close"
          onClick={() => {
            if (isDelete) {
              isDelete(true);
            }
            setValue("");
            setHidden("");
          }}
        >
          <IoIosClose size={35} />
        </button>
      )}
      <label
        htmlFor={id}
        className={`absolute mx-1 text-base duration-300 transform -translate-y-4 scale-75 w-auto top-1 text-black z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-2 peer-placeholder-shown:text-base peer-placeholder-shown:left-2 peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:w-11/12 peer-focus:top-1 peer-focus:w-auto peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:left-3 peer-focus:text-base left-3 peer-focus:text-black  `}
      >
        {label}
      </label>

      {active && (
        <div className={`relative mx-0`}>
          <div className="absolute z-[99] -top-2 w-[100.90%] md:w-[100.60%] -ml-[2px] pr-[4px] bg-white rounded-b-xl border-light-grey border-2 border-t-[1px] shadow-2xl ">
            <div className="p-3 overflow-y-auto max-h-[50dvh]">
              <ul className="flex flex-col gap-2">
                {!warning && datasource &&  (
                  <p className="text-slate-500 text-sm">Pilih Lokasi</p>
                )}
                {datasource?.length != 0 &&
                  datasource?.map((item: any, index: number) => (
                    <li
                      key={index}
                      className="flex flex-row items-center justify-start gap-2 cursor-pointer"
                      onClick={() => {
                        setValue(item.text);
                        setHidden(item.text);
                        data(item);
                      }}
                    >
                      <FiMapPin size={15} />{" "}
                      {name == "city" && <>{item.type}</>} {item.text}
                    </li>
                  ))}

                {warning && !datasource && (
                  <>
                    {name == "province" ? (
                      <li className="flex flex-row items-center justify-start gap-2 cursor-pointer">
                        <span className="text-red-600">
                          <IoMdCloseCircle size={20} />
                        </span>
                        <span className="text-xs md:text-sm">
                          Lokasi tidak ditemukan.
                        </span>
                      </li>
                    ) : (
                      <li className="flex flex-row items-center justify-start gap-2 cursor-pointer">
                        <span className="text-red-600">
                          <IoMdCloseCircle size={20} />
                        </span>
                        <span className="text-xs md:text-sm">
                          Lokasi tidak ditemukan. Pastikan Anda sudah mengisi
                          lokasi/alamat secara berurutan
                        </span>
                      </li>
                    )}
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
