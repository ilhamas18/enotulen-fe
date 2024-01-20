import React from "react";
import { useRouter } from "next/navigation";
import { dataStepbar } from "@/components/data/stepList";

interface PropTypes {
  step: string;
}

export default function StepsWrapper({ step }: PropTypes) {
  const router = useRouter();

  return (
    <div className="w-full -mb-4">
      <div className="steps-wrapper">
        <div className="steps-list">
          {dataStepbar.map((item, i) => (
            <React.Fragment key={i}>
              <div
                className={`steps__item ${parseInt(step) === i + 1 ? 'active' : ''} ${parseInt(step) > i + 1 ? 'done' : ''}`}
                onClick={() => {
                  if (i + 1 < parseInt(step)) {
                    if (i == 0) {
                      router.push('/')
                    } else {
                      router.push('/')
                    }
                  }
                }}
              >
                {i + 1 < parseInt(step) ? (
                  <div
                    key={i}
                    className="flex items-center justify-center text-xs"
                    style={{
                      backgroundColor: "#fff",
                      width: 28,
                      minWidth: 28,
                      height: 28,
                      minHeight: 28,
                      borderRadius: "50%",
                      border: "solid 1px #DDC984",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.5 4.5L6.5 11.5L3 8"
                        stroke="url(#paint0_linear_4112_7863)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_4112_7863"
                          x1="-0.430001"
                          y1="-3.04687"
                          x2="16.2149"
                          y2="-1.13835"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#F7C084" />
                          <stop offset="1" stopColor="#C59F11" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                ) : (
                  <>
                    {i + 1 == parseInt(step) ? (
                      <div
                        className="flex items-center justify-center text-xs"
                        style={{
                          backgroundColor: "#002DBB",
                          width: 28,
                          minWidth: 28,
                          height: 28,
                          minHeight: 28,
                          borderRadius: "50%",
                        }}
                      >
                        <span className="text-white">{i + 1}</span>
                      </div>
                    ) : (
                      <div
                        className="flex items-center justify-center text-xs"
                        style={{
                          backgroundColor: "#fff",
                          width: 28,
                          minWidth: 28,
                          height: 28,
                          minHeight: 28,
                          borderRadius: "50%",
                          border: "solid 1px",
                        }}
                      >
                        {i + 1}
                      </div>
                    )}
                  </>
                )}
                <span>{item.label}</span>
              </div>
              <div className="line-gap-wrapper">
                {i != 2 && (
                  <>
                    {parseInt(step) > i + 1 ? (
                      <div key={i} className="line-gap">
                        <span></span>
                      </div>
                    ) : (
                      <div key={i} className="line-gap">
                        <span></span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
