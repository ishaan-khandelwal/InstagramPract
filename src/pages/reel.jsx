import { useCallback, useEffect, useRef, useState } from "react";
import SideHamBurger from "../utils/sideHamBurger";
import { getApiUrl } from "../utils/api";
import "./reel.css";

const MAX_RESULTS = 6;
const QUERY_POOL = [
    "viral shorts",
    "motivation shorts",
    "fitness shorts",
    "comedy shorts",
    "tech shorts",
    "travel shorts",
    "food shorts"
];

function Reel() {
    const [reels, setReels] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [activeReelId, setActiveReelId] = useState(null);
    const [isSoundEnabled, setIsSoundEnabled] = useState(false);
    const feedRef = useRef(null);
    const observerRef = useRef(null);
    const isLoadingRef = useRef(false);
    const nextPageTokenRef = useRef(null);
    const queryIndexRef = useRef(0);
    const instanceCounterRef = useRef(0);

    const fetchReels = useCallback(async () => {
        if (isLoadingRef.current) {
            return;
        }

        isLoadingRef.current = true;
        setIsLoading(true);
        setErrorMessage("");

        const query = QUERY_POOL[queryIndexRef.current];
        const params = new URLSearchParams({
            maxResults: String(MAX_RESULTS),
            q: query
        });

        if (nextPageTokenRef.current) {
            params.set("pageToken", nextPageTokenRef.current);
        }

        try {
            const response = await fetch(getApiUrl(`/api/reels?${params.toString()}`));
            const payload = await response.json();

            if (!response.ok) {
                throw new Error(payload?.message || "Unable to load reels right now.");
            }

            const incoming = Array.isArray(payload?.items) ? payload.items : [];
            const mappedIncoming = incoming.map((item) => ({
                ...item,
                instanceId: `${item.id}-${instanceCounterRef.current++}`
            }));

            setReels((previous) => {
                const merged = [...previous, ...mappedIncoming];

                if (!activeReelId && merged.length > 0) {
                    setActiveReelId(merged[0].instanceId);
                }

                return merged;
            });

            const token = typeof payload?.nextPageToken === "string" ? payload.nextPageToken : null;

            if (token && incoming.length > 0) {
                nextPageTokenRef.current = token;
            } else {
                nextPageTokenRef.current = null;
                queryIndexRef.current = (queryIndexRef.current + 1) % QUERY_POOL.length;
            }
        } catch (error) {
            setErrorMessage(error.message || "Unable to load reels right now.");
            nextPageTokenRef.current = null;
            queryIndexRef.current = (queryIndexRef.current + 1) % QUERY_POOL.length;
        } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
            setIsInitialLoading(false);
        }
    }, [activeReelId]);

    useEffect(() => {
        fetchReels();
    }, []);

    useEffect(() => {
        const handleFirstInteraction = () => {
            setIsSoundEnabled(true);
            window.removeEventListener("pointerdown", handleFirstInteraction);
        };

        window.addEventListener("pointerdown", handleFirstInteraction, { passive: true });
        return () => {
            window.removeEventListener("pointerdown", handleFirstInteraction);
        };
    }, []);

    useEffect(() => {
        if (!feedRef.current) {
            return undefined;
        }

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute("data-reel-instance-id");
                        if (id) {
                            setActiveReelId(id);
                        }
                    }
                }
            },
            {
                root: feedRef.current,
                threshold: 0.7
            }
        );

        const nodes = feedRef.current.querySelectorAll("[data-reel-instance-id]");
        nodes.forEach((node) => observerRef.current?.observe(node));

        return () => {
            observerRef.current?.disconnect();
        };
    }, [reels]);

    useEffect(() => {
        if (!feedRef.current || reels.length === 0) {
            return undefined;
        }

        const feedNode = feedRef.current;
        const handleScroll = () => {
            const remaining = feedNode.scrollHeight - feedNode.scrollTop - feedNode.clientHeight;
            if (remaining < 340) {
                fetchReels();
            }
        };

        feedNode.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            feedNode.removeEventListener("scroll", handleScroll);
        };
    }, [fetchReels, reels.length]);

    return (
        <main className="dashboard-shell">
            <SideHamBurger />
            <section className="dashboard-content reels-content">
                {isInitialLoading ? <p className="reels-status">Loading reels...</p> : null}
                {errorMessage ? <p className="reels-status reels-status-error">{errorMessage}</p> : null}

                <div className="reels-feed" ref={feedRef}>
                    {reels.map((item) => {
                        const isActive = item.instanceId === activeReelId;
                        const muteValue = isSoundEnabled ? "0" : "1";
                        const src = isActive
                            ? `https://www.youtube.com/embed/${item.id}?autoplay=1&mute=${muteValue}&controls=1&modestbranding=1&playsinline=1&rel=0`
                            : `https://www.youtube.com/embed/${item.id}?autoplay=0&mute=${muteValue}&controls=1&modestbranding=1&playsinline=1&rel=0`;

                        return (
                            <article className="reel-slide" key={item.instanceId} data-reel-instance-id={item.instanceId}>
                                <div className="reel-player-shell">
                                    <iframe
                                        className="reel-player"
                                        src={src}
                                        title={item.title || "Reel"}
                                        loading="lazy"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                                <div className="reel-meta">
                                    <h2>{item.title || "Untitled reel"}</h2>
                                    <p>@{item.channelTitle || "creator"}</p>
                                </div>
                            </article>
                        );
                    })}

                    {isLoading && !isInitialLoading ? <p className="reels-status">Loading more reels...</p> : null}
                </div>
                {!isSoundEnabled ? (
                    <button
                        type="button"
                        className="reels-sound-overlay"
                        onClick={() => setIsSoundEnabled(true)}
                    >
                        Tap to enable sound
                    </button>
                ) : null}
            </section>
        </main>
    );
}

export default Reel;
