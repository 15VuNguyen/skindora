export interface Message {
  id: string;
  isUser: boolean;
  text?: string;
  product?: {
    productName: string;
    brand: string;
    description: string;
    imageUrl: string;
    productUrl: string;
  };
  routine?: {
    title: string;
    am: string[];
    pm: string[];
  };
}
