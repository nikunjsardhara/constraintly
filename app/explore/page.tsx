"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { MessageCircle, TrendingUp, Clock, Tag, Trophy } from "lucide-react";

const EMOJIS = ["🔥", "❤️", "🚀", "💡", "👏", "😎"];

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string; image: string | null };
  replies?: Comment[];
}

interface ExploreItem {
  id: string;
  title: string;
  thumbnail: string | null;
  user: { id: string; name: string; image: string | null } | null;
  endedAt: string | null;
  tags: string | null;
  isWinner: boolean;
  format: string;
  constraints: string[];
  reactionCounts: Record<string, number>;
  totalReactions: number;
}

type FilterType = "trending" | "newest";

export default function ExplorePage() {
  const [items, setItems] = useState<ExploreItem[]>([]);
  const [reactionsMap, setReactionsMap] = useState<Record<string, Reaction[]>>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("newest");
  const [tagFilter, setTagFilter] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<ExploreItem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const sessionData = await authClient.getSession();
      const sessionAny = sessionData as any;
      if (sessionAny && sessionAny.user) {
        setCurrentUserId(sessionAny.user.id);
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        let url = `/api/explore?filter=${filter}`;
        if (tagFilter) {
          url += `&tag=${encodeURIComponent(tagFilter)}`;
        }
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setItems(data || []);
          
          const reactionPromises = (data || []).map(async (item: ExploreItem) => {
            const reactionRes = await fetch(`/api/reactions?sessionId=${item.id}`);
            const reactions = reactionRes.ok ? await reactionRes.json() : [];
            return { id: item.id, reactions };
          });
          
          const reactionsResults = await Promise.all(reactionPromises);
          const map: Record<string, Reaction[]> = {};
          reactionsResults.forEach((r) => {
            map[r.id] = r.reactions;
          });
          setReactionsMap(map);
        }
      } catch (err) {
        console.error("Failed to load explore items", err);
      }
    };
    load();
  }, [filter, tagFilter]);

  useEffect(() => {
    if (!selectedItem) return;
    const loadComments = async () => {
      setLoadingComments(true);
      try {
        const res = await fetch(`/api/comments?sessionId=${selectedItem.id}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data || []);
        }
      } catch (err) {
        console.error("Failed to load comments", err);
      } finally {
        setLoadingComments(false);
      }
    };
    loadComments();
  }, [selectedItem]);

  const handleReaction = async (sessionId: string, emoji: string) => {
    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sessionId, emoji }),
      });
      
      if (res.ok) {
        const action = await res.json();
        
        setReactionsMap((prev) => {
          const current = prev[sessionId] || [];
          if (action.action === "removed") {
            return {
              ...prev,
              [sessionId]: current
                .map((r) => {
                  if (r.emoji === emoji) {
                    return { ...r, count: r.count - 1, users: r.users.filter((u) => u !== currentUserId) };
                  }
                  return r;
                })
                .filter((r) => r.count > 0),
            };
          } else {
            const existing = current.find((r) => r.emoji === emoji);
            if (existing) {
              return {
                ...prev,
                [sessionId]: current.map((r) =>
                  r.emoji === emoji ? { ...r, count: r.count + 1, users: [...r.users, currentUserId!] } : r
                ),
              };
            } else {
              return {
                ...prev,
                [sessionId]: [...current, { emoji, count: 1, users: [currentUserId!] }],
              };
            }
          }
        });
      }
    } catch (err) {
      console.error("Failed to toggle reaction", err);
    }
  };

  const handleSubmitComment = async (parentId?: string) => {
    if (!selectedItem) return;
    const content = parentId ? replyContent : newComment;
    if (!content.trim()) return;

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          sessionId: selectedItem.id,
          parentId: parentId || null,
          content,
        }),
      });

      if (res.ok) {
        const newCommentData = await res.json();
        if (parentId) {
          setComments((prev) => prev.map((c) => {
            if (c.id === parentId) {
              return { ...c, replies: [...(c.replies || []), newCommentData] };
            }
            return c;
          }));
          setReplyContent("");
          setReplyingTo(null);
        } else {
          setComments((prev) => [newCommentData, ...prev]);
          setNewComment("");
        }
      }
    } catch (err) {
      console.error("Failed to submit comment", err);
    }
  };

  const getTotalReactions = (sessionId: string) => {
    const reactions = reactionsMap[sessionId] || [];
    return reactions.reduce((sum, r) => sum + r.count, 0);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">Explore</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            <Button
              variant={filter === "trending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("trending")}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Trending
            </Button>
            <Button
              variant={filter === "newest" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("newest")}
            >
              <Clock className="w-4 h-4 mr-1" />
              Newest
            </Button>
          </div>
          
          <div className="flex-1 max-w-xs">
            <Input
              placeholder="Filter by tag..."
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="bg-white dark:bg-zinc-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card 
              key={item.id} 
              className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-zinc-400 transition-all"
              onClick={() => setSelectedItem(item)}
            >
              <div className="w-full h-48 bg-zinc-100 dark:bg-zinc-900 relative">
                {item.isWinner && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    Winner
                  </div>
                )}
                <img
                  src={item.thumbnail || '/file.svg'}
                  alt={item.title}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="p-3">
                <div className="text-sm font-semibold text-zinc-900 dark:text-white">{item.title}</div>
                <div className="text-xs text-zinc-500 mt-1">{item.user?.name || 'Unknown'}</div>
                <div className="text-xs text-zinc-400 mt-0.5 capitalize">{item.format?.replace('_', ' ')}</div>

                {item.constraints && item.constraints.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {item.constraints.slice(0, 3).map((constraint, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                        title={constraint}
                      >
                        {constraint.length > 20 ? constraint.slice(0, 20) + '...' : constraint}
                      </span>
                    ))}
                    {item.constraints.length > 3 && (
                      <span className="text-xs text-zinc-500">+{item.constraints.length - 3}</span>
                    )}
                  </div>
                )}

                {item.tags && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {item.tags.split(',').map((tag) => (
                      <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {EMOJIS.map((emoji) => {
                      const reaction = (reactionsMap[item.id] || []).find((r) => r.emoji === emoji);
                      const isActive = reaction?.users.includes(currentUserId || "");
                      return (
                        <button
                          key={emoji}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReaction(item.id, emoji);
                          }}
                          className={`text-lg px-1 py-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                            isActive ? "bg-zinc-200 dark:bg-zinc-700" : ""
                          }`}
                          title={reaction ? `${reaction.count} ${emoji}` : `React ${emoji}`}
                        >
                          {emoji}
                          {reaction && reaction.count > 0 && (
                            <span className="text-xs ml-0.5">{reaction.count}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs text-zinc-500">
                    {getTotalReactions(item.id)} reactions
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedItem(null)}>
            <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{selectedItem.title}</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>✕</Button>
              </div>
              
              <div className="p-4">
                <div className="w-full h-64 bg-zinc-100 dark:bg-zinc-800 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={selectedItem.thumbnail || '/file.svg'}
                    alt={selectedItem.title}
                    className="object-contain w-full h-full"
                  />
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">By {selectedItem.user?.name || 'Unknown'}</span>
                  <span className="text-xs text-zinc-400 capitalize">• {selectedItem.format?.replace('_', ' ')}</span>
                  {selectedItem.isWinner && (
                    <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full">Winner</span>
                  )}
                </div>

                {selectedItem.constraints && selectedItem.constraints.length > 0 && (
                  <div className="mb-4 p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                    <div className="text-xs font-medium text-violet-700 dark:text-violet-300 mb-2">Constraints</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.constraints.map((constraint, idx) => (
                        <span 
                          key={idx} 
                          className="text-xs px-2 py-1 rounded bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                        >
                          {constraint}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-1 mb-4">
                  {EMOJIS.map((emoji) => {
                    const reaction = (reactionsMap[selectedItem.id] || []).find((r) => r.emoji === emoji);
                    const isActive = reaction?.users.includes(currentUserId || "");
                    return (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(selectedItem.id, emoji)}
                        className={`text-xl px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                          isActive ? "bg-zinc-200 dark:bg-zinc-700" : ""
                        }`}
                      >
                        {emoji}
                        {reaction && reaction.count > 0 && (
                          <span className="text-xs ml-1">{reaction.count}</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageCircle className="w-4 h-4" />
                    <span className="font-medium">Comments</span>
                  </div>

                  {currentUserId && (
                    <div className="mb-4">
                      <textarea
                        className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 text-sm"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={2}
                      />
                      <Button size="sm" className="mt-2" onClick={() => handleSubmitComment()}>
                        Post Comment
                      </Button>
                    </div>
                  )}

                  {loadingComments ? (
                    <div className="text-center py-4 text-zinc-500">Loading comments...</div>
                  ) : comments.length === 0 ? (
                    <div className="text-center py-4 text-zinc-500">No comments yet. Be the first!</div>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{comment.user.name}</span>
                            <span className="text-xs text-zinc-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-zinc-700 dark:text-zinc-300">{comment.content}</p>
                          
                          {currentUserId && (
                            <button
                              className="text-xs text-zinc-500 mt-1 hover:text-zinc-700"
                              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            >
                              Reply
                            </button>
                          )}
                          
                          {replyingTo === comment.id && (
                            <div className="mt-2">
                              <textarea
                                className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700 text-sm"
                                placeholder="Write a reply..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                rows={2}
                              />
                              <div className="flex gap-2 mt-2">
                                <Button size="sm" onClick={() => handleSubmitComment(comment.id)}>Reply</Button>
                                <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>Cancel</Button>
                              </div>
                            </div>
                          )}

                          {comment.replies && comment.replies.length > 0 && (
                            <div className="ml-4 mt-3 space-y-2 border-l-2 border-zinc-200 dark:border-zinc-700 pl-3">
                              {comment.replies.map((reply) => (
                                <div key={reply.id}>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-xs">{reply.user.name}</span>
                                    <span className="text-xs text-zinc-500">{new Date(reply.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{reply.content}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
