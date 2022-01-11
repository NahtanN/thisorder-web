import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
// import FacebookProvider from 'next-auth/providers/facebook'

const {
  GOOGLE_CLIENT_ID: googleClientId,
  GOOGLE_CLIENT_SECRET: googleClientSecret
} = process.env

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret
    })
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === 'google') {
        // console.log(account)
      }
      return true
    },
    async jwt({ token, account }) {
      console.log(token)
      // token.accessToken = 'fsdfasdfasds'
      console.log(token)

      return token
    },
  }
})
