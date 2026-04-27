import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getApiUrl } from '../../config'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import toast from 'react-hot-toast'

export const CreateServicePage: React.FC = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price_range: '',
    delivery_time: '',
    image_url: ''
  })

  const CATEGORIES = [
    'Technology', 'Marketing', 'Design', 'Legal', 'Finance', 
    'Consulting', 'AI & Machine Learning', 'Blockchain', 'Education', 'Other'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !token) return
    setUploadingImage(true)
    try {
      const body = new FormData()
      body.append('file', file)
      const response = await fetch(getApiUrl('/api/launchpad/upload/service-image'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body
      })
      const data = await response.json()
      if (response.ok && data.filename) {
        setFormData(prev => ({ ...prev, image_url: data.filename }))
        toast.success('Image uploaded successfully')
      } else {
        toast.error(data.error || 'Failed to upload image')
      }
    } catch {
      toast.error('Failed to upload image')
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(getApiUrl('/api/launchpad/services'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Service created successfully!')
        navigate('/alumni/services')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create service')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/alumni/services" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Services
        </Link>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Service</CardTitle>
            <CardDescription>
              Offer your expertise to the Launchpad community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Full Stack Development, Legal Consulting"
                  required
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={handleCategoryChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe what you offer in detail..."
                  required
                  className="min-h-[150px]"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price_range">Price Range</Label>
                  <Input
                    id="price_range"
                    name="price_range"
                    placeholder="e.g. ₹50,000 - ₹2,00,000 or ₹500/hr"
                    value={formData.price_range}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delivery_time">Delivery Time</Label>
                  <Input
                    id="delivery_time"
                    name="delivery_time"
                    placeholder="e.g. 2 weeks, 3-5 days"
                    value={formData.delivery_time}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  placeholder="Paste URL or upload below"
                  value={formData.image_url}
                  onChange={handleChange}
                />
                <div className="flex items-center gap-3">
                  <label htmlFor="service-image-upload">
                    <Button type="button" variant="outline" asChild disabled={uploadingImage}>
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    </Button>
                  </label>
                  <input
                    id="service-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <p className="text-xs text-muted-foreground">JPG, PNG, GIF, WEBP</p>
                </div>
                {!!formData.image_url && (
                  <img
                    src={formData.image_url.startsWith('http') ? formData.image_url : getApiUrl(`/api/profile/picture/${formData.image_url}`)}
                    alt="Service preview"
                    className="h-28 w-full max-w-xs object-cover rounded-md border"
                  />
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/alumni/services')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Service'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
