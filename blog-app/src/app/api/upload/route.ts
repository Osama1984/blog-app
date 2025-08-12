import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const uploadType = formData.get('type') as string // 'post', 'user', 'category'
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      )
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads', uploadType || 'general')
    
    // Create upload directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const uploadedFiles = []

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { success: false, error: `File ${file.name} is not an image` },
          { status: 400 }
        )
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: `File ${file.name} is too large (max 5MB)` },
          { status: 400 }
        )
      }

      // Generate unique filename
      const timestamp = Date.now()
      const fileExtension = file.name.split('.').pop()
      const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`
      
      // Convert file to buffer and save
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filePath = join(uploadDir, fileName)
      
      await writeFile(filePath, buffer)

      // Return the public URL
      const publicUrl = `/uploads/${uploadType || 'general'}/${fileName}`
      
      uploadedFiles.push({
        name: file.name,
        url: publicUrl,
        size: file.size,
        type: file.type
      })
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload files' },
      { status: 500 }
    )
  }
}
