// hooks/useProductionPrice.js
import useSheetData from "./useSheetData";

const URL = "https://sheet2api.com/v1/TwV9qFW8TCCX/price-list/Produksi";

const useProductionPrice = () => {
    return useSheetData(URL);
};

export default useProductionPrice;
