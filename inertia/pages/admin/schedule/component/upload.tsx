import { router } from '@inertiajs/react'
import axios from 'axios'
import React, { useState } from 'react'
import { callAlert } from '~/components/alert'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

export interface ScheduleUploadProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

interface UploadResult {
  savedCount: number
  errorCount: number
  errors?: Array<{
    row: number
    error: string
    data: any
  }>
}

const ScheduleUpload: React.FC<ScheduleUploadProps> = (props) => {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ]
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please select a valid Excel file (.xls or .xlsx)')
        setFile(null)
        return
      }
      setFile(selectedFile)
      setError(null)
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      callAlert({
        type: 'error',
        title: 'Error',
        message: 'Please select a file first',
      })
      return
    }

    setIsUploading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post('/api/schedules/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const result = response.data.data
      setResult(result)

      // Show success message
      const errorMessage =
        result.errorCount > 0
          ? `\nSuccessfully saved: ${result.savedCount} schedules\nErrors: ${result.errorCount} rows`
          : `Successfully saved: ${result.savedCount} schedules`

      callAlert({
        type: result.errorCount > 0 ? 'warning' : 'success',
        title: 'Upload Complete',
        message: errorMessage,
        options: {
          showCancelButton: false,
          willClose: () => {
            if (result.savedCount > 0) {
              router.reload()
              handleClose()
              props.onSuccess()
            }
          },
        },
      })
    } catch (err: any) {
      callAlert({
        type: 'error',
        title: 'Upload Failed',
        message: err.response?.data?.message || 'Failed to upload file',
      })
      setError(err.response?.data?.message || 'Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setError(null)
    setResult(null)
    props.onClose()
  }

  return (
    <Dialog open={props.open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Schedule from Excel</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Select Excel File</Label>
            <Input
              id="file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {/* <p className="text-sm text-muted-foreground">
              Upload an Excel file with columns: date (A3), time (B3), type (C3). Data starts from
              row 4.
            </p> */}
          </div>

          {error && (
            <div className="border border-red-500 bg-red-50 rounded-md p-4 text-red-900">
              {error}
            </div>
          )}

          {result && result.errors && result.errors.length > 0 && (
            <div className="space-y-2">
              <div className="border rounded-md p-4">
                <div className="font-semibold mb-2">Upload Result:</div>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li className="text-green-600">
                    Successfully saved: {result.savedCount} schedules
                  </li>
                  {result.errorCount > 0 && (
                    <li className="text-red-600">Errors: {result.errorCount} rows</li>
                  )}
                </ul>
              </div>

              <div className="border rounded-md p-4 max-h-64 overflow-y-auto">
                <h4 className="font-semibold mb-2">Error Details:</h4>
                <ul className="space-y-2 text-sm">
                  {result.errors.map((err, idx) => (
                    <li key={idx} className="text-red-600">
                      <span className="font-medium">Row {err.row}:</span> {err.error}
                      {err.data && (
                        <span className="text-gray-600"> - {JSON.stringify(err.data)}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!file || isUploading}>
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ScheduleUpload
