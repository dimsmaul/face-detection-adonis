import User from '#models/user'
import UserDatum from '#models/user_datum'
import type { HttpContext } from '@adonisjs/core/http'

export default class UserDataController {
  async create({ request, response }: HttpContext) {
    const { dob, address, phone, subDistrict, city, province, postalCode, userId } = request.only([
      'dob',
      'address',
      'phone',
      'subDistrict',
      'city',
      'province',
      'postalCode',
      'userId',
    ])

    try {
      const userData = await UserDatum.create({
        dob,
        address,
        phone,
        subDistrict,
        city,
        province,
        postalCode,
      })
      const user = await User.findOrFail(userId)

      // Simpan user_datum_id ke user
      user.userData.id = userData.id
      await user.save()

      return response.created({
        message: 'User data created successfully',
        data: userData,
      })
    } catch (error) {
      response.badRequest('Failed to create user data')
    }
  }

  async update({ params, request, response }: HttpContext) {
    const { id } = params
    const { dob, address, phone, subDistrict, city, province, postalCode } = request.only([
      'dob',
      'address',
      'phone',
      'subDistrict',
      'city',
      'province',
      'postalCode',
    ])

    try {
      const userData = await UserDatum.findOrFail(id)

      userData.merge({
        dob,
        address,
        phone,
        subDistrict,
        city,
        province,
        postalCode,
      })

      await userData.save()

      return response.ok({
        message: 'User data updated successfully',
        data: userData,
      })
    } catch (error) {
      response.badRequest('Failed to update user data')
    }
  }
}
