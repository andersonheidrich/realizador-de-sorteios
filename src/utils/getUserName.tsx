export const getUserName = (
  user: string | { name: string; email: string } | undefined
) => {
  if (!user) return "Desconhecido";
  if (typeof user === "string") return user;
  return user.name;
};
