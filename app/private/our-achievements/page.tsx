import AchievementTab from "@/components/AchievementTab";

const Achievements = () => {
  return (
    <div className='w-full min-h-screen p-4'>
      <p className='text-center text-2xl font-semibold'>Our Achievements</p>
          <div className='mt-6 mx-auto w-full flex justify-center max-w-6xl'>
              <AchievementTab />
      </div>
    </div>
  );
};

export default Achievements;
