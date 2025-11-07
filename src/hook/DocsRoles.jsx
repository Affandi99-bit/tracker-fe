import { useState, useEffect } from "react";
const Docs_SHEET_URL = "https://sheet2api.com/v1/m1ewfV3RhmFs/database-job-positions/Dokumentasi";

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