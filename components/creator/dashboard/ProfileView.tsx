"use client";

import LinkMe from "@/components/NavbarComponent/LinkMe";
import {
  Camera,
  Globe,
  Link,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { PiInstagramLogoFill, PiTiktokLogoFill } from "react-icons/pi";
import { useAuthStore } from "@/stores/useAuthStore";
import { apiFetch } from "@/lib/api";

const ProfileView = ({ value = true }: { value: boolean }) => {
  const router = useRouter();
  const [signInOpen, setSignInOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (pathname.startsWith("/profile")) {
          const routeTo = pathname.split("/profile/creator/");
          const res = await apiFetch(`/creator?id=${routeTo[1]}`);
          console.log(res);
          setUser(res.creator);
        } else {
          const currentUser = useAuthStore.getState().user;
          setUser(currentUser);
        }
      } catch (error) {
        console.log("Unable to fetch user...", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [pathname]);

  const openSignIn = () => {
    setMenuOpen(false); // Close menu if open
    setSignInOpen(true);
  };

  // function handleCoverImageUpload(){

  // }

  const closeSignIn = () => setSignInOpen(false);
  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Failed to fetch data</p>;
  return (
    <div>
      <div className="relative h-[300px] rounded-3xl p-6 md:p-12 text-white bg-epiclinx-semiteal overflow-hidden">
        {/* Background Image */}
        <Image
          src={
            user.coverImage ||
            "https://plus.unsplash.com/premium_photo-1673177667569-e3321a8d8256?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y292ZXIlMjBwaG90b3xlbnwwfHwwfHx8MA%3D%3D"
          }
          alt="Cover Background"
          fill
          className="object-cover rounded-3xl"
        />
        <div className="absolute inset-0 bg-black/40 rounded-3xl" />{" "}
        {/* Overlay for contrast */}
        {/* Top-right buttons with icons */}
        {value && (
          <div className="absolute top-4 right-4 flex gap-2 z-10 max-md:flex max-md:flex-col max-md:items-end max-md:gap-2">
            <button
              // onClick={handleCoverImageUpload}
              className="bg-black/50 text-white text-sm rounded-full px-3 py-1 flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Change Cover Image
            </button>
            <a
              href="/dashboard/creator/profile-management"
              className="bg-black/50 text-white text-sm rounded-full px-3 py-1 flex items-center gap-2"
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </a>
          </div>
        )}
        {/* Main Content centered vertically */}
        <div className="relative z-10 h-full flex items-end">
          <div className="flex flex-col md:flex-row items-start md:items-end md:gap-8 w-full">
            {/* Profile Image */}
            <div className="md:flex-shrink-0 mb-4 md:mb-0">
              <Image
                src={
                  user?.profileImageUrl ||
                  "https://i.abcnewsfe.com/a/0a683baa-5400-45bf-bfae-ae6f493bcacc/lopez-03-gty-kla-241009_1728495696385_hpMain_1x1.jpg?w=992"
                }
                alt="Logo"
                width={100}
                height={100}
                className="rounded-full object-cover bg-white border border-white"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col w-full gap-5 text-white">
              <div className="flex justify-between items-center">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <h3 className="text-2xl font-semibold">{user?.username}</h3>
                  <div className="flex gap-3">
                    <a
                      href={user?.instagram || "https://www.instagram.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 w-8 bg-white rounded-full flex items-center justify-center"
                    >
                      <PiInstagramLogoFill className="w-5 h-5 text-black/80" />
                    </a>
                    <a
                      href={user?.tiktok || "https://www.tiktok.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 w-8 bg-white rounded-full flex items-center justify-center"
                    >
                      <PiTiktokLogoFill className="w-5 h-5 text-black/80" />
                    </a>
                    <a
                      href={user?.facebook || "https://www.facebook.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 w-8 bg-white rounded-full flex items-center justify-center"
                    >
                      <FaFacebook className="w-5 h-5 text-black/80" />
                    </a>
                  </div>
                </div>
                <div>
                  <button
                    className="next-button !h-12 flex justify-center items-center"
                    onClick={openSignIn}
                  >
                    <Link className="w-4 h-4 mr-2" />
                    Link me
                  </button>
                </div>
              </div>

              <p className="text-sm max-w-2xl"></p>
            </div>
          </div>
        </div>
      </div>

      {/* Creator Details Card */}
      <div className="mt-6 bg-white/10 rounded-3xl p-6 md:p-8 text-white">
        <h3 className="text-xl font-semibold mb-6">About</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {user?.location && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-base font-medium">{user.location}</p>
                </div>
              </div>
            )}

            {user?.followers && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Followers</p>
                  <p className="text-base font-medium">
                    {user.followers.toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {user?.email && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-base font-medium break-all">
                    {user.email}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {user?.phone && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-base font-medium">{user.phone}</p>
                </div>
              </div>
            )}

            {user?.businessWebsite && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Website</p>
                  <a
                    href={user.businessWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-medium text-epiclinx-teal hover:underline break-all"
                  >
                    {user.businessWebsite}
                  </a>
                </div>
              </div>
            )}

            {user?.categories && user.categories.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {user.categories.map((category, index) => (
                      <span
                        key={index}
                        className="bg-epiclinx-semiteal text-black text-xs font-medium px-3 py-1 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Business Description - Full Width if exists */}
        {user?.businessDescription && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-gray-400 mb-2">About</p>
            <p className="text-base leading-relaxed">
              {user.businessDescription}
            </p>
          </div>
        )}
      </div>

      {/* Stats Section */}
      {value && (
        <div className="flex w-full max-md:flex-col justify-between mt-6 gap-4">
          <div className="flex w-full justify-between max-md:flex-col max-md:items-start gap-3 items-center bg-white/10 rounded-3xl p-10 text-center text-white">
            <p className="text-6xl font-bold">32</p>
            <p className="text-md mt-1">Jobs Completed</p>
          </div>
          <div className="flex w-full justify-between items-center max-md:flex-col max-md:items-start gap-3 bg-white/10 rounded-3xl p-10 text-center text-white">
            <p className="text-6xl font-bold">11</p>
            <p className="text-md mt-1">Earning Secured</p>
          </div>
          <div className="flex w-full justify-between items-center max-md:flex-col max-md:items-start gap-3 bg-white/10 rounded-3xl p-10 text-center text-white">
            <p className="text-6xl font-bold">16</p>
            <p className="text-md mt-1">Brands Worked With</p>
          </div>
        </div>
      )}

      {/* Sign In Form */}
      <LinkMe isOpen={signInOpen} onClose={closeSignIn} />
    </div>
  );
};

export default ProfileView;
