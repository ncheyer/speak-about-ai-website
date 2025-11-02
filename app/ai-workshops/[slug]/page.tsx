import { notFound } from "next/navigation"
import { getWorkshopBySlug, incrementWorkshopPopularity } from "@/lib/workshops-db"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Users, MapPin, CheckCircle, Target, BookOpen, Award, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function WorkshopDetailPage({ params }: PageProps) {
  const { slug } = await params
  const workshop = await getWorkshopBySlug(slug)

  if (!workshop) {
    notFound()
  }

  // Increment popularity counter
  await incrementWorkshopPopularity(workshop.id)

  return (
    <>
      {/* Hero Image */}
      {workshop.thumbnail_url && (
        <div className="relative w-full h-96 overflow-hidden">
          <Image
            src={workshop.thumbnail_url}
            alt={workshop.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
      )}

      {/* Hero Section */}
      <section className={workshop.thumbnail_url ? "py-12 -mt-32 relative z-10" : "bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12"}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className={`p-8 rounded-xl ${workshop.thumbnail_url ? 'bg-white shadow-xl' : ''}`}>
                <div className="flex gap-2 mb-4">
                  <Badge variant="default" className="capitalize">
                    {workshop.format}
                  </Badge>
                  {workshop.featured && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1 fill-yellow-800" />
                      Featured
                    </Badge>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {workshop.title}
                </h1>

                {workshop.short_description && (
                  <p className="text-xl text-gray-600 mb-6">{workshop.short_description}</p>
                )}

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-6 mb-8">
                  {workshop.duration_minutes && (
                    <div className="flex items-center text-gray-700">
                      <Clock className="h-5 w-5 mr-2 text-blue-600" />
                      <span className="font-medium">{workshop.duration_minutes} minutes</span>
                    </div>
                  )}
                  {workshop.target_audience && (
                    <div className="flex items-center text-gray-700">
                      <Users className="h-5 w-5 mr-2 text-blue-600" />
                      <span className="font-medium">{workshop.target_audience}</span>
                    </div>
                  )}
                  {workshop.max_participants && (
                    <div className="flex items-center text-gray-700">
                      <Award className="h-5 w-5 mr-2 text-blue-600" />
                      <span className="font-medium">Max {workshop.max_participants} participants</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Speaker & CTA */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Workshop Instructor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {workshop.speaker_name ? (
                    <Link href={`/speakers/${workshop.speaker_slug}`} className="block group">
                      <div className="flex items-center gap-4 mb-4">
                        {workshop.speaker_headshot && (
                          <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all">
                            <Image
                              src={workshop.speaker_headshot}
                              alt={workshop.speaker_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
                            {workshop.speaker_name}
                          </h3>
                          <p className="text-sm text-gray-600">Expert Instructor</p>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <p className="text-gray-500">Instructor to be assigned</p>
                  )}

                  {workshop.price_range && (
                    <div className="py-4 border-t border-b">
                      <p className="text-sm text-gray-600 mb-1">Investment</p>
                      <p className="text-2xl font-bold text-gray-900">{workshop.price_range}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Link href={`/contact?workshop=${workshop.id}`}>
                      <Button className="w-full" size="lg">
                        Request This Workshop
                      </Button>
                    </Link>
                    <p className="text-xs text-gray-500 text-center">
                      Fully customizable for your organization
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              {workshop.description && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Workshop</h2>
                  <div className="prose prose-lg max-w-none text-gray-700">
                    {workshop.description.split('\n').map((paragraph, i) => (
                      <p key={i} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Objectives */}
              {workshop.learning_objectives && workshop.learning_objectives.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <Target className="h-8 w-8 mr-3 text-blue-600" />
                    Learning Objectives
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {workshop.learning_objectives.map((objective, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                        <p className="text-gray-800">{objective}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Takeaways */}
              {workshop.key_takeaways && workshop.key_takeaways.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <Award className="h-8 w-8 mr-3 text-purple-600" />
                    Key Takeaways
                  </h2>
                  <ul className="space-y-3">
                    {workshop.key_takeaways.map((takeaway, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-purple-600 font-bold text-sm">{index + 1}</span>
                        </div>
                        <p className="text-gray-800 text-lg">{takeaway}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Format Options */}
              {workshop.agenda && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <BookOpen className="h-8 w-8 mr-3 text-green-600" />
                    Workshop Formats & Options
                  </h2>

                  {/* Parse and display agenda as structured cards */}
                  <div className="space-y-6">
                    {workshop.agenda.split('\n\n').map((section, sectionIndex) => {
                      const lines = section.split('\n').filter(line => line.trim())
                      if (lines.length === 0) return null

                      const title = lines[0]
                      const isFeatured = title.includes('FEATURED') || title.includes('Most Popular')
                      const isMainHeading = title === title.toUpperCase() && !title.includes(':')

                      if (isMainHeading && lines.length === 1) {
                        // Section header with gradient styling
                        return (
                          <div key={sectionIndex} className="mt-12 mb-6">
                            <div className="flex items-center">
                              <div className="flex-grow h-px bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300"></div>
                              <h3 className="px-6 text-xl font-bold text-gray-700 uppercase tracking-wide">
                                {title}
                              </h3>
                              <div className="flex-grow h-px bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300"></div>
                            </div>
                          </div>
                        )
                      }

                      // Workshop offering card with enhanced styling
                      return (
                        <Card
                          key={sectionIndex}
                          className={`${
                            isFeatured
                              ? 'border-2 border-blue-500 shadow-2xl bg-gradient-to-br from-blue-50 via-white to-purple-50 hover:shadow-blue-200 transition-all duration-300'
                              : 'border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300'
                          }`}
                        >
                          <CardHeader className={`${isFeatured ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-gray-50'} relative overflow-hidden`}>
                            {isFeatured && (
                              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                            )}
                            <div className="flex items-start justify-between relative z-10">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className={`p-2 rounded-lg ${isFeatured ? 'bg-white/20' : 'bg-blue-100'}`}>
                                    <BookOpen className={`h-6 w-6 ${isFeatured ? 'text-white' : 'text-blue-600'}`} />
                                  </div>
                                  <CardTitle className={`text-xl ${isFeatured ? 'text-white' : 'text-gray-900'}`}>
                                    {title.replace('FEATURED WORKSHOP:', '').replace(/\([^)]*\)/g, '').trim()}
                                  </CardTitle>
                                </div>
                                {title.match(/\(([^)]+)\)/) && (
                                  <div className="flex gap-2 mt-3">
                                    {title.match(/\(([^)]+)\)/)?.[1].split('-').map((badge, i) => (
                                      <Badge
                                        key={i}
                                        className={`${
                                          isFeatured
                                            ? 'bg-white text-blue-600 hover:bg-white/90'
                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                        } text-xs font-semibold`}
                                      >
                                        {badge.trim()}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                              {isFeatured && (
                                <Badge className="bg-yellow-400 text-yellow-900 ml-3 flex items-center gap-1 font-bold">
                                  <Star className="h-3 w-3 fill-yellow-900" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="pt-6 pb-6">
                            <div className="space-y-3">
                              {lines.slice(1).map((line, lineIndex) => {
                                const isBullet = line.startsWith('•') || line.startsWith('-')
                                return (
                                  <div key={lineIndex} className="flex items-start gap-3">
                                    {isBullet && (
                                      <CheckCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isFeatured ? 'text-blue-600' : 'text-green-600'}`} />
                                    )}
                                    <p className={`${isBullet ? 'flex-1' : ''} text-gray-700 leading-relaxed text-base`}>
                                      {line.replace(/^[•\-]\s*/, '')}
                                    </p>
                                  </div>
                                )
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Prerequisites */}
              {workshop.prerequisites && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Prerequisites</h2>
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
                    <p className="text-gray-800">{workshop.prerequisites}</p>
                  </div>
                </div>
              )}

              {/* Materials Included */}
              {workshop.materials_included && workshop.materials_included.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Materials Included</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {workshop.materials_included.map((material, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <p className="text-gray-800">{material}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Topics */}
              {workshop.topics && workshop.topics.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Topics Covered</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {workshop.topics.map((topic, index) => (
                        <Badge key={index} variant="secondary">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Customization */}
              {workshop.customizable && (
                <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-900">
                      <Target className="h-5 w-5" />
                      Fully Customizable
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-700 mb-4">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Tailored to your industry</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Scaled for team size</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Adjusted for skill level</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Flexible scheduling</span>
                      </li>
                    </ul>
                    <Link href={`/contact?workshop=${workshop.id}`} className="block">
                      <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-100">
                        Discuss Customization
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Employee & Participant Testimonials
            </h2>
            <p className="text-xl text-gray-600">
              Don't take our word for it. Wall of testimonials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex text-yellow-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4">
                    "I wish we had more time with her."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex text-yellow-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4">
                    "She was funny, kind, and incredibly intelligent."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex text-yellow-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4">
                    "Clear in her words and spoke in a way that a whole room of people would understand."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 4 */}
            <Card className="bg-white md:col-span-2 lg:col-span-1">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex text-yellow-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4">
                    "Joan was a great instructor. I learned so much about ChatGPT from her! Her interactive exercises were fun and informative."
                  </p>
                  <p className="text-gray-900 font-semibold">- Nidhi B.</p>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 5 - Featured Large */}
            <Card className="bg-white md:col-span-2">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex text-yellow-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4 text-lg">
                    "I highly recommend Joan Palmiter Bajorek's "AI ChatGPT for Beginners" workshop to anyone interested in harnessing the benefits of ChatGPT. Joan's expertise, her energetic presentation style, and hands-on approach made it an engaging—and fun—learning experience."
                  </p>
                  <p className="text-gray-900 font-semibold">- Shana C.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Team?</h2>
          <p className="text-xl mb-8 opacity-90">
            Book this workshop for your organization and equip your team with cutting-edge AI knowledge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/contact?workshop=${workshop.id}`}>
              <Button size="lg" variant="secondary" className="font-semibold">
                Request This Workshop
              </Button>
            </Link>
            <Link href="/ai-workshops">
              <Button size="lg" variant="outline" className="font-semibold bg-transparent text-white border-white hover:bg-white hover:text-blue-600">
                Browse All Workshops
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

// Generate static params for all workshop slugs
export async function generateStaticParams() {
  const { getActiveWorkshops } = await import("@/lib/workshops-db")
  const workshops = await getActiveWorkshops()

  return workshops.map((workshop) => ({
    slug: workshop.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const workshop = await getWorkshopBySlug(slug)

  if (!workshop) {
    return {
      title: "Workshop Not Found",
    }
  }

  return {
    title: workshop.meta_title || `${workshop.title} | AI Workshop | Speak About AI`,
    description: workshop.meta_description || workshop.short_description || workshop.description?.substring(0, 160),
    keywords: workshop.keywords?.join(", ") || workshop.topics?.join(", "),
  }
}
