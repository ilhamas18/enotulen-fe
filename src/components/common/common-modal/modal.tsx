import React, { forwardRef, useImperativeHandle, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, Box } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';

type ModalInterface = {
  isOpen: boolean,
  onClose: any,
  children: any,
  className?: string,
  animate?: boolean,
  type?: string,
  disableScrollLock?: any
}
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const CommonModal = ({
  isOpen,
  onClose,
  className,
  animate,
  children,
  type = "xl"
}: ModalInterface) => {
  const showHideClassName = isOpen ? "modal display-block" : "modal display-none";
  const [open, setOpen] = useState(true);
  return (
    <>
      {animate ? (
        <Dialog
          onClose={onClose}
          aria-labelledby="customized-dialog-title"
          open={isOpen}
        >
          <AnimatePresence>
            <motion.div
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1,
                transition: {
                  duration: 0.3
                }
              }}
              exit={{
                opacity: 0,
                transition: {
                  delay: 0.3
                }
              }}
              onClick={() => setOpen(false)}
              className="modal-backdrop"
            >
              <motion.div
                initial={{
                  scale: 0
                }}
                animate={{
                  scale: 1,
                  transition: {
                    duration: 0.3
                  }
                }}
                exit={{
                  scale: 0
                }}
                className={`modal-content-wrapper md:w-[50%] w-full h-auto ${type === "xl" ? 'xl' : 'axis'}`}
              >
                <motion.div
                  className="modal-content grow"
                  initial={{
                    x: 100,
                    opacity: 0
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    transition: {
                      delay: 0.3,
                      duration: 0.3
                    }
                  }}
                  exit={{
                    x: 100,
                    opacity: 0
                  }}
                >
                  {children}
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </Dialog>
      ) : (
        <Dialog
          onClose={onClose}
          aria-labelledby="customized-dialog-title"
          open={isOpen}
        >
          <AnimatePresence>
            <motion.div
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1,
                transition: {
                  duration: 0.3
                }
              }}
              exit={{
                opacity: 0,
                transition: {
                  delay: 0.3
                }
              }}
              onClick={() => setOpen(false)}
              className="modal-backdrop"
            >
              <div
                className={`modal-content-wrapper md:w-[50%] w-full h-auto max-h-[500px] ${type === "xl" ? 'xl' : 'axis'}`}
              >
                <div>
                  {children}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </Dialog>
      )}
    </>
  )
}

export const CommonModalBottom = ({ isOpen, onClose, className, children, type }: ModalInterface) => {
  return (
    <>
      <Dialog
        onClose={onClose}
        TransitionComponent={Transition}
        aria-labelledby="customized-dialog-title flex"
        open={isOpen}
        className="bottom-sheet"
        disableScrollLock
      >
        <AnimatePresence>
          <motion.div className="modal-content-wrapper w-[420px] mx:auto">
            <motion.div className="modal-content grow">{children}</motion.div>
          </motion.div>
        </AnimatePresence>
      </Dialog>
    </>
  );
};
