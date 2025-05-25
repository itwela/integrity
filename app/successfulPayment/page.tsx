'use client'

import Image from "next/image";
import IntegrityHeader from "../components/header";
import React from "react";
import { motion } from "framer-motion";
import { colors } from "../tokens/colors";
import IntegrityButton from "../components/IntegrityButton";
import IntegrityFooter from "../components/footer";
import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";

const successContent = {
    title: "Payment Successful",
    message: "Thank you for your purchase. Your package containing the INTEGRITY fragrance and details on how to access the album + audiobook will be on its way to you soon. We're excited for you to experience this journey with us.",
    buttonText: "HOME"
};

export default function SuccessfulPayment() {
    return (
        <>
            <div className="w-full h-max flex flex-col">
                <div className="flex flex-col">
                    {/* NOTE - HEADER */}
                    <IntegrityHeader showHeader={false} />

                    {/* NOTE - BACKGROUND IMAGE */}
                    <div className="fixed top-0 left-0 w-full h-full -z-10">
                        <div className="bg-black w-full h-full absolute top-0 left-0 z-[1]" style={{ opacity: 0.75 }}></div>
                        <Image 
                            fill 
                            className="object-cover w-full h-full" 
                            src="/assets/images/integrity-albumn-cover.png" 
                            alt="integrity-cover" 
                            priority 
                        />
                    </div>

                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="flex h-[100dvh] items-center justify-center px-4 overflow-hidden"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="w-[90%] sm:w-[50%] max-h-[70dvh] bg-[#1a1a1a] rounded-2xl py-12 px-6 flex flex-col items-center gap-8"
                        >
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.4 }}
                                className="relative p-[30px] flex items-center justify-center rounded-full"
                            >
                                {[...Array(8)].map((_, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: 0.6 + (i * 0.1),
                                        }}
                                        className="absolute w-2 h-2 bg-gray-600 translate-x-[-50%] translate-y-[-50%] rounded-full"
                                        style={{
                                            top: `${50 - 45 * Math.sin(i * Math.PI / 4)}%`,
                                            left: `${50 - 45 * Math.cos(i * Math.PI / 4)}%`,
                                        }}
                                    />
                                ))}
                                <FaCheckCircle className="text-4xl" style={{ color: colors.primary }} />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.6 }}
                                className="w-full max-w-md space-y-6 text-center"
                            >
                                <motion.h2
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.7 }}
                                    className="text-2xl font-bold mb-4"
                                    style={{
                                        color: colors.primary,
                                        fontFamily: 'boldMain',
                                    }}
                                >
                                    {successContent.title}
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.8 }}
                                    className="text-sm mb-6"
                                    style={{
                                        color: colors.grey,
                                        fontFamily: 'main',
                                    }}
                                >
                                    {successContent.message}
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.9 }}
                                >
                                    <Link href="/">
                                    <IntegrityButton
                                        backgroundColor={colors.primary}
                                        borderColor={colors.primary}
                                        textColor={colors.white}
                                        >
                                        {successContent.buttonText}
                                    </IntegrityButton>
                                        </Link>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* NOTE - FOOTER */}
                <div className="w-full h-max">
                    <IntegrityFooter />
                </div>
            </div>
        </>
    );
} 