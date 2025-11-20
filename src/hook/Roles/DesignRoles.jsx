import { useState, useEffect } from "react";
const Design_SHEET_URL = "https://sheet2api.com/v1/m1ewfV3RhmFs/database-job-positions/Design";

const useRoleDesign = () => {
    const [roleDesign, setRoleDesign] = useState([]);

    useEffect(() => {
        async function fetchRoles() {
            try {
                const res = await fetch(Design_SHEET_URL);
                const data = await res.json();

                const formatted = data.map((r, index) => ({
                    id: index,
                    name: r.TITLE,
                    bobot: r.Bobot
                }));
                setRoleDesign(formatted);
            } catch (err) {
                console.error("Failed to fetch roles", err);
            }
        }
        fetchRoles();
    }, []);

    return roleDesign;
};
export default useRoleDesign