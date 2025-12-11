import { useState, useEffect } from "react";
import { fetchRolesData } from "../../constant/importdata";

const useRoleMotion = () => {
    const [roleMotion, setRoleMotion] = useState([]);

    useEffect(() => {
        async function fetchRoles() {
            try {
                const formatted = await fetchRolesData("Motion");
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