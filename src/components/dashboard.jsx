import SideHamBurger from "../utils/sideHamBurger";
import "./dashboard.css";
import { useState, useEffect } from "react";
import { getApiUrl } from "../utils/api";
import { getAuthToken } from "../utils/auth";

const statusItems = ["You", "Meta", "Google", "Vite", "React"];

function Dashboard() {
    const [posts, setPosts] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const token = getAuthToken();
        if (token) {
            fetch(getApiUrl("/api/verify-token"), {
                headers: { "Authorization": `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => setCurrentUserId(data.userId))
                .catch(err => console.error("Error verifying token:", err));
        }
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch(getApiUrl("/api/posts"));
            const data = await res.json();
            if (data.status === "success") {
                setPosts(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        }
    };

    const handleLike = async (postId) => {
        const token = getAuthToken();
        if (!token) {
            alert("Please login to like posts");
            return;
        }

        try {
            const res = await fetch(getApiUrl(`/api/posts/${postId}/like`), {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.status === "success") {
                // Optimistically update the UI or refetch
                setPosts(prevPosts => prevPosts.map(post => {
                    if (post._id === postId) {
                        const isLiked = post.likes.includes(currentUserId);
                        return {
                            ...post,
                            likes: isLiked
                                ? post.likes.filter(id => id !== currentUserId)
                                : [...post.likes, currentUserId]
                        };
                    }
                    return post;
                }));
            }
        } catch (error) {
            console.error("Failed to toggle like:", error);
        }
    };

    return (

        <main className="dashboard-shell">
            <SideHamBurger />
            <section className="dashboard-content">
                <div className="dashboard-placeholder">
                    <div className="dashboard-status">
                        {statusItems.map((name) => (
                            <button className="dashboard-status-item" type="button" key={name}>
                                <span className="dashboard-status-avatar">{name.slice(0, 1)}</span>
                                <span className="dashboard-status-name">{name}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="dashboard-posts-list">
                    {posts.length > 0 ? (
                        posts.map((post) => {
                            const isLiked = post.likes.includes(currentUserId);
                            return (
                                <div className="dashboard-post" key={post._id}>
                                    <div className="dashboard-post-card">
                                        <div className="dashboard-post-profile">
                                            <div className="dashboard-post-profile-image">
                                                {post.author?.username?.slice(0, 1).toUpperCase() || "U"}
                                            </div>
                                            <p className="dashboard-post-profile-name">{post.author?.username || "User"}</p>
                                            <button className="dashboard-post-profile-options" type="button" aria-label="Post options">...</button>
                                        </div>
                                        <div className="dashboard-post-image">
                                            {post.imageUrl ? (
                                                <img src={post.imageUrl} alt="Post content" />
                                            ) : (
                                                <span>Post Content</span>
                                            )}
                                        </div>
                                        <div className="dashboard-post-footer">
                                            <div className="dashboard-post-footer-icons">
                                                <button
                                                    type="button"
                                                    onClick={() => handleLike(post._id)}
                                                    className={isLiked ? "liked" : ""}
                                                >
                                                    {isLiked ? "❤️ Liked" : "🤍 Like"}
                                                </button>
                                                <button type="button" >🗨️ Comment</button>
                                                <button type="button" >➤ Share</button>
                                            </div>
                                            <div className="dashboard-post-footer-likes">
                                                <p>{post.likes.length} {post.likes.length === 1 ? "like" : "likes"}</p>
                                            </div>
                                            <div className="dashboard-post-footer-caption">
                                                <p>{post.caption}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="dashboard-post">
                            <div className="dashboard-post-card">
                                <div className="dashboard-post-profile">
                                    <div className="dashboard-post-profile-image">G</div>
                                    <p className="dashboard-post-profile-name">Google</p>
                                    <button className="dashboard-post-profile-options" type="button">...</button>
                                </div>
                                <div className="dashboard-post-image">
                                    <span>No Posts Found</span>
                                </div>
                                <div className="dashboard-post-footer">
                                    <p style={{ textAlign: "center", padding: "20px" }}>
                                        No posts available in the database.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}

export default Dashboard
