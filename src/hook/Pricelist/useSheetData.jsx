// hooks/useSheetData.js
import { useState, useEffect } from "react";
import { fetchPricelistData } from "../../constant/importdata";

const useSheetData = (sheetName) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);

                const formatted = await fetchPricelistData(sheetName);
                setData(formatted);
            } catch (err) {
                console.error("Failed to fetch:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [sheetName]);

    return { data, loading, error };
};

export default useSheetData;
