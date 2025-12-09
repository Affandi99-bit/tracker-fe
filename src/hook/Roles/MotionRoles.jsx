import { useState, useEffect } from "react";
const MOTION_SHEET_URL = "https://sheetdb.io/api/v1/7fhjfzfme2u8g?sheet=Motion";

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
                    bobot: r.Bobot
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