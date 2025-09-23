import { useState, useEffect } from "react";

const SHEET_URL = "https://sheet2api.com/v1/m1ewfV3RhmFs/database-job-positions";

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