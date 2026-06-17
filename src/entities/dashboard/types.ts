export type CafeItemResponse = {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: number;
  displayOrder: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt?: Date;
};

export type CafeCategoryResponse = {
  id: string;
  sectionId: string;
  name: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
};

export type CafeCategoryWithItemsResponse = CafeCategoryResponse & {
  items: CafeItemResponse[];
};

export type CafeSectionResponse = {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
};

export type CafeSectionWithCategoriesResponse = CafeSectionResponse & {
  categories: CafeCategoryWithItemsResponse[];
};
