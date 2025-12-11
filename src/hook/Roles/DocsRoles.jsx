import { useState, useEffect } from "react";
import { fetchRolesData } from "../../constant/importdata";

const useRoleDocs = () => {
    const [roleDocs, setRoleDocs] = useState([]);

    useEffect(() => {
        async function fetchRoles() {
            try {
                const formatted = await fetchRolesData("Dokumentasi");
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