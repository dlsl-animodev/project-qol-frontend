"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import IdleScreen from "./idle-screen";
import TypingScreen from "./typing-screen";
import LoadingScreen from "./loading-screen";
import DisplayScreen from "./display-screen";
import ErrorScreen from "./error-screen";
import { gsap } from "gsap";
import { toast } from "sonner";

import "./event-style.css";

enum AppState {
    Idle,
    Typing,
    Loading,
    Display,
    Error,
}

type StudentApiResponse = {
    error?: string;
    email_address: string;
    department: string;
    partner_id: string;
}

export function EventScreen() {
    const [appState, setAppState] = useState<AppState>(AppState.Idle);
    const [studentId, setStudentId] = useState<string>('');
    const [studentData, setStudentData] = useState<StudentApiResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    const idleRef = useRef<HTMLDivElement>(null);
    const typingRef = useRef<HTMLDivElement>(null);
    const loadingRef = useRef<HTMLDivElement>(null);
    const displayRef = useRef<HTMLDivElement>(null);
    const errorRef = useRef<HTMLDivElement>(null);


    const stateRefs = useMemo(() => ({
        [AppState.Idle]: idleRef,
        [AppState.Typing]: typingRef,
        [AppState.Loading]: loadingRef,
        [AppState.Display]: displayRef,
        [AppState.Error]: errorRef,
    }), []);

    const prevStateRef = useRef<AppState>(appState);
    const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);
    // Track scheduled timeouts so we can clear them when needed
    const timeoutIdsRef = useRef<number[]>([]);


    const studentIdRef = useRef<string>('');
    // Sequence guard to ensure only the latest request updates the main display
    const latestRequestIdRef = useRef(0);

    // Small helper to schedule and track timeouts (ensures cleanup)
    const scheduleTimeout = useCallback((fn: () => void, delay: number) => {
        const id = window.setTimeout(fn, delay);
        timeoutIdsRef.current.push(id);
        return id;
    }, []);

    // Animation helpers to keep the transition effect logic tidy
    const animateOut = useCallback((state: AppState, prevEl: HTMLDivElement | null, tl: gsap.core.Timeline) => {
        switch (state) {
            case AppState.Idle:
                tl.to(prevEl, { scale: 1.2, autoAlpha: 0, duration: 0.4, ease: 'power2.in' });
                break;
            case AppState.Typing:
                tl.to(prevEl, { y: -50, autoAlpha: 0, duration: 0.4, ease: 'power2.in' });
                break;
            case AppState.Loading:
                tl.to(prevEl, { scale: 0.8, autoAlpha: 0, duration: 0.4, ease: 'power2.in' });
                break;
            case AppState.Display:
                tl.to(prevEl, { clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)', scale: 0.8, duration: 0.6, ease: 'power3.in' });
                break;
            case AppState.Error:
                tl.to(prevEl, { x: -20, autoAlpha: 0, duration: 0.35, ease: 'power2.in' });
                break;
            default:
                tl.to(prevEl, { autoAlpha: 0, duration: 0.4 });
        }
    }, []);

    const animateIn = useCallback((state: AppState, el: HTMLDivElement | null, tl: gsap.core.Timeline) => {
        switch (state) {
            case AppState.Idle:
                tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 });
                break;
            case AppState.Typing:
                tl.fromTo(el, { autoAlpha: 0, x: 100 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power2.out' });
                break;
            case AppState.Loading:
                tl.fromTo(el, { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' });
                break;
            case AppState.Display:
                tl.fromTo(el, { autoAlpha: 0, clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' },
                    { autoAlpha: 1, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 0.7, ease: 'power2.inOut' });
                break;
            case AppState.Error:
                tl.fromTo(el, { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power2.out' });
                break;
            default:
                tl.to(el, { autoAlpha: 1, duration: 0.5 });
        }
    }, []);


    useEffect(() => {
        gsap.set(idleRef.current, { autoAlpha: 1 });
        gsap.set([typingRef.current, loadingRef.current, displayRef.current, errorRef.current], { autoAlpha: 0, clipPath: '' });
    }, []);

    useEffect(() => {
        if (prevStateRef.current === appState) return;

        const prevRef = stateRefs[prevStateRef.current].current;
        const currentRef = stateRefs[appState].current;
        const prevAppState = prevStateRef.current;

        // Cancel any previous timeline and tweens to avoid lingering elements
        if (activeTimelineRef.current) {
            activeTimelineRef.current.kill();
            activeTimelineRef.current = null;
        }
        const all = [idleRef.current, typingRef.current, loadingRef.current, displayRef.current, errorRef.current].filter(Boolean) as HTMLDivElement[];
        gsap.killTweensOf(all);
        // Hide all non-participating screens immediately
        const others = all.filter((el) => el !== prevRef && el !== currentRef);
        gsap.set(others, { autoAlpha: 0 });

        const tl = gsap.timeline({ onComplete: () => { activeTimelineRef.current = null; } });
        activeTimelineRef.current = tl;

        // Animate out the previous screen, then animate in the current screen
        animateOut(prevAppState, prevRef, tl);
        animateIn(appState, currentRef, tl);

        prevStateRef.current = appState;
    }, [appState, stateRefs, animateIn, animateOut]);


    const startAttendance = useCallback((id: string) => {
        setAppState(AppState.Loading);

        // API: https://project-qol-backend.onrender.com/api/student?id=123456789
        const apiUrl = `https://project-qol-backend.onrender.com/api/student?id=${id}`;
        // Increment and capture a request sequence number
        const requestId = ++latestRequestIdRef.current;

        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then((data: StudentApiResponse | null) => {
                if (!data) {
                    throw new Error('No student data found');
                }

                if (data.error) {
                    throw new Error(data.error);
                }

                if (!data.email_address) {
                    throw new Error('Student email not found');
                }

                // Always show a toast for any successful scan
                toast.success("Attendance recorded", {
                    description: `${data.email_address || 'Unknown'} • ${data.partner_id || id}`,
                });

                // Only update the main display if this is the latest successful request
                if (latestRequestIdRef.current === requestId) {
                    setStudentData(data);
                    // Transition to display after a short delay, then back to idle
                    scheduleTimeout(() => setAppState(AppState.Display), 1000);
                    scheduleTimeout(() => setAppState(AppState.Idle), 3500);
                }
            })
            .catch((error) => {
                console.error('Error fetching API:', error);
                toast.error("Attendance error", { description: String(error) });
                if (latestRequestIdRef.current === requestId) {
                    setErrorMessage(String(error));
                    scheduleTimeout(() => setAppState(AppState.Error), 50);
                    scheduleTimeout(() => setAppState(AppState.Idle), 2500);
                }
            });
    }, [scheduleTimeout]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            // Handle delete
            if (event.key === 'Backspace') {
                studentIdRef.current = studentIdRef.current.slice(0, -1);
                setStudentId(studentIdRef.current);

                if (studentIdRef.current.length === 0) {
                    setAppState(AppState.Idle);
                }
                return;
            }

            // Submit current ID
            if (event.key === 'Enter' && studentIdRef.current.length > 0) {
                startAttendance(studentIdRef.current);
                studentIdRef.current = '';
                setStudentId('');
                return;
            }

            // Ignore non-character keys or IME composing
            if (event.isComposing || event.key.length > 1) return;

            // If starting a new input, clear any pending timeouts and switch to typing state
            if (studentIdRef.current === '') {
                timeoutIdsRef.current.forEach((id) => clearTimeout(id));
                timeoutIdsRef.current = [];
                setAppState(AppState.Typing);
            }

            // Append the typed character
            studentIdRef.current += event.key;
            setStudentId(studentIdRef.current);
        };

        window.addEventListener('keydown', handleKeyPress);

        // Cleanup listener and clear any pending timeouts on unmount
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            timeoutIdsRef.current.forEach((id) => clearTimeout(id));
        };
    }, [startAttendance]);

    return (
        <main
            className="bg-grid-animated text-orange-500 w-screen h-screen flex items-center justify-center p-4 overflow-hidden"
        >

            <div className="w-full max-w-4xl h-full max-h-[600px] bg-gradient-to-b from-orange-700 to-orange-900 p-6 rounded-3xl shadow-[0_0_40px_rgba(249,115,22,0.5),inset_0_4px_8px_rgba(0,0,0,0.6)] border-2 border-black/50">

                <div className="w-full h-full bg-black/80 rounded-xl relative overflow-hidden crt-screen">

                    <div className="inset-0 crt-content-bulge">

                        <div ref={idleRef} className="absolute inset-8">
                            <IdleScreen isActive={appState === AppState.Idle} />
                        </div>
                        <div ref={typingRef} className="absolute inset-8">
                            <TypingScreen isActive={appState === AppState.Typing} studentId={studentId} />
                        </div>
                        <div ref={loadingRef} className="absolute inset-8">
                            <LoadingScreen isActive={appState === AppState.Loading} />
                        </div>
                        <div ref={displayRef} className="absolute inset-8">
                            <DisplayScreen isActive={appState === AppState.Display} data={studentData ?? undefined} />
                        </div>
                        <div ref={errorRef} className="absolute inset-8">
                            <ErrorScreen isActive={appState === AppState.Error} message={errorMessage} />
                        </div>
                        <div className="absolute top-2 left-4 text-sm text-orange-500/70">ID_TAP TERMINAL V1.3.8</div>
                        <div className="absolute bottom-2 right-4 text-sm text-orange-500/70">SYSTEM STATUS: ONLINE</div>
                    </div>

                </div>

            </div>
        </main>
    );
}