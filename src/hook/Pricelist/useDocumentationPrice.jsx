// hooks/useDocumentationPrice.js
import useSheetData from "./useSheetData";

const URL = "https://sheet2api.com/v1/xxkSeGtHRL2x/pricelist-dummy/Documentation";

const useDocumentationPrice = () => {
    return useSheetData(URL);
};

export default useDocumentationPrice;
