// hooks/useMotionPrice.js
import useSheetData from "./useSheetData";

const useMotionPrice = () => {
    return useSheetData("Motion");
};

export default useMotionPrice;
