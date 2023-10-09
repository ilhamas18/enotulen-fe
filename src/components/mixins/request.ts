import axios from "axios"
import { getCookies } from "cookies-next"

const initialErr = [
  { errorCode: "07", errorMessage: "Registrasi Gagal" },
  { errorCode: "11", errorMessage: "Kamu sudah kedaftar" },
  { errorCode: "10", errorMessage: "User tidak terdaftar" },
  { errorCode: "12", errorMessage: "Kamu memasukan data yang salah" },
  { errorCode: "13", errorMessage: "Kamu sudah login ditempat lain" },
  { errorCode: "14", errorMessage: "Login gagal, silakan coba lagi" },
  { errorCode: "15", errorMessage: "Tunggu verifikasi kami yaa" },
  { errorCode: "16", errorMessage: "Kode OTP yang kamu masukkan salah" },
  { errorCode: "17", errorMessage: "Nohp tidak valid" },
  { errorCode: "18", errorMessage: "Nohp adalah operator lain" },
  { errorCode: "19", errorMessage: "Token Salah" },
  { errorCode: "20", errorMessage: "Silakan masukkan nomor XL/AXIS" },
  {
    errorCode: "22",
    errorMessage: "Akun Anda dinonaktifkan sementara, coba lagi dalam 10 menit",
  },
  {
    errorCode: "23",
    errorMessage: "Akun Anda dinonaktifkan sementara, coba lagi dalam 2 jam",
  },
  {
    errorCode: "24",
    errorMessage: "Jumlah nomor yang ditambahkan sudah mencapai batas maksimal",
  },
  {
    errorCode: "29",
    errorMessage: "Peyimpanan token gagal",
  },
  {
    errorCode: "30",
    errorMessage: "Resend email gagal",
  },
  { errorCode: "32", errorMessage: "Email Token tidak ada" },
  {
    errorCode: "33",
    errorMessage: "Domain email yang didaftarkan tidak valid",
  },
  { errorCode: "90", errorMessage: "Email OTP gagal, silahkan coba lagi" },
  {
    errorCode: "91",
    errorMessage: "Terjadi kesalahan pada server, silahkan coba lagi nanti",
  },
  {
    errorCode: "92",
    errorMessage: "Terjadi kesalahan pada server, silahkan coba lagi nanti",
  },
  { errorCode: "93", errorMessage: "Token Salah" },
  {
    errorCode: "93",
    errorMessage:
      "Kami sedang melakukan pemeliharaan sistem untuk pengalaman transaksi yang lebih baik. Terima kasih",
  },
  {
    errorCode: "95",
    errorMessage: "Terjadi kesalahan pada server, silahkan coba lagi nanti",
  },
  {
    errorCode: "500",
    errorMessage: "Terjadi kesalahan pada server, silahkan coba lagi nanti",
  },
]

interface reqApi {
  type?: string;
  url: string;
  method: string;
  body?: any;
  token?: string;
  result200?: any;
}

function eroorId(val: any) {
  const result = initialErr.filter((el) => el.errorCode === val)
  if (result === undefined || result.length === 0) {
    return "Terjadi kesalahan pada server, silahkan coba lagi nanti"
  }
  return result[0].errorMessage
}

export const fetchApi = async ({
  type,
  url,
  method,
  body,
  token,
  result200 = false,
}: reqApi) => {
  let baseURL = process.env.BASE_URL;
  let header;
  
  if (type === "auth") {
    header = {
      Authorization: `Bearer ${getCookies()?.refreshSession}`,
      "Content-Type": "application/json"
    }
  } else if (type === "file") {
    header = {
      Authorization: `Bearer ${getCookies()?.refreshSession}`,
      'Content-Type': 'multipart/form-data'
    }
  } else if (type === "withoutAuth") {
    header = {
      'Content-Type': "application/json"
    }
  }
  
  try {
    const response: any = await axios({
      method,
      url: `${baseURL}${url}`,
      data: body ? JSON.stringify(body) : {},
      headers: header,
    })
    const { data }: any = response;
    
    return data
  } catch (err: any) {
    
    return {
      success: err?.response?.data?.success ? err.response.data.success : false,
      code: err?.response?.status ? err.response.status : 500,
      data: err
    }
    
    // return err
  }
}