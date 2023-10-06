import withAuth from "@/components/hocs/withAuth"
import TematikForm from "@/components/pages/tematik/form"

const TambahTematik = () => {
  return (
    <div className="px-4">
      <TematikForm />
    </div>
  )
}

export default withAuth(TambahTematik)