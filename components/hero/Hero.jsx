"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Inter, Playfair_Display } from 'next/font/google';
import AuthModal from '../auth/AuthModal';
import LogoutLoader from '../auth/LogoutLoader';
import { signOut } from "next-auth/react";
const inter = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '500', '700', '900'],
    display: 'swap',
});

export default function Hero() {
    const containerRef = useRef(null);
    const ctaRef = useRef(null);
    const videoRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const router = useRouter();
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();

    // Track authentication status changes
    useEffect(() => {
        const error = searchParams.get('error');
        if (error) {
            toast.error('Sign-in was canceled. Please try again.');
        }
    }, [searchParams]);

    useEffect(() => {
        // Handle video loading state with faster detection
        if (videoRef.current) {
            const video = videoRef.current;

            // Set loading to false when video can start playing
            video.oncanplay = () => {
                setIsLoading(false);
            };

            // Fallback: Set loading to false after 3 seconds
            const fallbackTimeout = setTimeout(() => {
                setIsLoading(false);
            }, 3000);

            return () => clearTimeout(fallbackTimeout);
        }
    }, []);

    useEffect(() => {
        // Mouse move effect for subtle parallax
        const handleMouseMove = (e) => {
            setMousePosition({
                x: e.clientX / window.innerWidth - 0.5,
                y: e.clientY / window.innerHeight - 0.5
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Calculate transform based on mouse position for parallax effect
    const textTransform = {
        transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`
    };

    const overlayTransform = {
        transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`
    };

    // Handle Create Resume button click
    const handleCreateResume = () => {
        if (session) {
            // User is already authenticated, redirect to resume builder
            router.push('/builder');
        } else {
            // User is not authenticated, show auth modal
            setIsAuthModalOpen(true);
        }
    };

    const handleCloseAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    const handleSignOut = async () => {
        setIsLoggingOut(true);
        try {
            await signOut({ callbackUrl: '/' });
        } catch (error) {
            // Handle any errors
        } finally {
            // The page will redirect, so we don't need to set loading to false
        }
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black">

            {/* Animated gradient background that shows before video loads */}
            <div
                className="absolute top-0 left-0 w-full h-full opacity-70 transition-opacity duration-1000"
                style={{
                    background: "linear-gradient(125deg, #000000 0%, #1a1a2e 50%, #16213e 100%)",
                    display: isLoading ? 'block' : 'none'
                }}
            />

            {/* Video background with subtle parallax effect */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute top-0 left-0 w-full h-full object-cover opacity-70 scale-105 transition-transform duration-1000"
                    style={{
                        display: isLoading ? 'none' : 'block',
                        transform: `scale(1.05) translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`
                    }}
                >
                    <source src="https://ik.imagekit.io/profocto/background.mp4?updatedAt=1759063890063" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Ripple Grid Background (from reactbits.dev) */}
            <div className="absolute inset-0 z-5 opacity-40">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:70px_70px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-pink-900/10 to-purple-900/10"></div>
                <div className="absolute left-1/4 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-purple-500/20 blur-[80px]"></div>
                <div className="absolute right-1/4 top-0 h-[300px] w-[600px] -translate-y-1/2 rounded-full bg-pink-500/30 blur-[80px]"></div>
            </div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 z-15">
                {/* Main grid with thicker lines */}
                <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                }}></div>

                {/* Larger grid with slightly thicker lines */}
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(255, 255, 255, 0.2) 1.5px, transparent 1.5px),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1.5px, transparent 1.5px)
                    `,
                    backgroundSize: '100px 100px'
                }}></div>

                {/* Diagonal grid pattern */}
                <div className="absolute inset-0 opacity-15" style={{
                    backgroundImage: `
                        linear-gradient(45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.1) 75%, rgba(255, 255, 255, 0.1)),
                        linear-gradient(-45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.1) 75%, rgba(255, 255, 255, 0.1))
                    `,
                    backgroundSize: '60px 60px'
                }}></div>
            </div>

            {/* Geometric pattern overlay */}
            <div className="absolute inset-0 z-15 opacity-10">
                {/* Corner circles - hidden on mobile */}
                <div className="absolute top-10 left-10 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full border-2 border-white/20 hidden sm:block"></div>
                <div className="absolute top-10 right-10 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full border-2 border-white/20 hidden sm:block"></div>
                <div className="absolute bottom-10 left-10 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full border-2 border-white/20 hidden sm:block"></div>
                <div className="absolute bottom-10 right-10 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full border-2 border-white/20 hidden sm:block"></div>

                {/* Center crosshair - always visible but subtle on mobile */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 sm:via-white/30 to-transparent"></div>
                <div className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/20 sm:via-white/30 to-transparent"></div>
            </div>

            {/* Header Information */}
            <div className="absolute top-4 sm:top-8 left-4 sm:left-8 z-20 text-white/80 text-xs sm:text-sm font-light tracking-wide transition-all duration-500 hover:text-white">
                <div className="opacity-80 hover:opacity-100 transition-opacity">RESUME BUILDER</div>
                <div className="mt-1 opacity-60 hover:opacity-100 transition-opacity">SERIF DESIGN</div>
            </div>

            <div className={`absolute z-[9999] top-4 sm:top-8 right-4 sm:right-8 z-20 text-white/80 text-xs sm:text-sm font-light tracking-wide text-right transition-all duration-500 hover:text-white ${inter.className}`}>
                {session ? (
                    <div className="flex flex-col items-end gap-2">
                        <div className="opacity-80 hover:opacity-100 transition-opacity">LOGGED IN</div>
                        <button
                            onClick={handleSignOut}
                            disabled={isLoggingOut}
                            className="relative  pointer-events-auto text-pink-300 cursor-pointer hover:text-pink-200 transition-colors opacity-60 hover:opacity-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="opacity-80 hover:opacity-100 transition-opacity">ESTABLISHED</div>
                        <div className="mt-1 opacity-60 hover:opacity-100 transition-opacity">2025</div>
                    </>
                )}
            </div>

            {/* Main Content */}
            <div ref={containerRef} className="relative z-20 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-4">
                {/* Introducing Badge with animation */}
                <div className="mb-8 sm:mb-12 transform transition-all duration-700 hover:scale-105">
                    <div className={`inline-flex items-center justify-center px-4 sm:px-6 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md transition-all duration-500 hover:bg-white/20 hover:border-white/40 ${inter.className}`}>
                        <span className="text-white text-xs sm:text-sm font-light tracking-wider uppercase">
                            Introducing
                        </span>
                    </div>
                </div>

                {/* Main Typography with subtle parallax */}
                <div className="text-center mb-12 sm:mb-16 transform transition-transform duration-1000" style={textTransform}>
                    <div className="relative">
                        {/* Side decorative text */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full hidden xl:block">
                            <div className={`text-white/30 text-lg font-light tracking-widest uppercase rotate-90 origin-center ${inter.className}`}>
                                Creative
                            </div>
                        </div>

                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full hidden xl:block">
                            <div className={`text-white/30 text-lg font-light tracking-widest uppercase -rotate-90 origin-center ${inter.className}`}>
                                Modern
                            </div>
                        </div>

                        <h1 className={`mb-4 ${playfair.className}`}>
                            <div className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[12rem] leading-tight tracking-tight font-bold bg-gradient-to-r from-white via-pink-200 to-pink-300 bg-clip-text text-transparent drop-shadow-lg pb-2">
                                Profile
                            </div>
                            <div className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[12rem] leading-tight tracking-tight -mt-1 sm:-mt-2 md:-mt-4 lg:-mt-6 font-bold bg-gradient-to-r from-pink-300 via-pink-200 to-white bg-clip-text text-transparent drop-shadow-lg pb-4 sm:pb-6">
                                Élegante
                            </div>
                        </h1>
                    </div>

                    {/* Subtitle */}
                    <div className={`mt-8 sm:mt-16 space-y-1 ${inter.className}`}>
                        <p className="text-white/80 text-sm sm:text-lg font-light tracking-wider uppercase transition-all duration-500 hover:text-white px-4 sm:px-0">
                            {session ? 'Your Resume Builder Dashboard' : 'Elegant and Modern Resume Builder'}
                        </p>
                        <p className="text-white/60 text-xs sm:text-sm font-light tracking-wider uppercase transition-all duration-500 hover:text-white/80">
                            {session ? 'Manage and create your professional resumes' : 'Created by ResumeType'}
                        </p>
                    </div>
                </div>

                {session ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className={`text-white/80 text-sm ${inter.className}`}>
                            Welcome back, <span className="text-pink-300 font-medium">{session.user?.name || session.user?.email}</span>
                        </div>
                        <button
                            ref={ctaRef}
                            onClick={handleCreateResume}
                            className={`inline-flex h-10 sm:h-12 items-center justify-center rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 sm:px-8 text-sm sm:text-base font-semibold transition-all duration-300 hover:from-pink-600 hover:to-pink-700 hover:shadow-lg transform hover:scale-105 ${inter.className}`}
                        >
                            Go to Dashboard
                        </button>
                    </div>
                ) : (
                    <button
                        ref={ctaRef}
                        onClick={handleCreateResume}
                        className={`inline-flex h-10 sm:h-12 items-center justify-center rounded-lg bg-white text-black px-6 sm:px-8 text-sm sm:text-base font-semibold transition-all duration-300 hover:bg-gray-100 hover:shadow-lg ${inter.className}`}
                    >
                        Create Resume
                    </button>
                )}
            </div>

            {/* Animated gradient overlay for better text contrast */}
            <div
                className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-transparent to-black/30 opacity-60 transition-transform duration-1000"
                style={overlayTransform}
            ></div>

            {/* Sleek corner accents with creative design */}
            {/* Top-left corner */}
            <div className="absolute top-0 left-0 z-20 hidden sm:block">
                <div className="w-32 sm:w-48 h-32 sm:h-48 relative">
                    {/* Main corner lines - extended length */}
                    <div className="absolute top-0 left-0 w-20 sm:w-32 h-0.5 bg-gradient-to-r from-pink-400/70 to-transparent"></div>
                    <div className="absolute top-0 left-0 w-0.5 h-20 sm:h-32 bg-gradient-to-b from-pink-400/70 to-transparent"></div>

                    {/* Secondary accent lines - extended */}
                    <div className="absolute top-2 sm:top-3 left-0 w-16 sm:w-24 h-px bg-gradient-to-r from-pink-300/50 to-transparent"></div>
                    <div className="absolute top-0 left-2 sm:left-3 w-px h-16 sm:h-24 bg-gradient-to-b from-pink-300/50 to-transparent"></div>

                    {/* Tertiary accent lines for more coverage */}
                    <div className="absolute top-4 sm:top-6 left-0 w-12 sm:w-16 h-px bg-gradient-to-r from-pink-200/30 to-transparent"></div>
                    <div className="absolute top-0 left-4 sm:left-6 w-px h-12 sm:h-16 bg-gradient-to-b from-pink-200/30 to-transparent"></div>

                    {/* Corner dot */}
                    <div className="absolute top-0 left-0 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-pink-400/60 rounded-full"></div>
                </div>
            </div>

            {/* Top-right corner */}
            <div className="absolute top-0 right-0 z-20 hidden sm:block">
                <div className="w-32 sm:w-48 h-32 sm:h-48 relative">
                    {/* Main corner lines - extended length */}
                    <div className="absolute top-0 right-0 w-20 sm:w-32 h-0.5 bg-gradient-to-l from-pink-400/70 to-transparent"></div>
                    <div className="absolute top-0 right-0 w-0.5 h-20 sm:h-32 bg-gradient-to-b from-pink-400/70 to-transparent"></div>

                    {/* Secondary accent lines - extended */}
                    <div className="absolute top-2 sm:top-3 right-0 w-16 sm:w-24 h-px bg-gradient-to-l from-pink-300/50 to-transparent"></div>
                    <div className="absolute top-0 right-2 sm:right-3 w-px h-16 sm:h-24 bg-gradient-to-b from-pink-300/50 to-transparent"></div>

                    {/* Tertiary accent lines for more coverage */}
                    <div className="absolute top-4 sm:top-6 right-0 w-12 sm:w-16 h-px bg-gradient-to-l from-pink-200/30 to-transparent"></div>
                    <div className="absolute top-0 right-4 sm:right-6 w-px h-12 sm:h-16 bg-gradient-to-b from-pink-200/30 to-transparent"></div>

                    {/* Corner dot */}
                    <div className="absolute top-0 right-0 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-pink-400/60 rounded-full"></div>
                </div>
            </div>

            {/* Bottom-left corner */}
            <div className="absolute bottom-0 left-0 z-20 hidden sm:block">
                <div className="w-32 sm:w-48 h-32 sm:h-48 relative">
                    {/* Main corner lines - extended length */}
                    <div className="absolute bottom-0 left-0 w-20 sm:w-32 h-0.5 bg-gradient-to-r from-pink-400/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-0.5 h-20 sm:h-32 bg-gradient-to-t from-pink-400/70 to-transparent"></div>

                    {/* Secondary accent lines - extended */}
                    <div className="absolute bottom-2 sm:bottom-3 left-0 w-16 sm:w-24 h-px bg-gradient-to-r from-pink-300/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-2 sm:left-3 w-px h-16 sm:h-24 bg-gradient-to-t from-pink-300/50 to-transparent"></div>

                    {/* Tertiary accent lines for more coverage */}
                    <div className="absolute bottom-4 sm:bottom-6 left-0 w-12 sm:w-16 h-px bg-gradient-to-r from-pink-200/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-4 sm:left-6 w-px h-12 sm:h-16 bg-gradient-to-t from-pink-200/30 to-transparent"></div>

                    {/* Corner dot */}
                    <div className="absolute bottom-0 left-0 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-pink-400/60 rounded-full"></div>
                </div>
            </div>

            {/* Bottom-right corner */}
            <div className="absolute bottom-0 right-0 z-20 hidden sm:block">
                <div className="w-32 sm:w-48 h-32 sm:h-48 relative">
                    {/* Main corner lines - extended length */}
                    <div className="absolute bottom-0 right-0 w-20 sm:w-32 h-0.5 bg-gradient-to-l from-pink-400/70 to-transparent"></div>
                    <div className="absolute bottom-0 right-0 w-0.5 h-20 sm:h-32 bg-gradient-to-t from-pink-400/70 to-transparent"></div>

                    {/* Secondary accent lines - extended */}
                    <div className="absolute bottom-2 sm:bottom-3 right-0 w-16 sm:w-24 h-px bg-gradient-to-l from-pink-300/50 to-transparent"></div>
                    <div className="absolute bottom-0 right-2 sm:right-3 w-px h-16 sm:h-24 bg-gradient-to-t from-pink-300/50 to-transparent"></div>

                    {/* Tertiary accent lines for more coverage */}
                    <div className="absolute bottom-4 sm:bottom-6 right-0 w-12 sm:w-16 h-px bg-gradient-to-l from-pink-200/30 to-transparent"></div>
                    <div className="absolute bottom-0 right-4 sm:right-6 w-px h-12 sm:h-16 bg-gradient-to-t from-pink-200/30 to-transparent"></div>

                    {/* Corner dot */}
                    <div className="absolute bottom-0 right-0 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-pink-400/60 rounded-full"></div>
                </div>
            </div>

            {/* Floating elements for enhanced design */}
            <div className="absolute top-1/4 left-1/3 z-10 hidden md:block">
                <div className="w-1 h-1 bg-pink-300/40 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute top-3/4 right-1/4 z-10 hidden md:block">
                <div className="w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            <div className="absolute top-1/2 right-1/3 z-10 hidden lg:block">
                <div className="w-0.5 h-0.5 bg-pink-200/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Custom styles for animations */}
            <style jsx>{`
                @keyframes float {
                    0% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                    100% { transform: translateY(0) rotate(0deg); }
                }
                
                .animate-shimmer {
                    background-size: 200% 200%;
                    animation: shimmer 3s ease-in-out infinite;
                }
                
                @keyframes shimmer {
                    0% { background-position: 0% 0%; }
                    50% { background-position: 100% 100%; }
                    100% { background-position: 0% 0%; }
                }
            `}</style>

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={handleCloseAuthModal}
            />

            {/* Logout Loading */}
            <LogoutLoader isVisible={isLoggingOut} />
        </div>
    );
}