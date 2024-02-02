import axios from "axios"
import { getCookies } from "cookies-next"

interface reqApi {
  type?: string;
  url?: string;
  method: string;
  body?: any;
  token?: string;
  result200?: any;
}

export const fetchApi = async ({
  type,
  url,
  method,
  body,
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
    const { data }: any = err.response;

    return data
  }
}