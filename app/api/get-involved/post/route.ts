import { NextResponse } from "next/server";
import { supabaseServiceClient } from "@/utils/supabase/service";

export async function POST(req: Request) {
  try {
    const { title, desc } = await req.json();

    // Validate data
    if (!title || !desc) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { error } = await supabaseServiceClient
      .from("getInvolved")
      .insert([{ title, desc }]);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Event posted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
