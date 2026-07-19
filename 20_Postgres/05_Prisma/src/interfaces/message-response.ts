export type MessageResponse<T = unknown> = {
  message: string;
  success?: boolean;
  data?: T; // Optional payload of any type
};
