'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function WMSPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/wms/dashboard')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Đang chuyển hướng...</p>
      </div>
    </div>
  )
}
