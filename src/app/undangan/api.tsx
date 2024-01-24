import { fetchApi } from "../api/request";

const getUndangan = async (id: any) => {
  const response = await fetchApi({
    url: `/undangan/getUndanganDetail/${id}`,
    method: 'get',
    type: 'auth'
  })
  return response;
}

export default getUndangan;