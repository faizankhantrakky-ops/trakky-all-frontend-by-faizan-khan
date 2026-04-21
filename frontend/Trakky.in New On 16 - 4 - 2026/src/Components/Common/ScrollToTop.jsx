import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// In-memory scroll position cache (faster than sessionStorage)
const scrollPositions = {};

const ScrollToTop = () => {
    const location = useLocation();
    const navigationType = useNavigationType();
    const isFirstLoad = useRef(true); // Track initial page load

    // Store scroll position in memory (and backup in sessionStorage)
    useEffect(() => {
        const saveScrollPosition = () => {
            const pos = { x: window.scrollX, y: window.scrollY };
            scrollPositions[location.pathname] = pos; // In-memory cache (fast)
            sessionStorage.setItem(`scrollPos_${location.pathname}`, JSON.stringify(pos)); // Backup
        };

        // Throttle scroll events (optimized)
        const throttledSave = throttle(saveScrollPosition, 100);
        window.addEventListener("scroll", throttledSave);

        return () => window.removeEventListener("scroll", throttledSave);
    }, [location.pathname]);

    // Restore scroll position instantly on back/forward
    useEffect(() => {
        if (navigationType === "POP") {
            // 1. Check in-memory cache FIRST (fastest)
            const cachedPos = scrollPositions[location.pathname];
            if (cachedPos) {
                window.scrollTo(cachedPos.x, cachedPos.y);
                return;
            }

            // 2. Fallback to sessionStorage (slightly slower but works after refresh)
            const savedPos = sessionStorage.getItem(`scrollPos_${location.pathname}`);
            if (savedPos) {
                const { x, y } = JSON.parse(savedPos);
                window.scrollTo(x, y);
                return;
            }
        }

        // Default: Scroll to top on new pages or first load
        if (!isFirstLoad.current) {
            window.scrollTo(0, 0);
        }
        isFirstLoad.current = false;
    }, [location.pathname, navigationType]);

    return null;
};

// Efficient throttle function (optimized for scroll events)
const throttle = (func, limit) => {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= limit) {
            func.apply(this, args);
            lastCall = now;
        }
    };
};

export default ScrollToTop;