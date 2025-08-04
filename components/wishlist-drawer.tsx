"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, X, Send, Trash2 } from 'lucide-react'
import { useWishlist } from '@/contexts/wishlist-context'
import { useRouter } from 'next/navigation'

export function WishlistDrawer() {
  const { wishlist, wishlistCount, removeFromWishlist, clearWishlist, isLoading } = useWishlist()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleRemove = async (speakerId: number, speakerName: string) => {
    await removeFromWishlist(speakerId)
  }

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      await clearWishlist()
    }
  }

  const handleSubmitWishlist = () => {
    setIsOpen(false)
    router.push('/contact')
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <Heart className="h-4 w-4 mr-2" />
          Wishlist
          {wishlistCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {wishlistCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Your Speaker Wishlist
          </SheetTitle>
          <SheetDescription>
            {wishlistCount === 0 
              ? "Add speakers you're interested in to create your perfect lineup"
              : `${wishlistCount} speaker${wishlistCount === 1 ? '' : 's'} in your wishlist`
            }
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading wishlist...</div>
            </div>
          ) : wishlist.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-4">
                Browse our speakers and add the ones you're interested in to build your perfect event lineup.
              </p>
              <Button onClick={() => setIsOpen(false)}>
                Browse Speakers
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlist.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage 
                      src={item.speaker?.headshot_url} 
                      alt={item.speaker?.name}
                    />
                    <AvatarFallback>
                      {item.speaker?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {item.speaker?.name}
                    </h4>
                    {item.speaker?.one_liner && (
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {item.speaker.one_liner}
                      </p>
                    )}
                    {item.speaker?.speaking_fee_range && (
                      <p className="text-xs text-green-600 mt-1">
                        {item.speaker.speaking_fee_range}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(item.speakerId, item.speaker?.name || '')}
                    className="flex-shrink-0 text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {wishlist.length > 0 && (
          <div className="border-t pt-4 mt-4 space-y-3">
            <Button 
              onClick={handleSubmitWishlist}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Wishlist & Get Quote
            </Button>
            
            <Button 
              onClick={handleClearAll}
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              Submit your wishlist to get personalized recommendations and pricing
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}