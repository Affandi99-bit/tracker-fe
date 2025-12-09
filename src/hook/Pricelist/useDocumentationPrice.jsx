// hooks/useDocumentationPrice.js
import useSheetData from "./useSheetData";

const URL = "https://sheetdb.io/api/v1/l9178q5i58acu?sheet=Dokumentasi";

const useDocumentationPrice = () => {
    return useSheetData(URL);
};

export default useDocumentationPrice;
