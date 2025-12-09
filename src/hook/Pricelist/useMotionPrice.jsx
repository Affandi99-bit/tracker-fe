// hooks/useMotionPrice.js
import useSheetData from "./useSheetData";

const URL = "https://sheetdb.io/api/v1/l9178q5i58acu?sheet=Motion";

const useMotionPrice = () => {
    return useSheetData(URL);
};

export default useMotionPrice;
