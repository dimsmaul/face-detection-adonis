// app/services/supabase_storage_service.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

export class SupabaseStorageService {
  private client: SupabaseClient
  private bucket: string

  constructor() {
    this.client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    this.bucket = process.env.SUPABASE_BUCKET!
  }

  /**
   * Upload file
   */
  public async uploadFile(fileBuffer: Buffer, folder: string, ext: string, fileName?: string) {
    const name = fileName || `${uuidv4()}.${ext}`
    const path = `${folder}/${name}`

    const { error } = await this.client.storage.from(this.bucket).upload(path, fileBuffer, {
      cacheControl: '3600',
      upsert: true, // jika sama path, akan overwrite → efek update
      contentType: this.getContentType(ext),
    })

    if (error) throw new Error(`Upload failed: ${error.message}`)

    const { data } = this.client.storage.from(this.bucket).getPublicUrl(path)

    return { path, url: data.publicUrl }
  }

  /**
   * Get public URL of file
   */
  public getPublicUrl(path: string) {
    const { data } = this.client.storage.from(this.bucket).getPublicUrl(path)
    return data.publicUrl
  }

  /**
   * Download file as Buffer
   */
  public async downloadFile(path: string): Promise<Buffer> {
    const { data, error } = await this.client.storage.from(this.bucket).download(path)

    if (error || !data) throw new Error(`Download failed: ${error?.message || 'No data'}`)

    return Buffer.from(await data.arrayBuffer())
  }

  /**
   * Delete file
   */
  public async deleteFile(path: string) {
    const { error } = await this.client.storage.from(this.bucket).remove([path])

    if (error) throw new Error(`Delete failed: ${error.message}`)

    return true
  }

  /**
   * Update file → sama seperti upload ulang ke path yang sama
   */
  public async updateFile(fileBuffer: Buffer, path: string, ext: string, oldPath: string) {
    await this.deleteFile(oldPath)
    return this.uploadFile(fileBuffer, path.split('/')[0], ext, path.split('/')[1])
  }

  private getContentType(ext: string) {
    const map: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      pdf: 'application/pdf',
      txt: 'text/plain',
    }
    return map[ext.toLowerCase()] || 'application/octet-stream'
  }
}
