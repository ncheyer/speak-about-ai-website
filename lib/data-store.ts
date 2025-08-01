// Simple in-memory data store for v0.dev compatibility
// In production, this would be replaced with a real database

export interface User {
  id: string
  email: string
  password: string
  name?: string
  emailVerified?: Date
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface Event {
  id: string
  title: string
  description?: string
  date: Date
  location: string
  capacity?: number
  price?: number
  imageUrl?: string
  published: boolean
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface EventAttendee {
  id: string
  eventId: string
  email: string
  name: string
  createdAt: Date
}

// In-memory storage
let users: User[] = []
let events: Event[] = []
let attendees: EventAttendee[] = []

// User functions
export const db = {
  user: {
    create: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
      const user: User = {
        ...data,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      users.push(user)
      return user
    },
    
    findUnique: async ({ where }: { where: { id?: string; email?: string } }): Promise<User | null> => {
      if (where.id) {
        return users.find(u => u.id === where.id) || null
      }
      if (where.email) {
        return users.find(u => u.email === where.email) || null
      }
      return null
    },
    
    update: async ({ where, data }: { where: { id: string }; data: Partial<User> }): Promise<User> => {
      const index = users.findIndex(u => u.id === where.id)
      if (index === -1) throw new Error('User not found')
      
      users[index] = {
        ...users[index],
        ...data,
        updatedAt: new Date(),
      }
      return users[index]
    },
  },
  
  event: {
    create: async (data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> => {
      const event: Event = {
        ...data,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      events.push(event)
      return event
    },
    
    findMany: async ({ where, orderBy }: { 
      where?: { userId?: string; published?: boolean }; 
      orderBy?: { date?: 'asc' | 'desc' } 
    } = {}): Promise<Event[]> => {
      let result = [...events]
      
      if (where?.userId) {
        result = result.filter(e => e.userId === where.userId)
      }
      if (where?.published !== undefined) {
        result = result.filter(e => e.published === where.published)
      }
      
      if (orderBy?.date) {
        result.sort((a, b) => {
          const diff = a.date.getTime() - b.date.getTime()
          return orderBy.date === 'asc' ? diff : -diff
        })
      }
      
      return result
    },
    
    findUnique: async ({ where }: { where: { id: string } }): Promise<Event | null> => {
      return events.find(e => e.id === where.id) || null
    },
    
    update: async ({ where, data }: { where: { id: string }; data: Partial<Event> }): Promise<Event> => {
      const index = events.findIndex(e => e.id === where.id)
      if (index === -1) throw new Error('Event not found')
      
      events[index] = {
        ...events[index],
        ...data,
        updatedAt: new Date(),
      }
      return events[index]
    },
    
    delete: async ({ where }: { where: { id: string } }): Promise<void> => {
      const index = events.findIndex(e => e.id === where.id)
      if (index === -1) throw new Error('Event not found')
      events.splice(index, 1)
    },
  },
  
  eventAttendee: {
    create: async (data: Omit<EventAttendee, 'id' | 'createdAt'>): Promise<EventAttendee> => {
      const attendee: EventAttendee = {
        ...data,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date(),
      }
      attendees.push(attendee)
      return attendee
    },
    
    findMany: async ({ where }: { where?: { eventId?: string } } = {}): Promise<EventAttendee[]> => {
      if (where?.eventId) {
        return attendees.filter(a => a.eventId === where.eventId)
      }
      return [...attendees]
    },
    
    count: async ({ where }: { where: { eventId: string } }): Promise<number> => {
      return attendees.filter(a => a.eventId === where.eventId).length
    },
  },
}

// Helper to get event with attendee count
export async function getEventWithAttendeeCount(eventId: string) {
  const event = await db.event.findUnique({ where: { id: eventId } })
  if (!event) return null
  
  const attendeeCount = await db.eventAttendee.count({ where: { eventId } })
  return {
    ...event,
    _count: {
      attendees: attendeeCount,
    },
  }
}

// Helper to get all events with attendee counts for a user
export async function getUserEventsWithAttendees(userId: string) {
  const userEvents = await db.event.findMany({ 
    where: { userId },
    orderBy: { date: 'asc' },
  })
  
  return Promise.all(
    userEvents.map(async (event) => {
      const attendeeCount = await db.eventAttendee.count({ where: { eventId: event.id } })
      return {
        ...event,
        _count: {
          attendees: attendeeCount,
        },
      }
    })
  )
}