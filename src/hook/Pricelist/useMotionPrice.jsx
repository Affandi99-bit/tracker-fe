// hooks/useMotionPrice.js
import useSheetData from "./useSheetData";

const URL = "https://sheet2api.com/v1/xxkSeGtHRL2x/pricelist-dummy/Motion";

const useMotionPrice = () => {
    return useSheetData(URL);
};

export default useMotionPrice;
