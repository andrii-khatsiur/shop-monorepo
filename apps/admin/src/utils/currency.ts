export const formatPrice = (priceInCoins: number | null): string => {
  if (priceInCoins === null || priceInCoins === undefined) {
    return "";
  }
  const priceInUAH = priceInCoins / 100; // Assuming 100 coins = 1 UAH
  return `${priceInUAH.toFixed(2)} грн`;
};

export const convertPriceToCoins = (
  price: number | null | undefined
): number => {
  if (price === null || price === undefined) {
    return 0;
  }
  return Math.round(price * 100);
};

export const convertCoinsToPrice = (
  coins: number | null | undefined
): number | null => {
  if (coins === null || coins === undefined) {
    return null;
  }
  return coins / 100;
};
