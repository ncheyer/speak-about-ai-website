"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, Mail, MapPin, Building, User, Phone, DollarSign, MessageSquare, Heart, CheckCircle, AlertCircle } from 'lucide-react'
// import { useWishlist } from '@/contexts/wishlist-context'
import { useToast } from '@/hooks/use-toast'

export function CustomContactForm() {
  // const { wishlist, wishlistCount } = useWishlist()
  const wishlist: any[] = []
  const wishlistCount = 0
  const { toast } = useToast()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    phone: '',
    organizationName: '',
    specificSpeaker: '',
    eventDate: '',
    eventLocation: '',
    eventBudget: '',
    additionalInfo: ''
  })

  const budgetOptions = [
    'Under $10k',
    '$10k - $25k',
    '$25k - $50k',
    '$50k - $100k',
    'Over $100k',
    'Let\'s discuss'
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.clientName || !formData.clientEmail) {
      toast({
        title: "Required fields missing",
        description: "Please fill in your name and email address.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submit-deal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok) {
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
          specificSpeaker: '',
          eventDate: '',
          eventLocation: '',
          eventBudget: '',
          additionalInfo: ''
        })
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
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Request Submitted Successfully!</h2>
            <p className="text-gray-600 mb-4">
              Thank you for your interest in our AI keynote speakers. We've received your request and will be in touch within 24 hours with personalized recommendations.
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Book an AI Keynote Speaker</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Please be as detailed as possible about your event to help us quickly identify the right expert for you.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>
                Tell us about your event and speaker requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientName" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Name *
                    </Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="clientEmail" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email *
                    </Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                      placeholder="your.email@company.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone (optional)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="organizationName" className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Organization Name
                    </Label>
                    <Input
                      id="organizationName"
                      value={formData.organizationName}
                      onChange={(e) => handleInputChange('organizationName', e.target.value)}
                      placeholder="Your company or organization"
                    />
                  </div>
                </div>

                {/* Event Details */}
                <div>
                  <Label htmlFor="specificSpeaker" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Do you have a specific speaker in mind?
                  </Label>
                  <Input
                    id="specificSpeaker"
                    value={formData.specificSpeaker}
                    onChange={(e) => handleInputChange('specificSpeaker', e.target.value)}
                    placeholder="Speaker name or type of expertise you're looking for"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eventDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Event Date (optional)
                    </Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => handleInputChange('eventDate', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="eventLocation" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Event Location (optional)
                    </Label>
                    <Input
                      id="eventLocation"
                      value={formData.eventLocation}
                      onChange={(e) => handleInputChange('eventLocation', e.target.value)}
                      placeholder="City, State or Virtual"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="eventBudget" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Event Budget
                  </Label>
                  <Select value={formData.eventBudget} onValueChange={(value) => handleInputChange('eventBudget', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="additionalInfo" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Additional Information
                  </Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    placeholder="What additional information would you like us to know about your organization, industry, or event?"
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Wishlist Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Your Speaker Wishlist
                {wishlistCount > 0 && (
                  <Badge variant="destructive">{wishlistCount}</Badge>
                )}
              </CardTitle>
              <CardDescription>
                {wishlistCount === 0 
                  ? "Add speakers you're interested in while browsing"
                  : `${wishlistCount} speaker${wishlistCount === 1 ? '' : 's'} selected`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {wishlist.length === 0 ? (
                <div className="text-center py-6">
                  <Heart className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 mb-4">
                    No speakers in your wishlist yet. Browse our speakers and add the ones you're interested in.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/speakers">Browse Speakers</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {wishlist.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={item.speaker?.headshot_url} 
                          alt={item.speaker?.name}
                        />
                        <AvatarFallback className="text-xs">
                          {item.speaker?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.speaker?.name}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {wishlist.length > 3 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{wishlist.length - 3} more speakers
                    </p>
                  )}
                  
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      These speakers will be included in your request and we'll provide personalized recommendations based on your selections.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium">Call us directly</p>
                    <a href="tel:+1-510-435-3947" className="text-blue-600 hover:underline">
                      (510) 435-3947
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium">Email us</p>
                    <a href="mailto:human@speakabout.ai" className="text-blue-600 hover:underline">
                      human@speakabout.ai
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}