export function getHSL(color) {
  let r = parseInt(color.substr(1, 2), 16) / 255; // Grab the hex representation of red (chars 1-2) and convert to decimal (base 10).
  let g = parseInt(color.substr(3, 2), 16) / 255;
  let b = parseInt(color.substr(5, 2), 16) / 255;

  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);

  let h, s;
  let l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}
