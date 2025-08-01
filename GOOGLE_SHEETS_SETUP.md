# Google Sheets Database Setup

This guide shows how to set up Google Sheets as a database for the Event Hub.

## Why Google Sheets?

- ✅ Works with v0.dev preview
- ✅ No server setup required
- ✅ Easy to view and edit data
- ✅ Real-time collaboration
- ✅ Free for small projects

## Setup Steps

### 1. Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "Event Hub Database"
4. Copy the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

### 2. Create a Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

4. Create a service account:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Give it a name like "event-hub-sheets"
   - Click "Create and Continue"
   - Skip the optional steps and click "Done"

5. Create a key for the service account:
   - Click on the service account you just created
   - Go to the "Keys" tab
   - Click "Add Key" > "Create New Key"
   - Choose "JSON" format
   - Download the key file

### 3. Share the Sheet with Service Account

1. Open your Google Sheet
2. Click the "Share" button
3. Add the service account email (from the JSON file, `client_email` field)
4. Give it "Editor" permissions
5. Click "Send"

### 4. Set Environment Variables

Add these to your `.env.local` file:

```bash
# Google Sheets Database
GOOGLE_SPREADSHEET_ID="your-spreadsheet-id-here"
GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\nHere\n-----END PRIVATE KEY-----\n"
```

**Important**: 
- The `GOOGLE_PRIVATE_KEY` should include the `\\n` characters as literal `\n`
- Keep the quotes around the entire key including the BEGIN/END lines

### 5. Test the Setup

1. Start your development server: `pnpm dev`
2. Check the console - you should see: `🔗 Using Google Sheets as database`
3. Try creating an account and event - they should appear in your Google Sheet!

## Sheet Structure

The app will automatically create these sheets with proper headers:

- **Users**: Stores user accounts and authentication data
- **Events**: Stores event information 
- **Attendees**: Stores event registration data

## Fallback Behavior

If Google Sheets is not configured, the app automatically falls back to in-memory storage, so it works in both environments:

- ✅ With Google Sheets: Persistent data storage
- ✅ Without Google Sheets: In-memory storage (perfect for v0.dev)

## Security Notes

- Never commit your `.env.local` file
- The service account only has access to sheets you specifically share with it
- You can revoke access anytime by removing the service account from sheet sharing

## Troubleshooting

### "Using in-memory database" message
- Check that all 3 environment variables are set correctly
- Verify the service account email matches exactly
- Ensure the private key includes the BEGIN/END lines

### Authentication errors
- Make sure you shared the sheet with the service account email
- Check that the Google Sheets API is enabled in your project
- Verify the private key format (should have literal `\n` characters)

### Permission errors
- Service account needs "Editor" access to the spreadsheet
- Make sure the spreadsheet ID is correct