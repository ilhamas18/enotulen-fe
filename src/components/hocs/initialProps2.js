import { getCookie, deleteCookie, setCookie as setCookiee } from "cookies-next"
import { setCookie } from "nookies"
import { fetchApi } from "src/mixins/request"

export async function getInitialProps(context) {
  let authenticated = false
  const { req, res } = context.ctx
  const pageProps = context.Component.getInitialProps
    ? await context.Component.getInitialProps(context.ctx)
    : {}

  const token = req
    ? getCookie("refreshSession", { req, res })
    : getCookie("refreshSession")
  const refreshTok = req
    ? getCookie("refreshToken", { req, res })
    : getCookie("refreshToken")

  if (typeof token === "undefined" && typeof refreshTok !== "undefined") {
    const refresh = await fetchApi({
      url: "/refresh",
      method: "post",
      body: {
        grant_type: "refresh_token",
        refresh_token: refreshTok,
      },
      result200: true,
    })

    if (refresh.err) {
      if (req) {
        deleteCookie("refreshToken", { req, res })
      } else {
        deleteCookie("refreshToken")
      }
      return { pageProps, authenticated }
    }

    const {
      accessToken,
      accessTokenExpiresIn,
      refreshToken,
      refreshTokenExpiresIn,
    } = refresh.res

    setCookie(req ? context.ctx : null, "refreshSession", accessToken, {
      maxAge: accessTokenExpiresIn,
      path: "/",
      secure: process.env.SITE_ENV === "production",
    })

    setCookie(req ? context.ctx : null, "refreshToken", refreshToken, {
      maxAge: refreshTokenExpiresIn,
      path: "/",
      secure: process.env.SITE_ENV === "production",
    })

    authenticated = true
    return { pageProps, authenticated }
  }

  if (typeof token === "undefined") {
    if (req) {
      deleteCookie("sesionResedEmail", { req, res })
    } else {
      deleteCookie("sesionResedEmail")
    }
  }

  if (typeof token !== "undefined") {
    const resUser = await fetchApi({
      url: `/profile`,
      method: "get",
      type: "auth",
      token,
    })

    if (resUser.res === "Invalid token") {
      if (req) {
        deleteCookie("sesionResedEmail", { req, res })
        deleteCookie("refreshSession", { req, res })
        deleteCookie("refreshToken", { req, res })
        setCookiee("modal-axpe", "show", { req, res })
        return { pageProps, authenticated }
      }

      setCookiee("modal-axpe", "show")
      deleteCookie("refreshSession")
      deleteCookie("refreshToken")
      deleteCookie("sesionResedEmail")
      return { pageProps, authenticated }
    }

    authenticated = true
    return { pageProps, authenticated }
  }

  return { pageProps, authenticated }
}
