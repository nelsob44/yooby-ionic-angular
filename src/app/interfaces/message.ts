export interface Message {
  id: string;
  messageFrom: string;
  messageTo: string;
  messageDetails: string;
  messageImages: [string];
  messageRead: boolean;
  messageTime: string;
}
