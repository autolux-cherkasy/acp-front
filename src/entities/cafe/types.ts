export type CafeItemResponse = {
  id: string;
  name: string;
  price: number;
  displayOrder: number;
};

export type CafeItemGroup = {
  note: string | null;
  items: CafeItemResponse[];
};
export type CafeCategoryResponse = {
  id: string;
  name: string;
  displayOrder: number;
  groups: CafeItemGroup[];
};

export type CafeMenuResponse = {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  imageUrl?: string | null;
  categories: CafeCategoryResponse[];
};
