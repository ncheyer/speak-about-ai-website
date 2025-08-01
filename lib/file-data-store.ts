// Simple file-based data store for v0.dev preview compatibility
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

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

// Data file paths
const DATA_DIR = join(process.cwd(), 'data')
const USERS_FILE = join(DATA_DIR, 'users.json')
const EVENTS_FILE = join(DATA_DIR, 'events.json')
const ATTENDEES_FILE = join(DATA_DIR, 'attendees.json')

// Initialize data directory and files
async function initializeDataFiles() {
  try {
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true })
    }
    
    // Initialize with sample data if files don't exist
    if (!existsSync(USERS_FILE)) {
      const sampleUsers: User[] = [
        {
          id: 'demo-user-1',
          email: 'demo@example.com',
          password: '$2a$10$8K1p/a0dUZRHXUqULkRFfuTGZE6r3J5J9YcvG7zJvE.NGE6qGfQYm', // password123
          name: 'Demo User',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        }
      ]
      await writeFile(USERS_FILE, JSON.stringify(sampleUsers, null, 2))
    }
    
    if (!existsSync(EVENTS_FILE)) {
      const sampleEvents: Event[] = [
        {
          id: 'demo-event-1',
          title: 'AI Conference 2024',
          description: 'A comprehensive conference about the future of artificial intelligence.',
          date: new Date('2024-06-15T10:00:00.000Z'),
          location: 'San Francisco, CA',
          capacity: 200,
          price: 299,
          published: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          userId: 'demo-user-1',
        },
        {
          id: 'demo-event-2',
          title: 'Machine Learning Workshop',
          description: 'Hands-on workshop covering practical machine learning techniques.',
          date: new Date('2024-07-20T14:00:00.000Z'),
          location: 'New York, NY',
          capacity: 50,
          price: 150,
          published: false,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          userId: 'demo-user-1',
        }
      ]
      await writeFile(EVENTS_FILE, JSON.stringify(sampleEvents, null, 2))
    }
    
    if (!existsSync(ATTENDEES_FILE)) {
      const sampleAttendees: EventAttendee[] = [
        {
          id: 'demo-attendee-1',
          eventId: 'demo-event-1',
          email: 'attendee1@example.com',
          name: 'John Smith',
          createdAt: new Date('2024-01-02'),
        },
        {
          id: 'demo-attendee-2',
          eventId: 'demo-event-1',
          email: 'attendee2@example.com',
          name: 'Jane Doe',
          createdAt: new Date('2024-01-03'),
        }
      ]
      await writeFile(ATTENDEES_FILE, JSON.stringify(sampleAttendees, null, 2))
    }
  } catch (error) {
    console.error('Error initializing data files:', error)
  }
}

// Helper functions to read/write JSON files with date parsing
async function readJsonFile<T>(filePath: string): Promise<T[]> {
  try {
    const data = await readFile(filePath, 'utf-8')
    return JSON.parse(data, (key, value) => {
      // Parse date strings back to Date objects
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
        return new Date(value)
      }
      return value
    })
  } catch (error) {
    return []
  }
}

async function writeJsonFile<T>(filePath: string, data: T[]): Promise<void> {
  await writeFile(filePath, JSON.stringify(data, null, 2))
}

// Initialize on startup
initializeDataFiles().catch(console.error)

// Database operations
export const db = {
  user: {
    create: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
      const users = await readJsonFile<User>(USERS_FILE)
      const user: User = {
        ...data,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      users.push(user)
      await writeJsonFile(USERS_FILE, users)
      return user
    },
    
    findUnique: async ({ where }: { where: { id?: string; email?: string } }): Promise<User | null> => {
      const users = await readJsonFile<User>(USERS_FILE)
      
      if (where.id) {
        return users.find(u => u.id === where.id) || null
      }
      if (where.email) {
        return users.find(u => u.email === where.email) || null
      }
      return null
    },
    
    update: async ({ where, data }: { where: { id: string }; data: Partial<User> }): Promise<User> => {
      const users = await readJsonFile<User>(USERS_FILE)
      const index = users.findIndex(u => u.id === where.id)
      if (index === -1) throw new Error('User not found')
      
      users[index] = {
        ...users[index],
        ...data,
        updatedAt: new Date(),
      }
      await writeJsonFile(USERS_FILE, users)
      return users[index]
    },
  },
  
  event: {
    create: async (data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> => {
      const events = await readJsonFile<Event>(EVENTS_FILE)
      const event: Event = {
        ...data,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      events.push(event)
      await writeJsonFile(EVENTS_FILE, events)
      return event
    },
    
    findMany: async ({ where, orderBy }: { 
      where?: { userId?: string; published?: boolean }; 
      orderBy?: { date?: 'asc' | 'desc' } 
    } = {}): Promise<Event[]> => {
      const events = await readJsonFile<Event>(EVENTS_FILE)
      let result = [...events]
      
      if (where?.userId) {
        result = result.filter(e => e.userId === where.userId)
      }
      if (where?.published !== undefined) {
        result = result.filter(e => e.published === where.published)
      }
      
      if (orderBy?.date) {
        result.sort((a, b) => {
          const diff = new Date(a.date).getTime() - new Date(b.date).getTime()
          return orderBy.date === 'asc' ? diff : -diff
        })
      }
      
      return result
    },
    
    findUnique: async ({ where }: { where: { id: string } }): Promise<Event | null> => {
      const events = await readJsonFile<Event>(EVENTS_FILE)
      return events.find(e => e.id === where.id) || null
    },
    
    update: async ({ where, data }: { where: { id: string }; data: Partial<Event> }): Promise<Event> => {
      const events = await readJsonFile<Event>(EVENTS_FILE)
      const index = events.findIndex(e => e.id === where.id)
      if (index === -1) throw new Error('Event not found')
      
      events[index] = {
        ...events[index],
        ...data,
        updatedAt: new Date(),
      }
      await writeJsonFile(EVENTS_FILE, events)
      return events[index]
    },
    
    delete: async ({ where }: { where: { id: string } }): Promise<void> => {
      const events = await readJsonFile<Event>(EVENTS_FILE)
      const index = events.findIndex(e => e.id === where.id)
      if (index === -1) throw new Error('Event not found')
      events.splice(index, 1)
      await writeJsonFile(EVENTS_FILE, events)
    },
  },
  
  eventAttendee: {
    create: async (data: Omit<EventAttendee, 'id' | 'createdAt'>): Promise<EventAttendee> => {
      const attendees = await readJsonFile<EventAttendee>(ATTENDEES_FILE)
      const attendee: EventAttendee = {
        ...data,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date(),
      }
      attendees.push(attendee)
      await writeJsonFile(ATTENDEES_FILE, attendees)
      return attendee
    },
    
    findMany: async ({ where }: { where?: { eventId?: string } } = {}): Promise<EventAttendee[]> => {
      const attendees = await readJsonFile<EventAttendee>(ATTENDEES_FILE)
      
      if (where?.eventId) {
        return attendees.filter(a => a.eventId === where.eventId)
      }
      return attendees
    },
    
    count: async ({ where }: { where: { eventId: string } }): Promise<number> => {
      const attendees = await readJsonFile<EventAttendee>(ATTENDEES_FILE)
      return attendees.filter(a => a.eventId === where.eventId).length
    },
  },
}