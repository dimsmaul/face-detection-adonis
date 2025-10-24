import Admin from '#models/admin'
import UserDatum from '#models/user_datum'
import MinioService from '#services/minio_service'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export default class AdminsController {
  private minio = new MinioService()

  async index({ request, response }: HttpContext) {
    const { page = 1, limit = 10, search = '' } = request.qs()

    const data = await Admin.query()
      .where('name', 'like', `%${search}%`)
      .orWhere('email', 'like', `%${search}%`)
      .preload('position')
      .preload('userData')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return response.ok({
      message: 'Teacher staffs fetched successfully',
      data,
    })
  }

  async show({ params, response }: HttpContext) {
    const { id } = params

    try {
      const teacherStaff = await Admin.query().where('id', id).preload('position').firstOrFail()

      return response.ok({
        message: 'Teacher staff fetched successfully',
        data: teacherStaff,
      })
    } catch (error) {
      response.notFound('Teacher staff not found')
    }
  }

  async store({ request, response }: HttpContext) {
    const validator = vine.compile(
      vine.object({
        // nip: vine.string().optional(),
        name: vine.string().optional(),
        email: vine.string().email(),
        password: vine.string().minLength(6),
        subject: vine.string().optional(),
        status: vine.number().optional(),
        positionId: vine.string().uuid(),
        profile: vine.any().optional(),

        dob: vine.date().optional(),
        address: vine.string().optional(),
        phone: vine.string().optional(),
        subDistrict: vine.string().optional(),
        city: vine.string().optional(),
        province: vine.string().optional(),
        postalCode: vine.string().optional(),
      })
    )

    try {
      const payload = await request.validateUsing(validator)
      const file = request.file('profile')

      let profileUrl: string | null = null
      if (file) {
        const uploaded = await this.minio.uploadFile(file, 'profiles')
        profileUrl = uploaded.url
      }

      const { dob, address, phone, subDistrict, city, province, postalCode } = payload
      const userData = await UserDatum.create({
        dob: dob ? DateTime.fromJSDate(dob) : null,
        address,
        phone,
        subDistrict,
        city,
        province,
        postalCode,
      })

      const teacherStaff = await Admin.create({
        ...payload,
        nip: `${Date.now()}`,
        userDataId: userData.id,
        profile: profileUrl,
      })

      return response.created({
        message: 'Teacher staff created successfully',
        data: teacherStaff,
      })
    } catch (error) {
      response.badRequest('Failed to create teacher staff')
    }
  }

  async update({ params, request, response }: HttpContext) {
    const { id } = params
    const validator = vine.compile(
      vine.object({
        nip: vine.string().optional(),
        name: vine.string().optional(),
        email: vine.string().email().optional(),
        password: vine.string().minLength(6).optional(),
        subject: vine.string().optional(),
        status: vine.number().optional(),
        roleId: vine.string().uuid().optional(),
      })
    )

    try {
      const teacherStaff = await Admin.findOrFail(id)

      const payload = await request.validateUsing(validator)
      teacherStaff.merge({
        ...payload,
      })

      await teacherStaff.save()

      return response.ok({
        message: 'Teacher staff updated successfully',
        data: teacherStaff,
      })
    } catch (error) {
      response.notFound('Teacher staff not found')
    }
  }

  async destroy({ params, response }: HttpContext) {
    const { id } = params

    try {
      const teacherStaff = await Admin.findOrFail(id)
      await teacherStaff.delete()

      return response.ok({
        message: 'Teacher staff deleted successfully',
      })
    } catch (error) {
      response.notFound('Teacher staff not found')
    }
  }
}
