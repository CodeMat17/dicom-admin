import { createClient } from "@/utils/supabase/server";

import {
  CalendarDaysIcon,
  ComponentIcon,
  HandshakeIcon,
  HomeIcon,
  NetworkIcon,
  UserPenIcon,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SignOut from "./SignOut";

const SideNav = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <aside
      className='
        hidden sm:block sm:fixed sm:w-20 md:w-64 lg:w-72 
        h-screen bg-gray-800 p-4
        text-white transition-all z-50
      '>
      <div className='flex items-center gap-2'>
        <Image
          alt=''
          priority
          width={55}
          height={55}
          src='/gouni_logo.jpg'
          className='rounded-full shrink-0'
        />
        <p className='hidden md:block font-semibold tracking-wider text-lg'>
          DICOM
        </p>
      </div>

      {/* Add your navigation items here */}
      <nav className='mt-8 space-y-3'>
        <Link
          href='/private'
          className='flex gap-3 items-center justify-center md:justify-start rounded-xl px-3 py-2  hover:bg-black/30'>
          <HomeIcon className='w-5 h-5 shrink-0' />
          <p className='hidden md:block '>Home</p>
        </Link>
        <Link
          href='/private/about-us'
          className='flex gap-3 items-center justify-center md:justify-start rounded-xl px-3 py-2  hover:bg-black/30'>
          <UsersIcon className='w-5 h-5 shrink-0' />
          <p className='hidden md:block'>About Us</p>
        </Link>
        <Link
          href='/private/our-achievements'
          className='flex gap-3 items-center justify-center md:justify-start rounded-xl px-3 py-2  hover:bg-black/30'>
          <ComponentIcon className='w-5 h-5 shrink-0' />
          <p className='hidden md:block'>Achievements</p>
        </Link>
        <Link
          href='/private/upcoming-events'
          className='flex gap-3 items-center justify-center md:justify-start rounded-xl px-3 py-2  hover:bg-black/30'>
          <CalendarDaysIcon className='w-5 h-5 shrink-0' />
          <p className='hidden md:block'>Upcoming Events</p>
        </Link>
        <Link
          href='/private/trainings-workshops'
          className='flex gap-3 items-center justify-center md:justify-start rounded-xl px-3 py-2  hover:bg-black/30'>
          <NetworkIcon className='w-5 h-5 shrink-0' />
          <p className='hidden md:block'>Trainings / Workshops</p>
        </Link>
        <Link
          href='/private/get-involved'
          className='flex gap-3 items-center justify-center md:justify-start rounded-xl px-3 py-2  hover:bg-black/30'>
          <HandshakeIcon className='w-5 h-5 shrink-0' />
          <p className='hidden md:block '>Get Involved</p>
        </Link>
        <Link
          href='/private/contact-us'
          className='flex gap-3 items-center justify-center md:justify-start rounded-xl px-3 py-2  hover:bg-black/30'>
          <UserPenIcon className='w-5 h-5 shrink-0' />
          <p className='hidden md:block'>Contact Us</p>
        </Link>
      </nav>
      <div className='mt-4 flex flex-col  justify-center items-center md:items-start md:pl-4'>
        <SignOut email={user?.email} />
      </div>
    </aside>
  );
};

export default SideNav;
