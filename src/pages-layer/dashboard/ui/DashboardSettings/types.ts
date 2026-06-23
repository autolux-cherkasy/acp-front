export type CompanyForm = {
  name: string;
  phone1: string;
  phone2: string;
  phone3: string;
  email: string;
  managerName: string;
  managerPhone: string;
  managerEmail: string;
};

export type ModulePermissions = {
  routes: boolean;
  fleet: boolean;
  staff: boolean;
  cafe: boolean;
};

export type SingleField = {
  type: "single";
  key: keyof CompanyForm;
  label: string;
  placeholder: string;
};

export type RowField = {
  type: "row";
  fields: Omit<SingleField, "type">[];
};

export type FieldConfig = SingleField | RowField;

type TFunction = (key: string) => string;

export function getCompanyFields(t: TFunction): FieldConfig[] {
  return [
    {
      type: "single",
      key: "name",
      label: t("dispatcherArea.settingsCards.company.fields.name"),
      placeholder: t("dispatcherArea.settingsCards.company.placeholders.name"),
    },
    {
      type: "row",
      fields: [
        {
          key: "phone1",
          label: t("dispatcherArea.settingsCards.company.fields.phone1"),
          placeholder: t("profile.placeholders.phone"),
        },
        {
          key: "phone2",
          label: t("dispatcherArea.settingsCards.company.fields.phone2"),
          placeholder: t("profile.placeholders.phone"),
        },
        {
          key: "phone3",
          label: t("dispatcherArea.settingsCards.company.fields.phone3"),
          placeholder: t("profile.placeholders.phone"),
        },
      ],
    },
    {
      type: "single",
      key: "email",
      label: t("profile.fields.email"),
      placeholder: t("profile.placeholders.email"),
    },
    {
      type: "single",
      key: "managerName",
      label: t("dispatcherArea.settingsCards.company.fields.manager"),
      placeholder: t("dispatcherArea.settingsCards.company.placeholders.managerName"),
    },
    {
      type: "single",
      key: "managerPhone",
      label: t("profile.fields.phone"),
      placeholder: t("profile.placeholders.phone"),
    },
    {
      type: "single",
      key: "managerEmail",
      label: t("profile.fields.email"),
      placeholder: t("profile.placeholders.email"),
    },
  ];
}
