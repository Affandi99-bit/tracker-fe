// hooks/useSheetData.js
import { useState, useEffect } from "react";

const useSheetData = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);

                const res = await fetch(url);
                if (!res.ok) throw new Error("Network error");

                const json = await res.json();

                const formatted = json.map((item, index) => ({
                    id: index + 1,
                    service: item.Nama || "",
                    price: Number(item.Harga) || 0
                }));

                setData(formatted);
            } catch (err) {
                console.error("Failed to fetch:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [url]);

    return { data, loading, error };
};

export default useSheetData;
