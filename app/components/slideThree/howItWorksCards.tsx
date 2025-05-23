'use client'

import { colors } from "@/app/tokens/colors"
import { FaShoppingBag } from "react-icons/fa";
import { FaQrcode } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { animationTokens } from "@/app/tokens/animationTokens";

export default function HowItWorksCards() {
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [hoveredTextColor, setHoveredTextColor] = useState<string | null>(null);

    const handleCardHover = (cardId: string) => {
        setHoveredCard(cardId);
        setHoveredTextColor(colors.white);
    }

    const handleCardLeave = () => {
        setHoveredCard(null);
        setHoveredTextColor(colors.grey);
    }

    const styles = {
        cardContainer: {
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
        },
        card: {
            backgroundColor: colors["dark-grey"],
            color: colors.white,
            borderRadius: '10px',
            padding: '20px',
            margin: '20px',
            display: 'flex',
            flexDirection: 'column' as const,
            justifyContent: 'space-between' as const,
            alignItems: 'center' as const,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        },
        iconContainer: {
            color: colors.primary,
        },
        connector: {
            width: '100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 -10px'
        },
        dot: {
            width: '8px',
            height: '8px',
            backgroundColor: colors.grey,
            borderRadius: '50%',
            margin: '0 4px'
        },
        hIWCardHeader: {
            fontWeight: 'bold',
            color: colors.white,
            textAlign: 'center' as const,
            fontFamily: 'boldMain',
        },
        hIWCardId: {
            fontWeight: 'bold',
            color: colors.grey,
            textAlign: 'center' as const,
            fontFamily: 'boldMain',
        },
        hIWCardDescription: {
            fontWeight: 'bold',
            color: hoveredTextColor as string,
            transition: 'color 0.3s ease',
        }
    }

    interface CardData {
        id: string;
        heading: string;
        icon: React.ReactNode;
        description: string;
    }

    const cardData: CardData[] = [
        {
            id: '1',
            heading: 'Purchase the Drop',
            icon: <FaShoppingBag />,
            description: 'Get the exclusive INTEGRITY  — album, fragrance, and audiobook in one.'
        },
        {
            id: '2',
            heading: 'Scan the Code',
            icon: <FaQrcode />,
            description: 'Flip the fragrance. Scan the QR code on the back of the bottle.'
        },
        {
            id: '3',
            heading: 'Unlock the Experience',
            icon: <FaLockOpen />,
            description: 'Head to the site and sign in with the email you used at checkout. That\'s it.'
        }
    ];

    return (
        <>

            {/* NOTE - DESKTOP CARDS */}
            <div
                className="
        hidden
        sm:flex flex-row 
        "
                style={styles.cardContainer}>
                {cardData.map((card, index) => (
                    <React.Fragment key={card.id}>

                        {/* NOTE - CARD */}
                        <div
                            className="lg:w-[250px] lg:h-[350px] hover:scale-105"
                            style={styles.card}
                            onMouseEnter={() => handleCardHover(card.id)}
                            onMouseLeave={() => handleCardLeave()}>

                            {/* NOTE - HEADING AND ID */}
                            <div className="flex flex-row justify-between items-center w-full">
                                <h1
                                    className="lg:text-[0.8rem] select-none"
                                    style={styles.hIWCardHeader}>{card.heading}</h1>
                                <h1
                                    style={styles.hIWCardId}
                                    className="lg:text-[1.5rem] select-none"
                                >{card.id}</h1>
                            </div>

                            <div
                                className="lg:text-[6rem] select-none"
                                style={styles.iconContainer}>
                                {card.icon}
                            </div>

                            <p
                                className="lg:text-[1rem] select-none"
                                style={{
                                    ...styles.hIWCardDescription,
                                    color: hoveredCard === card.id ? colors.white : colors.grey
                                }}>{card.description}</p>

                        </div>

                        {/* NOTE - CONNECTOR DOTS */}
                        {index < cardData.length - 1 && (
                            <div style={styles.connector}>
                                <div style={styles.dot}></div>
                                <div style={styles.dot}></div>
                                <div style={styles.dot}></div>
                                <div style={styles.dot}></div>
                                <div style={styles.dot}></div>
                                <div style={styles.dot}></div>
                            </div>
                        )}

                    </React.Fragment>
                ))}
            </div>

            {/* NOTE - MOBILE CARDS */}
            <div className="sm:hidden h-max py-5 flex flex-col gap-[10px] items-center justify-start snap-y snap-mandatory">
                {cardData.map((card, index) => (
                    <React.Fragment key={card.id}>
                        <div className="flex flex-col justify-center items-center w-full h-max snap-start">

                            <div 
                            style={{ backgroundColor: colors["dark-grey"], fontFamily: 'boldMain' }} 
                            className="flex flex-col rounded-lg p-[20px] justify-center items-center w-[80%] h-max gap-[50px] snap-start">
                                
                                <div className="flex flex-row justify-between items-center w-full">
                                    <h1 className="text-[0.90rem] select-none">{card.heading}</h1>
                                    <h1 style={{color: colors.grey}} className="text-[1.5rem] select-none">{card.id}</h1>
                                </div>
                                
                                <div className="text-[6rem] select-none" style={styles.iconContainer}>
                                    {card.icon}
                                </div>
                                
                                <p className="text-[0.90rem] select-none" style={styles.hIWCardDescription}>
                                    {card.description}
                                </p>

                            </div>

                        </div>
                    </React.Fragment>
                ))}
            </div>

        </>
    )
}