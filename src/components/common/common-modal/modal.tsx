import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { useState } from "react";

type ModalInterface = {
  isOpen: boolean,
  onClose: any,
  children: any,
  className?: string,
  size?: string;
  disableScrollLock?: any
}

export const CommonModal = ({
  isOpen,
  onClose,
  className,
  size,
  children,
}: ModalInterface) => {

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-backdrop"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className={`modal-content-wrapper ${size === undefined ? 'sm' : size}`}
          >
            <FiAlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
            <div className="relative text-black">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
// import { motion, AnimatePresence } from "framer-motion"
// import { Dialog, Box } from '@mui/material';
// import { TransitionProps } from '@mui/material/transitions';
// import Slide from '@mui/material/Slide';

// type ModalInterface = {
//   isOpen: boolean,
//   onClose: any,
//   children: any,
//   classNameName?: string,
//   animate?: boolean,
//   type?: string,
//   disableScrollLock?: any
// }
// const Transition = React.forwardRef(function Transition(
//   props: TransitionProps & {
//     children: React.ReactElement<any, any>;
//   },
//   ref: React.Ref<unknown>,
// ) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// export const CommonModal = ({
// isOpen,
// onClose,
// classNameName,
// animate,
// children,
//   type = "xl"
// }: ModalInterface) => {
//   const showHideclassNameName = isOpen ? "modal display-block" : "modal display-none";
//   const [open, setOpen] = useState(true);
//   return (
//     <>
//       {animate ? (
//         <Dialog
//           onClose={onClose}
//           aria-labelledby="customized-dialog-title"
//           open={isOpen}
//         >
//           <AnimatePresence>
//             <motion.div
//               initial={{
//                 opacity: 0
//               }}
//               animate={{
//                 opacity: 1,
//                 transition: {
//                   duration: 0.3
//                 }
//               }}
//               exit={{
//                 opacity: 0,
//                 transition: {
//                   delay: 0.3
//                 }
//               }}
//               onClick={() => setOpen(false)}
//               classNameName="modal-backdrop"
//             >
//               <motion.div
//                 initial={{
//                   scale: 0
//                 }}
//                 animate={{
//                   scale: 1,
//                   transition: {
//                     duration: 0.3
//                   }
//                 }}
//                 exit={{
//                   scale: 0
//                 }}
//                 classNameName={`modal-content-wrapper md:w-[50%] w-full h-auto ${type === "xl" ? 'xl' : 'axis'}`}
//               >
//                 <motion.div
//                   classNameName="modal-content grow"
//                   initial={{
//                     x: 100,
//                     opacity: 0
//                   }}
//                   animate={{
//                     x: 0,
//                     opacity: 1,
//                     transition: {
//                       delay: 0.3,
//                       duration: 0.3
//                     }
//                   }}
//                   exit={{
//                     x: 100,
//                     opacity: 0
//                   }}
//                 >
//                   {children}
//                 </motion.div>
//               </motion.div>
//             </motion.div>
//           </AnimatePresence>
//         </Dialog>
//       ) : (
//         <Dialog
//           onClose={onClose}
//           aria-labelledby="customized-dialog-title"
//           open={isOpen}
//         >
//           <AnimatePresence>
//             <motion.div
//               initial={{
//                 opacity: 0
//               }}
//               animate={{
//                 opacity: 1,
//                 transition: {
//                   duration: 0.3
//                 }
//               }}
//               exit={{
//                 opacity: 0,
//                 transition: {
//                   delay: 0.3
//                 }
//               }}
//               onClick={() => setOpen(false)}
//               classNameName="modal-backdrop"
//             >
//               <div
//                 classNameName={`modal-content-wrapper md:w-[50%] w-full h-auto max-h-[500px] ${type === "xl" ? 'xl' : 'axis'}`}
//               >
//                 <div>
//                   {children}
//                 </div>
//               </div>
//             </motion.div>
//           </AnimatePresence>
//         </Dialog>
//       )}
//     </>
//   )
// }

// export const CommonModalBottom = ({ isOpen, onClose, classNameName, children, type }: ModalInterface) => {
//   return (
//     <>
//       <Dialog
//         onClose={onClose}
//         TransitionComponent={Transition}
//         aria-labelledby="customized-dialog-title flex"
//         open={isOpen}
//         classNameName="bottom-sheet"
//         disableScrollLock
//       >
//         <AnimatePresence>
//           <motion.div classNameName="modal-content-wrapper w-[420px] mx:auto">
//             <motion.div classNameName="modal-content grow">{children}</motion.div>
//           </motion.div>
//         </AnimatePresence>
//       </Dialog>
//     </>
//   );
// };
