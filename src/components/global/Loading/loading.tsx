import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import Image from "next/image";

interface type {
  loading: any;
  setLoading: any;
}

export default function Loading({ loading, setLoading }: type) {
  return (
    <>
      {loading && (
        <div className="wrapper-loading fixed z-50 bg-slate-200 opacity-60 top-0 bottom-0 left-0 right-0"></div>
      )}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={loading}
        onClose={() => {
          setLoading(false);
        }}
      >
        <div className="mt-[15rem] p-4 flex justify-center">
          <Image
            src="/loading.svg"
            width={30}
            height={30}
            alt="Loading"
            className="w-8/12"
          />
        </div>
      </Snackbar>
    </>
  );
}
