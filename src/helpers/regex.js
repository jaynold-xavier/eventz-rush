export const getInBetweenCharsRegex = (left = "[", right = "]") => {
  return new RegExp(`\\${left}(.*?)\\${right}`, "gi");
};
