// components/TeamCard.tsx
"use client";

import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type TeamProps = {
  id: string;
  name: string;
  position: string;
  bio: string;
  photo: string;
};

const TeamCard = () => {
  const supabase = createClient();
  const router = useRouter();
  const [team, setTeam] = useState<TeamProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTeam();
  }, [supabase]);

  const fetchTeam = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("team")
      .select("id, name, position, bio, photo")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching teams:", error.message);
    } else {
      setTeam(data as TeamProps[]);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className='text-center w-full flex justify-center py-32'>
        Wait...
      </div>
    );
  }

  return (
    <div className='mt-12'>
      <p className='text-center text-xl font-medium'>Our Team</p>

      <div className='mt-6 w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
        {team &&
          team.map((user) => (
            <div
              key={user.id}
              className='flex flex-col justify-center gap-4 rounded-xl overflow-hidden w-full border p-5 shadow-md cursor-pointer'
              onClick={() => router.push(`/private/edit-team/${user.id}`)}>
              <div className='text-center'>
                <Image
                  alt=''
                  width={100}
                  height={100}
                  priority
                  src={user.photo}
                  className='w-full max-w-[150px] aspect-square mx-auto rounded-full object-cover'
                />
                <p className='text-xl font-medium'>{user.name}</p>
                <p className='mt-1 text-sm'>{user.position}</p>
              </div>
              <div>
                <p className='mt-1 text-sm text-gray-500'>{user.bio}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TeamCard;
