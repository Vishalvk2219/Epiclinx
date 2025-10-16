'use client';

import { useRef } from 'react';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, MessageCircle, MessageCircleMore } from 'lucide-react';

const reviews = Array(5).fill({
  date: 'Dec 24, 2024',
  rating: 5,
  text: `Jennifer was a fantastic partner—creative, professional, and easy to work with. They delivered quality content that aligned perfectly with our brand. We'd gladly collaborate again!`,
  brand: 'H&M',
  tags: ['Spring Launch', 'TikTok'],
  campaign: '#AD204',
  logo: 'https://cdn.worldvectorlogo.com/logos/h-m.svg', // Replace with actual logo path
});

const PublicReviews = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const card = scrollRef.current.querySelector('div[data-card]');
      const cardWidth = card ? (card as HTMLElement).offsetWidth + 16 : 300; // +gap-4
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-white/20 rounded-3xl p-4 md:p-8 text-white md:grid md:grid-cols-4 max-md:flex max-md:flex-col max-md:gap-4 gap-4 mt-3">
      <div className='flex items-start flex-col gap-4 col-span-1'>
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-white/90">
          <div className='flex flex-col gap-1 items-center'>
            <div className="text-white font-light text-xs">Average Rating</div>
            <div className="text-white font-semibold text-lg">⭐ 4.9 / 5</div>
          </div>
          <div className='flex flex-col gap-1 items-center'>
            <div className="text-white font-light text-xs">Total Reviews</div>
            <div className="text-white font-semibold text-lg flex items-center gap-1"><span className='text-epiclinx-teal'><MessageCircleMore /></span> 12</div>
          </div>
        </div>

        {/* Arrow buttons row */}
        <div className="flex justify-end mb-4">
          <div className="flex gap-2">
            <button
              className="bg-epiclinx-teal p-2 rounded-full hover:bg-epiclinx-teal/80 hover:transition-all hover:duration-300"
              onClick={() => scroll('left')}
            >
              <ArrowLeft className="w-5 h-5 text-black" />
            </button>
            <button
              className="bg-epiclinx-teal p-2 rounded-full hover:bg-epiclinx-teal/80 hover:transition-all hover:duration-300"
              onClick={() => scroll('right')}
            >
              <ArrowRight className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth col-span-3 hide-scrollbar"
      >
        {reviews.map((review, index) => (
          <div
            key={index}
            data-card
            className="min-w-[300px] max-w-sm bg-epiclinx-semiteal rounded-3xl p-4 shrink-0"
          >
            <div className="flex justify-between items-start text-black">
              <div className="flex">
                {'★'.repeat(review.rating)}{' '}
                {'☆'.repeat(5 - review.rating)}
              </div>
              <span className="text-sm">{review.date}</span>
            </div>
            <p className="text-black text-sm font-light mt-2 !mb-7 line-clamp-4">{review.text}</p>
            <div className="mt-4 flex items-center gap-3">
              <img
                src={review.logo}
                alt={review.brand}
                className="w-8 h-8 rounded-full"
              />
              <div className="text-black text-sm font-semibold">{review.brand}</div>
            </div>
            <div className="text-xs text-black mt-1">
              {review.brand} — {review.tags.join(' — ')} — {review.campaign}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicReviews;
