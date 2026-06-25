export type TableRow = (string | boolean)[];

export type SubSection = {
  groupLabel: string;
  columns: string[];
  ids: string[];
  rows: TableRow[];
};

export type DataSection = {
  id: string;
  title: string;
  imageUrl?: string;
  columns?: string[];
  rows?: TableRow[];
  subSections?: SubSection[];
};

export type TabMockData = {
  sections: DataSection[];
};

export const MOCK_ROUTES: TabMockData = {
  sections: [
    {
      id: "cherkasy-kharkiv",
      title: "м.Черкси - м.Харків",
      columns: ["Напрямок", "Час відправлення", "Час прибуття", "Ціна"],
      rows: [
        ["м.Черкаси - с.Бугаївка", "07:00", "08:50", "300 ₴"],
        ["м.Черкаси - м.Градизьк", "07:00", "09:00", "400 ₴"],
        ["м.Черкаси - м.Кременчук", "07:00", "09:45", "400 ₴"],
        ["м.Черкаси - м.Полтава", "07:00", "11:00", "667 ₴"],
        ["м.Черкаси - с.Валки", "07:00", "12:40", "950 ₴"],
        ["м.Черкаси - м.Харків", "07:00", "18:30", "950 ₴"],
      ],
    },
    {
      id: "kharkiv-cherkasy",
      title: "м.Харків - м.Черкаси",
      columns: ["Напрямок", "Час відправлення", "Час прибуття", "Ціна"],
      rows: [
        ["с.Бугаївка - м.Черкаси", "18:00", "20:00", "300 ₴"],
        ["м.Градизьк - м.Черкаси", "17:35", "20:00", "400 ₴"],
        ["м.Кременчук - м.Черкаси", "17:45", "20:00", "400 ₴"],
        ["м.Полтава - м.Черкаси", "16:00", "20:00", "667 ₴"],
        ["с.Валки - м.Черкаси", "14:40", "20:00", "950 ₴"],
        ["м.Харків - м.Черкаси", "14:00", "13:00", "950 ₴"],
      ],
    },
  ],
};

export const MOCK_FLEET: TabMockData = {
  sections: [
    {
      id: "bus",
      title: "Автобус",
      columns: ["Марка автобуса", "Місця", "Номер", "Водій"],
      rows: [
        ["Mercedes-Benz Sprinter", "18", "CA 5374 CO", "Березань Олег Васильович"],
        ["Mercedes-Benz Sprinter", "21", "CA 4512 AI", "Назаренко Петро Іванович"],
        ["Mercedes-Benz Sprinter", "21", "CA 2763 AI", "Лобода Сергій Вікторович"],
      ],
    },
  ],
};

export const MOCK_DATA_BY_TAB: Record<string, TabMockData> = {
  routes: MOCK_ROUTES,
  fleet: MOCK_FLEET,
};

export type ColumnDef = {
  key: string;
  label: string;
};

export const SECTION_COLUMNS: Record<string, ColumnDef[]> = {
  // cafe
  cafe: [
    { key: "name", label: "Вид" },
    { key: "isAvailable", label: "Наявність" },
    { key: "price", label: "Ціна" },
  ],
  // routes
  routes: [
    { key: "direction", label: "Напрямок" },
    { key: "departure", label: "Час відправлення" },
    { key: "arrival", label: "Час прибуття" },
    { key: "price", label: "Ціна" },
  ],
  // staff
  dispatchers: [
    { key: "fullName", label: "П.І.Б" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Телефон" },
  ],
  drivers: [
    { key: "fullName", label: "П.І.Б" },
    { key: "license", label: "Посвідчення водія до" },
    { key: "category", label: "Категорія" },
    { key: "phone", label: "Телефон" },
  ],
  // fleet
  fleet: [
    { key: "model", label: "Марка автобуса" },
    { key: "seats", label: "Місця" },
    { key: "number", label: "Номер" },
    { key: "driver", label: "Водій" },
  ],
};
