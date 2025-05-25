'use client'

import Image from "next/image";
import IntegrityHeader from "../components/header";
import React from "react";
import { motion } from "framer-motion";
import { animationTokens } from "../tokens/animationTokens";
import { colors } from "../tokens/colors";
import { FaLock, FaPause, FaPlay } from "react-icons/fa";
import AudioPlayer from "../components/audio-player/AudioPlayer";
import { useAudioContext } from '@/app/providers/AudioContextProvider';
import IntegrityButton from "../components/IntegrityButton";
import IntegrityFooter from "../components/footer";

export default function Unlock() {

    const [hasAccess, setHasAccess] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const [isEmailValid, setIsEmailValid] = React.useState(false);
    const { musicFiles, audioBookFiles, audioCategories } = useAudioContext();
    const [audioIndex, setAudioIndex] = React.useState(0);
    const [showAudioPlayer, setShowAudioPlayer] = React.useState(false);
    const [selectedTrack, setSelectedTrack] = React.useState<IntegrityTrack | null>(null);
    const { loadPlaylist, playTrack, currentTrackIndex, fileIsPlaying, setFileIsPlaying, audioRef } = useAudioContext();
    const [goodEmail, setGoodEmail] = React.useState<string | null>(null);

    const handleTrackSelect = async (track: IntegrityTrack, trackIndex: number) => {
        // If clicking the currently playing track, toggle play/pause
        if (trackIndex === currentTrackIndex && showAudioPlayer) {
            if (fileIsPlaying) {
                audioRef.current?.pause();
                setFileIsPlaying(false);
            } else {
                audioRef.current?.play();
                setFileIsPlaying(true);
            }
            return;
        }

        // Update the album index if needed
        const albumIndex = currentAudioCategory === 'Music' 
            ? musicFiles.findIndex(album => album.audio_files.some(t => t.id === track.id))
            : audioBookFiles.findIndex(album => album.audio_files.some(t => t.id === track.id));
        
        if (albumIndex !== -1) {
            setAudioIndex(albumIndex);
        }

        // Set the track index and show player
        setSelectedTrack(track);
        setShowAudioPlayer(true);

        // Load and play the track
        await loadPlaylist(currentAudioData.tracks);
        playTrack(trackIndex, currentAudioData.tracks);
    }

    const handleAccess = () => {
        localStorage.setItem('integrity-release-email', email);
        setHasAccess(true);
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const emailValue = e.target.value;
        setEmail(emailValue);
        setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue));
    }

    interface IntegrityTrack {
        id: number;
        title: string;
        url: string;
        image: string;
        tags: string[];
    }

    const [currentAudioCategory, setCurrentAudioCategory] = React.useState(audioCategories?.[0]);

    const handleCategoryChange = (category: string) => {
        setAudioIndex(0);
        setCurrentAudioCategory(category);
        // Reset audio state when changing categories
        setShowAudioPlayer(false);
        setFileIsPlaying(false);
        audioRef.current?.pause();
    }

    const currentAudioData = React.useMemo(() => {
        const data = currentAudioCategory === 'Music' ? musicFiles : audioBookFiles;
        return {
            albums: data || [],
            tracks: data?.[0]?.audio_files.map(track => ({
                id: track.id,
                title: track.title,
                url: track.url,
                image: track.image,
                tags: track.tags
            })) || []
        };
    }, [currentAudioCategory, musicFiles, audioBookFiles]);

    React.useEffect(() => {
        setGoodEmail(localStorage.getItem('integrity-release-email'));
    }, []);

    const handleGoodEmail = () => {
        // if (goodEmail) {
        //     setHasAccess(true);
        // }
        console.log('goodEmail', goodEmail);
    }

    const SoICanFinishBuildFunction = () => {
        console.log(selectedTrack);
    }

    React.useEffect(() => {
        handleGoodEmail();
        SoICanFinishBuildFunction();
    }, [goodEmail, selectedTrack]);

    return (
        <>
        <div className="w-full h-max flex flex-col">

        <div className="flex flex-col">
            {/* NOTE - HEADER */}
            <IntegrityHeader showHeader={false} />

            {/* NOTE - BACKGROUND IMAGE */}
            <div className="fixed top-0 left-0 w-full h-full -z-10">
                <div className="bg-black w-full h-full absolute top-0 left-0 z-[1]" style={{ opacity: 0.75 }}></div>
                <Image fill className="object-cover w-full h-full" src="/assets/images/integrity-albumn-cover.png" alt="integrity-cover" priority />
            </div>

            {hasAccess ? (
                <>
                    {/* Main content */}
                    <div className="flex-1 overflow-y-auto pt-[80px]">
                        <div className="w-full max-w-7xl mx-auto px-4 py-[50px]">
                            <div className="flex justify-center mb-8">
                                {audioCategories.map((category) => {
                                    const isActive = currentAudioCategory === category;
                                    const bgColor = isActive ? colors.primary : colors['dark-grey'];

                                    return (
                                        <IntegrityButton
                                            key={category}
                                            onClick={() => handleCategoryChange(category)}
                                            backgroundColor={bgColor}
                                            borderColor={colors.primary}
                                            textColor={colors.white}
                                            className=""
                                        >
                                            <span className="cursor-pointer" onClick={() => handleCategoryChange(category)}>
                                            {category}
                                            </span>
                                        </IntegrityButton>
                                    );
                                })}
                            </div>
                            {/* Album display */}
                            <motion.div 
                                className="flex flex-col items-center mb-12"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: animationTokens.duration1 }}
                            >
                                <motion.div 
                                    className="w-[280px] aspect-square relative mb-6"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: animationTokens.duration2 }}
                                >
                                    <Image
                                        src={currentAudioData.albums[audioIndex]?.audio_image || '/assets/images/integrity-albumn-cover.png'}
                                        alt="Album cover"
                                        fill
                                        className="object-cover rounded-lg"
                                        priority
                                    />

                                {/* NOTE AD PLAY BUTTON HERE THAT PLAYS THE CURRENT LIKE ALBUMN ESSENTIALLY AND PAUSES IT WHEN PRESSED YOU KNOW */}
                                    <div className="absolute bottom-5 right-5">
                                        <button
                                            onClick={() => {
                                                // Check if we're currently playing tracks from a different album or category
                                                const currentAlbumTracks = currentAudioData.tracks;
                                                const isCurrentAlbumPlaying = showAudioPlayer && 
                                                    currentTrackIndex !== undefined && 
                                                    currentAlbumTracks.some(track => track.id === currentAudioData.tracks[currentTrackIndex]?.id);

                                                if (!isCurrentAlbumPlaying) {
                                                    if (currentAlbumTracks.length > 0) {
                                                        // If we're in a different category from what's playing, reset everything
                                                        if (showAudioPlayer) {
                                                            setShowAudioPlayer(false);
                                                            setFileIsPlaying(false);
                                                            audioRef.current?.pause();
                                                        }
                                                        // Start playing the current album
                                                        handleTrackSelect(currentAlbumTracks[0], 0);
                                                    }
                                                } else {
                                                    // We're on the correct album, just toggle play/pause
                                                    if (fileIsPlaying) {
                                                        audioRef.current?.pause();
                                                        setFileIsPlaying(false);
                                                    } else {
                                                        audioRef.current?.play();
                                                        setFileIsPlaying(true);
                                                    }
                                                }
                                            }}
                                            className="w-12 h-12 cursor-pointer rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform"
                                            style={{ backgroundColor: colors.primary }}
                                        >
                                            {fileIsPlaying && showAudioPlayer && currentTrackIndex !== undefined && 
                                             currentAudioData.tracks.some(track => track.id === currentAudioData.tracks[currentTrackIndex]?.id) ? (
                                                <FaPause className="w-4 h-4 text-white" />
                                            ) : (
                                                <FaPlay className="w-4 h-4 text-white" />
                                            )}
                                        </button>
                                    </div>
                                </motion.div>

                                <motion.p 
                                    style={{
                                        color: colors.primary, 
                                        fontFamily: 'boldMain', 
                                        fontWeight: 'bold'
                                    }} 
                                    className="text-center text-[0.8rem]"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: animationTokens.duration1, delay: animationTokens.delay1 }}
                                >
                                    {currentAudioData.albums[audioIndex]?.audio_description_1}
                                </motion.p>
                                <motion.p 
                                    style={{
                                        color: colors.grey,
                                        fontFamily: 'boldMain',
                                        fontWeight: 'bold'
                                    }} 
                                    className="text-[0.7rem]"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: animationTokens.duration1, delay: animationTokens.delay1 + 0.1 }}
                                >
                                        {currentAudioData.albums[audioIndex]?.audio_description_2}
                                </motion.p>
                            </motion.div>

                            {/* Track list */}
                            <motion.div 
                                className="max-w-3xl mx-auto space-y-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: animationTokens.duration2 }}
                            >
                                {currentAudioData.tracks.map((track, index) => (
                                    <motion.button
                                        key={track.id}
                                        onClick={() => handleTrackSelect(track, index)}
                                        className="w-full cursor-pointer flex items-center p-4 bg-[#111] hover:bg-[#222] rounded-lg"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ 
                                            duration: animationTokens.duration1, 
                                            delay: index * 0.1 
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Image
                                            src={track.image}
                                            alt="Track thumbnail"
                                            width={48}
                                            height={48}
                                            className="rounded-md mr-4"
                                        />
                                        <div className="text-left">
                                            <div style={{color: colors.primary, fontFamily: 'boldMain', fontWeight: 'bold'}} className="">{track.title}</div>
                                            <div className="text-[0.7rem]" style={{color: colors.grey, fontFamily: 'boldMain',}}>{track.title}</div>
                                        </div>
                                    </motion.button>
                                ))}
                            </motion.div>
                        </div>
                    </div>

                    {/* Audio player */}
                    {showAudioPlayer && (
                        <motion.div 
                            className="bg-[#111] fixed bottom-0 left-0 border-t w-full border-[#333] p-4"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            transition={{ duration: animationTokens.duration1 }}
                        >
                            <button
                                onClick={() => {
                                    setShowAudioPlayer(false);
                                    setFileIsPlaying(false);
                                    audioRef.current?.pause();
                                }}
                                className="absolute cursor-pointer top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-[#222]"
                                style={{backdropFilter: 'blur(8px)'}}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <div className="">
                                <AudioPlayer 
                                    playlist={currentAudioData.tracks}
                                />
                            </div>
                        </motion.div>
                    )}
                </>
            ) : (
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
                            <FaLock className="text-4xl text-[#C4A962]" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                            className="w-full max-w-md space-y-6"
                        >
                            <div className="space-y-2">
                                <motion.label
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 0.7 }}
                                    style={{
                                        fontFamily: 'boldMain',
                                    }}
                                    className="block text-gray-400 text-sm font-bold"
                                >
                                    Email:
                                </motion.label>
                                <motion.input
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 0.8 }}
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    placeholder="Enter your email"
                                    style={{
                                        backgroundColor: colors.grey,
                                        fontFamily: 'main',
                                    }}
                                    className="w-full p-3 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-[#C4A962]"
                                />
                            </div>

                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.9 }}
                                onClick={handleAccess}
                                style={{
                                    fontFamily: 'boldMain',
                                }}
                                disabled={!isEmailValid}
                                className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${isEmailValid
                                        ? 'bg-[#C4A962] cursor-pointer text-white hover:bg-[#B39852]'
                                        : 'bg-black/60 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                UNLOCK
                            </motion.button>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 1 }}
                                className="w-full h-px bg-gray-700 my-6"
                            />

                            <div className="text-center">
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        fontFamily: 'boldMain',
                                    }}
                                    transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 }}
                                    className="text-[#C4A962] text-sm font-bold"
                                >
                                    Enter Your Email
                                </motion.p>
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        fontFamily: 'boldMain',
                                    }}
                                    transition={{ duration: animationTokens.duration2, delay: animationTokens.duration2 }}
                                    className="text-[#C4A962] text-sm font-bold"
                                >
                                    To Experience Integrity
                                </motion.p>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}

        </div>
        {/* NOTE - FOOTER */}
        <div className="w-full h-max">
            <IntegrityFooter />
        </div>

        </div>

        </>
    )
}
