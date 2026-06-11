"use client";

import { useForm } from "react-hook-form";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import AdminModalFrame from "@/src/shared/ui/AdminModalFrame/AdminModalFrame";
import InputWithLabel from "@/src/shared/ui/InputWithLabel/InputWithLabel";

type RouteFormState = {
  name: string;
};

type RouteModalProps = {
  mode: "create" | "edit";
  onClose: () => void;
  onSubmit: (data: RouteFormState) => void;
  onDelete?: () => void;
  initialData?: Partial<RouteFormState>;
};

export default function RouteModal({
  mode,
  onClose,
  onSubmit,
  onDelete,
  initialData,
}: RouteModalProps) {
  const { t } = useI18n();

  const { register, handleSubmit } = useForm<RouteFormState>({
    defaultValues: {
      name: initialData?.name ?? "",
    },
  });

  const title =
    mode === "create"
      ? t("dispatcherArea.dataMgmt.routeModal.newTitle")
      : t("dispatcherArea.dataMgmt.routeModal.editTitle");

  const label =
    mode === "create"
      ? t("dispatcherArea.dataMgmt.routeModal.addLabel")
      : t("dispatcherArea.dataMgmt.routeModal.editLabel");

  return (
    <AdminModalFrame
      mode={mode}
      title={title}
      icon="/icons/workspace/sidebar/routes.svg"
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      onDelete={onDelete}
    >
      <InputWithLabel
        label={label}
        placeholder={t("dispatcherArea.dataMgmt.routeModal.placeholder")}
        {...register("name")}
      />
    </AdminModalFrame>
  );
}
