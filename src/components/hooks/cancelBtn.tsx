import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { Button } from "../common/button/button";
import { fetchApi } from "@/app/api/request";
import Swal from "sweetalert2";
import { setPayload } from "@/store/payload/action";

interface PropTypes {
  title: string;
  url?: string;
  data?: any;
  setLoading?: any;
}

const CancelBtn = ({ title, data, url, setLoading }: PropTypes) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const step: any = searchParams.get('step');

  const handleCancel = async () => {
    if (step !== null) {
      setLoading(true);
      const response = await fetchApi({
        url: url,
        method: 'post',
        type: 'auth',
        body: data
      })

      if (!response.success) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Koneksi bermasalah!",
        });
      } else {
        dispatch(setPayload([]));
        router.push("/laporan");
      }
    } else {
      dispatch(setPayload([]));
      router.push("/laporan");

    }
  }

  return (
    <Button
      variant="xl"
      type="secondary"
      className="button-container"
      onClick={handleCancel}
      rounded
    >
      <div className="flex justify-center items-center text-[#002DBB] font-Nunito">
        <span className="button-text">{title}</span>
      </div>
    </Button>
  )
}

export default CancelBtn;