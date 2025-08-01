import { 
  getSheetData, 
  appendToSheet, 
  updateSheetRow, 
  deleteSheetRow, 
  SHEETS,
  initializeSheets 
} from './google-sheets'

// Initialize sheets on startup
if (process.env.GOOGLE_SPREADSHEET_ID) {
  initializeSheets().catch(console.error)
}

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

// Helper functions to convert between sheet rows and objects
function userFromRow(row: string[]): User {
  return {
    id: row[0],
    email: row[1],
    password: row[2],
    name: row[3] || undefined,
    emailVerified: row[4] ? new Date(row[4]) : undefined,
    image: row[5] || undefined,
    createdAt: new Date(row[6]),
    updatedAt: new Date(row[7]),
  }
}

function userToRow(user: User): string[] {
  return [
    user.id,
    user.email,
    user.password,
    user.name || '',
    user.emailVerified?.toISOString() || '',
    user.image || '',
    user.createdAt.toISOString(),
    user.updatedAt.toISOString(),
  ]
}

function eventFromRow(row: string[]): Event {
  return {
    id: row[0],
    title: row[1],
    description: row[2] || undefined,
    date: new Date(row[3]),
    location: row[4],
    capacity: row[5] ? parseInt(row[5]) : undefined,
    price: row[6] ? parseFloat(row[6]) : undefined,
    imageUrl: row[7] || undefined,
    published: row[8] === 'true',
    createdAt: new Date(row[9]),
    updatedAt: new Date(row[10]),
    userId: row[11],
  }
}

function eventToRow(event: Event): string[] {
  return [
    event.id,
    event.title,
    event.description || '',
    event.date.toISOString(),
    event.location,
    event.capacity?.toString() || '',
    event.price?.toString() || '',
    event.imageUrl || '',
    event.published.toString(),
    event.createdAt.toISOString(),
    event.updatedAt.toISOString(),
    event.userId,
  ]
}

function attendeeFromRow(row: string[]): EventAttendee {
  return {
    id: row[0],
    eventId: row[1],
    email: row[2],
    name: row[3],
    createdAt: new Date(row[4]),
  }
}

function attendeeToRow(attendee: EventAttendee): string[] {
  return [
    attendee.id,
    attendee.eventId,
    attendee.email,
    attendee.name,
    attendee.createdAt.toISOString(),
  ]
}

// Database operations
export const db = {
  user: {
    create: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
      const user: User = {
        ...data,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      await appendToSheet(SHEETS.USERS, userToRow(user))
      return user
    },
    
    findUnique: async ({ where }: { where: { id?: string; email?: string } }): Promise<User | null> => {
      const rows = await getSheetData(SHEETS.USERS)
      
      // Skip header row
      for (let i = 1; i < rows.length; i++) {
        const user = userFromRow(rows[i])
        if ((where.id && user.id === where.id) || (where.email && user.email === where.email)) {
          return user
        }
      }
      
      return null
    },
    
    update: async ({ where, data }: { where: { id: string }; data: Partial<User> }): Promise<User> => {
      const rows = await getSheetData(SHEETS.USERS)
      
      for (let i = 1; i < rows.length; i++) {
        const user = userFromRow(rows[i])
        if (user.id === where.id) {
          const updatedUser = {
            ...user,
            ...data,
            updatedAt: new Date(),
          }
          await updateSheetRow(SHEETS.USERS, i + 1, userToRow(updatedUser))
          return updatedUser
        }
      }
      
      throw new Error('User not found')
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
      
      await appendToSheet(SHEETS.EVENTS, eventToRow(event))
      return event
    },
    
    findMany: async ({ where, orderBy }: { 
      where?: { userId?: string; published?: boolean }; 
      orderBy?: { date?: 'asc' | 'desc' } 
    } = {}): Promise<Event[]> => {
      const rows = await getSheetData(SHEETS.EVENTS)
      let events: Event[] = []
      
      // Skip header row
      for (let i = 1; i < rows.length; i++) {
        const event = eventFromRow(rows[i])
        
        if (where?.userId && event.userId !== where.userId) continue
        if (where?.published !== undefined && event.published !== where.published) continue
        
        events.push(event)
      }
      
      if (orderBy?.date) {
        events.sort((a, b) => {
          const diff = a.date.getTime() - b.date.getTime()
          return orderBy.date === 'asc' ? diff : -diff
        })
      }
      
      return events
    },
    
    findUnique: async ({ where }: { where: { id: string } }): Promise<Event | null> => {
      const rows = await getSheetData(SHEETS.EVENTS)
      
      for (let i = 1; i < rows.length; i++) {
        const event = eventFromRow(rows[i])
        if (event.id === where.id) {
          return event
        }
      }
      
      return null
    },
    
    update: async ({ where, data }: { where: { id: string }; data: Partial<Event> }): Promise<Event> => {
      const rows = await getSheetData(SHEETS.EVENTS)
      
      for (let i = 1; i < rows.length; i++) {
        const event = eventFromRow(rows[i])
        if (event.id === where.id) {
          const updatedEvent = {
            ...event,
            ...data,
            updatedAt: new Date(),
          }
          await updateSheetRow(SHEETS.EVENTS, i + 1, eventToRow(updatedEvent))
          return updatedEvent
        }
      }
      
      throw new Error('Event not found')
    },
    
    delete: async ({ where }: { where: { id: string } }): Promise<void> => {
      const rows = await getSheetData(SHEETS.EVENTS)
      
      for (let i = 1; i < rows.length; i++) {
        const event = eventFromRow(rows[i])
        if (event.id === where.id) {
          await deleteSheetRow(SHEETS.EVENTS, i + 1)
          return
        }
      }
      
      throw new Error('Event not found')
    },
  },
  
  eventAttendee: {
    create: async (data: Omit<EventAttendee, 'id' | 'createdAt'>): Promise<EventAttendee> => {
      const attendee: EventAttendee = {
        ...data,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date(),
      }
      
      await appendToSheet(SHEETS.ATTENDEES, attendeeToRow(attendee))
      return attendee
    },
    
    findMany: async ({ where }: { where?: { eventId?: string } } = {}): Promise<EventAttendee[]> => {
      const rows = await getSheetData(SHEETS.ATTENDEES)
      let attendees: EventAttendee[] = []
      
      for (let i = 1; i < rows.length; i++) {
        const attendee = attendeeFromRow(rows[i])
        
        if (where?.eventId && attendee.eventId !== where.eventId) continue
        
        attendees.push(attendee)
      }
      
      return attendees
    },
    
    count: async ({ where }: { where: { eventId: string } }): Promise<number> => {
      const attendees = await db.eventAttendee.findMany({ where })
      return attendees.length
    },
  },
}

// Helper functions
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