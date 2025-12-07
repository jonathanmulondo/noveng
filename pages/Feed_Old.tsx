import React, { useState, useRef, useEffect } from 'react';
import { MOCK_FEED } from '../services/mockData';
import { FeedItem } from '../types';
import { Heart, MessageCircle, Share2, Plus, Music, Bookmark, Play, Pause, Search } from 'lucide-react';

const FeedPost: React.FC<{ post: FeedItem; isActive: boolean }> = ({ post, isActive }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleLike = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLiked) setIsLiked(true);
    setShowHeartAnimation(true);
    setTimeout(() => setShowHeartAnimation(false), 1000);
  };

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.type === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Auto-play/pause based on active state (IntersectionObserver parent logic usually, simplifying here)
  useEffect(() => {
    if (post.type === 'video' && videoRef.current) {
      if (isActive) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive, post.type]);

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-zinc-950 snap-start shrink-0 select-none">
      
      {/* --- Main Content --- */}
      <div 
        className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-pointer"
        onDoubleClick={handleDoubleTap}
        onClick={togglePlay}
      >
         {post.type === 'video' ? (
           <video 
             ref={videoRef}
             src={post.src}
             className="w-full h-full object-cover"
             loop
             muted
             playsInline
           />
         ) : (
           <img 
             src={post.src} 
             alt="Post content" 
             className="w-full h-full object-cover"
           />
         )}

         {/* Play/Pause Overlay Icon for Video */}
         {post.type === 'video' && !isPlaying && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                 <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                     <Play size={32} className="text-white fill-white ml-1" />
                 </div>
             </div>
         )}

         {/* Heart Pop Animation */}
         {showHeartAnimation && (
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
             <Heart size={100} className="text-red-500 fill-red-500 animate-heart-pop shadow-xl" />
           </div>
         )}
      </div>

      {/* --- Gradient Overlay --- */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 pointer-events-none" />

      {/* --- Right Sidebar Actions --- */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-6 z-20 pb-4">
        
        {/* Profile Avatar & Follow */}
        <div className="relative mb-2 group cursor-pointer transition-transform active:scale-95">
           <div className="w-12 h-12 rounded-full border-2 border-white/90 overflow-hidden p-[1px] shadow-lg">
             <img src={post.avatar} className="w-full h-full rounded-full object-cover" alt={post.author} />
           </div>
           <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-tr from-pink-500 to-red-500 rounded-full p-0.5 text-white shadow-md transform scale-90 group-hover:scale-110 transition-transform">
             <Plus size={14} strokeWidth={4} />
           </div>
        </div>

        {/* Like Button */}
        <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={toggleLike}>
           <div className="p-2.5 rounded-full bg-black/20 backdrop-blur-sm transition-all active:scale-75 group-hover:bg-black/40">
             <Heart 
                size={28} 
                className={`transition-colors duration-300 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} 
                strokeWidth={isLiked ? 0 : 2}
             />
           </div>
           <span className="text-white text-xs font-semibold drop-shadow-md">{post.likes + (isLiked ? 1 : 0)}</span>
        </div>

        {/* Comment Button */}
        <div className="flex flex-col items-center gap-1 cursor-pointer group">
           <div className="p-2.5 rounded-full bg-black/20 backdrop-blur-sm transition-all active:scale-75 group-hover:bg-black/40">
             <MessageCircle size={28} className="text-white" fill="white" fillOpacity={0.1} />
           </div>
           <span className="text-white text-xs font-semibold drop-shadow-md">{post.comments}</span>
        </div>

        {/* Save/Bookmark Button */}
        <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={toggleSave}>
           <div className="p-2.5 rounded-full bg-black/20 backdrop-blur-sm transition-all active:scale-75 group-hover:bg-black/40">
             <Bookmark 
                size={28} 
                className={`transition-colors duration-300 ${isSaved ? 'text-yellow-400 fill-yellow-400' : 'text-white'}`} 
                fillOpacity={isSaved ? 1 : 0.1}
             />
           </div>
           <span className="text-white text-xs font-semibold drop-shadow-md">{isSaved ? 'Saved' : 'Save'}</span>
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center gap-1 cursor-pointer group">
           <div className="p-2.5 rounded-full bg-black/20 backdrop-blur-sm transition-all active:scale-75 group-hover:bg-black/40">
             <Share2 size={28} className="text-white" />
           </div>
           <span className="text-white text-xs font-semibold drop-shadow-md">Share</span>
        </div>
      </div>

      {/* --- Bottom Left Content Info --- */}
      <div className="absolute bottom-0 left-0 right-20 p-4 z-20 text-white pb-24 md:pb-8 pl-4">
         {/* Author Name */}
         <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-lg shadow-black drop-shadow-lg cursor-pointer hover:underline tracking-wide">
               @{post.author}
            </h3>
            {/* Verified check */}
            <div className="bg-blue-500 rounded-full p-[2px]">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
         </div>
         
         {/* Caption with See More */}
         <div className="mb-3 text-sm md:text-base opacity-95 leading-snug drop-shadow-md font-light max-w-[90%]">
           {showFullCaption || post.caption.length < 80 ? (
             <span>
               {post.caption}
               {post.caption.length >= 80 && (
                   <button onClick={(e) => { e.stopPropagation(); setShowFullCaption(false); }} className="font-semibold ml-2 text-white/70 hover:text-white text-xs">less</button>
               )}
             </span>
           ) : (
             <span>
               {post.caption.substring(0, 80)}... 
               <button onClick={(e) => { e.stopPropagation(); setShowFullCaption(true); }} className="font-semibold ml-1 text-white/70 hover:text-white">more</button>
             </span>
           )}
         </div>

         {/* Tags */}
         {post.tags && post.tags.length > 0 && (
           <div className="flex flex-wrap gap-2 mb-4">
             {post.tags.map(tag => (
               <span key={tag} className="text-xs font-bold text-white border border-white/20 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer">
                 #{tag}
               </span>
             ))}
           </div>
         )}

         {/* Music Marquee */}
         <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full w-fit max-w-[80%] border border-white/5 hover:bg-white/15 transition-colors cursor-pointer">
            <Music size={14} className="shrink-0 animate-pulse text-white" />
            <div className="text-xs font-medium whitespace-nowrap overflow-hidden w-40 mask-gradient relative">
               <span className="animate-marquee inline-block">
                  Original Sound - {post.author} • Creating the future • Arduino Beats • 
               </span>
            </div>
         </div>
      </div>
      
      {/* --- Spinning Vinyl (Bottom Right) --- */}
      <div className="absolute bottom-6 right-4 z-20">
         <div className="relative cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border-[6px] border-zinc-800 flex items-center justify-center overflow-hidden animate-spin-slow shadow-xl shadow-black/50 group-hover:border-zinc-700 transition-colors">
                <img src={post.avatar} className="w-full h-full object-cover opacity-80" alt="Music" />
            </div>
            {/* Music notes flying out */}
            <div className="absolute -top-4 -right-2 pointer-events-none">
                 <Music size={12} className="text-slate-300 animate-bounce" style={{ animationDuration: '2.5s' }} />
            </div>
            <div className="absolute -top-8 -right-0 pointer-events-none opacity-60">
                 <Music size={10} className="text-slate-300 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
            </div>
         </div>
      </div>
    </div>
  );
};

export const Feed: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePostId, setActivePostId] = useState<string>(MOCK_FEED[0]?.id);

  // Simple scroll detection to auto-play active video
  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollPosition = container.scrollTop + container.clientHeight / 2;
    const posts = Array.from(container.children);
    
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i] as HTMLElement;
      if (
        post.offsetTop <= scrollPosition &&
        post.offsetTop + post.clientHeight > scrollPosition
      ) {
        // Find the post ID from the data index (simplified)
        if (MOCK_FEED[i]) {
          setActivePostId(MOCK_FEED[i].id);
        }
        break;
      }
    }
  };

  return (
    <div className="h-full w-full bg-zinc-950 flex flex-col items-center relative overflow-hidden">
      
      {/* Top Overlay Tabs (Following | For You) */}
      <div className="absolute top-4 left-0 right-0 z-30 flex justify-center gap-6 text-white text-base font-bold drop-shadow-xl pt-2 md:pt-4 select-none">
          <span className="opacity-60 cursor-pointer hover:opacity-100 transition-opacity">Following</span>
          <div className="w-[1px] h-4 bg-white/20 self-center"></div>
          <span className="border-b-2 border-white pb-1 cursor-pointer">For You</span>
      </div>

      {/* Search Icon Mobile */}
      <div className="absolute top-6 right-6 z-30 flex gap-4 md:hidden text-white">
          <Search size={24} strokeWidth={2.5} />
      </div>

      {/* Feed Container */}
      <div className="w-full h-full md:w-[400px] md:h-[calc(100vh-2rem)] md:mt-4 md:mb-4 md:rounded-3xl overflow-hidden relative shadow-2xl bg-black border border-white/5">
        
        {/* Scroll Container */}
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
        >
          {MOCK_FEED.map((post) => (
            <FeedPost key={post.id} post={post} isActive={activePostId === post.id} />
          ))}
        </div>

        {/* Desktop Upload FAB */}
        <button className="hidden md:flex absolute top-6 right-6 z-40 text-white p-3 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-full shadow-lg hover:scale-105 transition-transform group">
             <Plus size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
        </button>

      </div>
    </div>
  );
};