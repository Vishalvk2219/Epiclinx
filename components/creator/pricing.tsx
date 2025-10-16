"use client";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";

const plans = [
  {
    title: "7 day Trial",
    price: "Free",
    audience: "Any sized following",
    icon: "/shapes/shape4.svg",
    features: [
      "Access to Job Listings",
      "Apply to Collaborations",
      "Payment Protection",
    ],
    bg: "bg-[#EDF8F6]",
    destinationUrl:
      "/creator/become-a-creator?plan=nano&currency=usd&recurring_interval=month&trial=1",
  },
  {
    title: "Nano",
    price: "$5",
    audience: "1,000 - 10,000 followers",
    icon: "/shapes/shape3.svg",
    features: [
      "Access to Job Listings",
      "Apply to Collaborations",
      "Payment Protection",
      "Direct Business Messaging",
      "Access to Entire Database",
    ],
    bg: "bg-[#D4FFFB]",
    destinationUrl:
      "/creator/become-a-creator?plan=nano&currency=usd&recurring_interval=month",
  },
  {
    title: "Micro",
    price: "$15",
    audience: "10,000 - 50,000 followers",
    icon: "/shapes/shape2.svg",
    features: [
      "Access to Job Listings",
      "Apply to Collaborations",
      "Payment Protection",
      "Direct Business Messaging",
      "Access to Entire Database",
    ],
    bg: "bg-[#ADFFF7]",
    destinationUrl:
      "/creator/become-a-creator?plan=micro&currency=usd&recurring_interval=month",
  },
  {
    title: "Macro",
    price: "$25",
    audience: "50,000 - 250,000 followers",
    commission: "or 10% commission",
    icon: "/shapes/shape1.svg",
    features: [
      "Access to Job Listings",
      "Apply to Collaborations",
      "Payment Protection",
      "Direct Business Messaging",
      "Access to Entire Database",
      "Access to Bidding System",
      "Exclusive Brand Partnership",
    ],
    bg: "bg-[#00D1C7]",
    destinationUrl:
      "/creator/become-a-creator?plan=macro&currency=usd&recurring_interval=month",
  },
  {
    title: "Mega",
    price: "$50",
    audience: "250,000+ followers",
    commission: "or 10% commission",
    icon: "/shapes/shape1.svg",
    features: [
      "Access to Job Listings",
      "Apply to Collaborations",
      "Payment Protection",
      "Direct Business Messaging",
      "Access to Entire Database",
      "Access to Bidding System",
      "Exclusive Brand Partnership",
    ],
    bg: "bg-[#1f1f1f]",
    textColor: "text-white",
    destinationUrl:
      "/creator/become-a-creator?plan=mega&currency=usd&recurring_interval=month",
  },
];

export default function BrandPlans() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="px-4 md:py-24 py-8 max-w-7xl mx-auto">
      <div className="text-center my-10">
        <h2 className="text-2xl md:text-3xl text-black font-bold mb-2">
          Monthly Creator Subscription (Audience Size)
        </h2>
        <p className="text-sm text-gray-900 max-w-xl mx-auto my-5">
          You're not just joining a platform — you're joining the movement
          that's setting the standard for how creators and brands work together.
        </p>
        <p className="text-sm text-gray-900 max-w-xl mx-auto mt-3">
          Real pay. Real access. Real Respect.
        </p>
      </div>

      <div
        ref={scrollRef}
        className="flex mt-5 scroll-smooth hide-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-6 overflow-x-auto"
      >
        {plans.map((plan) => (
          <div
            key={plan.title}
            className={`min-w-[280px] sm:min-w-0 rounded-3xl p-6 flex flex-col justify-between ${
              plan.bg
            } ${plan.textColor || "text-black"}`}
          >
            <div>
              <Image src={plan.icon} alt={plan.title} width={50} height={50} />
              <h3 className="text-lg font-semibold mb-1 mt-3">{plan.title}</h3>
              <div className="mb-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.price !== "Free" && <span className="text-sm">/mo</span>}
              </div>
              <p className="text-sm mb-5">{plan.audience}</p>
              {plan.commission && (
                <p className="text-sm mb-5">{plan.commission}</p>
              )}
              <hr className="mb-4 border-gray-300" />
              <span
                className={`text-xs font-light mb-2 ${
                  plan.textColor || "text-gray-900"
                }`}
              >
                Includes:
              </span>
              <ul className="text-xs space-y-2 mt-5 font-light mb-10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">
                      <Check
                        className={`h-4 w-4 ${
                          plan.title === "Mega" ? "text-white" : "text-black"
                        }`}
                      />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link href={plan.destinationUrl}>
              <button
                className={`py-3 px-4 w-full rounded-full text-sm font-semibold ${
                  plan.title === "Macro"
                    ? " bg-black text-white"
                    : "bg-[#00D1C7] text-black"
                }`}
              >
                Create Account
              </button>
            </Link>
          </div>
        ))}
      </div>

      {/* Scroll Buttons (visible on mobile) */}
      <div className="sm:hidden flex justify-end gap-4 mt-6">
        <button
          onClick={() => scroll("left")}
          className="bg-epiclinx-teal hover:bg-epiclinx-teal/80 text-black p-2 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="bg-epiclinx-teal hover:bg-epiclinx-teal/80 text-black p-2 rounded-full"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
