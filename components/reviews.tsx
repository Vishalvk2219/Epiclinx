"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, MoveLeft, MoveRight, Star } from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
    id: number;
    text: string;
    rating: number;
    customerName: string;
    position: string;
    companyName: string;
    logoUrl: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        text: "A customer testimonial that highlights features and answers potential customer doubts about your product or service. Showcase testimonials from a similar demographic to your customers.",
        rating: 5,
        customerName: "Customer Name",
        position: "Position",
        companyName: "Company name",
        logoUrl: "https://images.pexels.com/photos/1337386/pexels-photo-1337386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
        id: 2,
        text: "A customer testimonial that highlights features and answers potential customer doubts about your product or service. Showcase testimonials from a similar demographic to your customers.",
        rating: 5,
        customerName: "Customer Name",
        position: "Position",
        companyName: "Company name",
        logoUrl: "https://images.pexels.com/photos/243244/pexels-photo-243244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
        id: 3,
        text: "A customer testimonial that highlights features and answers potential customer doubts about your product or service. Showcase testimonials from a similar demographic to your customers.",
        rating: 5,
        customerName: "Customer Name",
        position: "Position",
        companyName: "Company name",
        logoUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
        id: 4,
        text: "Our team has seen remarkable improvements in productivity since adopting this solution. The intuitive interface and robust feature set have transformed our workflow completely.",
        rating: 5,
        customerName: "Customer Name",
        position: "Position",
        companyName: "Company name",
        logoUrl: "https://images.pexels.com/photos/1337382/pexels-photo-1337382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
        id: 5,
        text: "The customer support is exceptional. Whenever we've had questions or needed assistance, the team has been responsive and thorough in addressing our concerns.",
        rating: 5,
        customerName: "Customer Name",
        position: "Position",
        companyName: "Company name",
        logoUrl: "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
];

const StarRating: React.FC<{ rating: number; maxRating?: number }> = ({ rating, maxRating = 5 }) => {
    return (
        <div className="flex">
            {Array.from({ length: maxRating }, (_, index) => (
                <Star
                    key={index}
                    className={`w-4 h-4 ${index < rating ? 'fill-white' : 'fill-gray-300'
                        }`}
                />
            ))}
        </div>
    );
};

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
    return (
        <div className="bg-gray-700 rounded-3xl p-6 shadow-lg h-full flex flex-col">
            <div className="mb-3">
                <StarRating rating={testimonial.rating} />
            </div>

            <p className="text-white mb-6 text-sm flex-grow font-light">
                "{testimonial.text}"
            </p>

            <div className="flex items-center mt-auto">
                <div className="w-12 h-12 mr-4 rounded-full overflow-hidden flex items-center justify-center bg-white">
                    <Image
                        src={testimonial.logoUrl}
                        alt={`${testimonial.companyName} logo`}
                        width={40}
                        height={40}
                        className="w-12 h-12 object-cover"
                    />
                </div>

                <div>
                    <p className="text-white text-sm font-light">{testimonial.customerName}</p>
                    <p className="text-gray-300 font-light text-xs">
                        {testimonial.position}, {testimonial.companyName}
                    </p>
                </div>
            </div>
        </div>
    );
};

const Reviews = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchEndX, setTouchEndX] = useState(0);
    const autoplayInterval = 5000;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
        );
    }, []);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEndX(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStartX - touchEndX > 50) {
            nextSlide();
        } else if (touchEndX - touchStartX > 50) {
            prevSlide();
        }
    };

    const [visibleCount, setVisibleCount] = useState(1);

    useEffect(() => {
        const updateVisibleCount = () => {
            if (window.innerWidth >= 1024) {
                setVisibleCount(3);
            } else if (window.innerWidth >= 640) {
                setVisibleCount(1);
            } else {
                setVisibleCount(1);
            }
        };

        updateVisibleCount(); // run initially
        window.addEventListener('resize', updateVisibleCount);
        return () => window.removeEventListener('resize', updateVisibleCount);
    }, []);


    const getVisibleTestimonials = () => {
        let testimonialCards = [];
        for (let i = 0; i < visibleCount; i++) {
            const index = (currentIndex + i) % testimonials.length;
            testimonialCards.push(
                <div key={testimonials[index].id} className="px-2 h-full">
                    <TestimonialCard testimonial={testimonials[index]} />
                </div>
            );
        }

        return testimonialCards;
    };


    return (
        <div className="flex flex-col items-center justify-center md:p-4 md:p-8 my-10">
            <div className="w-full max-w-7xl mx-auto">
                <div className="relative w-full"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <h2 className="text-center text-white text-2xl font-semibold mb-8">
                        Reviews from the epic brands we have linked with creators
                    </h2>

                    <div
                        className="relative overflow-hidden"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div className="flex transition-transform duration-500 ease-in-out h-full">
                            {getVisibleTestimonials()}
                        </div>
                    </div>

                    {/* Navigation Buttons - Desktop: Sides, Mobile: Bottom Right */}
                    <div className="flex md:block max-md:justify-between max-md:items-center max-md:mt-5">
                        <div className="md:hidden flex mt-6 justify-start pl-4 md:justify-center md:pl-0">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-2 h-2 mx-1 rounded-full transition-colors duration-300 ${index === currentIndex ? 'bg-[#adfff7]' : 'bg-gray-500'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                        <div className="flex max-md:mt-5 gap-2 md:static md:flex md:gap-0">
                            <button
                                onClick={prevSlide}
                                className="bg-[#00E0CA] text-black p-2 rounded-full z-10 transition-colors md:absolute md:-left-3 md:top-[210px] md:-translate-y-1/2"
                                aria-label="Previous testimonial"
                            >
                                <ArrowLeft className="h-6 w-6" />
                            </button>

                            <button
                                onClick={nextSlide}
                                className="bg-[#00E0CA] text-black p-2 rounded-full z-10 transition-colors md:absolute md:-right-3 md:top-[210px] md:-translate-y-1/2"
                                aria-label="Next testimonial"
                            >
                                <ArrowRight className="h-6 w-6" />
                            </button>
                        </div>


                    </div>

                    {/* Pagination Dots - Left aligned on mobile, centered on desktop */}
                    <div className="max-md:hidden flex mt-6 justify-start pl-4 md:justify-center md:pl-0">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-2 h-2 mx-1 rounded-full transition-colors duration-300 ${index === currentIndex ? 'bg-[#adfff7]' : 'bg-gray-500'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reviews;