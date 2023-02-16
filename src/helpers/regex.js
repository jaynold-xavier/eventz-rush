export const getInBetweenCharactersRegex = (left = "[", right = "]") => {
  return new RegExp(`\\${left}(.*?)\\${right}`, "gi");
};
