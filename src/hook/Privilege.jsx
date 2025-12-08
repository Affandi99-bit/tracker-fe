import { useState, useEffect } from "react";

/**
 * Hook to get current user's privilege level
 * @returns {string} The privilege level: 'masteruser', 'pm', 'user', or null
 */
export const usePrivilege = () => {
    const [privilege, setPrivilege] = useState(() => {
        // Initialize from localStorage immediately
        return localStorage.getItem("userPrivilege");
    });

    useEffect(() => {
        // Check localStorage on mount and listen for changes
        const checkPrivilege = () => {
            const storedPrivilege = localStorage.getItem("userPrivilege");
            setPrivilege(storedPrivilege);
        };

        // Check immediately
        checkPrivilege();

        // Listen for storage events (in case privilege changes in another tab)
        window.addEventListener('storage', checkPrivilege);

        // Also check periodically in case localStorage is updated without storage event
        // Using a reasonable interval to avoid performance issues
        const interval = setInterval(checkPrivilege, 500);

        return () => {
            window.removeEventListener('storage', checkPrivilege);
            clearInterval(interval);
        };
    }, []);

    return privilege;
};

/**
 * Check if user has permission to perform an action
 * @param {string} action - The action to check: 'create', 'edit', 'delete', 'report', 'view'
 * @returns {boolean} True if user has permission
 */
export const useHasPermission = (action) => {
    const privilege = usePrivilege();

    // If no privilege set, deny access
    if (!privilege) {
        return false;
    }

    // masteruser has all permissions
    if (privilege === "masteruser") {
        return true;
    }

    // pm permissions
    if (privilege === "pm") {
        return ["create", "edit", "delete", "report", "view", "kanban", "share", "equipment"].includes(action);
    }

    // user permissions - only view, kanban, equipment, and share
    if (privilege === "user") {
        return ["view", "kanban", "share", "equipment"].includes(action);
    }

    // finance permissions - only finance tools and view list
    if (privilege === "finance") {
        return ["view", "finance", "report", "create", "edit", "delete"].includes(action);
    }

    return false;
};

export default usePrivilege;
