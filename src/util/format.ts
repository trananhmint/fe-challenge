import dayjs from "dayjs";

export const formatDate = (timestamp: number) => {
  const formattedDate = dayjs.unix(timestamp).format("YYYY-MM-DD");
  return formattedDate;
};
export const formatDateTime = (timestamp: number) => {
  const formattedDate = dayjs.unix(timestamp).format("YYYY-MM-DD HH:mm:ss");
  return formattedDate;
};
export const formatMoney = (value: number) => {
  const config = {
    style: "currency" as const,
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };
  const formatted = new Intl.NumberFormat("en-US", config).format(value);
  return formatted;
};
