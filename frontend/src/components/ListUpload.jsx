import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { Upload, FileText, AlertCircle, CheckCircle2, Users } from 'lucide-react'

const ListUpload = () => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  // Handle file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }, [])

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  // Handle file selection
  const handleFileSelect = (selectedFile) => {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase()
    const allowedExtensions = ['csv', 'xlsx', 'xls']
    
    if (!allowedExtensions.includes(fileExtension)) {
      toast.error('Invalid file type. Only CSV, XLSX, and XLS files are allowed.')
      return
    }
    
    // Check file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB.')
      return
    }
    
    setFile(selectedFile)
    setUploadResult(null)
  }

  // Handle file input change
  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  // Upload and distribute file
  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first.')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await api.post('/lists/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      setUploadResult(response.data)
      toast.success('File uploaded and distributed successfully!')
      setFile(null)
      
      // Reset file input
      const fileInput = document.getElementById('file-input')
      if (fileInput) {
        fileInput.value = ''
      }
    } catch (error) {
      console.error('Upload error:', error)
      const errorMsg = error.response?.data?.msg || 'Failed to upload file'
      toast.error(errorMsg)
    } finally {
      setUploading(false)
    }
  }

  // Remove selected file
  const removeFile = () => {
    setFile(null)
    setUploadResult(null)
    const fileInput = document.getElementById('file-input')
    if (fileInput) {
      fileInput.value = ''
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Upload & Distribute Lists</h1>
        <p className="mt-2 text-sm text-gray-600">
          Upload CSV, XLSX, or XLS files to distribute tasks among agents
        </p>
      </div>

      {/* File Upload Section */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Upload className="h-5 w-5 mr-2" />
          File Upload
        </h2>

        {/* File Requirements */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">File Requirements:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• File formats: CSV, XLSX, XLS</li>
            <li>• Maximum file size: 5MB</li>
            <li>• Required columns: FirstName, Phone, Notes</li>
            <li>• Lists will be distributed equally among available agents</li>
          </ul>
        </div>

        {/* Drag and Drop Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : file
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={!file ? handleDrag : undefined}
          onDragLeave={!file ? handleDrag : undefined}
          onDragOver={!file ? handleDrag : undefined}
          onDrop={!file ? handleDrop : undefined}
        >
          {/* Only show file input when no file is selected */}
          {!file && (
            <input
              id="file-input"
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileInputChange}
            />
          )}
          
          {file ? (
            <div className="space-y-4">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">File Selected</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    <strong>Name:</strong> {file.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Type:</strong> {file.type || 'Unknown'}
                  </p>
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className={`btn-primary ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    'Upload & Distribute'
                  )}
                </button>
                <button
                  onClick={removeFile}
                  disabled={uploading}
                  className="btn-secondary"
                >
                  Remove File
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {dragActive ? 'Drop your file here' : 'Upload a file'}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Drag and drop your CSV, XLSX, or XLS file here, or click to browse
                </p>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                Choose File
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upload Result */}
      {uploadResult && (
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
            Upload Successful
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {uploadResult.totalItems}
                </div>
                <div className="text-sm text-blue-800">Total Items</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {uploadResult.agentsCount}
                </div>
                <div className="text-sm text-green-800">Agents</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.ceil(uploadResult.totalItems / uploadResult.agentsCount)}
                </div>
                <div className="text-sm text-purple-800">Items per Agent (avg)</div>
              </div>
            </div>

            {/* Distribution Details */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Distribution Details
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Agent Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Items Assigned
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {uploadResult.distribution?.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          {item.agentName}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {item.itemCount} items
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-blue-500" />
          Instructions
        </h2>
        
        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900">Expected File Format:</h4>
            <p>Your file should contain the following columns:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>FirstName:</strong> Text field containing the first name</li>
              <li><strong>Phone:</strong> Number field containing the phone number</li>
              <li><strong>Notes:</strong> Text field containing additional notes (optional)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900">Distribution Logic:</h4>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Items are distributed equally among all available agents</li>
              <li>If the total number isn't divisible by agent count, remaining items are distributed sequentially</li>
              <li>You must have at least one agent before uploading files</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListUpload