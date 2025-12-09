import { useState, useEffect } from "react";

const SHEET_URL = "https://sheetdb.io/api/v1/7fhjfzfme2u8g?sheet=Produksi";

const useRoleProduction = () => {
    const [roleProduction, setRoleProduction] = useState([]);

    useEffect(() => {
        async function fetchRoles() {
            try {
                const res = await fetch(SHEET_URL);
                const data = await res.json();

                const formatted = data.map((r, index) => ({
                    id: index,
                    name: r.TITLE,
                    bobot: r.Bobot
                }));
                setRoleProduction(formatted);
            } catch (err) {
                console.error("Failed to fetch roles", err);
            }
        }
        fetchRoles();
    }, []);

    return roleProduction;
};
export default useRoleProduction