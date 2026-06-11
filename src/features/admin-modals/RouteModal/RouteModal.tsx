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
  icon?: string;
  titles?: { create: string; edit: string };
  labels?: { create: string; edit: string };
  placeholder?: string;
};

export default function RouteModal({
  mode,
  onClose,
  onSubmit,
  onDelete,
  initialData,
  icon = "/icons/workspace/sidebar/routes.svg",
  titles,
  labels,
  placeholder,
}: RouteModalProps) {
  const { t } = useI18n();

  const { register, handleSubmit } = useForm<RouteFormState>({
    defaultValues: {
      name: initialData?.name ?? "",
    },
  });

  const title =
    mode === "create"
      ? (titles?.create ?? t("dispatcherArea.dataMgmt.routeModal.newTitle"))
      : (titles?.edit ?? t("dispatcherArea.dataMgmt.routeModal.editTitle"));

  const label =
    mode === "create"
      ? (labels?.create ?? t("dispatcherArea.dataMgmt.routeModal.addLabel"))
      : (labels?.edit ?? t("dispatcherArea.dataMgmt.routeModal.editLabel"));

  return (
    <AdminModalFrame
      mode={mode}
      title={title}
      icon={icon}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      onDelete={onDelete}
    >
      <InputWithLabel
        label={label}
        placeholder={placeholder ?? t("dispatcherArea.dataMgmt.routeModal.placeholder")}
        {...register("name")}
      />
    </AdminModalFrame>
  );
}
