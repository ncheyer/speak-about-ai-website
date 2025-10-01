import { neon } from "@neondatabase/serverless"

// Lazy initialize Neon client
let sql: any = null

function getSQL() {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL environment variable is not set")
      throw new Error("Database configuration error: DATABASE_URL not set")
    }
    try {
      sql = neon(process.env.DATABASE_URL)
      console.log("Vendors DB: Database connection initialized successfully")
    } catch (error) {
      console.error("Failed to initialize Neon client for vendors:", error)
      throw error
    }
  }
  return sql
}

export interface VendorCategory {
  id: number
  name: string
  slug: string
  description?: string
  icon?: string
  display_order: number
  created_at: string
}

export interface Vendor {
  id: number
  company_name: string
  slug: string
  category_id?: number
  category?: VendorCategory
  contact_name?: string
  contact_email: string
  contact_phone?: string
  website?: string
  logo_url?: string
  description?: string
  services?: string[]
  specialties?: string[]
  pricing_range?: string
  minimum_budget?: number
  location?: string
  years_in_business?: number
  team_size?: string
  certifications?: string[]
  featured: boolean
  verified: boolean
  status: "pending" | "approved" | "rejected" | "suspended"
  tags?: string[]
  social_media?: any
  portfolio_items?: any
  client_references?: any
  created_at: string
  updated_at: string
  approved_at?: string
  approved_by?: string
  average_rating?: number
  review_count?: number
}

export interface VendorReview {
  id: number
  vendor_id: number
  reviewer_name: string
  reviewer_email: string
  reviewer_company?: string
  rating: number
  review_text?: string
  verified_purchase: boolean
  helpful_count: number
  response_text?: string
  response_date?: string
  status: "pending" | "approved" | "rejected"
  created_at: string
  updated_at: string
}

export interface DirectorySubscriber {
  id: number
  email: string
  name?: string
  company?: string
  phone?: string
  access_level: "basic" | "premium" | "vendor"
  subscription_status: "active" | "inactive" | "suspended"
  last_login?: string
  login_count: number
  preferences?: any
  created_at: string
  updated_at: string
}

// Get all vendor categories
export async function getVendorCategories(): Promise<VendorCategory[]> {
  const db = getSQL()
  try {
    const categories = await db`
      SELECT * FROM vendor_categories
      ORDER BY display_order, name
    `
    return categories as VendorCategory[]
  } catch (error) {
    console.error("Error fetching vendor categories:", error)
    throw error
  }
}

// Get all approved vendors
export async function getApprovedVendors(): Promise<Vendor[]> {
  const db = getSQL()
  try {
    const vendors = await db`
      SELECT 
        v.*,
        vc.name as category_name,
        vc.slug as category_slug,
        vc.icon as category_icon,
        COALESCE(AVG(vr.rating), 0) as average_rating,
        COUNT(DISTINCT vr.id) as review_count
      FROM vendors v
      LEFT JOIN vendor_categories vc ON v.category_id = vc.id
      LEFT JOIN vendor_reviews vr ON v.id = vr.vendor_id AND vr.status = 'approved'
      WHERE v.status = 'approved'
      GROUP BY v.id, vc.id
      ORDER BY v.featured DESC, v.company_name
    `
    return vendors.map(v => ({
      ...v,
      category: v.category_name ? {
        id: v.category_id,
        name: v.category_name,
        slug: v.category_slug,
        icon: v.category_icon
      } : undefined
    })) as Vendor[]
  } catch (error) {
    console.error("Error fetching approved vendors:", error)
    throw error
  }
}

// Get all vendors (admin)
export async function getAllVendors(): Promise<Vendor[]> {
  const db = getSQL()
  try {
    const vendors = await db`
      SELECT 
        v.*,
        vc.name as category_name,
        vc.slug as category_slug,
        vc.icon as category_icon,
        COALESCE(AVG(vr.rating), 0) as average_rating,
        COUNT(DISTINCT vr.id) as review_count
      FROM vendors v
      LEFT JOIN vendor_categories vc ON v.category_id = vc.id
      LEFT JOIN vendor_reviews vr ON v.id = vr.vendor_id AND vr.status = 'approved'
      GROUP BY v.id, vc.id
      ORDER BY v.created_at DESC
    `
    return vendors.map(v => ({
      ...v,
      category: v.category_name ? {
        id: v.category_id,
        name: v.category_name,
        slug: v.category_slug,
        icon: v.category_icon
      } : undefined
    })) as Vendor[]
  } catch (error) {
    console.error("Error fetching all vendors:", error)
    throw error
  }
}

// Get vendor by ID
export async function getVendorById(id: number): Promise<Vendor | null> {
  const db = getSQL()
  try {
    const vendors = await db`
      SELECT 
        v.*,
        vc.name as category_name,
        vc.slug as category_slug,
        vc.icon as category_icon,
        COALESCE(AVG(vr.rating), 0) as average_rating,
        COUNT(DISTINCT vr.id) as review_count
      FROM vendors v
      LEFT JOIN vendor_categories vc ON v.category_id = vc.id
      LEFT JOIN vendor_reviews vr ON v.id = vr.vendor_id AND vr.status = 'approved'
      WHERE v.id = ${id}
      GROUP BY v.id, vc.id
    `
    if (vendors.length === 0) return null
    
    const vendor = vendors[0]
    return {
      ...vendor,
      category: vendor.category_name ? {
        id: vendor.category_id,
        name: vendor.category_name,
        slug: vendor.category_slug,
        icon: vendor.category_icon
      } : undefined
    } as Vendor
  } catch (error) {
    console.error("Error fetching vendor by ID:", error)
    throw error
  }
}

// Get vendor by slug
export async function getVendorBySlug(slug: string): Promise<Vendor | null> {
  const db = getSQL()
  try {
    const vendors = await db`
      SELECT 
        v.*,
        vc.name as category_name,
        vc.slug as category_slug,
        vc.icon as category_icon,
        COALESCE(AVG(vr.rating), 0) as average_rating,
        COUNT(DISTINCT vr.id) as review_count
      FROM vendors v
      LEFT JOIN vendor_categories vc ON v.category_id = vc.id
      LEFT JOIN vendor_reviews vr ON v.id = vr.vendor_id AND vr.status = 'approved'
      WHERE v.slug = ${slug}
      GROUP BY v.id, vc.id
    `
    if (vendors.length === 0) return null
    
    const vendor = vendors[0]
    return {
      ...vendor,
      category: vendor.category_name ? {
        id: vendor.category_id,
        name: vendor.category_name,
        slug: vendor.category_slug,
        icon: vendor.category_icon
      } : undefined
    } as Vendor
  } catch (error) {
    console.error("Error fetching vendor by slug:", error)
    throw error
  }
}

// Create vendor
export async function createVendor(vendor: Partial<Vendor>): Promise<Vendor> {
  const db = getSQL()
  try {
    const result = await db`
      INSERT INTO vendors (
        company_name, slug, category_id, contact_name, contact_email,
        contact_phone, website, logo_url, description, services,
        specialties, pricing_range, minimum_budget, location,
        years_in_business, team_size, certifications, featured,
        verified, status, tags, social_media, portfolio_items,
        client_references
      ) VALUES (
        ${vendor.company_name}, ${vendor.slug}, ${vendor.category_id}, 
        ${vendor.contact_name || null}, ${vendor.contact_email},
        ${vendor.contact_phone || null}, ${vendor.website || null}, 
        ${vendor.logo_url || null}, ${vendor.description || null},
        ${vendor.services || null}, ${vendor.specialties || null},
        ${vendor.pricing_range || null}, ${vendor.minimum_budget || null},
        ${vendor.location || null}, ${vendor.years_in_business || null},
        ${vendor.team_size || null}, ${vendor.certifications || null},
        ${vendor.featured || false}, ${vendor.verified || false},
        ${vendor.status || 'pending'}, ${vendor.tags || null},
        ${vendor.social_media || null}, ${vendor.portfolio_items || null},
        ${vendor.client_references || null}
      )
      RETURNING *
    `
    return result[0] as Vendor
  } catch (error) {
    console.error("Error creating vendor:", error)
    throw error
  }
}

// Update vendor - handles partial updates properly
export async function updateVendor(id: number, updates: Partial<Vendor>): Promise<Vendor> {
  const db = getSQL()
  try {
    console.log("updateVendor called with id:", id)
    console.log("Updates received:", JSON.stringify(updates, null, 2))
    
    // First get the current vendor to merge with updates
    const current = await getVendorById(id)
    if (!current) {
      throw new Error(`Vendor with id ${id} not found`)
    }

    // Merge updates with current data, preserving undefined as null
    const merged = {
      company_name: updates.company_name !== undefined ? updates.company_name : current.company_name,
      slug: updates.slug !== undefined ? updates.slug : current.slug,
      category_id: updates.category_id !== undefined ? updates.category_id : current.category_id,
      contact_name: updates.contact_name !== undefined ? updates.contact_name : current.contact_name,
      contact_email: updates.contact_email !== undefined ? updates.contact_email : current.contact_email,
      contact_phone: updates.contact_phone !== undefined ? updates.contact_phone : current.contact_phone,
      website: updates.website !== undefined ? updates.website : current.website,
      logo_url: updates.logo_url !== undefined ? updates.logo_url : current.logo_url,
      description: updates.description !== undefined ? updates.description : current.description,
      services: updates.services !== undefined ? updates.services : current.services,
      specialties: updates.specialties !== undefined ? updates.specialties : current.specialties,
      pricing_range: updates.pricing_range !== undefined ? updates.pricing_range : current.pricing_range,
      minimum_budget: updates.minimum_budget !== undefined ? updates.minimum_budget : current.minimum_budget,
      location: updates.location !== undefined ? updates.location : current.location,
      years_in_business: updates.years_in_business !== undefined ? updates.years_in_business : current.years_in_business,
      team_size: updates.team_size !== undefined ? updates.team_size : current.team_size,
      certifications: updates.certifications !== undefined ? updates.certifications : current.certifications,
      featured: updates.featured !== undefined ? updates.featured : current.featured,
      verified: updates.verified !== undefined ? updates.verified : current.verified,
      status: updates.status !== undefined ? updates.status : current.status,
      tags: updates.tags !== undefined ? updates.tags : current.tags,
      social_media: updates.social_media !== undefined ? updates.social_media : current.social_media,
      portfolio_items: updates.portfolio_items !== undefined ? updates.portfolio_items : current.portfolio_items,
      client_references: updates.client_references !== undefined ? updates.client_references : current.client_references
    }

    // Convert arrays to PostgreSQL array format if they exist
    const servicesArray = merged.services ? 
      (Array.isArray(merged.services) ? merged.services : [merged.services]) : []
    const specialtiesArray = merged.specialties ? 
      (Array.isArray(merged.specialties) ? merged.specialties : [merged.specialties]) : []
    const certificationsArray = merged.certifications ? 
      (Array.isArray(merged.certifications) ? merged.certifications : [merged.certifications]) : []
    const tagsArray = merged.tags ? 
      (Array.isArray(merged.tags) ? merged.tags : [merged.tags]) : []
    
    // Ensure JSONB fields are valid JSON or null
    // These fields should be objects or null, never strings in the database
    let socialMedia = null
    let portfolioItems = null  
    let clientReferences = null
    
    // Handle social_media
    if (merged.social_media !== undefined && merged.social_media !== null) {
      if (typeof merged.social_media === 'string') {
        // If it's a string, try to parse it
        try {
          socialMedia = merged.social_media === '' ? null : JSON.parse(merged.social_media)
        } catch (e) {
          console.error("Invalid social_media JSON string:", merged.social_media)
          socialMedia = null
        }
      } else if (typeof merged.social_media === 'object') {
        // If it's already an object, use it directly
        socialMedia = merged.social_media
      }
    }
    
    // Handle portfolio_items
    if (merged.portfolio_items !== undefined && merged.portfolio_items !== null) {
      if (typeof merged.portfolio_items === 'string') {
        try {
          portfolioItems = merged.portfolio_items === '' ? null : JSON.parse(merged.portfolio_items)
        } catch (e) {
          console.error("Invalid portfolio_items JSON string:", merged.portfolio_items)
          portfolioItems = null
        }
      } else if (typeof merged.portfolio_items === 'object') {
        portfolioItems = merged.portfolio_items
      }
    }
    
    // Handle client_references
    if (merged.client_references !== undefined && merged.client_references !== null) {
      if (typeof merged.client_references === 'string') {
        try {
          clientReferences = merged.client_references === '' ? null : JSON.parse(merged.client_references)
        } catch (e) {
          console.error("Invalid client_references JSON string:", merged.client_references)
          clientReferences = null
        }
      } else if (typeof merged.client_references === 'object') {
        clientReferences = merged.client_references
      }
    }

    const result = await db`
      UPDATE vendors
      SET
        company_name = ${merged.company_name},
        slug = ${merged.slug},
        category_id = ${merged.category_id},
        contact_name = ${merged.contact_name},
        contact_email = ${merged.contact_email},
        contact_phone = ${merged.contact_phone},
        website = ${merged.website},
        logo_url = ${merged.logo_url},
        description = ${merged.description},
        services = ${servicesArray},
        specialties = ${specialtiesArray},
        pricing_range = ${merged.pricing_range},
        minimum_budget = ${merged.minimum_budget},
        location = ${merged.location},
        years_in_business = ${merged.years_in_business},
        team_size = ${merged.team_size},
        certifications = ${certificationsArray},
        featured = ${merged.featured},
        verified = ${merged.verified},
        status = ${merged.status},
        tags = ${tagsArray},
        social_media = ${socialMedia},
        portfolio_items = ${portfolioItems},
        client_references = ${clientReferences},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    
    if (!result || result.length === 0) {
      throw new Error(`Failed to update vendor with id ${id}`)
    }
    
    return result[0] as Vendor
  } catch (error) {
    console.error("Error updating vendor with id", id, ":", error)
    console.error("Updates attempted:", updates)
    throw error
  }
}

// Delete vendor
export async function deleteVendor(id: number): Promise<boolean> {
  const db = getSQL()
  try {
    await db`DELETE FROM vendors WHERE id = ${id}`
    return true
  } catch (error) {
    console.error("Error deleting vendor:", error)
    throw error
  }
}

// Get vendor reviews
export async function getVendorReviews(vendorId: number): Promise<VendorReview[]> {
  const db = getSQL()
  try {
    const reviews = await db`
      SELECT * FROM vendor_reviews
      WHERE vendor_id = ${vendorId} AND status = 'approved'
      ORDER BY created_at DESC
    `
    return reviews as VendorReview[]
  } catch (error) {
    console.error("Error fetching vendor reviews:", error)
    throw error
  }
}

// Create vendor review
export async function createVendorReview(review: Partial<VendorReview>): Promise<VendorReview> {
  const db = getSQL()
  try {
    const result = await db`
      INSERT INTO vendor_reviews (
        vendor_id, reviewer_name, reviewer_email, reviewer_company,
        rating, review_text, verified_purchase, status
      ) VALUES (
        ${review.vendor_id}, ${review.reviewer_name}, ${review.reviewer_email},
        ${review.reviewer_company || null}, ${review.rating}, 
        ${review.review_text || null}, ${review.verified_purchase || false},
        ${review.status || 'pending'}
      )
      RETURNING *
    `
    return result[0] as VendorReview
  } catch (error) {
    console.error("Error creating vendor review:", error)
    throw error
  }
}

// Directory Subscriber functions
export async function getDirectorySubscribers(): Promise<DirectorySubscriber[]> {
  const db = getSQL()
  try {
    const subscribers = await db`
      SELECT * FROM directory_subscribers
      ORDER BY created_at DESC
    `
    return subscribers as DirectorySubscriber[]
  } catch (error) {
    console.error("Error fetching directory subscribers:", error)
    throw error
  }
}

export async function createDirectorySubscriber(subscriber: Partial<DirectorySubscriber>): Promise<DirectorySubscriber> {
  const db = getSQL()
  try {
    const result = await db`
      INSERT INTO directory_subscribers (
        email, name, company, phone, access_level, subscription_status
      ) VALUES (
        ${subscriber.email}, ${subscriber.name || null}, 
        ${subscriber.company || null}, ${subscriber.phone || null},
        ${subscriber.access_level || 'basic'}, 
        ${subscriber.subscription_status || 'active'}
      )
      ON CONFLICT (email) 
      DO UPDATE SET 
        name = COALESCE(${subscriber.name}, directory_subscribers.name),
        company = COALESCE(${subscriber.company}, directory_subscribers.company),
        phone = COALESCE(${subscriber.phone}, directory_subscribers.phone),
        last_login = CURRENT_TIMESTAMP,
        login_count = directory_subscribers.login_count + 1
      RETURNING *
    `
    return result[0] as DirectorySubscriber
  } catch (error) {
    console.error("Error creating/updating directory subscriber:", error)
    throw error
  }
}

export async function getDirectorySubscriberByEmail(email: string): Promise<DirectorySubscriber | null> {
  const db = getSQL()
  try {
    const result = await db`
      SELECT * FROM directory_subscribers
      WHERE email = ${email}
    `
    return result.length > 0 ? result[0] as DirectorySubscriber : null
  } catch (error) {
    console.error("Error fetching subscriber by email:", error)
    throw error
  }
}

export async function updateDirectorySubscriber(
  id: number, 
  updates: Partial<DirectorySubscriber>
): Promise<DirectorySubscriber> {
  const db = getSQL()
  try {
    const result = await db`
      UPDATE directory_subscribers
      SET
        name = COALESCE(${updates.name}, name),
        company = COALESCE(${updates.company}, company),
        phone = COALESCE(${updates.phone}, phone),
        access_level = COALESCE(${updates.access_level}, access_level),
        subscription_status = COALESCE(${updates.subscription_status}, subscription_status),
        last_login = COALESCE(${updates.last_login}, last_login),
        login_count = COALESCE(${updates.login_count}, login_count),
        preferences = COALESCE(${updates.preferences}, preferences),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return result[0] as DirectorySubscriber
  } catch (error) {
    console.error("Error updating directory subscriber:", error)
    throw error
  }
}

// Alias functions for compatibility with subscribe route
export const subscribeToDirectory = createDirectorySubscriber
export const getSubscriberByEmail = getDirectorySubscriberByEmail

export async function updateSubscriberLogin(email: string): Promise<DirectorySubscriber | null> {
  const db = getSQL()
  try {
    const result = await db`
      UPDATE directory_subscribers 
      SET 
        last_login = CURRENT_TIMESTAMP,
        login_count = login_count + 1,
        updated_at = CURRENT_TIMESTAMP
      WHERE email = ${email}
      RETURNING *
    `
    
    return result[0] as DirectorySubscriber || null
  } catch (error) {
    console.error("Error updating subscriber login:", error)
    throw error
  }
}