import { Client } from 'minio'
import { readFileSync } from 'node:fs'
import { v4 as uuidv4 } from 'uuid'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

export default class MinioService {
  private client: Client
  private bucket: string

  constructor() {
    this.client = new Client({
      endPoint: process.env.MINIO_ENDPOINT!,
      port: Number(process.env.MINIO_PORT!),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ROOT_USER!,
      secretKey: process.env.MINIO_ROOT_PASSWORD!,
      region: process.env.MINIO_REGION!,
    })

    this.bucket = process.env.MINIO_BUCKET!
  }

  /**
   * 🟢 Upload file ke Supabase S3
   */
  async uploadFile(file: MultipartFile, folder = 'uploads') {
    if (!file.tmpPath) throw new Error('Temporary file path not found')

    const fileBuffer = readFileSync(file.tmpPath)
    const fileName = `${folder}/${uuidv4()}.${file.extname}`

    await this.client.putObject(this.bucket, fileName, fileBuffer, undefined, {
      'Content-Type': file.type,
    })

    const url = this.getPublicUrl(fileName)
    return { fileName, url }
  }

  /**
   * 🟢 Update file di Supabase S3
   */
  async updateFile(file: MultipartFile, folder = 'uploads', oldPath?: string) {
    if (oldPath) {
      await this.deleteFile(oldPath)
    }

    return this.uploadFile(file, folder)
  }

  /**
   * 🟢 Dapatkan file (stream)
   */
  async getFile(fileName: string) {
    return this.client.getObject(this.bucket, fileName)
  }

  /**
   * 🟢 Hapus file
   */
  async deleteFile(fileName: string) {
    await this.client.removeObject(this.bucket, fileName)
    return { deleted: true }
  }

  /**
   * 🟢 Dapatkan URL publik Supabase Storage
   */
  getPublicUrl(fileName: string) {
    return `${process.env.MINIO_ENDPOINT!.replace(/\/$/, '')}/${this.bucket}/${fileName}`
  }
}
