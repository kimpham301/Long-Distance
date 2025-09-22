import React from 'react';
import "./cloud.css"
const Cloud = ({scale, opacity, margin}: {scale: number, opacity: number, margin: number}) => {
    return (
        <div className={`cloud`} style={{ transform: `scale(${scale}`, opacity: opacity, marginLeft: margin + "%" }}>
            <div/>
            <div/>
            <div/>
            <div/>
        </div>
    );
};

export default Cloud;