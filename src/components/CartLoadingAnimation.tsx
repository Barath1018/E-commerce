// CartLoadingAnimation.tsx
import React from "react";
import cartVideo from "../assets/r6aqTqXc2A.mp4";
import './CartLoadingAnimation.css';
const CartLoadingAnimation = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-white">
            <video
                src={cartVideo}
                autoPlay
                muted
                playsInline
                className="cart-animation w-12 h-12 object-contain"
            />
            <svg
                className="w-full h-4 mt-0.3"
                viewBox="0 0 1200 100"
                preserveAspectRatio="none">
                <path
                    d="M0,50 C300,0 900,100 1200,50"
                    fill="none"
                    stroke="#333"
                    strokeWidth="6" />
            </svg>
            <div className="stone stone-above stone-1"></div>
            <div className="stone stone-below stone-2"></div>
            <div className="stone stone-above stone-3"></div>
        </div>
    );
};

export default CartLoadingAnimation;
