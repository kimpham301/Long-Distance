"use client"
import React from 'react';
import "./cloud.css"

const Cloud = ({scale, opacity, margin, delay}: { scale: number, opacity: number, margin: number, delay: number }) => {
    console.log(delay)
    return (
        <div className="cloud"
             style={{
                 transform: `scale(${scale})`,
                 opacity: opacity,
                 marginLeft: margin + "%",
                 animationDelay: "-" + delay + "s"
             }}>
            <div/>
            <div/>
            <div/>
            <div/>
        </div>
    );
};

export default Cloud;