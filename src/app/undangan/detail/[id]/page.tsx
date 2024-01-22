'use client';
import { fetchApi } from '@/components/mixins/request';
import * as React from 'react';
import { useState, useEffect } from 'react';
import NotulenDetailProps from '@/components/pages/notulen/detail';
import Loading from '@/components/global/Loading/loading';
import Swal from 'sweetalert2';
import Breadcrumb from '@/components/global/Breadcrumbs/Breadcrumb';
import withAuth from '@/components/hocs/withAuth';
import { shallowEqual, useSelector } from 'react-redux';
import { State } from '@/store/reducer';

const UndanganDetail = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  const [undanganDetail, setUndanganDetail] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { profile } = useSelector((state: State) => ({
    profile: state.profile.profile
  }), shallowEqual);

  const fetchData = async () => {

  }
}