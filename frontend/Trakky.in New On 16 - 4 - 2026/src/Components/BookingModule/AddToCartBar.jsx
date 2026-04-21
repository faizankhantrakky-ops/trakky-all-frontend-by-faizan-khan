import React, { useState, useEffect, useRef } from 'react';

const AddToCartBar = ({ selectedServices, onOpenBooking, closeModal }) => {
    const [totalItems, setTotalItems] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [vibrate, setVibrate] = useState(false);
    const [offerCount, setOfferCount] = useState(0);
    const [serviceCount, setServiceCount] = useState(0);
    const prevItemsRef = useRef(0);

    const keyframes = `
        @keyframes vibrate {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, -2px); }
            40% { transform: translate(2px, -2px); }
            60% { transform: translate(-2px, 2px); }
            80% { transform: translate(2px, 2px); }
            100% { transform: translate(0); }
        }
        
        @keyframes pulse-glow {
            0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
    `;

    // Trigger actual device vibration if supported
    const triggerVibration = () => {
        if ('vibrate' in navigator) {
            // Vibration pattern: vibrate for 50ms, pause 50ms, vibrate 50ms
            navigator.vibrate([50, 50, 50]);
        }
    };

    useEffect(() => {
        const total = selectedServices.reduce((sum, service) => {
            return sum + (service.quantity || 1);
        }, 0);

        const price = selectedServices.reduce((sum, service) => {
            return sum + (service.price) * (service.quantity || 1);
        }, 0);

        const offers = selectedServices.filter(s => s.isOffer).length;
        const services = selectedServices.filter(s => !s.isOffer).reduce((sum, s) => sum + (s.quantity || 1), 0);

        setTotalItems(total);
        setTotalPrice(price);
        setOfferCount(offers);
        setServiceCount(services);

        if (total > 0) {
            setIsVisible(true);

            // Trigger vibration when items are added
            if (total > prevItemsRef.current) {
                setVibrate(true);
                triggerVibration();
                setTimeout(() => setVibrate(false), 500);
            }
        } else {
            setIsVisible(false);
        }

        prevItemsRef.current = total;
    }, [selectedServices, closeModal]);

    if (!isVisible) return null;

    return (
        <>
            <style>{keyframes}</style>

            <div className={`fixed bottom-0 left-0 right-0 z-50 bg-[#502DA6] shadow-lg border-t border-gray-200 ${vibrate ? 'animate-vibrate' : ''
                }`}
                style={{
                    animation: vibrate ? 'vibrate 0.5s linear' : '',
                }}>
                <div className="max-w-lg mx-auto p-4">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="font-bold text-white">
                                {offerCount > 0 && serviceCount > 0 ? (
                                    <>
                                        {offerCount} offer{offerCount !== 1 ? 's' : ''} & {serviceCount} service{serviceCount !== 1 ? 's' : ''} • ₹{totalPrice}
                                    </>
                                ) : offerCount > 0 ? (
                                    <>
                                        {offerCount} offer{offerCount !== 1 ? 's' : ''} • ₹{totalPrice}
                                    </>
                                ) : (
                                    <>
                                        {serviceCount} service{serviceCount !== 1 ? 's' : ''} • ₹{totalPrice}
                                    </>
                                )}
                            </span>
                        </div>
                        <button
                            onClick={onOpenBooking}
                            onTouchEnd={(e) => {
                                // Trigger vibration on touch
                                triggerVibration();
                                onOpenBooking(e);
                            }}
                            className={`bg-white text-[#512DC8] font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:bg-gray-100 active:bg-gray-200 relative ${vibrate ? 'animate-pulse-glow' : ''
                                }`}
                            style={{
                                animation: vibrate ? 'pulse-glow 1s ease-out' : '',
                            }}
                        >
                            View Cart 
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddToCartBar;