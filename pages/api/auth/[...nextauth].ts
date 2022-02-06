import NextAuth, { User } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import API from '../../../services/API'
import { decode, JwtPayload } from 'jsonwebtoken'
import moment from 'moment'
import { signOut } from 'next-auth/react'
// import FacebookProvider from 'next-auth/providers/facebook'

interface ResUser extends User {
  access_token: string
  refresh_token: string
}

const {
  GOOGLE_CLIENT_ID: googleClientId,
  GOOGLE_CLIENT_SECRET: googleClientSecret,
} = process.env

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Thisorder Account',
      credentials: {
        email: {
          label: 'Username',
          type: 'text',
          placeholder: 'User or E-mail',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credential, req) {
        if (
          credential &&
          credential.email !== '' &&
          credential.password !== ''
        ) {
          try {
            const result = await API.post(
              'http://localhost:3333/auth/local/signin',
              credential
            )
            return result.data
          } catch (err) {
            return null
          }
        }

        return null
      },
    }),
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        const { access_token, refresh_token } = user as ResUser

        token.access_token = access_token
        token.refresh_token = refresh_token
        console.log('here')
      }

      let jwtDecoded = decode(token?.access_token as string)

      if (typeof jwtDecoded === 'object') {
        let exp = jwtDecoded?.exp
        console.log(moment.unix(exp!).diff(moment()))
        let isExpired = moment.unix(exp!).diff(moment()) < 1

        if (!isExpired) return token

        let data
        try {
          const response = await API.post(
            'http://localhost:3333/auth/refresh',
            {},
            {
              headers: {
                Authorization: `Bearer ${token.refresh_token}`,
              },
            }
          )
          data = response.data
        } catch (err) {
          console.log('refresh token expired!')
          signOut()
        }

        token.access_token = data.access_token
        token.refresh_token = data.refresh_token
      }

      return token
    },
    async session({ session, token }) {
      session.access_token = token.access_token
      session.refresh_token = token.refresh_token
      console.log(session)
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: 'sdfgsdfgsdfd',
  },
  secret: 'sdfgdsfgsdfg',
})
