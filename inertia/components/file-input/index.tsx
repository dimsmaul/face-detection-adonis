import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Eye } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'
import { cn } from '~/lib/utils'

export interface FileInputProps extends React.ComponentProps<'input'> {
  file?: File | FileList | null
}

const FileInput = ({ className, file, type, ...props }: FileInputProps) => {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <div className="flex flex-row items-center gap-2 w-full">
        <Input type="file" className={cn(className, 'w-full')} {...props} />
        {file && (file instanceof FileList ? file.length > 0 : typeof file === 'string') && (
          <Button type="button" size={'icon'} variant={'outline'} onClick={() => setOpen(true)}>
            <Eye />
          </Button>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Preview</DialogTitle>
          <div className='flex justify-center items-center'>
            {file instanceof FileList && file.length > 0 ? (
              <img
                src={URL.createObjectURL(file[0])}
                alt="Preview"
                className="max-w-full max-h-96"
              />
            ) : file && typeof file === 'string' ? (
              <img src={file} alt="Preview" className="max-w-full max-h-96" />
            ) : (
              <p>No file selected</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default FileInput
