import { useState, useEffect } from "react";
const Docs_SHEET_URL = "https://sheetdb.io/api/v1/7fhjfzfme2u8g?sheet=Dokumentasi";

const useRoleDocs = () => {
    const [roleDocs, setRoleDocs] = useState([]);

    useEffect(() => {
        async function fetchRoles() {
            try {
                const res = await fetch(Docs_SHEET_URL);
                const data = await res.json();

                const formatted = data.map((r, index) => ({
                    id: index,
                    name: r.TITLE,
                    bobot: r.Bobot
                }));
                setRoleDocs(formatted);
            } catch (err) {
                console.error("Failed to fetch roles", err);
            }
        }
        fetchRoles();
    }, []);

    return roleDocs;
};
export default useRoleDocs