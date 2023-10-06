'use client'
import AddNotulenForm from "@/components/pages/notulen/form"
import { FaWpforms } from "react-icons/fa";
import withAuth from "@/components/hocs/withAuth";

const Notulen = () => {
  const gradientStyle = {
    width: '100%',
    background: 'linear-gradient(to right, #00bcd4, #2196f3)',
  };

  return (
    <div className="form-notulen-container">
      <div style={gradientStyle} className='mt-8'>
        <div className='px-4 flex text-white py-4 space-x-6 font-bold items-center'>
          <FaWpforms size={20} />
          <div className='text-title-xsm'>Form Tambah Notulen</div>
        </div>
      </div>      
      <AddNotulenForm />
    </div>
  )
}

export default withAuth(Notulen)