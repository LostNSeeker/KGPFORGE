import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { Service } from '../../types'
import { getApiUrl } from '../../config'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Badge } from '../../components/ui/badge'
import { Clock, DollarSign, ArrowLeft, Heart, Share2, Users } from 'lucide-react'
import { Timeline } from '../../components/ui/modern-timeline'
import type { TimelineItem } from '../../components/ui/modern-timeline'

export const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [service, setService] = useState<Service | null>(null)
  const [timeline, setTimeline] = useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  const resolveImageUrl = (value?: string | null) => {
    if (!value) return ''
    if (value.startsWith('http://') || value.startsWith('https://')) return value
    return getApiUrl(`/api/profile/picture/${value}`)
  }

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(getApiUrl(`/api/launchpad/services/${id}`), {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setService(data)
          const fromResponse = Array.isArray(data.timeline) ? data.timeline : []
          setTimeline(fromResponse)
          // If no timeline in response, try dedicated endpoint (e.g. older backend)
          if (fromResponse.length === 0 && id) {
            const timelineRes = await fetch(getApiUrl(`/api/launchpad/services/${id}/timeline`))
            if (timelineRes.ok) {
              const timelineData = await timelineRes.json()
              if (Array.isArray(timelineData) && timelineData.length > 0) {
                setTimeline(timelineData)
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching service details:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchService()
  }, [id, token])

  if (loading) return <div className="flex justify-center py-20">Loading...</div>
  if (!service) return <div className="flex justify-center py-20">Service not found</div>

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="container mx-auto max-w-5xl px-4">
        <Link to="/launchpad" className="flex items-center text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Launchpad
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>
            
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-200">
               {service.image_url ? (
                  <img src={resolveImageUrl(service.image_url)} alt={service.title} className="w-full h-full object-cover" />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
               )}
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">About this service</h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {service.description}
              </div>
            </div>
            
             <div className="bg-white rounded-xl p-6 shadow-sm">
               <h2 className="text-xl font-semibold mb-4">Reviews & Past Work</h2>
               {service.reviews && service.reviews.length > 0 ? (
                 <ul className="space-y-4">
                   {service.reviews.map((review) => (
                     <li key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                       <div className="flex items-center justify-between gap-2 mb-1">
                         <span className="font-medium text-gray-900">{review.author_name}</span>
                         {review.rating != null && (
                           <span className="text-sm text-amber-600">
                             {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                           </span>
                         )}
                       </div>
                       <p className="text-gray-600 text-sm">{review.content}</p>
                       <p className="text-gray-400 text-xs mt-1">
                         {new Date(review.created_at).toLocaleDateString()}
                       </p>
                     </li>
                   ))}
                 </ul>
               ) : (
                 <p className="text-gray-500 italic">No reviews yet.</p>
               )}
            </div>

            {/* Timeline — fully admin controlled */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">How we do it</h2>
              {timeline.length > 0 ? (
                <Timeline items={timeline} />
              ) : (
                <div className="bg-white rounded-xl p-6 shadow-sm text-center text-gray-500">
                  Timeline will appear here once admin configures it for this service.
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
             <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
               <div className="flex items-center justify-between mb-6">
                 <Badge variant="secondary" className="px-3 py-1 text-sm bg-blue-50 text-blue-700">
                   {service.category}
                 </Badge>
                 <div className="flex space-x-2">
                   <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
                     <Heart className="h-5 w-5" />
                   </Button>
                   <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-500">
                     <Share2 className="h-5 w-5" />
                   </Button>
                 </div>
               </div>
               
               <div className="space-y-4 mb-6">
                 <div className="flex items-center justify-between text-gray-700">
                   <div className="flex items-center">
                     <DollarSign className="h-5 w-5 mr-2 text-gray-400" />
                     <span className="font-medium">Price Range</span>
                   </div>
                   <span className="font-bold">{service.price_range || 'Contact us'}</span>
                 </div>
<div className="flex items-center justify-between text-gray-700">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-gray-400" />
                    <span className="font-medium">Delivery Time</span>
                  </div>
                  <span className="font-bold">{service.delivery_time || 'Flexible'}</span>
                </div>
               </div>

               {/* Allotted students */}
               <div className="border-t pt-6">
                 <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                   <Users className="h-4 w-4 mr-2 text-gray-500" />
                   Allotted students
                 </h3>
                 {service.allotted_students && service.allotted_students.length > 0 ? (
                   <ul className="space-y-2">
                     {service.allotted_students.map((s) => (
                       <li key={s.id} className="flex items-center gap-2 text-sm">
                         <Avatar className="h-8 w-8">
                           <AvatarImage src={s.avatar ? getApiUrl(`/api/profile/picture/${s.avatar}`) : undefined} />
                           <AvatarFallback>{s.name?.charAt(0) || '?'}</AvatarFallback>
                         </Avatar>
                         <span className="text-gray-700 truncate">{s.name}</span>
                       </li>
                     ))}
                   </ul>
                 ) : (
                   <p className="text-sm text-gray-500 italic">No students allotted yet.</p>
                 )}
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
