"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "../global/Sidebar/Sidebar";
import Header from "../global/Header/Header";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../../store";

interface PropTypes {
  children: any,
  setAuthenticated: any
}

const Layout = ({ children, setAuthenticated }: PropTypes) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Provider store={store}>
          <PersistGate persistor={persistor} loading={null}>
            <div className="dark:bg-boxdark-2 dark:text-bodydark">
              <div className="flex h-screen overflow-hidden">
                {pathname === '/auth/login' ? (
                  <>
                    {children}
                  </>
                ) : (
                  <>
                    <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    <div className='relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden'>
                      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setAuthenticated={setAuthenticated} />
                      <main>
                        <div className='mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10'>
                          {children}
                        </div>
                      </main>
                    </div>
                  </>
                )}
              </div>
            </div>
          </PersistGate>
        </Provider>
      </body>
    </html>
  )
}

export default Layout;

