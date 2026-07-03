"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import AdminModalFrame from "@/src/shared/ui/AdminModalFrame/AdminModalFrame";
import InputWithLabel from "@/src/shared/ui/InputWithLabel/InputWithLabel";
import ImageUploadField from "@/src/shared/ui/ImageUploadField/ImageUploadField";

type RouteFormState = {
  name: string;
  departureCity: string;
  arrivalCity: string;
};

type RouteModalProps = {
  mode: "create" | "edit";
  onClose: () => void;
  onSubmit: (data: RouteFormState & { imageFile?: File }) => void;
  onDelete?: () => void;
  initialData?: Partial<RouteFormState & { imageUrl?: string }>;
  showImage?: boolean;
  showTwoCities?: boolean;
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
  showImage,
  showTwoCities,
  icon = "/icons/workspace/sidebar/routes.svg",
  titles,
  labels,
  placeholder,
}: RouteModalProps) {
  const { t } = useI18n();
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);

  const { register, handleSubmit } = useForm<RouteFormState>({
    defaultValues: {
      name: initialData?.name ?? "",
      departureCity: initialData?.departureCity ?? "",
      arrivalCity: initialData?.arrivalCity ?? "",
    },
  });

  const submitHandler = useCallback(
    (data: RouteFormState) => {
      onSubmit({ ...data, imageFile });
    },
    [onSubmit, imageFile],
  );

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
      onSubmit={handleSubmit(submitHandler)}
      onDelete={onDelete}
    >
      {showTwoCities ? (
        <>
          <InputWithLabel
            label={t("dispatcherArea.dataMgmt.routeModal.departureCityLabel")}
            placeholder={t("dispatcherArea.dataMgmt.routeModal.cityPlaceholder")}
            {...register("departureCity")}
          />
          <InputWithLabel
            label={t("dispatcherArea.dataMgmt.routeModal.arrivalCityLabel")}
            placeholder={t("dispatcherArea.dataMgmt.routeModal.cityPlaceholder")}
            {...register("arrivalCity")}
          />
        </>
      ) : (
        <InputWithLabel
          label={label}
          placeholder={placeholder ?? t("dispatcherArea.dataMgmt.routeModal.placeholder")}
          {...register("name")}
        />
      )}
      {showImage && (
        <ImageUploadField
          initialUrl={initialData?.imageUrl}
          addLabel={t("dispatcherArea.dataMgmt.cafeCategoryModal.addPhoto")}
          changeLabel={t("dispatcherArea.dataMgmt.cafeCategoryModal.changePhoto")}
          onChange={(file) => setImageFile(file)}
        />
      )}
    </AdminModalFrame>
  );
}
