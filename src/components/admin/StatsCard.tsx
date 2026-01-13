// src/components/admin/StatsCard.tsx
import { StatsCardProps } from '@/types'
import Link from 'next/link'

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  href,
  loading,
}: StatsCardProps) {
  const colorClasses = {
    blue: 'from-blue-600 to-blue-400',
    purple: 'from-purple-600 to-purple-400',
    green: 'from-green-600 to-green-400',
    red: 'from-red-600 to-red-400',
  }

  const content = (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}
        >
          <Icon className="text-white" size={24} />
        </div>
        <div className="text-3xl font-bold">
          {loading ? (
            <div className="w-16 h-8 bg-gray-800 animate-pulse rounded" />
          ) : (
            value
          )}
        </div>
      </div>
      <h3 className="text-gray-400 text-sm font-medium group-hover:text-white transition-colors">
        {title}
      </h3>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}