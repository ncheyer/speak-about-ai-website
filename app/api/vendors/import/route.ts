import { NextRequest, NextResponse } from "next/server"
import { createVendor, getVendorCategories } from "@/lib/vendors-db"

interface VendorSpreadsheetRow {
  "Email Address": string
  "Company Name": string
  "Primary Contact Name": string
  "Primary Contact Role": string
  "Primary Contact LinkedIn Profile": string
  "Business Email (must be a company domain)": string
  "Business Phone Number": string
  "Company Website URL": string
  "Years in Business": string
  "Describe your business in 1-2 sentences.": string
  "Primary Vendor Category": string
  "Secondary Services Offered": string
  "Specialty Capabilities or Certifications (e.g., sustainable practices, minority-owned, specific equipment)": string
  "Typical Event Types Served": string
  "Average Event Size You Handle (number of attendees)": string
  "Headquarters Location (City, State/Province, Country)": string
  "Service Areas": string
  "Specific Cities/Regions Covered": string
  "Are travel fees applicable?": string
  "Travel Fee General Policy (if applicable)": string
  "Typical Project Budget Range (Minimum)": string
  "Typical Project Budget Range (Maximum)": string
  "Pricing Structure": string
  "Payment Terms (Deposit requirements, net terms)": string
  "Link to Portfolio or Case Studies": string
  "Awards or Industry Recognition": string
  "Links to Google Reviews or other platform ratings (e.g., Yelp, WeddingWire)": string
  "Typical Lead Time Required for Your Services": string
  "Do you work with other vendors? (e.g., preferred partner list, collaborations)": string
  "Preferred Partner List (if applicable)": string
  "Languages Spoken by Your Team": string
  "Accessibility Accommodations Offered (e.g., accessible venues, sign language interpreters, sensory-friendly options)": string
}

function parseCSVRow(row: any): VendorSpreadsheetRow {
  return row
}

function determinePricingRange(min: string, max: string): string {
  const minBudget = parseInt(min?.replace(/[^0-9]/g, '') || '0')
  const maxBudget = parseInt(max?.replace(/[^0-9]/g, '') || '0')
  
  if (maxBudget < 5000) return "$"
  if (maxBudget < 25000) return "$$"
  if (maxBudget < 100000) return "$$$"
  return "$$$$"
}

function determineTeamSize(yearsInBusiness: string): string {
  // This is a placeholder - you might want to add a team size field to your spreadsheet
  const years = parseInt(yearsInBusiness || '0')
  if (years < 2) return "1-10"
  if (years < 5) return "11-50"
  if (years < 10) return "51-200"
  return "200+"
}

function mapCategoryName(categoryName: string, categories: any[]): number | null {
  // Map spreadsheet category names to database categories
  const categoryMap: { [key: string]: string } = {
    "Event Technology": "event-technology",
    "AV": "event-technology",
    "Audio Visual": "event-technology",
    "Production": "event-production",
    "Event Production": "event-production",
    "Venues": "venues-spaces",
    "Venue": "venues-spaces",
    "Spaces": "venues-spaces",
    "Catering": "catering-fb",
    "Food & Beverage": "catering-fb",
    "F&B": "catering-fb",
    "Marketing": "marketing-pr",
    "PR": "marketing-pr",
    "Public Relations": "marketing-pr",
    "Staffing": "staffing-talent",
    "Talent": "staffing-talent",
    "Design": "design-creative",
    "Creative": "design-creative",
    "Transportation": "transportation",
    "Transport": "transportation",
    "Logistics": "transportation",
    "Photography": "photography-video",
    "Video": "photography-video",
    "Videography": "photography-video",
    "Swag": "swag-printing",
    "Printing": "swag-printing",
    "Promotional": "swag-printing"
  }
  
  const normalizedCategory = categoryName?.trim()
  for (const [key, value] of Object.entries(categoryMap)) {
    if (normalizedCategory?.toLowerCase().includes(key.toLowerCase())) {
      const category = categories.find(c => c.slug === value)
      if (category) return category.id
    }
  }
  
  // Default to first category if no match
  return categories[0]?.id || null
}

export async function POST(request: NextRequest) {
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
    const { data, autoApprove = false } = body
    
    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { error: "Invalid data format. Expected array of vendor records." },
        { status: 400 }
      )
    }
    
    // Get categories for mapping
    const categories = await getVendorCategories()
    
    const results = {
      success: 0,
      failed: 0,
      errors: [] as any[]
    }
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      
      try {
        // Skip empty rows
        if (!row["Company Name"] || !row["Business Email (must be a company domain)"]) {
          continue
        }
        
        // Parse services from secondary services field
        const services: string[] = []
        if (row["Primary Vendor Category"]) {
          services.push(row["Primary Vendor Category"])
        }
        if (row["Secondary Services Offered"]) {
          services.push(...row["Secondary Services Offered"].split(/[,;]/).map((s: string) => s.trim()).filter(Boolean))
        }
        
        // Parse specialties and certifications
        const specialties = row["Specialty Capabilities or Certifications (e.g., sustainable practices, minority-owned, specific equipment)"]
          ?.split(/[,;]/)
          .map((s: string) => s.trim())
          .filter(Boolean) || []
        
        // Parse tags from various fields
        const tags: string[] = []
        if (row["Typical Event Types Served"]) {
          tags.push(...row["Typical Event Types Served"].split(/[,;]/).map((s: string) => s.trim()).filter(Boolean))
        }
        if (row["Languages Spoken by Your Team"]) {
          tags.push(...row["Languages Spoken by Your Team"].split(/[,;]/).map((s: string) => s.trim()).filter(Boolean))
        }
        
        // Build social media object
        const socialMedia: any = {}
        if (row["Primary Contact LinkedIn Profile"]) {
          socialMedia.linkedin = row["Primary Contact LinkedIn Profile"]
        }
        
        // Build portfolio items
        const portfolioItems: any[] = []
        if (row["Link to Portfolio or Case Studies"]) {
          portfolioItems.push({
            title: "Portfolio",
            link: row["Link to Portfolio or Case Studies"]
          })
        }
        if (row["Links to Google Reviews or other platform ratings (e.g., Yelp, WeddingWire)"]) {
          portfolioItems.push({
            title: "Reviews",
            link: row["Links to Google Reviews or other platform ratings (e.g., Yelp, WeddingWire)"]
          })
        }
        
        // Build additional info for JSONB fields
        const additionalInfo = {
          contactRole: row["Primary Contact Role"],
          eventSize: row["Average Event Size You Handle (number of attendees)"],
          serviceAreas: row["Service Areas"],
          citiesRegions: row["Specific Cities/Regions Covered"],
          travelFees: row["Are travel fees applicable?"],
          travelPolicy: row["Travel Fee General Policy (if applicable)"],
          budgetMin: row["Typical Project Budget Range (Minimum)"],
          budgetMax: row["Typical Project Budget Range (Maximum)"],
          pricingStructure: row["Pricing Structure"],
          paymentTerms: row["Payment Terms (Deposit requirements, net terms)"],
          awards: row["Awards or Industry Recognition"],
          leadTime: row["Typical Lead Time Required for Your Services"],
          vendorCollaborations: row["Do you work with other vendors? (e.g., preferred partner list, collaborations)"],
          preferredPartners: row["Preferred Partner List (if applicable)"],
          accessibility: row["Accessibility Accommodations Offered (e.g., accessible venues, sign language interpreters, sensory-friendly options)"]
        }
        
        // Generate slug from company name
        const slug = row["Company Name"]
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
        
        // Create vendor object
        const vendorData = {
          company_name: row["Company Name"],
          slug: slug,
          category_id: mapCategoryName(row["Primary Vendor Category"], categories),
          contact_name: row["Primary Contact Name"],
          contact_email: row["Business Email (must be a company domain)"],
          contact_phone: row["Business Phone Number"],
          website: row["Company Website URL"],
          description: row["Describe your business in 1-2 sentences."],
          services: services,
          specialties: specialties,
          pricing_range: determinePricingRange(
            row["Typical Project Budget Range (Minimum)"],
            row["Typical Project Budget Range (Maximum)"]
          ),
          minimum_budget: parseInt(row["Typical Project Budget Range (Minimum)"]?.replace(/[^0-9]/g, '') || '0') || null,
          location: row["Headquarters Location (City, State/Province, Country)"],
          years_in_business: parseInt(row["Years in Business"] || '0') || null,
          team_size: determineTeamSize(row["Years in Business"]),
          certifications: specialties, // Using specialties as certifications
          featured: false,
          verified: false,
          status: autoApprove ? "approved" : "pending",
          tags: tags,
          social_media: socialMedia,
          portfolio_items: portfolioItems,
          client_references: additionalInfo // Storing additional data in client_references for now
        }
        
        // Create vendor
        await createVendor(vendorData)
        results.success++
        
      } catch (error) {
        console.error(`Error processing row ${i + 1}:`, error)
        results.failed++
        results.errors.push({
          row: i + 1,
          company: row["Company Name"],
          error: error instanceof Error ? error.message : "Unknown error"
        })
      }
    }
    
    return NextResponse.json({
      message: `Import completed. Success: ${results.success}, Failed: ${results.failed}`,
      results
    })
    
  } catch (error) {
    console.error("Error importing vendors:", error)
    return NextResponse.json(
      { error: "Failed to import vendors" },
      { status: 500 }
    )
  }
}