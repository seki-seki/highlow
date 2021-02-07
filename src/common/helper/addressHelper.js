export const ellipsisAddress = (address, prefixLength = 5, suffixLength = 4) => {
  return `${address.substr(0,prefixLength)}...${address.substr(address.length - suffixLength, suffixLength )}`
};
