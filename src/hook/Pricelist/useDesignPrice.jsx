// hooks/useDesignPrice.js
import useSheetData from "./useSheetData";

const URL = "https://sheetdb.io/api/v1/l9178q5i58acu?sheet=Design";

const useDesignPrice = () => {
    return useSheetData(URL);
};

export default useDesignPrice;
