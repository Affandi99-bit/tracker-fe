import React, { useState } from "react";

const Tooltip = ({ children, content, position = "top" }) => {
    const [visible, setVisible] = useState(false);

    const getPositionStyle = () => {
        switch (position) {
            case "bottom":
                return { top: "120%", left: "50%", transform: "translateX(-50%)" };
            case "left":
                return { right: "110%", top: "50%", transform: "translateY(-50%)" };
            case "right":
                return { left: "110%", top: "50%", transform: "translateY(-50%)" };
            case "top":
            default:
                return { bottom: "120%", left: "50%", transform: "translateX(-50%)" };
        }
    };

    return (
        <span
            style={{ position: "relative", display: "inline-block" }}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            tabIndex={0}
            onFocus={() => setVisible(true)}
            onBlur={() => setVisible(false)}
        >
            {children}
            {visible && (
                <span
                    style={{
                        position: "absolute",
                        zIndex: 100,
                        padding: "6px 12px",
                        background: "#222",
                        color: "#fff",
                        borderRadius: "4px",
                        fontSize: "0.85rem",
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                        ...getPositionStyle(),
                    }}
                >
                    {content}
                </span>
            )}
        </span>
    );
};

export default Tooltip;