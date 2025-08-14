import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { serialsService } from '@/lib/services/serials'
import { Serial, CreateSerialDto, UpdateSerialDto, SerialFilters } from '@/types/serial'
import { toast } from 'sonner'

const QUERY_KEYS = {
  serials: ['serials'] as const,
  serial: (id: string) => ['serials', id] as const,
  serialByNumber: (serialNumber: string) => ['serials', 'number', serialNumber] as const,
  serialsByCustomer: (email: string) => ['serials', 'customer', email] as const,
}

export function useSerials(filters?: SerialFilters) {
  return useQuery({
    queryKey: [...QUERY_KEYS.serials, filters],
    queryFn: () => serialsService.getSerials(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useSerial(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.serial(id),
    queryFn: () => serialsService.getSerialById(id),
    enabled: !!id,
  })
}

export function useSerialByNumber(serialNumber: string) {
  return useQuery({
    queryKey: QUERY_KEYS.serialByNumber(serialNumber),
    queryFn: () => serialsService.getSerialByNumber(serialNumber),
    enabled: !!serialNumber,
  })
}

export function useSerialsByCustomer(email: string) {
  return useQuery({
    queryKey: QUERY_KEYS.serialsByCustomer(email),
    queryFn: () => serialsService.getSerialsByCustomerEmail(email),
    enabled: !!email,
  })
}

export function useCreateSerial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSerialDto) => serialsService.createSerial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.serials })
      toast.success('Serial đã được tạo thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi khi tạo serial: ${error.message}`)
    },
  })
}

export function useUpdateSerial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSerialDto }) =>
      serialsService.updateSerial(id, data),
    onSuccess: (updatedSerial) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.serials })
      queryClient.setQueryData(QUERY_KEYS.serial(updatedSerial.id), updatedSerial)
      toast.success('Serial đã được cập nhật thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi khi cập nhật serial: ${error.message}`)
    },
  })
}

export function useDeleteSerial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => serialsService.deleteSerial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.serials })
      toast.success('Serial đã được xóa thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi khi xóa serial: ${error.message}`)
    },
  })
}

export function useUpdateWarrantyStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, warrantyStatus }: { id: string; warrantyStatus: 'valid' | 'expired' | 'voided' }) =>
      serialsService.updateWarrantyStatus(id, warrantyStatus),
    onSuccess: (updatedSerial) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.serials })
      queryClient.setQueryData(QUERY_KEYS.serial(updatedSerial.id), updatedSerial)
      toast.success('Trạng thái bảo hành đã được cập nhật')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi khi cập nhật trạng thái bảo hành: ${error.message}`)
    },
  })
}