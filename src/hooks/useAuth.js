import { useContext } from "react";
import { UserContext } from "../contexts";

// sample value = "linear-gradient(45deg, #9164ff, #7e5bff, #7f66ff)"

export default function useAuth() {
  const { user, setUser } = useContext(UserContext);

  return { user, setUser };
}
