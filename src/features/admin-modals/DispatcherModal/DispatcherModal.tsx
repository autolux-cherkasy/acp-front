"use client";

import { useForm } from "react-hook-form";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import AdminModalFrame from "@/src/shared/ui/AdminModalFrame/AdminModalFrame";
import InputWithLabel from "@/src/shared/ui/InputWithLabel/InputWithLabel";

type DispatcherFormState = {
  name: string;
  phone: string;
  email: string;
};

type DispatcherModalProps = {
  mode: "create" | "edit";
  onClose: () => void;
  onSubmit: (data: DispatcherFormState) => void;
  onDelete?: () => void;
  initialData?: Partial<DispatcherFormState>;
};

export default function DispatcherModal({
  mode,
  onClose,
  onSubmit,
  onDelete,
  initialData,
}: DispatcherModalProps) {
  const { t } = useI18n();

  const { register, handleSubmit } = useForm<DispatcherFormState>({
    defaultValues: {
      name: initialData?.name ?? "",
      phone: initialData?.phone ?? "",
      email: initialData?.email ?? "",
    },
  });

  const title =
    mode === "create"
      ? t("dispatcherArea.dataMgmt.dispatcherModal.newTitle")
      : t("dispatcherArea.dataMgmt.dispatcherModal.editTitle");

  return (
    <AdminModalFrame
      mode={mode}
      title={title}
      icon="/icons/avatar.svg"
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      onDelete={onDelete}
      deleteSubject={t("common.confirmDelete.targets.dispatcher")}
    >
      <InputWithLabel
        label={t("dispatcherArea.dataMgmt.dispatcherModal.nameLabel")}
        placeholder={t("dispatcherArea.dataMgmt.dispatcherModal.namePlaceholder")}
        {...register("name")}
      />
      <InputWithLabel
        label={t("dispatcherArea.dataMgmt.dispatcherModal.phoneLabel")}
        placeholder={t("dispatcherArea.dataMgmt.dispatcherModal.phonePlaceholder")}
        {...register("phone")}
      />
      <InputWithLabel
        label={t("dispatcherArea.dataMgmt.dispatcherModal.emailLabel")}
        placeholder={t("dispatcherArea.dataMgmt.dispatcherModal.emailPlaceholder")}
        {...register("email")}
      />
    </AdminModalFrame>
  );
}
