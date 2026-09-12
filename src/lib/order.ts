export interface OrderItemInput {
  product: Product;
  options: Array<Option>;
  count: number;
  observation?: string;
}

export interface OrderItem extends OrderItemInput {
  total: number;
}

export interface Order {
  items: Array<OrderItem>;
  total: number;
}

const getOptionPrice = (option: Option): number =>
  (option.price ?? 0) * option.count;

export function calculateOrderItemTotal(item: OrderItemInput): number {
  const optionsTotal = item.options.reduce(
    (total, option) => total + getOptionPrice(option),
    0,
  );

  return (item.product.price + optionsTotal) * item.count;
}

export function createOrderItem(input: OrderItemInput): OrderItem {
  const options = input.options.filter(option => option.count > 0);
  const item = { ...input, options };

  return { ...item, total: calculateOrderItemTotal(item) };
}

export function updateOrderItemQuantity(
  item: OrderItem,
  count: number,
): OrderItem {
  return createOrderItem({ ...item, count });
}

export function calculateOrderTotal(items: Array<OrderItem>): number {
  return items.reduce((total, item) => total + item.total, 0);
}

export function createOrder(items: Array<OrderItem>): Order {
  return { items, total: calculateOrderTotal(items) };
}
