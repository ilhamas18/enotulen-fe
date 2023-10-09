'use client'
import React from "react";
import LoginForm from "@/components/pages/user/loginForm";
import withoutAuth from "@/components/hocs/withoutAuth";
import { getCookie } from "cookies-next";

const Page = () => {
  const gradientStyle = {
    width: '100%',
    background: 'linear-gradient(to right, #00bcd4, #2196f3)',
  };

  return (
    <div className="login-page-wrapper w-full">
      <div className="bg-white w-full min-h-screen w-full flex">
        {/* <div className="flex md:flex-row flex-col"> */}
        <div className="w-full bg-[#f5f7f9] flex flex-col w-full h-screen justify-center items-center justify-center">
          <div className="bg-white">
            <div className="flex flex-row items-center space-x-4 px-8" style={gradientStyle}>
              <img src="/logo/Lambang_Kota_Madiun.png" className="h-[58px] w-[58]" alt="Logo Kota Madiun" />
              <div className="lg:text-2xl text-white font-medium text-sm">E-NOTULEN</div>
            </div>
            <div className="bg-white px-4 pb-4">
              <div className="font-Nunito-Bold text-gray-400 md:text-md py-1 text-sm text-center bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-white">MASUK PORTAL</div>
              <LoginForm />
            </div>
          </div>
        </div>
        {/* <div className="md:w-1/2 w-full md:block hidden">
            <img src="/bg-login.jpeg" className="h-screen w-full" alt="Background" />
          </div> */}
        {/* </div> */}
      </div>
    </div>
  )
}

export default withoutAuth(Page);