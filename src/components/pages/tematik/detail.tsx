"use client";
import * as React from 'react';
import { useState, useEffect } from 'react';
import TextInput from "@/components/common/text-input/input"
import { Button } from "@/components/common/button/button";
import Swal from 'sweetalert2'
import { withFormik, FormikProps, FormikBag } from 'formik';
import * as Yup from 'yup';
import { fetchApi } from "@/components/mixins/request";
import { CommonModal } from "@/components/common/common-modal/modal";

interface PropTypes {
  dataTagging: any;
  openDetail: boolean;
  setOpenDetail: any;
}

const TematikDetail = ({ dataTagging, openDetail, setOpenDetail }: PropTypes) => {

  const handleCancel = () => {
    setOpenDetail(false);
  }

  return (
    <CommonModal isOpen={openDetail} onClose={setOpenDetail} animate={true}>
      <div className="form-container bg-white rounded-lg">
        <div className='flex flex-col space-y-1 py-3 w-full bg-meta-6 font-bold text-center text-white'>
          <div className="uppercase">List Notulen</div>
          <div>{dataTagging.nama_tagging}</div>
        </div>
        <ol className='px-8 mt-6 mb-10'>
          {dataTagging?.Notulens ? (
            dataTagging?.Notulens?.map((el: any, i: number) => (
              <li className='list-decimal'>
                <div>{el.acara}</div>
              </li>
            ))
          ) : (
            <div>Tidak ada notulen</div>
          )}
        </ol>
        <div className='text-danger text-title-xsm2 text-center hover:cursor-pointer' onClick={handleCancel}>Tutup</div>
      </div>
    </CommonModal>
  )
}

export default TematikDetail;