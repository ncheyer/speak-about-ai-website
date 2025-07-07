const metaDescriptions = [
  {
    page: "Home",
    description:
      "Book world-class AI keynote speakers for your event. Speak About AI is the only AI-exclusive bureau, trusted by Fortune 500s. Find your expert today.",
    length: 151,
  },
  {
    page: "Contact",
    description:
      "Contact Speak About AI to book top AI keynote speakers. Get personalized recommendations and check availability for your event. Reach out today.",
    length: 143,
  },
  {
    page: "Contact-2",
    description:
      "Get your perfect AI speaker in 4 hours. Free matching service. Tell us about your event and we'll connect you with top AI experts.",
    length: 132,
  },
  {
    page: "Our Services",
    description:
      "Discover AI speaker services from Speak About AI: keynotes, panels, workshops & SprintAI. Connect with world-class AI experts for your event.",
    length: 142,
  },
  {
    page: "Our Team",
    description:
      "Meet the Speak About AI team, your experts for connecting you with top AI keynote speakers. We're the world's only AI-exclusive speaker bureau.",
    length: 143,
  },
  {
    page: "Privacy",
    description:
      "Learn how Speak About AI collects, uses, and protects your personal information. Our privacy policy explains our data practices and your rights.",
    length: 143,
  },
  {
    page: "Terms",
    description:
      "Read the terms and conditions for using the Speak About AI website and services. Understand your rights and obligations when engaging with our platform.",
    length: 153,
  },
  {
    page: "Speakers Directory",
    description:
      "Browse our directory of top AI keynote speakers. Find artificial intelligence experts, machine learning specialists, and technology leaders for your event.",
    length: 155,
  },
  {
    page: "Blog",
    description:
      "Read the latest AI industry insights, speaker spotlights, and artificial intelligence trends from Speak About AI's expert blog.",
    length: 128,
  },
  {
    page: "AI Keynote Speakers",
    description:
      "Hire top AI keynote speakers for your event. Book artificial intelligence experts, machine learning specialists, and technology leaders. Get matched in 4 hours.",
    length: 160,
  },
  {
    page: "Top AI Speakers 2025",
    description:
      "Discover 2025's top AI keynote speakers. Book leading artificial intelligence experts, from Siri co-founders to Google execs, for your event.",
    length: 144,
  },
  {
    page: "Healthcare",
    description:
      "Book top healthcare AI keynote speakers for medical conferences. Experts in medical innovation, patient care, and AI in healthcare.",
    length: 130,
  },
  {
    page: "Leadership",
    description:
      "Book leadership & business strategy AI keynote speakers for corporate events. Experts on AI transformation, digital leadership & strategic innovation.",
    length: 149,
  },
  {
    page: "Sales & Marketing",
    description:
      "Book sales & marketing AI keynote speakers who've driven billions in revenue. Experts for sales conferences, marketing events & corporate training.",
    length: 148,
  },
  {
    page: "Technology",
    description:
      "Book top technology keynote speakers & AI experts for corporate events & tech summits. Leading voices in enterprise AI and digital transformation.",
    length: 146,
  },
  {
    page: "Automotive",
    description:
      "Book automotive AI keynote speakers for auto industry events. Experts in autonomous vehicles, smart manufacturing, and automotive technology innovation.",
    length: 153,
  },
  {
    page: "Manufacturing",
    description:
      "Book manufacturing AI keynote speakers for industrial events. Experts in Industry 4.0, smart manufacturing, automation, and industrial AI transformation.",
    length: 154,
  },
  {
    page: "Retail",
    description:
      "Book retail & e-commerce AI keynote speakers for retail events. Experts in customer experience, personalization, and retail technology innovation.",
    length: 147,
  },
]

console.log("Meta Description Length Analysis:")
console.log("=================================")

metaDescriptions.forEach((item) => {
  const status = item.length <= 160 ? "✅" : "❌"
  console.log(`${status} ${item.page}: ${item.length} chars`)
  if (item.length > 160) {
    console.log(`   OVER LIMIT by ${item.length - 160} characters`)
  }
})

console.log("\nSummary:")
console.log(`Total pages analyzed: ${metaDescriptions.length}`)
console.log(`Pages within 160 char limit: ${metaDescriptions.filter((item) => item.length <= 160).length}`)
console.log(`Pages over 160 char limit: ${metaDescriptions.filter((item) => item.length > 160).length}`)

const avgLength = Math.round(metaDescriptions.reduce((sum, item) => sum + item.length, 0) / metaDescriptions.length)
console.log(`Average description length: ${avgLength} characters`)
