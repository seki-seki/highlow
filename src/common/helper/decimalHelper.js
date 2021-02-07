export const makeDotByDecimal = (str, decimal) => {
  return `${str.substr(0,str.length - decimal)}.${str.substr(str.length - decimal, decimal)}`
};
