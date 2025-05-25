'use client'

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useAudioContext } from '@/app/providers/AudioContextProvider';
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';
import { BiLoaderAlt } from 'react-icons/bi';
import { colors } from '@/app/tokens/colors';

interface AudioFile {
    id: number;
    image: string;
    url: string;
    title: string;
    tags: string[];
}

interface AudioPlayerProps {
    playlist: AudioFile[];
    defaultImage?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
    playlist,
}) => {
    const { 
        fileIsPlaying, 
        fileIsPaused,
        fileIsLoading,
        setFileIsPlaying,
        setFileIsPaused,
        setFileIsLoading,
        currentTime,
        currentTrackIndex,
        currentPlaylist,
        skipToNext,
        skipToPrevious,
        playTrack,
        loadPlaylist,
        audioRef
    } = useAudioContext();

    useEffect(() => {
        // Only load the playlist without playing
        if (playlist.length > 0 && currentPlaylist.length === 0) {
            loadPlaylist(playlist);
        }
    }, [playlist, currentPlaylist.length, loadPlaylist]);

    const togglePlayPause = async () => {
        if (fileIsPlaying) {
            audioRef.current?.pause();
            setFileIsPlaying(false);
            setFileIsPaused(true);
        } else {
            setFileIsLoading(true);
            try {
                // If we're starting playback, use playTrack to ensure proper initialization
                if (fileIsPaused) {
                    await audioRef.current?.play();
                } else {
                    playTrack(currentTrackIndex, currentPlaylist);
                }
                setFileIsPlaying(true);
                setFileIsPaused(false);
            } catch (error) {
                console.error('Error playing audio:', error);
            } finally {
                setFileIsLoading(false);
            }
        }
    };

    const currentTrack = currentPlaylist[currentTrackIndex];
    if (!currentTrack) return null;

    const duration = audioRef.current?.duration || 0;
    const progress = duration ? (currentTime / duration) * 100 : 0;

    const PlayButtonIcon = () => {
        if (fileIsLoading) {
            return <BiLoaderAlt className="w-4 h-4 animate-spin" />;
        }
        return fileIsPlaying ? (
            <FaPause className="w-4 h-4" />
        ) : (
            <FaPlay className="w-4 h-4" />
        );
    };

    return (
        <div className="flex items-center bg-[#111] py-2  w-full gap-6 border-t">
            <div className="flex-shrink-0">
                <Image 
                    src={currentTrack.image}
                    alt="Album Art"
                    width={48}
                    height={48}
                    className="rounded-lg object-cover"
                />
            </div>
            
            <div className="flex items-center gap-4">
                <button 
                    className={`w-8 h-8 cursor-pointer rounded-full flex items-center justify-center transition-all
                              text-white hover:text-[${colors.primary}] disabled:opacity-50 disabled:cursor-not-allowed`}
                    onClick={skipToPrevious}
                    aria-label="Previous Track"
                    disabled={fileIsLoading}
                >
                    <FaStepBackward className="w-3 h-3" />
                </button>

                <button 
                    className={`w-10 h-10 cursor-pointer rounded-full flex items-center justify-center transition-all
                              bg-[${colors.primary}] text-white hover:opacity-90 disabled:opacity-50 
                              disabled:cursor-not-allowed relative overflow-hidden`}
                    onClick={togglePlayPause}
                    aria-label={fileIsPlaying ? 'Pause' : 'Play'}
                    disabled={fileIsLoading}
                    style={{ backgroundColor: colors.primary }}
                >
                    <PlayButtonIcon />
                </button>

                <button 
                    className={`w-8 h-8 cursor-pointer rounded-full flex items-center justify-center transition-all
                              text-white hover:text-[${colors.primary}] disabled:opacity-50 disabled:cursor-not-allowed`}
                    onClick={skipToNext}
                    aria-label="Next Track"
                    disabled={fileIsLoading}
                >
                    <FaStepForward className="w-3 h-3" />
                </button>
            </div>

            <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white mb-2 truncate" style={{ fontFamily: 'boldMain' }}>
                    {currentTrack.title}
                </div>
                <div className="h-1 bg-[#333] rounded-full overflow-hidden cursor-pointer">
                    <div 
                        className="h-full transition-[width] duration-100 rounded-full"
                        style={{ 
                            width: `${progress}%`,
                            backgroundColor: colors.primary
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;