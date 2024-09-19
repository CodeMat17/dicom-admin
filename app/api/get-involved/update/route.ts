import { supabaseServiceClient } from "@/utils/supabase/service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id, newTitle, newDesc } = await req.json();

    // Validate data
    if (!id || !newTitle || !newDesc) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { error } = await supabaseServiceClient
      .from("getInvolved")
      .update({ title: newTitle, desc: newDesc })
      .eq("id", id)
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Event posted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
