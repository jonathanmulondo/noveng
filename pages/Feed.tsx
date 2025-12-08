import React, { useState, useRef, useEffect } from 'react';
import { MOCK_FEED } from '../services/mockData';
import { FeedItem } from '../types';
import { Heart, MessageCircle, Share2, Plus, Music, Bookmark, Play, Search, Sparkles } from 'lucide-react';

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
    <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-neutral-950 via-purple-950/20 to-neutral-950 snap-start shrink-0 select-none">

      {/* Main Content */}
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-pointer"
        onDoubleClick={handleDoubleTap}
        onClick={togglePlay}
      >
         {post.type === 'video' ? (
           <video
             ref={videoRef}
             src={post.src}
             className="w-full h-full object-contain bg-neutral-900"
             loop
             playsInline
             crossOrigin="anonymous"
             preload="metadata"
             onError={(e) => {
               console.error('Video error:', e);
             }}
             onLoadedData={() => {
               console.log('Video loaded:', post.src);
             }}
           />
         ) : (
           <img
             src={post.src}
             alt="Post content"
             className="w-full h-full object-cover"
           />
         )}

         {/* Play/Pause Overlay - Purple theme */}
         {post.type === 'video' && !isPlaying && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                 <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-md flex items-center justify-center border-2 border-white/20">
                     <Play size={40} className="text-white fill-white ml-2" />
                 </div>
             </div>
         )}

         {/* Heart Pop Animation - Purple theme */}
         {showHeartAnimation && (
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
             <Heart size={120} className="text-pink-500 fill-pink-500 animate-heart-pop drop-shadow-2xl" />
           </div>
         )}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-transparent to-black/90 pointer-events-none" />

      {/* Right Sidebar Actions - Purple/Pink Theme */}
      <div className="absolute right-4 bottom-28 flex flex-col items-center gap-6 z-20">

        {/* Profile Avatar & Follow */}
        <div className="relative mb-2 group cursor-pointer transition-transform active:scale-95">
           <div className="w-14 h-14 rounded-full border-2 border-white/90 overflow-hidden shadow-xl shadow-purple-500/20">
             <img src={post.avatar} className="w-full h-full object-cover" alt={post.author} />
           </div>
           <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-1 text-white shadow-lg shadow-purple-500/30 transform scale-90 group-hover:scale-110 transition-transform">
             <Plus size={16} strokeWidth={4} />
           </div>
        </div>

        {/* Like Button - Purple/Pink */}
        <div className="flex flex-col items-center gap-1.5 cursor-pointer group" onClick={toggleLike}>
           <div className="p-3 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm transition-all active:scale-75 group-hover:from-purple-500/20 group-hover:to-pink-500/20 border border-white/10">
             <Heart
                size={28}
                className={`transition-all duration-300 ${
                  isLiked
                    ? 'text-pink-500 fill-pink-500 scale-110'
                    : 'text-white'
                }`}
                strokeWidth={isLiked ? 0 : 2.5}
             />
           </div>
           <span className="text-white text-sm font-bold drop-shadow-lg tabular-nums">
             {(post.likes + (isLiked ? 1 : 0)).toLocaleString()}
           </span>
        </div>

        {/* Comment Button */}
        <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
           <div className="p-3 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm transition-all active:scale-75 group-hover:from-purple-500/20 group-hover:to-pink-500/20 border border-white/10">
             <MessageCircle size={28} className="text-white" strokeWidth={2.5} />
           </div>
           <span className="text-white text-sm font-bold drop-shadow-lg tabular-nums">
             {post.comments.toLocaleString()}
           </span>
        </div>

        {/* Save/Bookmark Button - Purple theme */}
        <div className="flex flex-col items-center gap-1.5 cursor-pointer group" onClick={toggleSave}>
           <div className="p-3 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm transition-all active:scale-75 group-hover:from-purple-500/20 group-hover:to-pink-500/20 border border-white/10">
             <Bookmark
                size={28}
                className={`transition-all duration-300 ${
                  isSaved
                    ? 'text-purple-400 fill-purple-400'
                    : 'text-white'
                }`}
                strokeWidth={2.5}
             />
           </div>
           <span className="text-white text-xs font-semibold drop-shadow-lg opacity-90">
             {isSaved ? 'Saved' : 'Save'}
           </span>
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
           <div className="p-3 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm transition-all active:scale-75 group-hover:from-purple-500/20 group-hover:to-pink-500/20 border border-white/10">
             <Share2 size={28} className="text-white" strokeWidth={2.5} />
           </div>
        </div>
      </div>

      {/* Bottom Left Content Info */}
      <div className="absolute bottom-0 left-0 right-24 p-5 z-20 text-white pb-28 md:pb-10">
         {/* Author Name */}
         <div className="flex items-center gap-2.5 mb-3">
            <h3 className="font-bold text-lg shadow-black drop-shadow-2xl cursor-pointer hover:underline tracking-tight">
               @{post.author}
            </h3>
            {/* Verified badge - Purple */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-1">
                <Sparkles size={12} className="text-white fill-white" />
            </div>
         </div>

         {/* Caption */}
         <div className="mb-4 text-sm md:text-base opacity-95 leading-snug drop-shadow-2xl font-normal max-w-[90%]">
           {showFullCaption || post.caption.length < 100 ? (
             <span>
               {post.caption}
               {post.caption.length >= 100 && (
                   <button onClick={(e) => { e.stopPropagation(); setShowFullCaption(false); }} className="font-semibold ml-2 text-white/80 hover:text-white text-xs">less</button>
               )}
             </span>
           ) : (
             <span>
               {post.caption.substring(0, 100)}...
               <button onClick={(e) => { e.stopPropagation(); setShowFullCaption(true); }} className="font-semibold ml-1 text-white/80 hover:text-white">more</button>
             </span>
           )}
         </div>

         {/* Tags - Purple theme */}
         {post.tags && post.tags.length > 0 && (
           <div className="flex flex-wrap gap-2 mb-4">
             {post.tags.map(tag => (
               <span key={tag} className="text-xs font-bold text-white border border-purple-300/30 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md px-3 py-1.5 rounded-full hover:from-purple-500/30 hover:to-pink-500/30 transition-all cursor-pointer">
                 #{tag}
               </span>
             ))}
           </div>
         )}

         {/* Music Marquee - Purple theme */}
         <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md px-4 py-2.5 rounded-full w-fit max-w-[85%] border border-purple-300/20 hover:from-purple-500/30 hover:to-pink-500/30 transition-all cursor-pointer">
            <Music size={16} className="shrink-0 animate-pulse text-purple-300" />
            <div className="text-xs font-medium whitespace-nowrap overflow-hidden w-40 mask-gradient relative">
               <span className="animate-marquee inline-block">
                  Engineering Vibes - {post.author} • Building the future • NovEng Sounds •
               </span>
            </div>
         </div>
      </div>

      {/* Spinning Vinyl - Purple theme */}
      <div className="absolute bottom-8 right-5 z-20">
         <div className="relative cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 border-4 border-neutral-900 flex items-center justify-center overflow-hidden animate-spin-slow shadow-2xl shadow-purple-500/30 group-hover:border-purple-700 transition-colors">
                <img src={post.avatar} className="w-full h-full object-cover opacity-80" alt="Music" />
            </div>
            {/* Music notes */}
            <div className="absolute -top-4 -right-2 pointer-events-none">
                 <Music size={12} className="text-purple-300 animate-bounce" style={{ animationDuration: '2.5s' }} />
            </div>
            <div className="absolute -top-7 right-0 pointer-events-none opacity-70">
                 <Music size={10} className="text-pink-300 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
            </div>
         </div>
      </div>
    </div>
  );
};

export const Feed: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePostId, setActivePostId] = useState<string>(MOCK_FEED[0]?.id);

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
        if (MOCK_FEED[i]) {
          setActivePostId(MOCK_FEED[i].id);
        }
        break;
      }
    }
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-neutral-950 via-purple-950/20 to-neutral-950 flex flex-col items-center relative overflow-hidden">

      {/* Top Overlay Tabs - Purple theme */}
      <div className="absolute top-5 left-0 right-0 z-30 flex justify-center gap-8 text-white text-base font-bold drop-shadow-2xl pt-2 md:pt-4 select-none">
          <span className="opacity-50 cursor-pointer hover:opacity-100 transition-opacity">Following</span>
          <div className="w-[2px] h-5 bg-gradient-to-b from-purple-500 to-pink-500 self-center rounded-full"></div>
          <div className="relative">
            <span className="cursor-pointer">For You</span>
            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>
      </div>

      {/* Search Icon - Purple theme */}
      <div className="absolute top-6 right-6 z-30 md:hidden">
          <div className="p-2 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-300/30">
            <Search size={22} className="text-white" strokeWidth={2.5} />
          </div>
      </div>

      {/* Feed Container */}
      <div className="w-full h-full md:w-[420px] md:h-[calc(100vh-3rem)] md:mt-6 md:mb-6 md:rounded-3xl overflow-hidden relative shadow-2xl bg-neutral-900 border border-purple-500/10">

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

        {/* Upload FAB - Purple theme */}
        <button className="hidden md:flex absolute top-6 right-6 z-40 text-white p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-2xl shadow-purple-500/40 hover:scale-110 hover:shadow-purple-500/60 transition-all group">
             <Plus size={26} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
        </button>

      </div>
    </div>
  );
};
