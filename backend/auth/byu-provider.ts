import type { OAuthConfig } from "@auth/core/providers";

type BYUProfile = {
  sub: string;
  net_id: string;
  preferred_first_name: string;
  surname: string;
  byu_id: string;
  exp: number;
};

export default function BYUPKCE(): OAuthConfig<BYUProfile> {
  if (!process.env.BYU_ISSUER) throw new Error("Missing BYU_ISSUER");
  if (!process.env.BYU_CLIENT_ID) throw new Error("Missing BYU_CLIENT_ID");

  return {
    id: "byu-pkce",
    name: "BYU Authentication",
    type: "oauth",
    wellKnown: `${process.env.BYU_ISSUER}/.well-known/openid-configuration`,
    authorization: {
      url: `${process.env.BYU_ISSUER}/authorize`,
      params: { scope: "openid" },
    },
    token: `${process.env.BYU_ISSUER}/token`,
    userinfo: `${process.env.BYU_ISSUER}/userinfo`,
    issuer: "https://api.byu.edu",
    checks: ["pkce", "state"],
    client: {
      token_endpoint_auth_method: "none",
    },
    clientId: process.env.BYU_CLIENT_ID!,
    profile(profile, tokens) {
      // (keep your logs if you want)
      // console.log("BYU Profile:", profile);
      // console.log("BYU Tokens:", tokens);
      return {
        id: profile.sub,
        netId: profile.net_id,
        firstName: profile.preferred_first_name,
        lastName: profile.surname,
        accessToken: (tokens as any).access_token,
        expiresAt: profile.exp,
        tokenType: (tokens as any).token_type,
        byuId: profile.byu_id,
      };
    },
  };
}
