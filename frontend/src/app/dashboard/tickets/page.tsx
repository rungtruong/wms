'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketsService } from '@/services/tickets';
import { Ticket, CreateTicketRequest, UpdateTicketRequest, TicketPriority, TicketStatus, TicketComment } from '@/types';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Plus, Search, Edit, Trash2, MessageCircle, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const ticketSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.nativeEnum(TicketPriority),
  status: z.nativeEnum(TicketStatus),
  serialId: z.string().min(1, 'Serial ID is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Invalid email'),
  customerPhone: z.string().optional(),
});

const commentSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
  authorName: z.string().min(1, 'Author name is required'),
  authorEmail: z.string().email('Invalid email').optional(),
});

type TicketFormData = z.infer<typeof ticketSchema>;
type CommentFormData = z.infer<typeof commentSchema>;

export default function TicketsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | ''>('');
  const queryClient = useQueryClient();

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets', statusFilter, priorityFilter],
    queryFn: () => ticketsService.getAll(statusFilter || undefined, priorityFilter || undefined),
  });

  const { data: comments = [], isLoading: isLoadingComments } = useQuery({
    queryKey: ['ticket-comments', selectedTicket?.id],
    queryFn: () => selectedTicket ? ticketsService.getComments(selectedTicket.id) : Promise.resolve([]),
    enabled: !!selectedTicket,
  });

  const createMutation = useMutation({
    mutationFn: ticketsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setIsModalOpen(false);
      reset();
      toast.success('Ticket created successfully');
    },
    onError: () => {
      toast.error('Failed to create ticket');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTicketRequest }) =>
      ticketsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setIsModalOpen(false);
      setEditingTicket(null);
      reset();
      toast.success('Ticket updated successfully');
    },
    onError: () => {
      toast.error('Failed to update ticket');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ticketsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success('Ticket deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete ticket');
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: ({ ticketId, data }: { ticketId: string; data: CommentFormData }) =>
      ticketsService.addComment(ticketId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket-comments', selectedTicket?.id] });
      resetComment();
      toast.success('Comment added successfully');
    },
    onError: () => {
      toast.error('Failed to add comment');
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
  });

  const {
    register: registerComment,
    handleSubmit: handleSubmitComment,
    reset: resetComment,
    formState: { errors: commentErrors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = (data: TicketFormData) => {
    if (editingTicket) {
      updateMutation.mutate({ id: editingTicket.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const onSubmitComment = (data: CommentFormData) => {
    if (selectedTicket) {
      addCommentMutation.mutate({ ticketId: selectedTicket.id, data });
    }
  };

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    reset({
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      status: ticket.status,
      serialId: ticket.serialId,
      customerName: ticket.customerName,
      customerEmail: ticket.customerEmail,
      customerPhone: ticket.customerPhone || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this ticket?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewComments = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsCommentsModalOpen(true);
  };

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.HIGH:
        return 'bg-red-100 text-red-800';
      case TicketPriority.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case TicketPriority.LOW:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return 'bg-blue-100 text-blue-800';
      case TicketStatus.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-800';
      case TicketStatus.RESOLVED:
        return 'bg-green-100 text-green-800';
      case TicketStatus.CLOSED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return <AlertCircle className="h-4 w-4" />;
      case TicketStatus.IN_PROGRESS:
        return <Clock className="h-4 w-4" />;
      case TicketStatus.RESOLVED:
      case TicketStatus.CLOSED:
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <button
            onClick={() => {
              setEditingTicket(null);
              reset();
              setIsModalOpen(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Ticket
          </button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TicketStatus | '')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            {Object.values(TicketStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as TicketPriority | '')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">All Priority</option>
            {Object.values(TicketPriority).map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{ticket.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{ticket.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{ticket.customerName}</div>
                        <div className="text-sm text-gray-500">{ticket.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(ticket.status)}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewComments(ticket)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Comments"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(ticket)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ticket.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingTicket ? 'Edit Ticket' : 'Add New Ticket'}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    {...register('title')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      {...register('priority')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {Object.values(TicketPriority).map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      {...register('status')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {Object.values(TicketStatus).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serial ID
                  </label>
                  <input
                    {...register('serialId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {errors.serialId && (
                    <p className="text-red-500 text-sm mt-1">{errors.serialId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    {...register('customerName')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {errors.customerName && (
                    <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    {...register('customerEmail')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {errors.customerEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.customerEmail.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Phone
                  </label>
                  <input
                    {...register('customerPhone')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingTicket(null);
                      reset();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? 'Saving...'
                      : editingTicket
                      ? 'Update'
                      : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isCommentsModalOpen && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  Comments for: {selectedTicket.title}
                </h2>
                <button
                  onClick={() => {
                    setIsCommentsModalOpen(false);
                    setSelectedTicket(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {isLoadingComments ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No comments yet</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium text-gray-900">{comment.authorName}</span>
                          {comment.authorEmail && (
                            <span className="text-gray-500 text-sm ml-2">({comment.authorEmail})</span>
                          )}
                        </div>
                        <span className="text-gray-500 text-sm">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSubmitComment(onSubmitComment)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add Comment
                  </label>
                  <textarea
                    {...registerComment('content')}
                    rows={3}
                    placeholder="Enter your comment..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {commentErrors.content && (
                    <p className="text-red-500 text-sm mt-1">{commentErrors.content.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      {...registerComment('authorName')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    {commentErrors.authorName && (
                      <p className="text-red-500 text-sm mt-1">{commentErrors.authorName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Email (optional)
                    </label>
                    <input
                      type="email"
                      {...registerComment('authorEmail')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={addCommentMutation.isPending}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {addCommentMutation.isPending ? 'Adding...' : 'Add Comment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}