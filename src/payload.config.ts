import { buildConfig } from "payload"
import { mongooseAdapter } from "@payloadcms/db-mongodb"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { webpackBundler } from "@payloadcms/bundler-webpack"
import path from "path"

export default buildConfig({
  admin: {
    user: "users",
    bundler: webpackBundler(),
  },
  editor: lexicalEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || "mongodb://localhost:27017/speak-about-ai",
  }),
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || "http://localhost:3000",
  collections: [
    {
      slug: "blog-posts",
      admin: {
        useAsTitle: "title",
        defaultColumns: ["title", "author", "status", "publishedDate"],
      },
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
          admin: {
            description: "URL-friendly version of the title",
          },
        },
        {
          name: "excerpt",
          type: "textarea",
          required: true,
          admin: {
            description: "Brief summary for blog cards and SEO",
          },
        },
        {
          name: "content",
          type: "richText",
          required: true,
        },
        {
          name: "featuredImage",
          type: "upload",
          relationTo: "media",
          admin: {
            description: "Main image for the blog post",
          },
        },
        {
          name: "author",
          type: "text",
          required: true,
          defaultValue: "Robert Strong",
        },
        {
          name: "authorTitle",
          type: "text",
          admin: {
            description: "Author job title or role",
          },
        },
        {
          name: "authorImage",
          type: "upload",
          relationTo: "media",
        },
        {
          name: "publishedDate",
          type: "date",
          required: true,
          defaultValue: () => new Date(),
        },
        {
          name: "tags",
          type: "array",
          fields: [
            {
              name: "tag",
              type: "text",
            },
          ],
        },
        {
          name: "category",
          type: "select",
          options: [
            { label: "Featured", value: "featured" },
            { label: "Guide", value: "guide" },
            { label: "Ethics", value: "ethics" },
            { label: "Trends", value: "trends" },
            { label: "Event Planning", value: "event-planning" },
          ],
          defaultValue: "guide",
        },
        {
          name: "featured",
          type: "checkbox",
          defaultValue: false,
          admin: {
            description: "Show on homepage and featured sections",
          },
        },
        {
          name: "status",
          type: "select",
          options: [
            { label: "Draft", value: "draft" },
            { label: "Published", value: "published" },
          ],
          defaultValue: "draft",
          required: true,
        },
        // SEO Fields
        {
          name: "metaDescription",
          type: "textarea",
          admin: {
            description: "SEO meta description (150-160 characters)",
          },
        },
        {
          name: "seoKeywords",
          type: "text",
          admin: {
            description: "Comma-separated keywords for SEO",
          },
        },
      ],
      hooks: {
        beforeChange: [
          ({ data }) => {
            // Auto-generate slug from title if not provided
            if (data.title && !data.slug) {
              data.slug = data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "")
            }
            return data
          },
        ],
      },
    },
    {
      slug: "media",
      upload: {
        staticURL: "/media",
        staticDir: "media",
        imageSizes: [
          {
            name: "thumbnail",
            width: 400,
            height: 300,
            position: "centre",
          },
          {
            name: "card",
            width: 768,
            height: 432,
            position: "centre",
          },
          {
            name: "feature",
            width: 1200,
            height: 675,
            position: "centre",
          },
        ],
        adminThumbnail: "thumbnail",
        mimeTypes: ["image/*"],
      },
      fields: [
        {
          name: "alt",
          type: "text",
          required: true,
        },
      ],
    },
    {
      slug: "users",
      auth: true,
      admin: {
        useAsTitle: "email",
      },
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "role",
          type: "select",
          options: [
            { label: "Admin", value: "admin" },
            { label: "Editor", value: "editor" },
          ],
          defaultValue: "editor",
          required: true,
        },
      ],
    },
  ],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
})
