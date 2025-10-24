import User from '#models/user'
import UserDatum from '#models/user_datum'
import MinioService from '#services/minio_service'
import { SupabaseStorageService } from '#services/supabase_service'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { DateTime } from 'luxon'
import { readFileSync } from 'node:fs'

export default class UsersController {
  private minio = new MinioService()
  private supabase = new SupabaseStorageService()
  async index({ request, response }: HttpContext) {
    const { page = 1, limit = 10, search = '' } = request.qs()

    const data = await User.query()
      .where('name', 'like', `%${search}%`)
      .orWhere('email', 'like', `%${search}%`)
      .preload('userData')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    // return inertia.render('admin/student/pages/index', { data })
    return response.ok({
      message: 'Users fetched successfully',
      data: data,
    })
  }

  async show({ params, response }: HttpContext) {
    const { id } = params

    try {
      const user = await User.query().where('id', id).preload('userData').firstOrFail()

      return response.ok({
        message: 'User fetched successfully',
        data: user,
      })
    } catch (error) {
      response.notFound('User not found')
    }
  }

  async store({ request, response }: HttpContext) {
    const validator = vine.compile(
      vine.object({
        name: vine.string().optional(),
        email: vine.string().email(),
        password: vine.string().minLength(6),
        subject: vine.string().optional(),
        status: vine.number().optional(),
        dateOfAcceptance: vine.date().optional(),
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
    // try {
    const payload = await request.validateUsing(validator)
    const file = request.file('profile')

    let profileUrl: string | null = null
    if (file) {
      const buffer = readFileSync(file.tmpPath!)
      const uploaded = await this.supabase.uploadFile(buffer, 'profiles', file.extname!)
      profileUrl = uploaded.url
    }

    const { dob, address, phone, subDistrict, city, province, postalCode, ...user } = payload
    const userData = await UserDatum.create({
      dob: dob ? DateTime.fromJSDate(dob) : null,
      address,
      phone,
      subDistrict,
      city,
      province,
      postalCode,
    })

    const teacherStaff = await User.create({
      ...user,
      nim: `${Date.now()}`,
      userDataId: userData.id,
      profile: profileUrl,
      dateOfAcceptance: payload.dateOfAcceptance
        ? DateTime.fromJSDate(payload.dateOfAcceptance)
        : null,
    })

    return response.created({
      message: 'Users created successfully',
      data: teacherStaff,
    })
    // } catch (error) {
    //   response.badRequest('Failed to create user')
    // }
  }

  async update({ params, request, response }: HttpContext) {
    const { id } = params

    const validator = vine.compile(
      vine.object({
        name: vine.string().optional(),
        email: vine.string().email(),
        password: vine.string().minLength(6),
        subject: vine.string().optional(),
        status: vine.number().optional(),
        major: vine.string().optional(),
        dateOfAcceptance: vine.date().optional(),
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

    const validateUser = await User.query().where('id', id).preload('userData').firstOrFail()

    const payload = await request.validateUsing(validator)
    const file = request.file('profile')

    let profileUrl: string | null = null
    if (file) {
      const buffer = readFileSync(file.tmpPath!)
      if (validateUser.profile) {
        const uploaded = await this.supabase.updateFile(
          buffer,
          'profiles',
          file.extname!,
          validateUser.profile!
        )
        profileUrl = uploaded.url
      } else {
        const uploaded = await this.supabase.uploadFile(buffer, 'profiles', file.extname!)
        profileUrl = uploaded.url
      }
    }

    const { dob, address, phone, subDistrict, city, province, postalCode, ...user } = payload

    let datumId = ''
    if (validateUser.userData) {
      validateUser.userData.merge({
        dob: dob ? DateTime.fromJSDate(dob) : null,
        address,
        phone,
        subDistrict,
        city,
        province,
        postalCode,
      })
      await validateUser.userData.save()
    } else {
      const userData = await UserDatum.create({
        dob: dob ? DateTime.fromJSDate(dob) : null,
        address,
        phone,
        subDistrict,
        city,
        province,
        postalCode,
      })
      datumId = userData.id
    }

    // data merge
    validateUser.merge({
      ...user,
      nim: validateUser.nim ? validateUser.nim : `${Date.now()}`,
      userDataId: validateUser?.userData?.id || datumId,
      profile: profileUrl || validateUser.profile,
      dateOfAcceptance: payload.dateOfAcceptance
        ? DateTime.fromJSDate(payload.dateOfAcceptance)
        : null,
    })

    await validateUser.save()
    const data = validateUser

    return response.ok({
      message: 'Users Update successfully',
      data: data,
    })
    // try {
    //   const user = await User.findOrFail(id)

    //   user.merge({
    //     nim,
    //     name,
    //     email,
    //     password,
    //     major,
    //     status,
    //     dateOfAcceptance,
    //     profile,
    //   })

    //   await user.save()

    //   return response.ok({
    //     message: 'User updated successfully',
    //     data: user,
    //   })
    // } catch (error) {
    //   response.notFound('User not found')
    // }
  }

  async destroy({ params, response }: HttpContext) {
    const { id } = params
    try {
      const user = await User.findOrFail(id)
      await user.delete()

      return response.ok({
        message: 'User deleted successfully',
      })
    } catch (error) {
      response.notFound('User not found')
    }
  }
}
