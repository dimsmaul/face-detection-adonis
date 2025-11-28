import Schedule from '#models/schedule'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import * as XLSX from 'xlsx'
import fs from 'node:fs'
import dayjs from 'dayjs'
import { DateTime } from 'luxon'

export default class SchedulesController {
  async show({ params, response }: HttpContext) {
    const date = params.date
    const schedule = await User.query()
      .whereHas('attendances', (attendanceQuery) => {
        attendanceQuery.where('date', date)
      })
      .preload('attendances', (attendanceQuery) => {
        attendanceQuery.where('date', date)
      })
      .first()

    if (!schedule) {
      return response.status(404).json({ message: 'Schedule not found' })
    }
    return response.ok({
      message: 'Schedule fetched successfully',
      data: schedule,
    })
  }
  async showId({ params, response }: HttpContext) {
    const id = params.id
    const schedule = await Schedule.findByOrFail('id', id)
    if (!schedule) {
      return response.status(404).json({ message: 'Schedule not found' })
    }
    return response.ok({
      message: 'Schedule fetched successfully',
      data: schedule,
    })
  }

  async store({ request, response }: HttpContext) {
    const body = request.only(['date', 'time', 'type'])

    // validate same date
    const existingSchedule = await Schedule.query().where('date', body.date).first()
    if (existingSchedule) {
      return response.status(400).json({ message: 'Schedule for this date already exists' })
    }

    const schedule = await Schedule.create(body)
    return response.created({
      message: 'Schedule created successfully',
      data: schedule,
    })
  }

  async upload({ request, response }: HttpContext) {
    try {
      // Get the uploaded file
      const file = request.file('file', {
        size: '10mb',
        extnames: ['xlsx', 'xls'],
      })

      if (!file) {
        return response.status(400).json({ message: 'No file uploaded' })
      }

      if (!file.isValid) {
        return response.status(400).json({ message: file.errors[0].message })
      }

      // Read the Excel file from the temporary path
      const buffer = fs.readFileSync(file.tmpPath!)
      const workbook = XLSX.read(buffer, { type: 'buffer' })

      // Get the first sheet
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]

      // Read data starting from row 4 (A4, B4, C4)
      // Convert sheet to JSON with header starting at row 3 (A3, B3, C3)
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        range: 3, // Start reading from row 4 (0-indexed, so row 3)
        header: ['date', 'time', 'type'],
        raw: false,
      })

      if (!jsonData || jsonData.length === 0) {
        return response.status(400).json({ message: 'No data found in the file' })
      }

      // Validate and save data
      const savedSchedules = []
      const errors = []

      let rowIndex = 4 // Starting row in Excel
      for (const item of jsonData) {
        const row = item as any

        // Skip empty rows
        if (!row.date && !row.time && !row.type) {
          rowIndex++
          continue
        }

        // Validate required fields
        if (!row.date || !row.time || !row.type) {
          errors.push({
            row: rowIndex,
            error: 'Missing required fields (date, time, or type)',
            data: row,
          })
          rowIndex++
          continue
        }

        // Validate type
        if (row.type !== 'Off' && row.type !== 'On') {
          errors.push({
            row: rowIndex,
            error: 'Type must be either "Off" or "On"',
            data: row,
          })
          rowIndex++
          continue
        }

        try {
          const formatDate = dayjs(row.date).format('YYYY-MM-DD')
          const newdate: DateTime<boolean> = DateTime.fromISO(formatDate)
          // Check if schedule for this date already exists
          const existingSchedule = await Schedule.query().where('date', formatDate).first()

          if (existingSchedule) {
            errors.push({
              row: rowIndex,
              error: 'Schedule for this date already exists',
              data: row,
            })
            rowIndex++
            continue
          }

          // Create schedule
          const schedule = await Schedule.create({
            date: newdate,
            time: row.time,
            type: row.type.toLowerCase(),
          })

          savedSchedules.push(schedule)
        } catch (error) {
          errors.push({
            row: rowIndex,
            error: error.message,
            data: row,
          })
        }
        rowIndex++
      }

      return response.ok({
        message: 'File processed successfully',
        data: {
          savedCount: savedSchedules.length,
          errorCount: errors.length,
          schedules: savedSchedules,
          errors: errors.length > 0 ? errors : undefined,
        },
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Failed to process file',
        error: error.message,
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    const body = request.only(['date', 'time', 'type'])

    const schedule = await Schedule.find(params.id)
    if (!schedule) {
      return response.status(404).json({ message: 'Schedule not found' })
    }

    // validate same date
    const existingSchedule = await Schedule.query()
      .where('date', body.date)
      .andWhere('id', '!=', params.id)
      .first()
    if (existingSchedule) {
      return response.status(400).json({ message: 'Schedule for this date already exists' })
    }

    schedule.date = body.date
    schedule.time = body.time
    schedule.type = body.type
    await schedule.save()

    return response.ok({
      message: 'Schedule updated successfully',
      data: schedule,
    })
  }

  async destroy({ params, response }: HttpContext) {
    const schedule = await Schedule.find(params.id)
    if (!schedule) {
      return response.status(404).json({ message: 'Schedule not found' })
    }

    await schedule.delete()
    return response.ok({ message: 'Schedule deleted successfully' })
  }
}
