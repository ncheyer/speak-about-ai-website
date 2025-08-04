"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart, Plus } from 'lucide-react'
import { useWishlist } from '@/contexts/wishlist-context'
import { useToast } from '@/hooks/use-toast'

interface WishlistButtonProps {
  speakerId: number
  speakerName?: string
  variant?: 'default' | 'outline' | 'ghost' | 'icon'
  size?: 'sm' | 'default' | 'lg'
  showText?: boolean
  className?: string
}

export function WishlistButton({ 
  speakerId, 
  speakerName = '',
  variant = 'outline',
  size = 'sm',
  showText = true,
  className = ''
}: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const inWishlist = isInWishlist(speakerId)

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsLoading(true)
    
    try {
      let success = false
      
      if (inWishlist) {
        success = await removeFromWishlist(speakerId)
        if (success) {
          toast({
            title: "Removed from wishlist",
            description: speakerName ? `${speakerName} removed from your wishlist` : "Speaker removed from wishlist"
          })
        }
      } else {
        success = await addToWishlist(speakerId)
        if (success) {
          toast({
            title: "Added to wishlist",
            description: speakerName ? `${speakerName} added to your wishlist` : "Speaker added to wishlist"
          })
        }
      }
      
      if (!success) {
        toast({
          title: "Error",
          description: "Failed to update wishlist. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (variant === 'icon') {
    return (
      <Button
        onClick={handleToggleWishlist}
        disabled={isLoading}
        size={size}
        variant="ghost"
        className={`p-2 hover:bg-red-50 ${className}`}
      >
        <Heart 
          className={`h-4 w-4 transition-colors ${
            inWishlist 
              ? 'fill-red-500 text-red-500' 
              : 'text-gray-400 hover:text-red-500'
          }`} 
        />
        <span className="sr-only">
          {inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        </span>
      </Button>
    )
  }

  return (
    <Button
      onClick={handleToggleWishlist}
      disabled={isLoading}
      variant={inWishlist ? 'default' : variant}
      size={size}
      className={`${inWishlist ? 'bg-red-500 hover:bg-red-600' : ''} ${className}`}
    >
      {inWishlist ? (
        <Heart className="h-4 w-4 mr-2 fill-current" />
      ) : (
        <Plus className="h-4 w-4 mr-2" />
      )}
      {showText && (
        <span>
          {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </Button>
  )
}