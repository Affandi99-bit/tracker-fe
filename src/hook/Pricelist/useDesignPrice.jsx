// hooks/useDesignPrice.js
import useSheetData from "./useSheetData";

const useDesignPrice = () => {
    return useSheetData("Design");
};

export default useDesignPrice;
