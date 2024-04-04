'use client';
import React from "react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import TextInput from '@/components/common/text-input/input';
import { Button } from '@/components/common/button/button';
import Swal from 'sweetalert2'
import Image from "next/image";
import { useAuth } from "@/components/providers/Auth";
import Loading from "@/components/global/Loading/loading";
import { withFormik, FormikProps, FormikBag } from 'formik';
import * as Yup from 'yup';
import { setCookie, getCookie, getCookies } from "cookies-next";
import { fetchApi } from "@/app/api/request";
import { useDispatch } from "react-redux";
import { setProfile } from "@/store/profile/action";
import { deleteCookie } from "cookies-next";

interface FormValues {
  nip: string,
  password: string,
}

interface OtherProps {
  title?: string;
  ref?: any;
}

interface MyFormProps extends OtherProps {
  handleSubmit: (
    values: FormValues,
    formikBag: FormikBag<object, FormValues>
  ) => void;
}

const FormField = (props: OtherProps & FormikProps<FormValues>) => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    isValid,
    dirty,
    ref
  } = props;

  return (
    <div className="form-container">
      <form className="form-wrapper-general">
        <div className="px-8 font-Nunito flex flex-col space-y-7 mt-4">
          <div className="data flex flex-row">
            <TextInput
              type="text"
              id="nip"
              name="nip"
              label="NIP/NIPPPK"
              max={18}
              touched={touched.nip}
              errors={errors.nip}
              value={values.nip}
              change={handleChange}
            />
          </div>
          <div className="data flex flex-row">
            <TextInput
              type="password"
              id="password"
              name="password"
              label="Password"
              touched={touched.password}
              errors={errors.password}
              value={values.password}
              change={handleChange}
            />
          </div>
        </div>
      </form>
      <div className="btn-space">
        <button
          type="button"
          onClick={(e: any) => handleSubmit()}
          className={`bg-[#0ac4a9] hover:bg-[#0ce8c8] md:w-[20%] w-[80%] py-2 rounded rounded-sm ml-8 mt-8 -mb-3 ${isSubmitting ? "loading" : ""}`}
          disabled={!(dirty && isValid) || isSubmitting}
        >
          <div className="text-Nunino text-sm text-white">
            {isSubmitting ? (
              <div><Image src="/loading.gif" width={18} height={18} alt="Loading" /></div>
            ) : (
              <span>Masuk</span>
            )}
          </div>
        </button>
      </div>
    </div>
  )
}

function CreateForm({ handleSubmit }: MyFormProps) {
  const FormWithFormik = withFormik({
    mapPropsToValues: () => ({
      nip: "",
      password: "",
    }),
    validationSchema: Yup.object().shape({
      nip: Yup.string()
        .required('Bagian dibutuhkan')
        .min(18, 'NIP harus 18 angka')
        .max(18, 'NIP harus 18 angka'),
      password: Yup.string()
        .required("Bagian dibutuhkan")
        .min(8, "Kata sandi terlalu pendek - minimal harus 8 karakter"),
    }),
    handleSubmit
  })(FormField)

  return <FormWithFormik />
}

const LoginForm: any = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { setAuthenticated } = useAuth();
  const [active, setActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = getCookie("refreshSession");
    if (typeof token !== "undefined") {
      getProfile();
    }
  }, [active]);

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

      if (resUser.success) {
        const { data } = resUser.data
        const response = await fetchApi({
          url: `/pegawai/getPegawai/${data.nip}`,
          method: "get",
          type: "auth"
        })

        if (response.success) {
          dispatch(setProfile(response.data.data));
          router.push('/');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Gagal memuat data profil',
          })
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Koneksi bermasalah!',
        })
      }
    } else {
      router.push('/auth/login')
    }
  }

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);

    const payload = {
      nip: values.nip,
      password: values.password
    }

    const response = await fetchApi({
      url: "/pegawai/login",
      method: "post",
      type: "withoutAuth",
      body: payload
    })

    if (!response.success) {
      router.push('/auth/login');
      if (response.code == 404) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'NIP tidak ditemukan',
        })
        setLoading(false);
      } else if (response.code == 400) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Password salah!',
        })
        setLoading(false);
      } else if (response.code == 500) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Koneksi bermasalah',
        })
        setLoading(false);
      }
      return false
    } else if (response.success) {
      setAuthenticated(true);
      setActive(true);
      setCookie("refreshSession", response.data.data.access_token, {
        maxAge: 900000,
        path: "/",
        // secure: true
      });
      // router.push("/")
      getProfile();
      return true;
    }
  }

  return (
    <React.Fragment>
      {loading ? (
        <Loading loading={Loading} setLoading={setLoading} />
      ) : (
        <CreateForm handleSubmit={handleSubmit} />
      )}
    </React.Fragment>
  )
}

export default LoginForm
