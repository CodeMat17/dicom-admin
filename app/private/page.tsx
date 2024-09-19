import HeroForm from "@/components/HeroForm";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/server";

const Private = async () => {
  const supabase = createClient();

  const { data } = await supabase.from("hero").select("*").single();

  return (
    <div className='px-4 pt-4 pb-12'>
      <p className='text-lg font-medium text-center'>Homepage</p>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <div className="mt-8">
        <HeroForm id={data.id} title={data.title} desc={data.desc} imgs={data.imgs} />
       
      </div>
    </div>
  );
};

export default Private;
