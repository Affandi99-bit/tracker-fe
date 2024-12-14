import { tags } from "../constant/constant";
import { payment } from "../constant/constant";
export const findTagColor = (tagValue) => {
  for (const category in tags) {
    const foundTag = tags[category].find((tag) => tag.value === tagValue);
    if (foundTag) return foundTag.color;
  }
  return "#FFFFFF";
};
export const findPaymentColor = (tagValue) => {
  const foundTag = payment.find((tag) => tag.value === tagValue);
  if (foundTag) return foundTag.color;
};
