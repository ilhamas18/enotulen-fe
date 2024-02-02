'use client';
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarLinkGroup from "./SiderbarLinkGroup";
import { RxDashboard } from "react-icons/rx";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineDatabase } from "react-icons/ai";
import { GiPapers } from "react-icons/gi";
import { shallowEqual, useSelector } from "react-redux";
import { State } from "@/store/reducer";
import { FaRegNewspaper } from "react-icons/fa";
import { BiSolidReport } from "react-icons/bi";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [role, setRole] = useState<string>('');

  const { profile } = useSelector((state: State) => ({
    profile: state.profile.profile
  }), shallowEqual);

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  let storedSidebarExpanded = "true";
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }: any) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  useEffect(() => {
    switch (profile.role) {
      case 1:
        setRole('ADMIN KOTA')
        break;
      case 2:
        setRole('ADMIN OPD')
        break;
      case 3:
        setRole('VERIFIKATOR')
        break;
      case 4:
        setRole('USER')
        break;
      default:
        setRole('');
    }
  }, [])

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-[17em] flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-center">
        <div className="font-bold text-meta-6 text-lg lg:py-6.5 py-4">{role}</div>
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      {/* <!-- SIDEBAR HEADER --> */}
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>
            <ul className="mb-6 flex flex-col gap-1.5">

              {/* <!-- Menu Item Dashboard --> */}
              <li>
                <Link
                  href="/"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4
                          ${pathname === "/" && "bg-graydark dark:bg-meta-4"}`}
                >
                  <RxDashboard size={20} />
                  Dashboard
                </Link>
              </li>

              {/* <!-- Menu Item Master --> */}
              <div className={`${profile.role == 1 || profile.role == 2 ? 'block' : 'hidden'}`}>
                <SidebarLinkGroup
                  activeCondition={
                    pathname.includes("master")
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <Link
                          href="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4
                          ${pathname.includes("master") || pathname === "/auth/registrasi" && "bg-graydark dark:bg-meta-4"}`
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true)
                          }}
                        >
                          <AiOutlineDatabase size={20} />
                          Master
                          <IoIosArrowDown size={20} className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"}`} />
                        </Link>
                        <div className={`translate transform overflow-hidden ${!open && "hidden"}`}>
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            <li>
                              <Link
                                href="/master/data-opd"
                                className={`first-letter:group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white
                                  ${pathname.includes("/master/data-opd") && "text-white"}
                                  ${profile.role == 1 ? 'block' : 'hidden'}`}
                              >Data OPD</Link>
                            </li>
                            <li>
                              <Link
                                href="/master/data-user"
                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white
                                  ${pathname.includes("/master/data-user") || pathname === "/auth/registrasi" ? "text-white" : ""}`}
                              >Data User</Link>
                            </li>
                            <li>
                              <Link
                                href="/master/tematik"
                                className={`first-letter:group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white
                                  ${pathname === "/master/tematik" && "text-white"}`}
                              >Tematik</Link>
                            </li>
                          </ul>
                        </div>
                      </React.Fragment>
                    )
                  }}
                </SidebarLinkGroup>
              </div>

              <SidebarLinkGroup
                activeCondition={
                  pathname.includes("undangan")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <Link
                        href="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4
                          ${pathname.includes("undangan") && "bg-graydark dark:bg-meta-4"}`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <FaRegNewspaper size={20} />
                        <div className="text-title-">Undangan</div>
                        <IoIosArrowDown size={20} className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"}`} />
                      </Link>
                      <div className={`translate transform overflow-hidden ${!open && "hidden"}`}>
                        <ul className="mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link
                              href="/undangan/laporan"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/undangan/laporan" || pathname.includes('/undangan/detail') ? "text-white" : ''}`}
                            >
                              List Undangan
                            </Link>
                          </li>
                          <li className={`${profile.role == 1 ? 'block' : 'hidden'}`}>
                            <Link
                              href="/undangan/arsip"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/undangan/arsip" && "text-white"}`}
                            >
                              Permintaan Hapus
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/undangan/tambah"
                              className={`group relative flex items-center gap-2.5 mb-4 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === '/undangan/tambah' && "text-white"
                                } ${profile.role == 4 || profile.role == 3 || profile.role == 2 ? 'block' : 'hidden'}`}
                            >
                              Input Undangan
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  )
                }}
              </SidebarLinkGroup>

              {/* {profile.role == 3 || profile.role == 4 && ( */}
              <SidebarLinkGroup
                activeCondition={
                  pathname.includes("notulen")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <Link
                        href="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4
                          ${pathname.includes("notulen") && "bg-graydark dark:bg-meta-4"}`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <GiPapers size={20} />
                        <div className="text-title-">Notulen</div>
                        <IoIosArrowDown size={20} className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"}`} />
                      </Link>
                      <div className={`translate transform overflow-hidden ${!open && "hidden"}`}>
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link
                              href="/notulen/laporan"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/notulen/laporan" || pathname.includes('/notulen/detail') && "text-white"
                                } ${pathname === '/notulen/laporan' && 'text-white'} `}
                            >
                              List Notulen
                            </Link>
                          </li>
                          <li className={`${profile.role == 3 ? 'block' : 'hidden'}`}>
                            <Link
                              href="/notulen/verifikasi"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/notulen/verifikasi" && "text-white"}`}
                            >
                              Verifikasi
                            </Link>
                          </li>
                          <li className={`${profile.role == 1 ? 'block' : 'hidden'}`}>
                            <Link
                              href="/notulen/arsip"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/notulen/arsip" && "text-white"}`}
                            >
                              Permintaan Hapus
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/notulen/form"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === '/notulen/form' && "text-white"
                                } ${profile.role == 4 || profile.role == 3 || profile.role == 2 ? 'block' : 'hidden'}`}
                            >
                              Input Notulen
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  )
                }}
              </SidebarLinkGroup>

              <li>
                <Link
                  href="/laporan"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4
                          ${pathname === "/laporan" && "bg-graydark dark:bg-meta-4"}`}
                >
                  <BiSolidReport size={20} />
                  Laporan
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
