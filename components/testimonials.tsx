import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

function Resizable() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [{
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 1
            }
        }],
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        appendDots: (dots: number) => (
            <span>
                <div
                    className=" absolute -bottom-8 left-2 md:hidden"
                >
                    <ul className="flex gap-2 text-white"> {dots} </ul>
                </div>
                <div
                    className="max-md:hidden absolute top-5 left-0 right-0"
                >
                    <ul className="flex gap-2 text-white justify-center"> {dots} </ul>
                </div>
            </span>
        ),
    };
    return (
        <div className="mx-auto max-w-7xl my-10">
            <h2 className="text-center md:max-w-xl mx-auto text-white text-3xl font-semibold mb-8">
                Reviews from the epic brands we have linked with creators
            </h2>
            <div className="relative mx-[8px]"
            >
                <Slider {...settings} nextArrow={<SampleNextArrow />} prevArrow={<SamplePrevArrow />}>
                    {testimonials.map((testimonial) => (
                        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))}
                </Slider>
            </div>
        </div>
    );
}

export default Resizable;

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <>
            <button
                onClick={onClick}
                className="bg-[#00E0CA] btn-hover max-md:hidden text-black p-2 rounded-full z-10 transition-colors md:absolute md:-right-3 md:top-[120px] md:-translate-y-1/2"
                aria-label="Next testimonial"
            >
                <ArrowRight className="h-6 w-6" />
            </button>
            <button
                onClick={onClick}
                className="bg-[#00E0CA] btn-hover text-black p-2 rounded-full z-10 transition-colors absolute -bottom-16 right-2 md:hidden"
                aria-label="Next testimonial"
            >
                <ArrowRight className="h-6 w-6" />
            </button>
        </>
    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <>
            <button
                className="bg-[#00E0CA] btn-hover text-black p-2 rounded-full absolute -bottom-16 right-16 md:hidden"
                aria-label="Previous testimonial"
                onClick={onClick}
            >
                <ArrowLeft className="h-6 w-6" />
            </button>
            <button
                onClick={onClick}
                className="bg-[#00E0CA] btn-hover max-md:hidden text-black p-2 rounded-full z-10 transition-colors md:absolute md:-left-3 md:top-[120px] md:-translate-y-1/2"
                aria-label="Previous testimonial"
            >
                <ArrowLeft className="h-6 w-6" />
            </button>
        </>
    );
}

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
    return (
        <div className="bg-gray-700 rounded-3xl p-6 shadow-lg h-full flex flex-col mx-2">
            <div className="mb-3">
                <StarRating rating={testimonial.rating} />
            </div>

            <p className="text-white mb-6 text-sm flex-grow font-extralight my-3">
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
        logoUrl: "https://images.pexels.com/photos/1337386/pexels-photo-1337386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
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
        text: "A customer testimonial that highlights features and answers potential customer doubts about your product or service. Showcase testimonials from a similar demographic to your customers.",
        rating: 5,
        customerName: "Customer Name",
        position: "Position",
        companyName: "Company name",
        logoUrl: "https://images.pexels.com/photos/1337382/pexels-photo-1337382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
        id: 5,
        text: "A customer testimonial that highlights features and answers potential customer doubts about your product or service. Showcase testimonials from a similar demographic to your customers.",
        rating: 5,
        customerName: "Customer Name",
        position: "Position",
        companyName: "Company name",
        logoUrl: "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
];