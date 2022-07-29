export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const rgbToRgbaConverter = ({
  rgb,
  opacity = 1,
}: {
  rgb: string;
  opacity?: number;
}) => {
  const rgbaReplace = rgb.replace('rgb', 'rgba');
  const opacityAddedValue = `${rgbaReplace.slice(
    0,
    rgbaReplace.length - 1
  )},${opacity})`;
  return opacityAddedValue;
};
