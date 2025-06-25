export interface CookieDefinition {
  name: string
  purpose: string
  expiry: string
  provider?: string
}

export interface CookieCategory {
  name: string
  description: string
  required: boolean
  cookies: CookieDefinition[]
}

export interface CookieCategories {
  [key: string]: CookieCategory
}

export const COOKIE_CATEGORIES: CookieCategories = {
  strictly_necessary: {
    name: "Strictly Necessary Cookies",
    description:
      "These cookies are essential for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms.",
    required: true,
    cookies: [
      {
        name: "cookie_consent",
        purpose: "Stores the user's cookie consent preferences.",
        expiry: "1 year",
        provider: "Speak About AI",
      },
      {
        name: "session_id", // Example, if you have session cookies
        purpose: "Maintains user session state across page requests.",
        expiry: "Session",
        provider: "Speak About AI",
      },
    ],
  },
  analytics: {
    name: "Analytics Cookies",
    description:
      "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.",
    required: false,
    cookies: [
      {
        name: "_ga",
        purpose: "Used by Google Analytics to distinguish users.",
        expiry: "2 years",
        provider: "Google Analytics",
      },
      {
        name: "_gid",
        purpose: "Used by Google Analytics to distinguish users.",
        expiry: "24 hours",
        provider: "Google Analytics",
      },
      {
        name: "_gat",
        purpose: "Used by Google Analytics to throttle request rate.",
        expiry: "1 minute",
        provider: "Google Analytics",
      },
    ],
  },
  functional: {
    name: "Functional Cookies",
    description:
      "These cookies enable the website to provide enhanced functionality and personalisation. They may be set by us or by third party providers whose services we have added to our pages.",
    required: false,
    cookies: [
      {
        name: "_hjIncludedInSample",
        purpose:
          "Used by Hotjar to know whether that user is included in the data sampling defined by your site's daily session limit.",
        expiry: "Session",
        provider: "Hotjar",
      },
      {
        name: "_hjSessionUser_{site_id}",
        purpose:
          "Hotjar cookie that persists the Hotjar User ID, unique to that site on the browser. This ensures that behavior in subsequent visits to the same site will be attributed to the same user ID.",
        expiry: "1 year",
        provider: "Hotjar",
      },
      // Add Pipedrive cookies below
      {
        name: "pipe_lcid", // Example Pipedrive cookie
        purpose: "Stores chat session information for Pipedrive live chat.",
        expiry: "1 year",
        provider: "Pipedrive",
      },
      {
        name: "pipe_lv", // Example Pipedrive cookie
        purpose: "Tracks last visit time for Pipedrive chat.",
        expiry: "1 year",
        provider: "Pipedrive",
      },
      {
        name: "pipe_sess", // Example Pipedrive cookie
        purpose: "Maintains Pipedrive chat session.",
        expiry: "Session",
        provider: "Pipedrive",
      },
      // Add other Hotjar or functional cookies if known
    ],
  },
  marketing: {
    name: "Marketing Cookies",
    description:
      "These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.",
    required: false,
    cookies: [
      // Example:
      // {
      //   name: "_fbp",
      //   purpose: "Used by Facebook to deliver a series of advertisement products such as real time bidding from third party advertisers.",
      //   expiry: "3 months",
      //   provider: "Facebook"
      // }
      // Add any marketing cookies you use, e.g., for Google Ads remarketing, LinkedIn Insight Tag, etc.
      {
        name: "IDE",
        purpose:
          "Used by Google DoubleClick to register and report the website user's actions after viewing or clicking one of the advertiser's ads with the purpose of measuring the efficacy of an ad and to present targeted ads to the user.",
        expiry: "1 year",
        provider: "Google (DoubleClick)",
      },
    ],
  },
}
