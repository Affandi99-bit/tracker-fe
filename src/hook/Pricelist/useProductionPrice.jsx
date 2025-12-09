// hooks/useProductionPrice.js
import useSheetData from "./useSheetData";

const URL = "https://sheetdb.io/api/v1/l9178q5i58acu?sheet=Produksi";

const useProductionPrice = () => {
    return useSheetData(URL);
};

export default useProductionPrice;
