import { type NextRequest, NextResponse } from "next/server"
import { updateAllProjectStatuses } from "@/lib/projects-db"

export async function POST(request: NextRequest) {
  try {
    console.log("Manual project status update triggered")
    
    const result = await updateAllProjectStatuses()
    
    return NextResponse.json({
      success: true,
      message: `Status update complete: ${result.updated} projects updated, ${result.errors} errors`,
      ...result
    })
  } catch (error) {
    console.error("Error in POST /api/projects/update-statuses:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update project statuses",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("Automatic project status update check triggered")
    
    const result = await updateAllProjectStatuses()
    
    return NextResponse.json({
      success: true,
      message: `Automatic status update: ${result.updated} projects updated, ${result.errors} errors`,
      ...result
    })
  } catch (error) {
    console.error("Error in GET /api/projects/update-statuses:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update project statuses",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}