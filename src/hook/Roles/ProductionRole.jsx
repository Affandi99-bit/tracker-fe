import { useState, useEffect } from "react";
import { fetchRolesData } from "../../constant/importdata";

const useRoleProduction = () => {
    const [roleProduction, setRoleProduction] = useState([]);

    useEffect(() => {
        async function fetchRoles() {
            try {
                const formatted = await fetchRolesData("Produksi");
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