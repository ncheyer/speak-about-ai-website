// Data store that switches between Google Sheets and in-memory storage
// Uses Google Sheets if properly configured, otherwise falls back to in-memory

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

// Check if Google Sheets is properly configured
const isGoogleSheetsConfigured = () => {
  return !!(
    process.env.GOOGLE_SPREADSHEET_ID && 
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && 
    process.env.GOOGLE_PRIVATE_KEY
  )
}

// Dynamic import and export of the appropriate data store
let dbModule: any = null

async function getDb() {
  if (!dbModule) {
    if (isGoogleSheetsConfigured()) {
      console.log('🔗 Using Google Sheets as database')
      const module = await import('./sheets-data-store')
      dbModule = module.db
    } else {
      console.log('💾 Using in-memory database')
      const module = await import('./memory-data-store')
      dbModule = module.db
    }
  }
  return dbModule
}

// Export database functions that dynamically choose the implementation
export const db = {
  user: {
    create: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
      const database = await getDb()
      return database.user.create(data)
    },
    
    findUnique: async ({ where }: { where: { id?: string; email?: string } }): Promise<User | null> => {
      const database = await getDb()
      return database.user.findUnique({ where })
    },
    
    update: async ({ where, data }: { where: { id: string }; data: Partial<User> }): Promise<User> => {
      const database = await getDb()
      return database.user.update({ where, data })
    },
  },
  
  event: {
    create: async (data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> => {
      const database = await getDb()
      return database.event.create(data)
    },
    
    findMany: async ({ where, orderBy }: { 
      where?: { userId?: string; published?: boolean }; 
      orderBy?: { date?: 'asc' | 'desc' } 
    } = {}): Promise<Event[]> => {
      const database = await getDb()
      return database.event.findMany({ where, orderBy })
    },
    
    findUnique: async ({ where }: { where: { id: string } }): Promise<Event | null> => {
      const database = await getDb()
      return database.event.findUnique({ where })
    },
    
    update: async ({ where, data }: { where: { id: string }; data: Partial<Event> }): Promise<Event> => {
      const database = await getDb()
      return database.event.update({ where, data })
    },
    
    delete: async ({ where }: { where: { id: string } }): Promise<void> => {
      const database = await getDb()
      return database.event.delete({ where })
    },
  },
  
  eventAttendee: {
    create: async (data: Omit<EventAttendee, 'id' | 'createdAt'>): Promise<EventAttendee> => {
      const database = await getDb()
      return database.eventAttendee.create(data)
    },
    
    findMany: async ({ where }: { where?: { eventId?: string } } = {}): Promise<EventAttendee[]> => {
      const database = await getDb()
      return database.eventAttendee.findMany({ where })
    },
    
    count: async ({ where }: { where: { eventId: string } }): Promise<number> => {
      const database = await getDb()
      return database.eventAttendee.count({ where })
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