import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/data-store"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { title, description, date, location, capacity, price, published } = body

    if (!title || !date || !location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const event = await db.event.create({
      title,
      description,
      date: new Date(date),
      location,
      capacity,
      price,
      published: published || false,
      userId: session.user.id,
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error("Create event error:", error)
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const events = await db.event.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "asc" },
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error("Get events error:", error)
    return NextResponse.json(
      { error: "Failed to get events" },
      { status: 500 }
    )
  }
}