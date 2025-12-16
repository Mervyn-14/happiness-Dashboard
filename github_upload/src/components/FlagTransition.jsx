import React, { useEffect, useState } from 'react';
import './FlagTransition.css';

export default function FlagTransition({ countryName, isoCode, onComplete }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Start fade out after 2.5s (longer display time)
        const timer = setTimeout(() => {
            setVisible(false);
        }, 2500);

        // Complete transition after animation ends (3.5s total for smooth fade)
        const completeTimer = setTimeout(() => {
            onComplete();
        }, 3500);

        return () => {
            clearTimeout(timer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    if (!isoCode) return null;

    return (
        <div className={`flag-transition-overlay ${!visible ? 'fade-out' : ''}`}>
            <div className="flag-container">
                <img
                    src={`https://flagcdn.com/w2560/${isoCode}.png`}
                    alt={`${countryName} flag`}
                    className="full-screen-flag"
                />
                <h1 className="country-name-overlay">{countryName}</h1>
            </div>
        </div>
    );
}
