'use client';

import { useQuery } from '@tanstack/react-query';
import { Package, FileText, Hash, Ticket } from 'lucide-react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { productsService } from '@/services/products';
import { contractsService } from '@/services/contracts';
import { serialsService } from '@/services/serials';
import { ticketsService } from '@/services/tickets';

function StatCard({ title, value, icon: Icon, color }: {
  title: string;
  value: number | string;
  icon: any;
  color: string;
}) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-lg font-medium text-gray-900">
                {value}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardContent() {
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsService.getAll(),
  });

  const { data: contracts = [] } = useQuery({
    queryKey: ['contracts'],
    queryFn: contractsService.getAll,
  });

  const { data: serials = [] } = useQuery({
    queryKey: ['serials'],
    queryFn: serialsService.getAll,
  });

  const { data: tickets = [] } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => ticketsService.getAll(),
  });

  const openTickets = tickets.filter(ticket => ticket.status === 'OPEN').length;
  const activeWarranties = serials.filter(serial => serial.warrantyStatus === 'ACTIVE').length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Tổng quan hệ thống quản lý bảo hành
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng sản phẩm"
          value={products.length}
          icon={Package}
          color="text-blue-600"
        />
        <StatCard
          title="Hợp đồng"
          value={contracts.length}
          icon={FileText}
          color="text-green-600"
        />
        <StatCard
          title="Bảo hành đang hoạt động"
          value={activeWarranties}
          icon={Hash}
          color="text-yellow-600"
        />
        <StatCard
          title="Tickets mở"
          value={openTickets}
          icon={Ticket}
          color="text-red-600"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Tickets gần đây
          </h3>
          <div className="space-y-3">
            {tickets.slice(0, 5).map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{ticket.title}</p>
                  <p className="text-xs text-gray-500">{ticket.customerName}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  ticket.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                  ticket.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {ticket.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Bảo hành sắp hết hạn
          </h3>
          <div className="space-y-3">
            {serials
              .filter(serial => {
                const endDate = new Date(serial.warrantyEndDate);
                const now = new Date();
                const diffTime = endDate.getTime() - now.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 30 && diffDays > 0;
              })
              .slice(0, 5)
              .map((serial) => {
                const endDate = new Date(serial.warrantyEndDate);
                const now = new Date();
                const diffTime = endDate.getTime() - now.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={serial.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{serial.serialNumber}</p>
                      <p className="text-xs text-gray-500">{serial.product?.name}</p>
                    </div>
                    <span className="text-xs text-orange-600 font-medium">
                      {diffDays} ngày
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
}