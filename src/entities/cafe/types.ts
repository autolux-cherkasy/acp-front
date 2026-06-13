export type CafeItemResponse = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  displayOrder: number;
};

export type CafeCategoryResponse = {
  id: string;
  name: string;
  displayOrder: number;
  items: CafeItemResponse[];
};

export type CafeMenuResponse = {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  imageUrl?: string | null;
  categories: CafeCategoryResponse[];
};
