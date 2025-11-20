// hooks/useProductionPrice.js
import useSheetData from "./useSheetData";

const URL = "https://sheet2api.com/v1/xxkSeGtHRL2x/pricelist-dummy/Production";

const useProductionPrice = () => {
    return useSheetData(URL);
};

export default useProductionPrice;
