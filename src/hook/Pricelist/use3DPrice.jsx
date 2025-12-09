import useSheetData from "./useSheetData";

const URL = "https://sheetdb.io/api/v1/l9178q5i58acu?sheet=3D";

const use3DPrice = () => {
    return useSheetData(URL);
};

export default use3DPrice;