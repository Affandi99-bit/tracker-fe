import { useState, useEffect } from "react";
const MOTION_SHEET_URL = "https://sheet2api.com/v1/m1ewfV3RhmFs/database-job-positions/Motion";

const useRoleMotion = () => {
    const [roleMotion, setRoleMotion] = useState([]);

    useEffect(() => {
        async function fetchRoles() {
            try {
                const res = await fetch(MOTION_SHEET_URL);
                const data = await res.json();

                const formatted = data.map((r, index) => ({
                    id: index,
                    name: r.TITLE,
                }));
                setRoleMotion(formatted);
            } catch (err) {
                console.error("Failed to fetch roles", err);
            }
        }
        fetchRoles();
    }, []);

    return roleMotion;
};
export default useRoleMotion