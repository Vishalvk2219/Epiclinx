"use client";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";

const plans = [
  {
    title: "7 day Trial",
    price: "Free",
    icon: "/shapes/shape4.svg",
    features: [
      "1 (Limited) Job Post per month",
      "Access to Post Collaborations",
      "Payment security",
    ],
    bg: "bg-[#EDF8F6] text-black",
    destinationUrl:
      "/brand/create-a-brand?plan=small&currency=usd&recurring_interval=month&trial=1",
  },
  {
    title: "Small Enterprise",
    price: "$30/mo",
    icon: "/shapes/shape3.svg",
    features: [
      "2 Job Posts per month",
      "Access to Post Collaborations",
      "Open jobs to EpicLinx creators",
      "Payment security",
      "Business profile & Branding page",
    ],
    bg: "bg-[#D4FFFB] text-black",
    destinationUrl:
      "/brand/create-a-brand?plan=small&currency=usd&recurring_interval=month",
  },
  {
    title: "Medium Enterprise",
    price: "$60/mo",
    icon: "/shapes/shape2.svg",
    features: [
      "5 Job Posts per month",
      "Access to Post Collaborations",
      "Open jobs to EpicLinx creators",
      "Payment security",
      "Business profile & Branding page",
      "Featured on Homepage (Extra Visibility)",
    ],
    bg: "bg-[#ADFFF7] text-black",
    destinationUrl:
      "/brand/create-a-brand?plan=medium&currency=usd&recurring_interval=month",
  },
  {
    title: "Large Enterprise",
    price: "$100/mo",
    icon: "/shapes/shape1.svg",
    features: [
      "15 Job Posts per month",
      "Access to Post Collaborations",
      "Open jobs to EpicLinx creators",
      "Payment security",
      "Business profile & Branding page",
      "Priority Job Listing Placement",
      "Featured on Homepage (Extra Visibility)",
      "Exclusive Access to High-Tier Influencers",
      "Bidding System (Influencers Compete for Jobs)",
    ],
    bg: "bg-[#1f1f1f] text-white",
    destinationUrl:
      "/brand/create-a-brand?plan=large&currency=usd&recurring_interval=month",
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
        <h2 className="text-2xl md:text-3xl text-black font-bold mb-2 max-md:hidden">
          Choose Your Brand Plan
        </h2>
        <h2 className="text-2xl md:text-3xl text-black font-bold mb-2 md:hidden">
          Brand Subscription Tiers
        </h2>
        <p className="text-sm text-gray-900 max-w-xl mx-auto max-md:hidden">
          Your brand deserves better. Connect with creators directly — no noise,
          no games, no gatekeepers.
        </p>
        <p className="text-sm text-gray-900 max-w-xl mx-auto md:hidden">
          Unlock your brand’s potential with targeted creator collaborations. No
          middle men. No commissions. No fuss.
        </p>
      </div>

      <div
        ref={scrollRef}
        className="flex mt-5 scroll-smooth hide-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto"
      >
        {plans.map((plan) => (
          <div
            key={plan.title}
            className={`min-w-[280px] sm:min-w-0 rounded-3xl p-6 flex flex-col justify-between ${plan.bg}`}
          >
            <div>
              <Image src={plan.icon} alt={plan.title} width={50} height={50} />
              <h3 className="text-lg font-semibold mb-1 mt-3">{plan.title}</h3>
              <p className="text-4xl font-bold mb-10">{plan.price}</p>
              <hr className="mb-4 border-gray-500" />
              <span
                className={`text-xs font-light mb-2 ${
                  plan.title === "Large Enterprise"
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                Includes:
              </span>
              <ul className="text-xs space-y-2 mt-5 font-light">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="text-epiclinx-teal text-xs">
                      <Check
                        className={`h-4 w-4 ${
                          plan.title === "Large Enterprise"
                            ? "text-white"
                            : "text-black"
                        }`}
                      />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <Link href={plan.destinationUrl} className="w-full">
              <button className="mt-6 bg-epiclinx-teal text-black text-sm font-semibold py-3 rounded-full btn-hover transition w-full">
                Create Account
              </button>
            </Link>
          </div>
        ))}
      </div>

      {/* Scroll Buttons (visible on mobile) */}
      <div className="sm:hidden flex justify-end mb-2 gap-2 pr-4 mt-5">
        <button
          onClick={() => scroll("left")}
          className="bg-epiclinx-teal text-white px-3 py-1 rounded-full text-sm"
        >
          <ArrowLeft />
        </button>
        <button
          onClick={() => scroll("right")}
          className="bg-epiclinx-teal text-white px-3 py-3 rounded-full text-sm"
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}
