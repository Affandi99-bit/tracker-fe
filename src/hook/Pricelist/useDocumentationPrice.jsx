// hooks/useDocumentationPrice.js
import useSheetData from "./useSheetData";

const URL = "https://sheet2api.com/v1/TwV9qFW8TCCX/price-list/Dokumentasi";

const useDocumentationPrice = () => {
    return useSheetData(URL);
};

export default useDocumentationPrice;
