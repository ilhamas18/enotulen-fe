"use client";
import '../components/assets/styles/main.scss';
import { Inter } from 'next/font/google'
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/global/Sidebar/Sidebar';
import Header from '@/components/global/Header/Header';
import { getCookie, deleteCookie, setCookie as setCookiee } from "cookies-next"
import { AuthProvider, useAuth, useIsAuthenticated } from '@/components/providers/Auth';
import Layout from '@/components/pages/layout';
import { fetchApi } from '@/components/mixins/request';
import { StoreProvider } from '@/store/StoreProvider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  authenticated: any
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <AuthProvider authenticated={authenticated}>
      <Layout setAuthenticated={setAuthenticated}>
        {children}
      </Layout>
    </AuthProvider>
  )
}

// RootLayout.getInitialProps = async (context: any) => {
//   let authenticated = false;
// console.log('masook');

//   const { req, res } = context.ctx;
//   const pageProps = context.Component.getInitialProps
//     ? await context.Component.getInitialProps(context.ctx)
//     : {}

//   const token = req
//     ? getCookie("refreshSession", { req, res })
//     : getCookie("refreshSession")

//   if (typeof token !== "undefined") {
//     const resUser = await fetchApi({
//       url: "/pegawai/getProfile",
//       method: "get",
//       type: "auth"
//     })
//     if (!resUser.success) {
//       deleteCookie("refreshSession");
//       return { pageProps, authenticated }
//     }

//     authenticated = true;
//     return { pageProps, authenticated }
//   } else {
//     authenticated = false;
//   }
// }

