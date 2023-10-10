'use client'
import withAuth from "@/components/hocs/withAuth";
import { GrStatusWarning } from "react-icons/gr";

const Unauthorized = () => {
  return (
    <div className="w-full bg-white rounded-xl h-full px-6 py-6 gap-6 flex items-center justify-center text-center">
      <div><GrStatusWarning size={30} className="text-xl-warning" /></div>
      <div className="md:text-title-md2 text-title-sm font-medium text-xl-warning">Anda tidak diizinkan masuk ke halaman ini !</div>
    </div>
  )
}

export default withAuth(Unauthorized);