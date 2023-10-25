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
  openEdit: boolean;
  setopenEdit: any;
}

const TematikEditForm = ({ dataTagging, openEdit, setopenEdit }: PropTypes) => {
  const [taggingSelected, setTaggingSelected] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setTaggingSelected(dataTagging?.nama_tagging)
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      nama_tagging: taggingSelected
    }

    const response = await fetchApi({
      url: `/tagging/editTagging/${dataTagging.id}`,
      method: 'put',
      body: payload,
      type: "auth"
    })

    if (!response.success) {
      if (response.data.code == 500) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Koneksi bermasalah!',
        })
      }
      setLoading(false);
    } else {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Data tagging berhasil diupdate',
        showConfirmButton: false,
        timer: 1500
      })
      setopenEdit(false);
      setLoading(false);
    }
  }

  const handleCancel = () => {
    setTaggingSelected(null);
    setopenEdit(false);
  }

  return (
    <CommonModal isOpen={openEdit} onClose={setopenEdit} animate={true}>
      <div className="form-container bg-white rounded-lg">
        <div className="w-full py-3 bg-meta-6 font-bold text-center text-white uppercase">Form Edit Tagging</div>
        <form className="form-wrapper-general relative p-6">
          <div className="data flex flex-row w-full">
            <TextInput
              type="text"
              id="namaTagging"
              name="namaTagging"
              label="Masukkan Tagging"
              change={(e: any) => setTaggingSelected(e.target.value)}
              value={taggingSelected}
            />
          </div>
          <div className="btn-submit mx-8 pb-4 mt-4 space-x-3 absolute right-0 flex">
            <div className="w-[8em]">
              <Button
                variant="xl"
                className="button-container mb-2 mt-5"
                rounded
                disabled={taggingSelected === null ? true : false}
                onClick={(e: any) => handleSubmit(e)}
                loading={loading}
              >
                <div className="flex justify-center items-center text-white font-Nunito">
                  <span className="button-text">Edit</span>
                </div>
              </Button>
            </div>
          </div>
        </form>
        <div className="w-[8em]">
          <Button
            variant="xl"
            type="secondary"
            className="button-container mb-2 mt-3 ml-6"
            rounded
            onClick={handleCancel}
          >
            <div className="flex justify-center items-center text-[#002DBB] font-Nunito">
              <span className="button-text">Batal</span>
            </div>
          </Button>
        </div>
      </div>
    </CommonModal>
  )
}

export default TematikEditForm;