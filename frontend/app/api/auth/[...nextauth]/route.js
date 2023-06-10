import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // this function is called when a user signs in
    async signIn({ user, account, profile }) {
      // NOT SURE IF GOOGLE AND TWITTER PROVIDE THE SAME INFO AS GITHUB
      try {
        const socialId = `${account.provider}-${account.providerAccountId}`;
        console.log("user", user);
        console.log("account", account);
        console.log("profile", profile);

        // Make a request to backend to create or update the user
        const res = await fetch("http://localhost:8000/user/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            social_id: socialId,
          }),
        });

        if (res.ok) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        console.log("signIn error", err);
        throw new Error("Failed to sign in...");
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
