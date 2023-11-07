import Link from "next/link";
import { useEffect } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import Image from "next/image";
import { getCookie, deleteCookie } from "cookies-next";
import { fetchApi } from "@/components/mixins/request";
import { RxHamburgerMenu } from "react-icons/rx";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownUser from "./DropdownUser";
import { useSelector } from "react-redux";
import { State } from "@/store/reducer";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
  setAuthenticated: any
}) => {

  const { profile } = useSelector((state: State) => ({
    profile: state.profile.profile
  }), shallowEqual)

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const token = getCookie("refreshSession");
    if (typeof token !== "undefined") {
      const resUser = await fetchApi({
        url: "/pegawai/getProfile",
        method: "get",
        type: "auth"
      })
      if (!resUser.success) {
        deleteCookie("refreshSession");
      }
      props.setAuthenticated(true)
    } else {
      props.setAuthenticated(false)
    }
  }

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-2 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && "!w-full delay-300"
                    }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && "delay-400 !w-full"
                    }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && "!w-full delay-500"
                    }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && "!h-0 !delay-[0]"
                    }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && "!h-0 !delay-200"
                    }`}
                ></span>
              </span>
            </span>
          </button>
          {/* <Link className="block flex-shrink-0 lg:hidden" href="/">
            <RxHamburgerMenu size={32} />
          </Link> */}
        </div>

        <div className="hidden sm:block">
          <div className="flex gap-2 items-center justify-center">
            <Image src="/logo/Lambang_Kota_Madiun.png" width={30} height={25} alt="Logo Kota Madiun" />
            <div className="font-bold">{profile?.Perangkat_Daerah?.nama_opd}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          {/* <ul className="flex items-center gap-2 2xsm:gap-4">
            <DarkModeSwitcher />
          </ul> */}
          <DropdownUser setAuthenticated={props.setAuthenticated} />
        </div>
      </div>
    </header>
  )
}

export default Header;