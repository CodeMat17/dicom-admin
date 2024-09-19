// /api/achievements/post/route.ts
import { NextResponse } from "next/server";
import {supabaseServiceClient} from '@/utils/supabase/service'


export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();

    // Validate data
    if (!title || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { error } = await supabaseServiceClient
      .from("achievements")
      .insert([{ title, content }]);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Achievement posted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
