import jwtDecode from "jwt-decode";

interface TokenPayload {
  exp: number;
}

export function isTokenExpired(token: string): boolean {
  const decodedToken = jwtDecode<TokenPayload>(token);
  const expirationTime = decodedToken.exp;
  const currentTime = Date.now() / 1000; // Convert to seconds

  return expirationTime < currentTime;
}
