import RootLayout from "../../app/layout";

const InitialProps = ({ authenticated }) => {
  // Your page component logic here
  return (
    <RootLayout authenticated={authenticated}>
    </RootLayout>
  );
};

export default InitialProps;

export async function getServerSideProps(context) {
  let authenticated = false;
  console.log('masook');

  const { req, res } = context.ctx;
  const pageProps = context.Component.getInitialProps
    ? await context.Component.getInitialProps(context.ctx)
    : {}

  const token = req
    ? getCookie("refreshSession", { req, res })
    : getCookie("refreshSession")

  if (typeof token !== "undefined") {
    const resUser = await fetchApi({
      url: "/pegawai/getProfile",
      method: "get",
      type: "auth"
    })
    if (!resUser.success) {
      deleteCookie("refreshSession");
      return { pageProps, authenticated }
    }

    authenticated = true;
    return { pageProps, authenticated }
  } else {
    authenticated = false;
  }
}