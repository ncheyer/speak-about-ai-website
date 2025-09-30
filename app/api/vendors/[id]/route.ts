import { NextRequest, NextResponse } from "next/server"
import { 
  getVendorById,
  updateVendor,
  deleteVendor
} from "@/lib/vendors-db"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vendor = await getVendorById(parseInt(params.id))
    
    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ vendor })
  } catch (error) {
    console.error("Error fetching vendor:", error)
    return NextResponse.json(
      { error: "Failed to fetch vendor" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check for admin authentication
    const isAdmin = request.headers.get("x-admin-request") === "true"
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    
    // Generate slug if company name changed
    if (body.company_name && !body.slug) {
      body.slug = body.company_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
    
    const vendor = await updateVendor(parseInt(params.id), body)
    
    return NextResponse.json({ vendor })
  } catch (error) {
    console.error("Error updating vendor:", error)
    return NextResponse.json(
      { error: "Failed to update vendor" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check for admin authentication
    const isAdmin = request.headers.get("x-admin-request") === "true"
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    await deleteVendor(parseInt(params.id))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting vendor:", error)
    return NextResponse.json(
      { error: "Failed to delete vendor" },
      { status: 500 }
    )
  }
}