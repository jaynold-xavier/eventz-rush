import { useEffect } from "react";

// sample value = "linear-gradient(45deg, #9164ff, #7e5bff, #7f66ff)"

export default function useBackground(value) {
  useEffect(() => {
    if (value) {
      document.body.style.background = value;
    }

    return () => {
      document.body.style.removeProperty("background");
    };
  }, [value]);
}
