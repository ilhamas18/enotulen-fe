"use client";
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from "@/components/global/Breadcrumbs/Breadcrumb";
import { fetchApi } from '@/components/mixins/request';
import Swal from 'sweetalert2';
import { shallowEqual, useSelector } from 'react-redux';
import { State } from '@/store/reducer';
import { BsPeopleFill } from "react-icons/bs";
import ListOPD from '@/components/pages/opd/listOPD';
import { FaSync } from 'react-icons/fa';
import withAuth from '@/components/hocs/withAuth';
import Loading from '@/components/global/Loading/loading';

const DataMasterUrusan = () => {
  const router = useRouter();
  const [dataUrusan, setDataUrusan] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchUrusan();
  }, []);

  const fetchUrusan = async () => {
    setLoading(true);

  }

  return (
    <div className="list-urusan-container">
      <Breadcrumb pageName="Urusan" />
    </div>
  )
}

export default withAuth(DataMasterUrusan);