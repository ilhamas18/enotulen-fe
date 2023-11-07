import React from "react";
import { NextSeo } from "next-seo";
import Head from "next/head";

function SEO() {
  return (
    <>
      <NextSeo
        title="ENotulen Kota Madiun"
        description=""
      />
      <Head>
        <script type="text/javascript" src="/script.meta.js" />
        <noscript>
          <img
            height="1"
            width="1"
            src="https://www.facebook.com/tr?id=663583184111454&ev=PageView&noscript=1"
          />
        </noscript>
      </Head>
    </>
  );
}

export default SEO;
