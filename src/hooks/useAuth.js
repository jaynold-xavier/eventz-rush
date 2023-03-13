import { useContext } from "react";
import { UserContext } from "../contexts";

export default function useAuth() {
  const { user, setUser } = useContext(UserContext);

  return { user, setUser };
}
