export type Library = {
  id: number;
  name: string;
  address: {
    street: string;
    postalCode: string;
  };
  availableBooks: number;
  totalBooks: number;
  checkLink: string;
};
