// Analysis of meta titles across all pages in the Speak About AI website

const metaTitles = [
  // Root layout (default)
  {
    page: "app/layout.tsx (default)",
    title: "Book AI Keynote Speakers | Speak About AI",
    length: 44,
  },

  // Home page
  {
    page: "app/page.tsx",
    title: "Top AI Keynote Speakers for Hire | Speak About AI",
    length: 50,
  },

  // Industry pages (these would need to be checked individually)
  // Most industry pages likely inherit from layout or have their own titles

  // Blog pages
  {
    page: "Blog pages (dynamic)",
    title: "Dynamic based on blog post title + site name",
    length: "Variable - needs individual checking",
  },

  // Speaker pages
  {
    page: "Speaker pages (dynamic)",
    title: "Dynamic based on speaker name + site name",
    length: "Variable - needs individual checking",
  },
]

console.log("Meta Title Analysis:")
console.log("===================")

metaTitles.forEach((item) => {
  console.log(`Page: ${item.page}`)
  console.log(`Title: "${item.title}"`)
  console.log(`Length: ${item.length} characters`)

  if (typeof item.length === "number") {
    if (item.length > 60) {
      console.log("⚠️  WARNING: Title may be too long for Google search results")
    } else if (item.length < 30) {
      console.log("⚠️  WARNING: Title may be too short for optimal SEO")
    } else {
      console.log("✅ Title length is within recommended range (30-60 characters)")
    }
  }

  console.log("---")
})

console.log("\nRecommendations:")
console.log("- Optimal meta title length: 50-60 characters")
console.log("- Google typically displays first 50-60 characters")
console.log("- Include primary keyword near the beginning")
console.log("- Make titles unique for each page")
