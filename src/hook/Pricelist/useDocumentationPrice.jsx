// hooks/useDocumentationPrice.js
import useSheetData from "./useSheetData";

const useDocumentationPrice = () => {
    return useSheetData("Dokumentasi");
};

export default useDocumentationPrice;
