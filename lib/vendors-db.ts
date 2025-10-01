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
    console.log("Database returned", vendors.length, "vendors")
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

// Create new vendor
export async function createVendor(vendor: Partial<Vendor>): Promise<Vendor> {
  const db = getSQL()
  try {
    // Ensure JSONB fields are properly formatted
    const socialMedia = vendor.social_media ? 
      (typeof vendor.social_media === 'string' ? vendor.social_media : JSON.stringify(vendor.social_media)) : 
      '{}'
    
    const portfolioItems = vendor.portfolio_items ? 
      (typeof vendor.portfolio_items === 'string' ? vendor.portfolio_items : JSON.stringify(vendor.portfolio_items)) : 
      '[]'
    
    const clientReferences = vendor.client_references ? 
      (typeof vendor.client_references === 'string' ? vendor.client_references : JSON.stringify(vendor.client_references)) : 
      '{}'
    
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
        ${vendor.contact_name}, ${vendor.contact_email}, ${vendor.contact_phone},
        ${vendor.website}, ${vendor.logo_url}, ${vendor.description},
        ${vendor.services || []}, ${vendor.specialties || []},
        ${vendor.pricing_range}, ${vendor.minimum_budget}, ${vendor.location},
        ${vendor.years_in_business}, ${vendor.team_size},
        ${vendor.certifications || []}, ${vendor.featured || false},
        ${vendor.verified || false}, ${vendor.status || 'pending'},
        ${vendor.tags || []}, ${socialMedia}::jsonb,
        ${portfolioItems}::jsonb, ${clientReferences}::jsonb
      )
      RETURNING *
    `
    return result[0] as Vendor
  } catch (error) {
    console.error("Error creating vendor:", error)
    throw error
  }
}

// Update vendor
export async function updateVendor(id: number, updates: Partial<Vendor>): Promise<Vendor> {
  const db = getSQL()
  try {
    const result = await db`
      UPDATE vendors
      SET
        company_name = COALESCE(${updates.company_name}, company_name),
        slug = COALESCE(${updates.slug}, slug),
        category_id = COALESCE(${updates.category_id}, category_id),
        contact_name = COALESCE(${updates.contact_name}, contact_name),
        contact_email = COALESCE(${updates.contact_email}, contact_email),
        contact_phone = COALESCE(${updates.contact_phone}, contact_phone),
        website = COALESCE(${updates.website}, website),
        logo_url = COALESCE(${updates.logo_url}, logo_url),
        description = COALESCE(${updates.description}, description),
        services = COALESCE(${updates.services}, services),
        specialties = COALESCE(${updates.specialties}, specialties),
        pricing_range = COALESCE(${updates.pricing_range}, pricing_range),
        minimum_budget = COALESCE(${updates.minimum_budget}, minimum_budget),
        location = COALESCE(${updates.location}, location),
        years_in_business = COALESCE(${updates.years_in_business}, years_in_business),
        team_size = COALESCE(${updates.team_size}, team_size),
        certifications = COALESCE(${updates.certifications}, certifications),
        featured = COALESCE(${updates.featured}, featured),
        verified = COALESCE(${updates.verified}, verified),
        status = COALESCE(${updates.status}, status),
        tags = COALESCE(${updates.tags}, tags),
        social_media = COALESCE(${updates.social_media}, social_media),
        portfolio_items = COALESCE(${updates.portfolio_items}, portfolio_items),
        client_references = COALESCE(${updates.client_references}, client_references),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return result[0] as Vendor
  } catch (error) {
    console.error("Error updating vendor:", error)
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

// Subscribe to directory
export async function subscribeToDirectory(subscriber: Partial<DirectorySubscriber>): Promise<DirectorySubscriber> {
  const db = getSQL()
  try {
    const result = await db`
      INSERT INTO directory_subscribers (
        email, name, company, phone, access_level,
        subscription_status, preferences
      ) VALUES (
        ${subscriber.email}, ${subscriber.name}, ${subscriber.company},
        ${subscriber.phone}, ${subscriber.access_level || 'basic'},
        ${subscriber.subscription_status || 'active'}, ${subscriber.preferences || {}}
      )
      ON CONFLICT (email) DO UPDATE
      SET
        name = COALESCE(${subscriber.name}, directory_subscribers.name),
        company = COALESCE(${subscriber.company}, directory_subscribers.company),
        phone = COALESCE(${subscriber.phone}, directory_subscribers.phone),
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `
    return result[0] as DirectorySubscriber
  } catch (error) {
    console.error("Error subscribing to directory:", error)
    throw error
  }
}

// Get subscriber by email
export async function getSubscriberByEmail(email: string): Promise<DirectorySubscriber | null> {
  const db = getSQL()
  try {
    const subscribers = await db`
      SELECT * FROM directory_subscribers
      WHERE email = ${email}
    `
    return subscribers.length > 0 ? subscribers[0] as DirectorySubscriber : null
  } catch (error) {
    console.error("Error fetching subscriber:", error)
    throw error
  }
}

// Update subscriber login
export async function updateSubscriberLogin(email: string): Promise<void> {
  const db = getSQL()
  try {
    await db`
      UPDATE directory_subscribers
      SET 
        last_login = CURRENT_TIMESTAMP,
        login_count = login_count + 1
      WHERE email = ${email}
    `
  } catch (error) {
    console.error("Error updating subscriber login:", error)
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

// Add vendor review
export async function addVendorReview(review: Partial<VendorReview>): Promise<VendorReview> {
  const db = getSQL()
  try {
    const result = await db`
      INSERT INTO vendor_reviews (
        vendor_id, reviewer_name, reviewer_email, reviewer_company,
        rating, review_text, verified_purchase, status
      ) VALUES (
        ${review.vendor_id}, ${review.reviewer_name}, ${review.reviewer_email},
        ${review.reviewer_company}, ${review.rating}, ${review.review_text},
        ${review.verified_purchase || false}, ${review.status || 'pending'}
      )
      RETURNING *
    `
    return result[0] as VendorReview
  } catch (error) {
    console.error("Error adding vendor review:", error)
    throw error
  }
}