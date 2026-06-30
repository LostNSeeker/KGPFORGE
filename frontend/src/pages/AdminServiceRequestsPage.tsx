import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getApiUrl } from '../config'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Loader2, MessageCircle, ArrowLeft, Calendar, FileText, UserPlus, Briefcase } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { formatDate } from '../lib/dataUtils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'

interface ServiceRequest {
  id: number
  user_id: number
  service_id?: number
  project_type: string
  description: string
  budget_range?: string
  status: 'pending' | 'contacted' | 'in_progress' | 'completed' | 'cancelled'
  created_at: string
  user: {
    id: number
    name: string
    email: string
    avatar?: string
  }
}

interface StudentProfile {
  user_id: number
  resume_url?: string
  skills?: string
  experience?: string
  education?: string
  linkedin_url?: string
  portfolio_url?: string
  other_info?: string
  created_at: string
  updated_at: string
  user: {
    id: number
    name: string
    email: string
  }
}

interface Service {
  id: number
  title: string
}

export const AdminServiceRequestsPage: React.FC = () => {
  const { token, user } = useAuth()
  const navigate = useNavigate()
  
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [profiles, setProfiles] = useState<StudentProfile[]>([])
  const [services, setServices] = useState<Service[]>([])
  
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)
  
  // Allotment Modal State
  const [allottingProfileId, setAllottingProfileId] = useState<number | null>(null)
  const [selectedServiceId, setSelectedServiceId] = useState<string>('')
  const [isAllotting, setIsAllotting] = useState(false)

  useEffect(() => {
    if (token) {
      fetchData()
    }
  }, [token])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [reqRes, profRes, srvRes] = await Promise.all([
        fetch(getApiUrl('/api/launchpad/admin/requests'), { headers: { Authorization: `Bearer ${token}` } }),
        fetch(getApiUrl('/api/launchpad/admin/student-profiles'), { headers: { Authorization: `Bearer ${token}` } }),
        fetch(getApiUrl('/api/launchpad/services'), { headers: { Authorization: `Bearer ${token}` } })
      ])
      
      if (reqRes.ok) setRequests(await reqRes.json())
      if (profRes.ok) setProfiles(await profRes.json())
      if (srvRes.ok) setServices(await srvRes.json())
        
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleChat = async (userId: number, requestId: number) => {
    try {
      setProcessingId(requestId)
      
      const res = await fetch(getApiUrl('/api/messages/conversations'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ other_user_id: userId })
      })

      if (res.ok) {
        const conversation = await res.json()
        navigate(`/messages/${conversation.id}`)
      } else {
        toast.error('Failed to start chat')
      }
    } catch (error) {
      console.error('Error starting chat:', error)
      toast.error('Failed to connect to chat')
    } finally {
      setProcessingId(null)
    }
  }

  const handleAllot = async () => {
    if (!selectedServiceId || !allottingProfileId) return
    setIsAllotting(true)
    try {
      const res = await fetch(getApiUrl('/api/launchpad/allotments'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          service_id: parseInt(selectedServiceId),
          student_id: allottingProfileId
        })
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(data.message || 'Allotted successfully')
        setAllottingProfileId(null)
        setSelectedServiceId('')
      } else {
        toast.error(data.error || 'Failed to allot')
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong')
    } finally {
      setIsAllotting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8 items-start">
          <Button variant="ghost" onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Service Requests & Profiles</h1>
        </div>

        <Tabs defaultValue="direct-requests" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8">
            <TabsTrigger value="direct-requests">Direct Requests</TabsTrigger>
            <TabsTrigger value="student-profiles">Student Profiles</TabsTrigger>
          </TabsList>

          <TabsContent value="direct-requests" className="mt-6">
            <div className="grid gap-6">
              {requests.map((request) => (
                <Card key={request.id} className="overflow-hidden hover:shadow-md transition-shadow border-0 shadow-sm bg-white">
                  <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border border-gray-200">
                          <AvatarImage 
                            src={request.user.avatar ? getApiUrl(`/api/profile/picture/${request.user.avatar}`) : undefined} 
                            alt={request.user.name} 
                          />
                          <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                            {request.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{request.project_type}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>by {request.user.name}</span>
                            <span>•</span>
                            <span>{request.user.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={
                          request.status === 'pending' ? 'secondary' : 
                          request.status === 'contacted' ? 'outline' :
                          request.status === 'completed' ? 'default' : 'secondary'
                        } className={`capitalize ${
                          request.status === 'completed' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : ''
                        }`}>
                          {request.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-gray-400 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(request.created_at)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                          <FileText className="h-4 w-4 mr-1" /> Description
                        </h4>
                        <p className="text-gray-700 whitespace-pre-wrap pl-5 border-l-2 border-gray-100">
                          {request.description}
                        </p>
                      </div>
                      
                      {request.budget_range && (
                        <div className="flex gap-2 text-sm">
                          <span className="font-medium text-gray-500">Budget:</span>
                          <span className="text-gray-900">{request.budget_range}</span>
                        </div>
                      )}

                      <div className="pt-4 flex justify-end gap-3 border-t border-gray-50 mt-4">
                        <Button 
                          onClick={() => handleChat(request.user.id, request.id)} 
                          disabled={!!processingId}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {processingId === request.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <MessageCircle className="h-4 w-4 mr-2" />
                          )}
                          Chat with User
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {requests.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No Direct Requests</h3>
                  <p className="text-gray-500 mt-2">There are currently no direct service requests.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="student-profiles" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profiles.map((profile) => (
                <Card key={profile.user_id} className="border-0 shadow-sm bg-white hover:shadow-md transition-all h-full flex flex-col">
                  <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{profile.user.name}</h3>
                        <p className="text-sm text-gray-500">{profile.user.email}</p>
                      </div>
                      <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                        Profile Submitted
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 flex-1 flex flex-col">
                    <div className="space-y-4 flex-1">
                      {profile.skills && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Skills</p>
                          <div className="flex flex-wrap gap-1.5">
                            {profile.skills.split(',').map(skill => skill.trim()).map(skill => (
                              <Badge key={skill} variant="secondary" className="bg-gray-100 text-gray-700">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {profile.experience && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Experience</p>
                          <p className="text-sm text-gray-700 line-clamp-2">{profile.experience}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3 pt-2">
                        {profile.resume_url && (
                          <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center">
                            <FileText className="h-4 w-4 mr-1" /> View CV
                          </a>
                        )}
                        {profile.linkedin_url && (
                          <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                            LinkedIn
                          </a>
                        )}
                        {profile.portfolio_url && (
                          <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                            Portfolio
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50 mt-6 grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => handleChat(profile.user_id, profile.user_id)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                      <Button 
                        onClick={() => setAllottingProfileId(profile.user_id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        <Briefcase className="h-4 w-4 mr-2" />
                        Allot Service
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {profiles.length === 0 && (
                <div className="col-span-1 md:col-span-2 text-center py-12 bg-white rounded-lg shadow-sm">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No Student Profiles</h3>
                  <p className="text-gray-500 mt-2">No students have submitted their general service profiles yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Allotment Modal */}
      <Dialog open={allottingProfileId !== null} onOpenChange={(open) => !open && setAllottingProfileId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Allot to Service</DialogTitle>
            <DialogDescription>
              Select an alumni service to allot this student to. They will be notified and asked to agree to the match.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a service..." />
              </SelectTrigger>
              <SelectContent>
                {services.map(service => (
                  <SelectItem key={service.id} value={service.id.toString()}>
                    {service.title}
                  </SelectItem>
                ))}
                {services.length === 0 && (
                  <SelectItem value="none" disabled>No active services available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="ghost" onClick={() => setAllottingProfileId(null)}>Cancel</Button>
            <Button onClick={handleAllot} disabled={!selectedServiceId || isAllotting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {isAllotting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Confirm Allotment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
