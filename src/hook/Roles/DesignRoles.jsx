import { useState, useEffect } from "react";
import { fetchRolesData } from "../../constant/importdata";

const useRoleDesign = () => {
    const [roleDesign, setRoleDesign] = useState([]);

    useEffect(() => {
        async function fetchRoles() {
            try {
                const formatted = await fetchRolesData("Design");
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