import cloudinary from "@/lib/cloudinary"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.formData()
    const file = body.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      stream.end(buffer)
    })

    const uploadResult = result as any

    return NextResponse.json(
      { success: true, url: uploadResult.secure_url },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Upload failed" },
      { status: 500 }
    )
  }
}