import { GetServerSideProps, NextPage } from 'next'
import { getSession, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import API from '../services/API'

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

const Dashboard: NextPage = () => {
  const [notes, setNotes] = useState<any>()
  const router = useRouter()

  const getNotes = async () => {
    try {
      console.log(API.defaults.headers)
      const result = await API.get('/notes')
      if (!result) return
      console.log(result)
      setNotes(result.data)
    } catch (err) {
      setNotes('Não autorizado')
    }
  }

  useEffect(() => {
    getNotes()
  }, [])
  return (
    <div>
      <h1>Página protegida</h1>
      <Link href="/admin">
        <a>Admin</a>
      </Link>
      <div></div>
      <button onClick={() => signOut()}>Log out</button>
    </div>
  )
}

export default Dashboard
