import { google } from 'googleapis'
import { GoogleAuth } from 'google-auth-library'

// Initialize Google Sheets API
const auth = new GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const sheets = google.sheets({ version: 'v4', auth })

export const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID!

// Sheet names
export const SHEETS = {
  USERS: 'Users',
  EVENTS: 'Events', 
  ATTENDEES: 'Attendees',
}

// Helper to get sheet data
export async function getSheetData(sheetName: string): Promise<any[][]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
    })
    return response.data.values || []
  } catch (error) {
    console.error(`Error reading ${sheetName} sheet:`, error)
    return []
  }
}

// Helper to append row to sheet
export async function appendToSheet(sheetName: string, values: any[]): Promise<void> {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [values],
      },
    })
  } catch (error) {
    console.error(`Error appending to ${sheetName} sheet:`, error)
    throw error
  }
}

// Helper to update a row
export async function updateSheetRow(
  sheetName: string, 
  rowIndex: number, 
  values: any[]
): Promise<void> {
  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A${rowIndex}:Z${rowIndex}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [values],
      },
    })
  } catch (error) {
    console.error(`Error updating ${sheetName} sheet:`, error)
    throw error
  }
}

// Helper to delete a row
export async function deleteSheetRow(
  sheetName: string,
  rowIndex: number
): Promise<void> {
  try {
    const requests = [{
      deleteDimension: {
        range: {
          sheetId: await getSheetId(sheetName),
          dimension: 'ROWS',
          startIndex: rowIndex - 1,
          endIndex: rowIndex,
        },
      },
    }]

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { requests },
    })
  } catch (error) {
    console.error(`Error deleting from ${sheetName} sheet:`, error)
    throw error
  }
}

// Get sheet ID by name
async function getSheetId(sheetName: string): Promise<number> {
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  })
  
  const sheet = spreadsheet.data.sheets?.find(
    s => s.properties?.title === sheetName
  )
  
  if (!sheet?.properties?.sheetId) {
    throw new Error(`Sheet ${sheetName} not found`)
  }
  
  return sheet.properties.sheetId
}

// Initialize sheets with headers if they don't exist
export async function initializeSheets(): Promise<void> {
  try {
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    })
    
    const existingSheets = spreadsheet.data.sheets?.map(
      s => s.properties?.title
    ) || []
    
    // Create sheets if they don't exist
    const sheetsToCreate = []
    
    if (!existingSheets.includes(SHEETS.USERS)) {
      sheetsToCreate.push({
        addSheet: {
          properties: { title: SHEETS.USERS }
        }
      })
    }
    
    if (!existingSheets.includes(SHEETS.EVENTS)) {
      sheetsToCreate.push({
        addSheet: {
          properties: { title: SHEETS.EVENTS }
        }
      })
    }
    
    if (!existingSheets.includes(SHEETS.ATTENDEES)) {
      sheetsToCreate.push({
        addSheet: {
          properties: { title: SHEETS.ATTENDEES }
        }
      })
    }
    
    if (sheetsToCreate.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: { requests: sheetsToCreate },
      })
    }
    
    // Add headers if sheets are empty
    const usersData = await getSheetData(SHEETS.USERS)
    if (usersData.length === 0) {
      await appendToSheet(SHEETS.USERS, [
        'id', 'email', 'password', 'name', 'emailVerified', 'image', 'createdAt', 'updatedAt'
      ])
    }
    
    const eventsData = await getSheetData(SHEETS.EVENTS)
    if (eventsData.length === 0) {
      await appendToSheet(SHEETS.EVENTS, [
        'id', 'title', 'description', 'date', 'location', 'capacity', 
        'price', 'imageUrl', 'published', 'createdAt', 'updatedAt', 'userId'
      ])
    }
    
    const attendeesData = await getSheetData(SHEETS.ATTENDEES)
    if (attendeesData.length === 0) {
      await appendToSheet(SHEETS.ATTENDEES, [
        'id', 'eventId', 'email', 'name', 'createdAt'
      ])
    }
  } catch (error) {
    console.error('Error initializing sheets:', error)
  }
}