export default interface BasketItem {
  id: string | number;
  unitCost: number;
  title: string;
  image: string;
  quantity: number;
  subTotal: number;
}
