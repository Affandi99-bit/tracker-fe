// hooks/useMotionPrice.js
import useSheetData from "./useSheetData";

const URL = "https://sheet2api.com/v1/TwV9qFW8TCCX/price-list/Motion";

const useMotionPrice = () => {
    return useSheetData(URL);
};

export default useMotionPrice;
