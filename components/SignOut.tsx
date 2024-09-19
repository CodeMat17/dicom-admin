"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createClient } from "@/utils/supabase/client";
import { MinusIcon, PowerIcon, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

const SignOut = ({ email }: { email: string | undefined }) => {



  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.refresh();
      router.push("/login");
    }
    setLoading(false);
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild className="flex justify-center items-center">
          <Button
            // size='icon'
            variant='outline'
            className='rounded-full text-red-500 flex gap-3 md:justify-start border'>
            <PowerIcon />
          <p className="hidden md:block">Sign out</p>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='mx-4'>
          <div className='space-y-1'>
            <div className='flex items-center gap-4'>
              {/* <Image
                alt=''
                priority
                width={30}
                height={30}
                src='/user.gif'
                className='rounded-full'
              /> */}
              <User className="w-4 h-4" />
              <p className='text-xs'>{email}</p>
            </div>

            <Button
              onClick={logout}
              // size='icon'
              variant='ghost'
              className='w-full mt-2 bg-red-500 hover:bg-red-200 text-white'>
              {/* <Image
                alt=''
                priority
                width={30}
                height={30}
                src='/power.gif'
                className='rounded-full'
              /> */}
              <p className=''>Sign out</p>
              {loading && <MinusIcon className='animate-spin' />}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      {/* <Button
     
        onClick={logout}
        className='rounded-full text-red-500'>
        <PowerIcon />
      </Button> */}
    </>
  );
};

export default SignOut;
