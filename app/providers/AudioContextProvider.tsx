'use client'

import React, { createContext, useContext, useState, useRef } from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ConvexHttpClient } from 'convex/browser';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface AudioFile {
    id: number;
    image: string;
    url: string;
    title: string;
    tags: string[];
}

interface AudioObject {
    audio_files: AudioFile[];
    audio_image: string;
    audio_name: string;
    audio_description_1: string;
    audio_description_2: string;
    audio_release_date: string;
}

interface AudioContextProviderProps {
    fileIsPlaying: boolean;
    fileIsPaused: boolean;
    fileIsLoading: boolean;
    setFileIsPlaying: (value: boolean) => void;
    setFileIsPaused: (value: boolean) => void;
    setFileIsLoading: (value: boolean) => void;
    currentTime: number;
    setCurrentTime: (value: number) => void;
    musicFiles: AudioObject[];
    audioBookFiles: AudioObject[];
    currentTrackIndex: number;
    setCurrentTrackIndex: (value: number) => void;
    currentPlaylist: AudioFile[];
    setCurrentPlaylist: (value: AudioFile[]) => void;
    audioRef: React.RefObject<HTMLAudioElement | null>;
    skipToNext: () => void;
    skipToPrevious: () => void;
    playTrack: (index: number, playlist: AudioFile[]) => void;
    loadPlaylist: (playlist: AudioFile[]) => void;
    audioCategories: string[];
    checkEmailAccess: (email: string) => Promise<boolean>;
}

const AudioContext = createContext<AudioContextProviderProps | null>(null);

export default function AudioContextProvider({ children }: { children: React.ReactNode }) {
    const [fileIsPlaying, setFileIsPlaying] = useState(false);
    const [fileIsPaused, setFileIsPaused] = useState(false);
    const [fileIsLoading, setFileIsLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [currentPlaylist, setCurrentPlaylist] = useState<AudioFile[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioCategories = [
        'Music',
        "Audiobook"
    ]
    
    // Fetch data from Convex
    const musicFiles = useQuery(api.music.get) || [];
    const audioBookFiles = useQuery(api.audiobooks.get) || [];
    
    const loadPlaylist = (playlist: AudioFile[]) => {
        setCurrentPlaylist(playlist);
        setCurrentTrackIndex(0);
        if (audioRef.current) {
            audioRef.current.src = playlist[0].url;
        }
    };

    const playTrack = (index: number, playlist: AudioFile[]) => {
        setCurrentTrackIndex(index);
        setCurrentPlaylist(playlist);
        setFileIsPlaying(true);
        setFileIsPaused(false);
        if (audioRef.current) {
            audioRef.current.src = playlist[index].url;
            audioRef.current.play();
        }
    };

    const skipToNext = () => {
        if (currentPlaylist.length === 0) return;
        const nextIndex = (currentTrackIndex + 1) % currentPlaylist.length;
        playTrack(nextIndex, currentPlaylist);
    };

    const skipToPrevious = () => {
        if (currentPlaylist.length === 0) return;
        const prevIndex = (currentTrackIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
        playTrack(prevIndex, currentPlaylist);
    };

    const checkEmailAccess = async (email: string): Promise<boolean> => {
        try {
            const hasValidEmail = await convex.query(api.stripeLogs.checkEmailAccess, { email });
            return hasValidEmail;
        } catch (error) {
            console.error('Error checking email access:', error);
            return false;
        }
    };
    
    return (
        <>
            <audio
                ref={audioRef}
                onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
                onEnded={skipToNext}
            />
            <AudioContext.Provider value={{
                fileIsPlaying,
                fileIsPaused,
                fileIsLoading,
                setFileIsPlaying,
                setFileIsPaused,
                setFileIsLoading,
                currentTime,
                setCurrentTime,
                musicFiles,
                audioBookFiles,
                currentTrackIndex,
                setCurrentTrackIndex,
                currentPlaylist,
                setCurrentPlaylist,
                audioRef,
                skipToNext,
                skipToPrevious,
                playTrack,
                loadPlaylist,
                audioCategories,
                checkEmailAccess
            }}>
                {children}
            </AudioContext.Provider>
        </>
    );
}

export function useAudioContext() {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudioContext must be used within an AudioContextProvider');
    }
    return context;
}