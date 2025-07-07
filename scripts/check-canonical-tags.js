const fs = require("fs")
const path = require("path")

// Function to extract canonical tags from page files
function checkCanonicalTags() {
  const pages = [
    { file: "app/page.tsx", expectedCanonical: "/" },
    { file: "app/contact/page.tsx", expectedCanonical: "/contact" },
    { file: "app/contact-2/page.tsx", expectedCanonical: "/contact-2" },
    { file: "app/our-services/page.tsx", expectedCanonical: "/our-services" },
    { file: "app/our-team/page.tsx", expectedCanonical: "/our-team" },
    { file: "app/privacy/page.tsx", expectedCanonical: "/privacy" },
    { file: "app/terms/page.tsx", expectedCanonical: "/terms" },
    { file: "app/speakers/page.tsx", expectedCanonical: "/speakers" },
    { file: "app/blog/page.tsx", expectedCanonical: "/blog" },
    { file: "app/top-ai-speakers-2025/page.tsx", expectedCanonical: "/top-ai-speakers-2025" },
    { file: "app/(no-nav)/ai-keynote-speakers/page.tsx", expectedCanonical: "/ai-keynote-speakers" },
    {
      file: "app/industries/healthcare-keynote-speakers/page.tsx",
      expectedCanonical: "/industries/healthcare-keynote-speakers",
    },
    {
      file: "app/industries/leadership-business-strategy-ai-speakers/page.tsx",
      expectedCanonical: "/industries/leadership-business-strategy-ai-speakers",
    },
    {
      file: "app/industries/sales-marketing-ai-speakers/page.tsx",
      expectedCanonical: "/industries/sales-marketing-ai-speakers",
    },
    {
      file: "app/industries/technology-ai-keynote-speakers/page.tsx",
      expectedCanonical: "/industries/technology-ai-keynote-speakers",
    },
    { file: "app/industries/automotive-ai-speakers/page.tsx", expectedCanonical: "/industries/automotive-ai-speakers" },
    {
      file: "app/industries/manufacturing-ai-speakers/page.tsx",
      expectedCanonical: "/industries/manufacturing-ai-speakers",
    },
    { file: "app/industries/retail-ai-speakers/page.tsx", expectedCanonical: "/industries/retail-ai-speakers" },
  ]

  console.log("🔍 Checking Canonical Tags Across All Pages\n")
  console.log("=".repeat(80))

  let hasCanonical = 0
  let missingCanonical = 0

  pages.forEach((page) => {
    try {
      const filePath = path.join(process.cwd(), page.file)
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf8")

        // Check if canonical is present in alternates
        const hasCanonicalTag = content.includes("canonical:") && content.includes(page.expectedCanonical)

        if (hasCanonicalTag) {
          console.log(`✅ ${page.file}`)
          console.log(`   Canonical: ${page.expectedCanonical}`)
          hasCanonical++
        } else {
          console.log(`❌ ${page.file}`)
          console.log(`   Missing canonical: ${page.expectedCanonical}`)
          missingCanonical++
        }
      } else {
        console.log(`⚠️  ${page.file} - File not found`)
        missingCanonical++
      }
    } catch (error) {
      console.log(`❌ ${page.file} - Error reading file: ${error.message}`)
      missingCanonical++
    }
    console.log("")
  })

  console.log("=".repeat(80))
  console.log(`📊 SUMMARY:`)
  console.log(`✅ Pages with canonical tags: ${hasCanonical}`)
  console.log(`❌ Pages missing canonical tags: ${missingCanonical}`)
  console.log(`📄 Total pages checked: ${pages.length}`)

  if (missingCanonical === 0) {
    console.log("\n🎉 All pages have proper canonical tags!")
  } else {
    console.log("\n⚠️  Some pages are missing canonical tags. This could impact SEO.")
  }
}

checkCanonicalTags()
