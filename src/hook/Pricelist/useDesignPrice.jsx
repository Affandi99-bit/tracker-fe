// hooks/useDesignPrice.js
import useSheetData from "./useSheetData";

const URL = "https://sheet2api.com/v1/xxkSeGtHRL2x/pricelist-dummy/Design";

const useDesignPrice = () => {
    return useSheetData(URL);
};

export default useDesignPrice;
