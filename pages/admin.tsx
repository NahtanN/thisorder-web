import { GetServerSideProps, NextPage } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

const Admin: NextPage = () => {
  const router = useRouter()

  return (
    <div>
      <h1>Página Admin</h1>
      <button onClick={() => router.push('/dashboard')}>Dashboard</button>
      <button onClick={() => router.push('/')}>Home</button>
    </div>
  )
}

export default Admin
