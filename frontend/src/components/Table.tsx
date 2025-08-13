import { ReactNode } from 'react'

interface Column {
  key: string
  header: string
  render?: (value: any, row: any) => ReactNode
  className?: string
}

interface TableProps {
  columns: Column[]
  data: any[]
  onRowClick?: (row: any) => void
  emptyMessage?: string
  className?: string
}

export default function Table({ 
  columns, 
  data, 
  onRowClick, 
  emptyMessage = "Không tìm thấy dữ liệu nào phù hợp với tiêu chí tìm kiếm.",
  className = ""
}: TableProps) {
  return (
    <div className="table-container">
      <table className={`table ${className}`}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.className}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr 
                key={row.id || index} 
                className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} className={column.className}>
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center text-gray-500 py-8">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
