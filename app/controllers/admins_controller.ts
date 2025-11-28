import Admin from '#models/admin'
import UserDatum from '#models/user_datum'
import { SupabaseStorageService } from '#services/supabase_service'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { DateTime } from 'luxon'
import { readFileSync } from 'node:fs'

export default class AdminsController {
  private supabase = new SupabaseStorageService()

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

        dob: vine.any().optional(),
        address: vine.string().optional(),
        phone: vine.string().optional(),
        subDistrict: vine.string().optional(),
        city: vine.string().optional(),
        province: vine.string().optional(),
        postalCode: vine.string().optional(),
      })
    )

    // try {
    // const payload = await request.validateUsing(validator)
    // const file = request.file('profile')

    // let profileUrl: string | null = null
    // if (file) {
    //   const uploaded = await this.minio.uploadFile(file, 'profiles')
    //   profileUrl = uploaded.url
    // }
    const payload = await request.validateUsing(validator)
    const file = request.file('profile')

    let profileUrl: string | null = null
    if (file) {
      const buffer = readFileSync(file.tmpPath!)
      const uploaded = await this.supabase.uploadFile(buffer, 'profiles', file.extname!)
      profileUrl = uploaded.url
    }

    const { dob, address, phone, subDistrict, city, province, postalCode, ...adminPayload } =
      payload
    const userData = await UserDatum.create({
      dob: dob ?? null,
      address,
      phone,
      subDistrict,
      city,
      province,
      postalCode,
    })

    const teacherStaff = await Admin.create({
      ...adminPayload,
      nip: `${Date.now()}`,
      userDataId: userData.id,
      profile: profileUrl,
    })

    return response.created({
      message: 'Teacher staff created successfully',
      data: teacherStaff,
    })
    // } catch (error) {
    //   response.badRequest('Failed to create teacher staff')
    // }
  }

  async update({ params, request, response }: HttpContext) {
    const { id } = params
    const validator = vine.compile(
      vine.object({
        // nip: vine.string().optional(),
        // name: vine.string().optional(),
        // email: vine.string().email().optional(),
        // password: vine.string().minLength(6).optional(),
        // subject: vine.string().optional(),
        // status: vine.number().optional(),
        // roleId: vine.string().uuid().optional(),
        name: vine.string().optional(),
        email: vine.string().email(),
        password: vine.string().optional(),
        subject: vine.string().optional(),
        status: vine.number().optional(),
        positionId: vine.string().uuid(),
        profile: vine.any().optional(),

        dob: vine.any().optional(),
        address: vine.string().optional(),
        phone: vine.string().optional(),
        subDistrict: vine.string().optional(),
        city: vine.string().optional(),
        province: vine.string().optional(),
        postalCode: vine.string().optional(),
      })
    )

    // try {
    // const teacherStaff = await Admin.findOrFail(id)
    const validateUser = await Admin.query().where('id', id).preload('userData').firstOrFail()

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
        dob: dob ?? null,
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
        dob: dob ?? null,
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
      // nip: validateUser.nip ? validateUser.nip : `${Date.now()}`,
      userDataId: validateUser?.userData?.id || datumId,
      profile: profileUrl || validateUser.profile,
    })

    await validateUser.save()
    const data = validateUser

    return response.ok({
      message: 'Users Update successfully',
      data: data,
    })
    // const payload = await request.validateUsing(validator)
    // teacherStaff.merge({
    //   ...payload,
    // })

    // const userDatum = await teacherStaff.related('userData').query().firstOrFail()
    // const { dob, address, phone, subDistrict, city, province, postalCode, ...adminPayload } =
    //   payload
    // const userData = await UserDatum({
    //   dob: dob ?? null,
    //   address,
    //   phone,
    //   subDistrict,
    //   city,
    //   province,
    //   postalCode,
    // })

    // await teacherStaff.save()

    // return response.ok({
    //   message: 'Teacher staff updated successfully',
    //   data: teacherStaff,
    // })
    // } catch (error) {
    //   response.notFound('Teacher staff not found')
    // }
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
