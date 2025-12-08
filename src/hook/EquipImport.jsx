import { useState, useEffect } from "react";

const SHEET_URL = "https://sheet2api.com/v1/m1ewfV3RhmFs/list-inventaris/Produktif";

const equipImport = () => {
    const [equip, setEquip] = useState([]);

    useEffect(() => {
        async function fetchRoles() {
            try {
                const res = await fetch(SHEET_URL);
                const data = await res.json();

                const formatted = data.map((r, index) => ({
                    id: index,
                    name: r.Nama,
                    kelengkapan: r.Kelengkapan,
                    kondisi: r.Kondisi,
                    note: r.Note
                }));
                setEquip(formatted);
            } catch (err) {
                console.error("Failed to fetch equip", err);
            }
        }
        fetchRoles();
    }, []);

    return equip;
};
export default equipImport