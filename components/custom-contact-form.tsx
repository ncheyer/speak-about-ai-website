"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Calendar, 
  Mail, 
  MapPin, 
  Building, 
  User, 
  Phone, 
  DollarSign, 
  MessageSquare, 
  CheckCircle,
  Users,
  Sparkles,
  Clock,
  Target,
  X,
  Search,
  ChevronDown,
  Loader2,
  Send,
  Newspaper
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface Speaker {
  id: number
  name: string
  title?: string
  oneLiner?: string
}

interface Workshop {
  id: number
  title: string
  duration_minutes: number | null
  format: string | null
  badge_text: string | null
}

export function CustomContactForm({ preselectedSpeaker }: { preselectedSpeaker?: string }) {
  const { toast } = useToast()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loadingSpeakers, setLoadingSpeakers] = useState(true)
  const [loadingWorkshops, setLoadingWorkshops] = useState(true)
  const [selectedSpeakers, setSelectedSpeakers] = useState<Speaker[]>([])
  const [selectedWorkshops, setSelectedWorkshops] = useState<Workshop[]>([])
  const [speakerSearchTerm, setSpeakerSearchTerm] = useState('')
  const [showSpeakerDropdown, setShowSpeakerDropdown] = useState(false)
  const [eventDates, setEventDates] = useState<string[]>([''])
  const [hasNoSpeakerInMind, setHasNoSpeakerInMind] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    phone: '',
    organizationName: '',
    eventLocation: '',
    eventBudget: '',
    additionalInfo: '',
    newsletterOptIn: false
  })

  const budgetOptions = [
    { value: 'under-10k', label: 'Under $10,000' },
    { value: '10k-25k', label: '$10,000 - $25,000' },
    { value: '25k-50k', label: '$25,000 - $50,000' },
    { value: '50k-100k', label: '$50,000 - $100,000' },
    { value: 'over-100k', label: 'Over $100,000' },
    { value: 'discuss', label: "Let's discuss" }
  ]

  useEffect(() => {
    fetchSpeakers()
    fetchWorkshops()
  }, [])

  // Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSpeakerDropdown(false)
      }
    }

    if (showSpeakerDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showSpeakerDropdown])

  useEffect(() => {
    // Auto-select speaker if passed as prop
    if (preselectedSpeaker && speakers.length > 0 && selectedSpeakers.length === 0) {
      const speaker = speakers.find(s => s.name === preselectedSpeaker)
      if (speaker) {
        setSelectedSpeakers([speaker])
      }
    }
  }, [preselectedSpeaker, speakers])

  useEffect(() => {
    // Auto-select workshop if passed as URL parameter
    const params = new URLSearchParams(window.location.search)
    const workshopId = params.get('workshop')

    if (workshopId && workshops.length > 0 && selectedWorkshops.length === 0) {
      const workshop = workshops.find(w => w.id === parseInt(workshopId))
      if (workshop) {
        setSelectedWorkshops([workshop])
      }
    }
  }, [workshops])

  const fetchSpeakers = async () => {
    try {
      const response = await fetch('/api/speakers')
      const data = await response.json()
      if (data.success) {
        setSpeakers(data.speakers || [])
      }
    } catch (error) {
      console.error('Error fetching speakers:', error)
    } finally {
      setLoadingSpeakers(false)
    }
  }

  const fetchWorkshops = async () => {
    try {
      const response = await fetch('/api/workshops')
      const data = await response.json()
      setWorkshops(data || [])
    } catch (error) {
      console.error('Error fetching workshops:', error)
    } finally {
      setLoadingWorkshops(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleSpeaker = (speaker: Speaker) => {
    // If selecting a speaker, clear "no speaker in mind"
    if (hasNoSpeakerInMind) {
      setHasNoSpeakerInMind(false)
    }
    setSelectedSpeakers(prev => {
      const exists = prev.find(s => s.id === speaker.id)
      if (exists) {
        return prev.filter(s => s.id !== speaker.id)
      }
      return [...prev, speaker]
    })
  }

  const toggleWorkshop = (workshop: Workshop) => {
    // If selecting a workshop, clear "no speaker in mind"
    if (hasNoSpeakerInMind) {
      setHasNoSpeakerInMind(false)
    }
    setSelectedWorkshops(prev => {
      const exists = prev.find(w => w.id === workshop.id)
      if (exists) {
        return prev.filter(w => w.id !== workshop.id)
      }
      return [...prev, workshop]
    })
  }

  const handleNoSpeakerInMind = () => {
    setHasNoSpeakerInMind(true)
    setSelectedSpeakers([])
    setSelectedWorkshops([])
    setShowSpeakerDropdown(false)
  }

  const removeSpeaker = (speakerId: number) => {
    setSelectedSpeakers(prev => prev.filter(s => s.id !== speakerId))
  }

  const removeWorkshop = (workshopId: number) => {
    setSelectedWorkshops(prev => prev.filter(w => w.id !== workshopId))
  }

  const filteredSpeakers = speakers.filter(speaker =>
    speaker.name.toLowerCase().includes(speakerSearchTerm.toLowerCase())
  )

  const filteredWorkshops = workshops.filter(workshop =>
    workshop.title.toLowerCase().includes(speakerSearchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.clientName || !formData.clientEmail || !formData.organizationName) {
      toast({
        title: "Required fields missing",
        description: "Please fill in your name, email address, and organization.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Submit the main contact form
      const response = await fetch('/api/submit-deal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          eventDates: eventDates.filter(date => date !== ''),
          specificSpeaker: hasNoSpeakerInMind
            ? 'No specific speaker in mind'
            : [
                ...selectedSpeakers.map(s => s.name),
                ...selectedWorkshops.map(w => `Workshop: ${w.title}`)
              ].join(', '),
          hasNoSpeakerInMind
        })
      })

      const result = await response.json()

      if (response.ok) {
        // If newsletter opt-in is checked, subscribe them
        if (formData.newsletterOptIn) {
          try {
            await fetch('/api/newsletter/signup', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: formData.clientEmail,
                name: formData.clientName,
                company: formData.organizationName,
                source: 'contact_form'
              })
            })
          } catch (error) {
            console.log('Newsletter signup failed:', error)
            // Don't block the form submission if newsletter fails
          }
        }
        
        setIsSuccess(true)
        toast({
          title: "Request submitted successfully!",
          description: result.message || "We'll be in touch within 24 hours."
        })
        
        // Reset form
        setFormData({
          clientName: '',
          clientEmail: '',
          phone: '',
          organizationName: '',
          eventLocation: '',
          eventBudget: '',
          additionalInfo: '',
          newsletterOptIn: false
        })
        setSelectedSpeakers([])
        setSelectedWorkshops([])
        setEventDates([''])
      } else {
        throw new Error(result.error || 'Failed to submit')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again or contact us directly.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-8">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Request Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your interest. We'll be in touch within 24 hours with personalized speaker recommendations for your event.
            </p>
            <Button onClick={() => setIsSuccess(false)} variant="outline">
              Submit Another Request
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Book an AI Keynote Speaker
        </h1>
        <p className="text-lg text-gray-600">
          Tell us about your event and we'll match you with the perfect AI expert
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Event Information</CardTitle>
          <CardDescription>
            Please provide as much detail as possible about your event
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Your Name *</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    placeholder="John Smith"
                    required
                    className="h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email Address *</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                    placeholder="person@company.com"
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    className="h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Organization *</Label>
                  <Input
                    id="organizationName"
                    value={formData.organizationName}
                    onChange={(e) => handleInputChange('organizationName', e.target.value)}
                    placeholder="Company"
                    required
                    className="h-12"
                  />
                </div>
              </div>
            </div>

            {/* Speaker Selection */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Speaker Preferences</h3>

              <div className="space-y-2">
                <Label>Speaker or Workshop You're Interested In</Label>
                <div className="relative" ref={dropdownRef}>
                  <div 
                    className={cn(
                      "min-h-[48px] w-full rounded-lg border bg-white px-3 py-2 cursor-pointer",
                      "hover:border-gray-400 transition-colors",
                      showSpeakerDropdown && "border-blue-500 ring-2 ring-blue-100"
                    )}
                    onClick={() => setShowSpeakerDropdown(!showSpeakerDropdown)}
                  >
                    {hasNoSpeakerInMind ? (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-gray-600">No specific speaker in mind</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setHasNoSpeakerInMind(false)
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (selectedSpeakers.length > 0 || selectedWorkshops.length > 0) ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedSpeakers.map(speaker => (
                          <Badge
                            key={`speaker-${speaker.id}`}
                            variant="secondary"
                            className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                          >
                            {speaker.name}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeSpeaker(speaker.id)
                              }}
                              className="ml-1 hover:text-blue-900"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        {selectedWorkshops.map(workshop => (
                          <Badge
                            key={`workshop-${workshop.id}`}
                            variant="secondary"
                            className="bg-green-100 text-green-700 hover:bg-green-200"
                          >
                            {workshop.title}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeWorkshop(workshop.id)
                              }}
                              className="ml-1 hover:text-green-900"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-gray-500">
                        <span>Select speakers or browse all options</span>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  {showSpeakerDropdown && (
                    <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-xl max-h-80 overflow-hidden">
                      <div className="sticky top-0 bg-white border-b p-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type="text"
                            placeholder="Search speakers..."
                            value={speakerSearchTerm}
                            onChange={(e) => setSpeakerSearchTerm(e.target.value)}
                            className="pl-10"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      <div className="overflow-y-auto max-h-60">
                        {/* No speaker in mind option */}
                        <div
                          className={cn(
                            "px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b",
                            hasNoSpeakerInMind && "bg-blue-50"
                          )}
                          onClick={handleNoSpeakerInMind}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-700">No specific speaker or workshop in mind</div>
                              <div className="text-sm text-gray-500">We'll recommend options based on your needs</div>
                            </div>
                            {hasNoSpeakerInMind && (
                              <CheckCircle className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                        </div>

                        {/* Speakers Section */}
                        {loadingSpeakers ? (
                          <div className="p-8 text-center">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                            <p className="text-sm text-gray-500 mt-2">Loading...</p>
                          </div>
                        ) : filteredSpeakers.length > 0 ? (
                          <>
                            <div className="px-4 py-2 bg-gray-100 border-b">
                              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Speakers</div>
                            </div>
                            {filteredSpeakers.map(speaker => {
                            const isSelected = selectedSpeakers.find(s => s.id === speaker.id)
                            return (
                              <div
                                key={speaker.id}
                                className={cn(
                                  "px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors",
                                  isSelected && "bg-blue-50"
                                )}
                                onClick={() => toggleSpeaker(speaker)}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-medium">{speaker.name}</div>
                                    {speaker.title && (
                                      <div className="text-sm text-gray-500">{speaker.title}</div>
                                    )}
                                  </div>
                                  {isSelected && (
                                    <CheckCircle className="h-5 w-5 text-blue-600" />
                                  )}
                                </div>
                              </div>
                            )
                          })}
                          </>
                        ) : (
                          <div className="p-8 text-center text-gray-500">
                            No speakers found matching "{speakerSearchTerm}"
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Can't find who you're looking for? Describe your ideal speaker in the additional information section below.
                </p>
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Event Details</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Event Date(s)</Label>
                  <div className="space-y-2">
                    {eventDates.map((date, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            type="date"
                            value={date}
                            onChange={(e) => {
                              const newDates = [...eventDates]
                              newDates[index] = e.target.value
                              setEventDates(newDates)
                            }}
                            className="h-12 pl-10"
                          />
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                        {eventDates.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setEventDates(eventDates.filter((_, i) => i !== index))
                            }}
                            className="h-12 w-12"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEventDates([...eventDates, ''])}
                      className="w-full"
                    >
                      Add Another Date
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="eventLocation">Event Location</Label>
                  <div className="relative">
                    <Input
                      id="eventLocation"
                      value={formData.eventLocation}
                      onChange={(e) => handleInputChange('eventLocation', e.target.value)}
                      placeholder="City, State or Virtual"
                      className="h-12 pl-10"
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventBudget">Budget Range</Label>
                <Select value={formData.eventBudget} onValueChange={(value) => handleInputChange('eventBudget', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select your budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Additional Information</h3>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">
                  Tell us more about your event
                </Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  placeholder="Share details about your audience, event theme, specific topics of interest, or any special requirements..."
                  rows={5}
                  className="resize-none"
                />
              </div>
            </div>

            {/* Newsletter Opt-in */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="newsletterOptIn"
                  checked={formData.newsletterOptIn}
                  onCheckedChange={(checked) => handleInputChange('newsletterOptIn', checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label 
                    htmlFor="newsletterOptIn" 
                    className="text-base font-medium cursor-pointer flex items-center gap-2"
                  >
                    <Newspaper className="h-4 w-4 text-blue-600" />
                    Subscribe to our newsletter
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Get exclusive AI speaker insights, event trends, and industry updates delivered to your inbox.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Contact Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Call us directly</p>
                <a href="tel:+1-510-435-3947" className="text-blue-600 hover:underline">
                  (510) 435-3947
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Email us</p>
                <a href="mailto:human@speakabout.ai" className="text-blue-600 hover:underline">
                  human@speakabout.ai
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}