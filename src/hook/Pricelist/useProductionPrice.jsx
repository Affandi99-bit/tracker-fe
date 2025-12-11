// hooks/useProductionPrice.js
import useSheetData from "./useSheetData";

const useProductionPrice = () => {
    return useSheetData("Produksi");
};

export default useProductionPrice;
