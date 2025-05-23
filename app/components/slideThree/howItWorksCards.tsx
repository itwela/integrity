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
            display: 'flex',
            flexDirection: 'row' as const,
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
            color: hoveredTextColor,
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
            heading: 'Purchase the Drop',
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
        <div style={styles.cardContainer}>
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
                            className="lg:text-[0.8rem]"
                            style={styles.hIWCardHeader}>{card.heading}</h1>
                            <h1
                            style={styles.hIWCardId}
                            className="lg:text-[1.5rem]"
                            >{card.id}</h1>
                        </div>
                        
                        <div 
                        className="lg:text-[6rem]" 
                        style={styles.iconContainer}>
                            {card.icon}
                        </div>
                        
                        <p 
                        className="lg:text-[1rem]"
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
    )
}