"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AchievementPost from "./AchievementPost";
import AchievementUpdate from "./AchievementUpdate";

const AchievementTab = () => {
  return (
    <Tabs
      defaultValue='update'
      className='w-full flex flex-col justify-center'>
      <TabsList>
        <TabsTrigger value='update'>Update</TabsTrigger>
        <TabsTrigger value='post'>Post</TabsTrigger>
      </TabsList>
      <TabsContent value='update'>
        <AchievementUpdate />
      </TabsContent>
      <TabsContent value='post'>
        <AchievementPost />
      </TabsContent>
    </Tabs>
  );
};

export default AchievementTab;
