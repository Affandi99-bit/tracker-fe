// hooks/useDesignPrice.js
import useSheetData from "./useSheetData";

const URL = "https://sheet2api.com/v1/TwV9qFW8TCCX/price-list/Design";

const useDesignPrice = () => {
    return useSheetData(URL);
};

export default useDesignPrice;
