export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const setToken = (tok: string | null) => {
  if (typeof window === "undefined") return;
  if (tok) localStorage.setItem("token", tok);
  else localStorage.removeItem("token");
};
