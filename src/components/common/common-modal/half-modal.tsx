import React from "react"
import Dialog from '@mui/material/Dialog';

interface type {
  isOpen: boolean,
  onClose: any,
  children: any,
  miniCard?: boolean,
  className?: string,
  title?: string,
  variant?: any,
  specialOffer?: any
}

export const CustomModal = ({
  isOpen,
  onClose,
  className,
  miniCard,
  children,
  specialOffer,
  title,
  variant
}: type) => {
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
    >
      <div className={`md:w-[450px] w-full modal fade fixed custom-half-modal ${!isOpen ? 'close' : ''} ${miniCard == true ? 'mini-half-card' : ''}`}>
        <div className="relative w-full package">
          {specialOffer && specialOffer !== '' ? (
            <>
              <div className="bg-gradient-to-r from-[#0139CD] to-[#5CD0F9] md:text-xs text-[8px] absolute -rotate-45 font-Museo-Medium items-center justify-center text-center text-white w-full md:-translate-x-[42%] -translate-x-[40%] pr-10 md:pr-7" dangerouslySetInnerHTML={{
                __html: `${specialOffer}`
              }}>
              </div>
              {title && title !== '' && <div className="font-Museo-Bold md:text-xl text-lg text-center border-b border-light-gray pb-4 mt-4">{title}</div>}
            </>
          ) : (
            <>
              {title && title !== '' && <div className="font-Museo-Bold md:text-xl text-lg text-center border-b border-light-gray pb-4 mt-4">{title}</div>}
            </>
          )}
        </div>

        <div className={`half-modal-wrap h-full pb-4 ${variant ? variant : ''} ${miniCard == true ? 'mini-half-card' : ''}`}>
          <div className={`bottom-0 pb-12 w-auto modal-card-custom py-4 overflow-auto w-full`}>
            <div className="text-center">
              {children}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
