'use client'

import Image from "next/image";
import IntegrityHeader from "../components/header";
import React from "react";
import { motion } from "framer-motion";
import { animationTokens } from "../tokens/animationTokens";
import { colors } from "../tokens/colors";
import { FaLock } from "react-icons/fa";

export default function Unlock() {
    
    const [hasAccess, setHasAccess] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const [isEmailValid, setIsEmailValid] = React.useState(false);

    const handleAccess = () => {
        setHasAccess(true);
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const emailValue = e.target.value;
        setEmail(emailValue);
        setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue));
    }

    const styles = {
        noAccessBox: {
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            justifyContent: 'space-evenly',
            height: '70dvh',
            width: '50dvw',
            backgroundColor: colors["dark-grey"],
            borderRadius: '20px',
        },
        lockIcon: {
            color: colors.primary,
            fontSize: '4rem',
            fontWeight: 'bold',
        },
        lockIconContainer: {
            display: 'flex',
            flexDirection: 'row' as const,
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            border: `4px dotted ${colors.grey}`,
            padding: '30px',
            borderRadius: '500px',
        },
        emailInput: {
            backgroundColor: colors.grey,
            color: colors.white,
            border: `1px solid ${colors.grey}`,
            borderRadius: '5px',
            padding: '10px',
            outline: 'none',
        },
        emailLabel: {
            color: colors.grey,
            fontFamily: 'main',
            fontWeight: 'bold',
        },
        authDescription: {
            color: colors.primary,
            fontFamily: 'main',
            fontWeight: 'bold',
        },
        unlockButton: {
            backgroundColor: isEmailValid ? colors.primary : colors.black, // Gold color when valid
            color: colors.white,
            border: `1px solid ${isEmailValid ? colors.primary : colors.black}`,
            borderRadius: '5px',
            padding: '10px',
            cursor: isEmailValid ? 'pointer' : 'not-allowed',
            },
        unlockButtonText: {
            fontFamily: 'main',
            fontWeight: 'bold',
            color: isEmailValid ? colors.white : colors.grey,
        }
    };

    React.useEffect(() => {
        const email = localStorage.getItem('integrity-release-email');
        if (email) {
            setHasAccess(true);
        }
    }, []);

    return (
        <div className={`flex flex-col items-center justify-center h-screen ${hasAccess ? 'overflow-auto' : 'overflow-hidden'}`}>

            {/* NOTE - HEADER */}
            <IntegrityHeader showHeader={false} />

            {/* NOTE - BACKGROUND IMAGE */}
            <div className="fixed top-0 left-0 w-full h-full -z-10">
                <div className="bg-black w-full h-full absolute top-0 left-0 z-[1]" style={{ opacity: 0.75 }}></div>
                <Image fill className="object-cover w-full h-full" src="/assets/images/integrity-albumn-cover.png" alt="integrity-cover" priority />
            </div>

            {/* NOTE - ACCESS Container */}
            {hasAccess ? (

                // NOTE - IF A USER HAS ACCESS
                <div className="flex flex-col items-center justify-center h-screen">
                    <h1 className="text-white text-4xl font-bold">Access</h1>
                </div>

            ) : (

                // NOTE - IF A USER HAS NO ACCESS
                <div style={styles.noAccessBox} className="flex flex-col items-center justify-center">
                    
                    {/* NOTE - LOCK ICON */}
                    <div style={styles.lockIconContainer}>
                        <FaLock style={styles.lockIcon} className="text-4xl font-bold" />
                    </div>

                    <div className="flex flex-col items-center justify-center w-[75%]">

                    {/* NOTE - EMAIL INPUT */}
                    <div className="mt-4 select-none gap-4 flex flex-col justify-start w-full">
                        <label className="select-none" htmlFor="email" style={styles.emailLabel}>Email:</label>
                        <input type="email" id="email" name="email" style={styles.emailInput} className="p-2 w-full rounded focus:outline-none" onChange={handleEmailChange} />
                        <button style={styles.unlockButton} className="p-2 w-full rounded" disabled={!isEmailValid}>
                            <p style={styles.unlockButtonText}>UNLOCK</p>
                        </button>
                    </div>

                    {/* NOTE - SMALL GREY DIVIDER */}
                    <span style={{ backgroundColor: colors.grey }}  className="w-full h-[1px] mt-8 select-none"></span>
                    </div>

                    {/* NOTE - EMAIL TEXT */}
                    <div className="mt-2 flex flex-col items-center justify-between w-[75%]">
                        <motion.p
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 }}
                        className="lg:text-[1.25rem] select-none"
                        style={styles.authDescription}>Enter Your Email</motion.p>
                        <motion.p 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: animationTokens.duration2, delay: animationTokens.duration2 }}
                        className="lg:text-[1.25rem] select-none"
                        style={styles.authDescription}>To Experience Integrity</motion.p>
                        {/* <button style={{ backgroundColor: colors.primary, color: colors.white, border: `1px solid ${colors.primary}`, borderRadius: '5px', padding: '10px' }} className="p-2 w-full rounded">Unlock</button> */}
                    </div>
                
                </div>
            
            )}

        </div>
    )
}
