import { useState, useEffect } from "react";

const SHEET_URL = "https://sheet2api.com/v1/m1ewfV3RhmFs/crew-database";

const crewImport = () => {
    const [crew, setCrew] = useState([]);

    useEffect(() => {
        async function fetchRoles() {
            try {
                const res = await fetch(SHEET_URL);
                const data = await res.json();

                const formatted = data.map((r, index) => ({
                    id: index,
                    name: r.Name,
                }));
                setCrew(formatted);
            } catch (err) {
                console.error("Failed to fetch crew", err);
            }
        }
        fetchRoles();
    }, []);

    return crew;
};
export default crewImport