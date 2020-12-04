import React from "react";

import "../styles/global.scss";
import "../styles/loading.scss";

function LoadingPage() {
    return (
        <div className="loading-page">
            <svg>
                <g>
                    <path d="M 50,100 A 1,1 0 0 1 50,0"/>
                </g>
                <g>
                    <path d="M 50,75 A 1,1 0 0 0 50,-25"/>
                </g>
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%"
                              style={{stopColor: "#1b5d1e", stopOpacity: "0.5"}}/>
                        <stop offset="100%"
                              style={{stopColor: "#2c9937", stopOpacity: "0.5"}}/>
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}

export default LoadingPage;