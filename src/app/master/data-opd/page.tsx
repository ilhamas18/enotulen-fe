import Breadcrumb from "@/components/global/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Data Master - Perangkat Daerah"
}

const DataMasterOPD = () => {
  return (
    <>
      <Breadcrumb pageName="Data Perangkat Daerah" />
      <div>Ini Page Data OPD</div>
    </>
  )
}

export default DataMasterOPD