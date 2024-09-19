// app/user/[id]/page.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import UploadPhoto from "@/components/UploadPhoto";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type TeamProps = {
  id: string;
  name: string;
  position: string;
  bio: string;
  photo: string;
};

const UserEditPage = () => {
  const router = useRouter();
  const params = useParams() as { id: string };
  const supabase = createClient();
  const id = params?.id;
  const [loading, setLoading] = useState(false);

  const [team, setTeam] = useState<TeamProps | null>(null);
  const [teamName, setTeamName] = useState("");
  const [teamPosition, setTeamPosition] = useState("");
  const [teamBio, setTeamBio] = useState("");
  const [teamPhoto, setTeamPhoto] = useState("");
  const [userImgUrl, setUserImgUrl] = useState("");

  useEffect(() => {
    if (id) {
      // Fetch the user data from Supabase when the page loads
      fetchUserData();
    }
  }, [id]);

  const fetchUserData = async () => {
    if (!id) return; // Ensure `id` is present
    const { data, error } = await supabase
      .from("team")
      .select("id, name, position, bio, photo")
      .eq("id", id) // Use `eq` instead of `match` for a single value
      .single();

    if (!data) {
      notFound;
    }

    if (error) {
      console.error("Error fetching user data:", error.message);
    } else {
      setTeamName(data?.name);
      setTeamPosition(data?.position);
      setTeamBio(data?.bio);
      setTeamPhoto(data?.photo);

      setTeam(data);
      setUserImgUrl(data.photo);
    }
  };

  if (team === null) {
    return <div className='w-full px-4 py-32 text-center'>Fetching data</div>;
  }

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (team) {
      setTeam({ ...team, [name]: value });
    }
  };

  // Handle save changes
  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/team/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, teamName, teamPosition, teamBio, teamPhoto }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      toast(`DONE!`, {
        description: "Team data updated successfully",
      });
      router.back();
      router.refresh();
    } catch (error) {
      console.error("Error updating team data:", error);
      alert("Failed to update team data");
    } finally {
      setLoading(false);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (newPhotoUrl: string) => {
    if (team) {
      setTeamPhoto(newPhotoUrl );
    }
  };

  console.log('new photo url: ', teamPhoto);

  return (
    <div className='px-4 pt-8 pb-12'>
      <h2 className='text-xl text-center font-bold mb-4'>
        Edit Team Member Data
      </h2>
      <div className='mt-8 flex flex-col items-center justify-center gap-4 w-full max-w-md mx-auto'>
        <div className='flex flex-col sm:flex-row items-center gap-2 sm:gap-8'>
          {teamPhoto && (
            <Image
              alt=''
              priority
              width={200}
              height={200}
              src={teamPhoto}
              className='rounded-full w-[200px] aspect-square object-cover shadow-md'
            />
          )}

          <UploadPhoto onPhotoUpload={handlePhotoUpload} />
        </div>

        <Input
          type='text'
          name='name'
          placeholder='Name'
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className='w-full border-gray-400 bg-gray-50'
        />

        <Input
          type='text'
          name='position'
          placeholder='Position'
          value={teamPosition}
          onChange={(e) => setTeamPosition(e.target.value)}
          className='border-gray-400 bg-gray-50'
        />

        <Textarea
          name='bio'
          value={teamBio}
          onChange={(e) => setTeamBio(e.target.value)}
          className='border-gray-400 bg-gray-50 h-28'
        />

        <Button
          onClick={handleSave}
          className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600'>
          {loading ? "Saving changes" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default UserEditPage;
