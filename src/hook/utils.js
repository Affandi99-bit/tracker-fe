import { tags } from "../constant/constant";
export const findTagColor = (tagValue) => {
  for (const category in tags) {
    const foundTag = tags[category].find((tag) => tag.value === tagValue);
    if (foundTag) return foundTag.color;
  }
  return "#222222";
};
