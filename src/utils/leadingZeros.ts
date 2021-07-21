export const leadingZeros = (num?: number) => {
  if (!num) return '';
  let ouput = num.toString();
  while (ouput.length < 3) ouput = `0${ouput}`;
  return ouput;
};
