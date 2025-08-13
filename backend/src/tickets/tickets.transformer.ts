export class TicketsTransformer {
  static transformTicket(ticket: any) {
    if (!ticket) return ticket;

    const { productSerialId, assignedTo, ...cleanTicket } = ticket;
    
    return cleanTicket;
  }

  static transformTickets(tickets: any[]) {
    return tickets.map(ticket => this.transformTicket(ticket));
  }
}