import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Loader2, Briefcase, Clock, CheckCircle, X, ArrowLeft, Calendar, Activity } from 'lucide-react'
import { getApiUrl } from '../config'

interface ServiceRequest {
  id: number
  service_id?: number
  project_type: string
  description: string
  budget_range?: string
  status: string
  admin_notes?: string
  created_at: string
}

export const StudentApplicationsPage: React.FC = () => {
  const { token, user, isLoading: authLoading } = useAuth()
  const [applications, setApplications] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token && user && user.role === 'student') {
      fetchApplications()
    }
  }, [token, user])

  const fetchApplications = async () => {
    try {
      const response = await fetch(getApiUrl('/api/launchpad/my-requests'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setApplications(data)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Loading applications...</span>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'student') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <p className="text-muted-foreground">Only students can view this page.</p>
      </div>
    )
  }

  const pendingApplications = applications.filter(app => ['pending', 'contacted'].includes(app.status))
  const activeApplications = applications.filter(app => app.status === 'in_progress')
  const completedApplications = applications.filter(app => app.status === 'completed')
  const cancelledApplications = applications.filter(app => app.status === 'cancelled')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/student-dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            My Applications
          </h1>
          <p className="text-gray-600">Track all your service requests and applications in one place</p>

          {/* Summary Stats */}
          {applications.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                <p className="text-sm text-gray-700 font-medium">Total</p>
                <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
              </div>
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-700 font-medium">Pending/Contacted</p>
                <p className="text-3xl font-bold text-yellow-900">{pendingApplications.length}</p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-700 font-medium">In Progress</p>
                <p className="text-3xl font-bold text-blue-900">{activeApplications.length}</p>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <p className="text-sm text-green-700 font-medium">Completed</p>
                <p className="text-3xl font-bold text-green-900">{completedApplications.length}</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* Pending Applications */}
          {pendingApplications.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 flex items-center">
                <Clock className="h-6 w-6 mr-2 text-yellow-600" />
                Pending & Contacted ({pendingApplications.length})
              </h2>
              <div className="space-y-4">
                {pendingApplications.map((application) => (
                  <Card key={application.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">
                            {application.project_type}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {application.description}
                          </CardDescription>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 ml-4 uppercase">
                          {application.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {application.admin_notes && (
                        <div className="p-3 bg-gray-50 rounded-lg mb-3">
                          <p className="text-xs font-medium text-gray-500 mb-1">Admin Notes:</p>
                          <p className="text-sm text-gray-700">{application.admin_notes}</p>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Requested on {new Date(application.created_at).toLocaleDateString()}
                        </div>
                        {application.service_id && (
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/launchpad/services/${application.service_id}`}>
                              View Service
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Active Applications */}
          {activeApplications.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 flex items-center">
                <Activity className="h-6 w-6 mr-2 text-blue-600" />
                In Progress ({activeApplications.length})
              </h2>
              <div className="space-y-4">
                {activeApplications.map((application) => (
                  <Card key={application.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">
                            {application.project_type}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {application.description}
                          </CardDescription>
                        </div>
                        <Badge className="bg-blue-600 text-white ml-4 uppercase">
                          IN PROGRESS
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {application.admin_notes && (
                        <div className="p-3 bg-gray-50 rounded-lg mb-3">
                          <p className="text-xs font-medium text-gray-500 mb-1">Admin Notes:</p>
                          <p className="text-sm text-gray-700">{application.admin_notes}</p>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Requested on {new Date(application.created_at).toLocaleDateString()}
                        </div>
                        {application.service_id && (
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/launchpad/services/${application.service_id}`}>
                              View Service
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Completed Applications */}
          {completedApplications.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 flex items-center">
                <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
                Completed ({completedApplications.length})
              </h2>
              <div className="space-y-4">
                {completedApplications.map((application) => (
                  <Card key={application.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">
                            {application.project_type}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {application.description}
                          </CardDescription>
                        </div>
                        <Badge className="bg-green-600 text-white ml-4 uppercase">
                          COMPLETED
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Requested on {new Date(application.created_at).toLocaleDateString()}
                        </div>
                        {application.service_id && (
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/launchpad/services/${application.service_id}`}>
                              View Service
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Cancelled Applications */}
          {cancelledApplications.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 flex items-center">
                <X className="h-6 w-6 mr-2 text-red-600" />
                Cancelled ({cancelledApplications.length})
              </h2>
              <div className="space-y-4">
                {cancelledApplications.map((application) => (
                  <Card key={application.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm opacity-75 hover:opacity-100 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">
                            {application.project_type}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {application.description}
                          </CardDescription>
                        </div>
                        <Badge className="bg-red-600 text-white ml-4 uppercase">
                          CANCELLED
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Requested on {new Date(application.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {applications.length === 0 && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="h-20 w-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <Briefcase className="h-10 w-10 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">No applications yet</CardTitle>
                <CardDescription className="text-gray-600 mb-6">
                  You haven't submitted any service requests or applications yet.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
