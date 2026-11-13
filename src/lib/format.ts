const tl = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatPrice = (n: number) => `${tl.format(n)} TL`;
