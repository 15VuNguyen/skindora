import { OrderStatus, Role } from '~/constants/enums'

type TransitionMap = Record<OrderStatus, OrderStatus[]>

const baseTransitions: TransitionMap = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [OrderStatus.SHIPPING],
  [OrderStatus.SHIPPING]: [OrderStatus.DELIVERED, OrderStatus.FAILED],
  [OrderStatus.DELIVERED]: [OrderStatus.RETURNED],
  [OrderStatus.FAILED]: [OrderStatus.RETURNED],
  [OrderStatus.RETURNED]: [],
  [OrderStatus.CANCELLED]: []
}

const roleTransitions: Record<Role, TransitionMap> = {
  0: {
    [OrderStatus.PENDING]: [OrderStatus.CANCELLED],
    [OrderStatus.CONFIRMED]: [OrderStatus.CANCELLED],
    [OrderStatus.PROCESSING]: [],
    [OrderStatus.SHIPPING]: [],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.FAILED]: [],
    [OrderStatus.RETURNED]: [],
    [OrderStatus.CANCELLED]: []
  },
  1: {
    [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
    [OrderStatus.PROCESSING]: [OrderStatus.SHIPPING],
    [OrderStatus.SHIPPING]: [],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.CANCELLED]: [],
    [OrderStatus.RETURNED]: [],
    [OrderStatus.FAILED]: []
  },
  2: baseTransitions
}

export function getNextOrderStatus(currentStatus: OrderStatus): OrderStatus | null {
  return baseTransitions[currentStatus]?.[0] || null
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return baseTransitions[from]?.includes(to) ?? false
}

export function canRoleTransition(
  role: Role,
  from: OrderStatus,
  to: OrderStatus
): boolean {
  return roleTransitions[role]?.[from]?.includes(to) ?? false
}
