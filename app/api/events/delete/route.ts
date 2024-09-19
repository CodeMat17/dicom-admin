import { supabaseServiceClient } from "@/utils/supabase/service";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    // Validate data
    if (!id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { error } = await supabaseServiceClient
      .from("events")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
