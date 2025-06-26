export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  console.log("getToken called, token:", !!token);
  return token;
};

export const setToken = (tok: string | null) => {
  if (typeof window === "undefined") return;
  console.log("setToken called with:", !!tok);
  if (tok) localStorage.setItem("token", tok);
  else localStorage.removeItem("token");
};
