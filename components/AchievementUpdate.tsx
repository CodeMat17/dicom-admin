"use client";

import { createClient } from "@/utils/supabase/client";
import { Edit3Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { sanitizeContent } from "@/utils/sanitizeContent";

type AchievementContent = {
  desc: string;
  img: string[];
};

type Achievement = {
  id: string;
  title: string;
  content: AchievementContent[];
};

const AchievementUpdate = () => {
  const supabase = createClient();

  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, []);

  // Fetch data from the 'achievement' table
  const fetchAchievements = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast("Error!", {
          description: error.message,
        });
        setError(error.message);
        return
      }

      // Assuming the structure of data matches Achievement type
      if (data) {
        // Parse the 'content' field for each achievement
        const parsedData = data.map((achievement: any) => ({
          ...achievement,
          content: JSON.parse(achievement.content[0]), // Parse the JSON string
        }));

        setAchievements(parsedData);
      }
    } catch (error) {
      setError("Failed to fetch achievements");
      toast("Error", {
        description: `Failed to fetch achievements: ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <p className='text-center py-20'>Loading achievements...</p>;

  return (
    <div className='w-full min-h-screen p-4 bg-gray-50 rounded-xl'>
      <h2 className='text-lg font-medium text-center my-6'>Achievements</h2>

      <div className='space-y-4 mt-5 max-w-6xl mx-auto'>
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className='relative bg-white p-6 shadow-md rounded-lg border'>
            <h3 className='text-xl font-bold mb-4'>{achievement.title}</h3>
            {/* <p>{achievement.content.desc}</p> */}

            <div dangerouslySetInnerHTML={{__html: sanitizeContent(achievement.content.desc)}} />

            <div className='flex justify-center'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2'>
                {achievement.content.img.map((image: string, i: number) => (
                  <Image
                    key={i}
                    loading='lazy'
                    width={200}
                    height={100}
                    src={image}
                    alt={`Achievement Image ${i + 1}`}
                    className='w-full h-auto max-w-[200px] mx-auto object-cover rounded-md border'
                  />
                ))}
              </div>
            </div>
            <Button
              asChild
              size='icon'
              variant='outline'
              className='absolute top-4 right-4'>
              <Link href={`/private/our-achievements/${achievement.id}`}>
                <Edit3Icon />
              </Link>
            </Button>
          </div>
        ))}
      </div>

      {/* <Button disabled={loading} onClick={updateAchievement}>
            {loading ? <MinusIcon className="animate-spin" /> : 'Update'}
            </Button> */}
    </div>
  );
};

export default AchievementUpdate;
