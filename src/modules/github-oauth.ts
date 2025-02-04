import { env } from "../env";

interface AccessTokenResponse {
  access_token: string;
}

interface GetUserResponse {
  id: number;
  name: string | null;
  email: string | null;
  avatar_url: string;
}

export async function getAccessTokenFromCode(code: string) {
  const accessTokenURL = new URL("https://github.com/login/oauth/access_token");

  accessTokenURL.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  accessTokenURL.searchParams.set("client_id", env.GITHUB_CLIENT_SECRET);
  accessTokenURL.searchParams.set("code", code);

  const response = await fetch(accessTokenURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });

  const { access_token } = (await response.json()) as AccessTokenResponse;

  return access_token;
}

export async function getUserFromAccessToken(accessToken: string) {
  const userURL = new URL("https://api.github.com/user");

  const response = await fetch(userURL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data: GetUserResponse = await response.json();

  return data;
}
