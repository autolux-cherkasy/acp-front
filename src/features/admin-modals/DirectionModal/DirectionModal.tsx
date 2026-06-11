"use client";

import { useForm, Controller } from "react-hook-form";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import AdminModalFrame from "@/src/shared/ui/AdminModalFrame/AdminModalFrame";
import InputWithLabel from "@/src/shared/ui/InputWithLabel/InputWithLabel";
import SelectField, { type SelectOption } from "@/src/shared/ui/SelectField/SelectField";
import styles from "./DirectionModal.module.css";

type DirectionFormState = {
  route: string;
  place: string;
  departureTime: string;
  arrivalTime: string;
  price: string;
};

type DirectionModalProps = {
  mode: "create" | "edit";
  onClose: () => void;
  onSubmit: (data: DirectionFormState) => void;
  onDelete?: () => void;
  initialData?: Partial<DirectionFormState>;
  routeOptions?: SelectOption[];
  timeOptions?: SelectOption[];
};

export default function DirectionModal({
  mode,
  onClose,
  onSubmit,
  onDelete,
  initialData,
  routeOptions = [],
  timeOptions = [],
}: DirectionModalProps) {
  const { t } = useI18n();

  const { register, handleSubmit, control } = useForm<DirectionFormState>({
    defaultValues: {
      route: initialData?.route ?? "",
      place: initialData?.place ?? "",
      departureTime: initialData?.departureTime ?? "",
      arrivalTime: initialData?.arrivalTime ?? "",
      price: initialData?.price ?? "",
    },
  });

  const title =
    mode === "create"
      ? t("dispatcherArea.dataMgmt.directionModal.newTitle")
      : t("dispatcherArea.dataMgmt.directionModal.editTitle");

  return (
    <AdminModalFrame
      mode={mode}
      title={title}
      icon="/icons/workspace/sidebar/routes.svg"
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      onDelete={onDelete}
    >
      <div className={styles.fieldWithLabel}>
        {mode === "edit" && (
          <span className={styles.fieldLabel}>
            {t("dispatcherArea.dataMgmt.directionModal.routeLabel")}
          </span>
        )}
        <Controller
          control={control}
          name="route"
          render={({ field }) => (
            <SelectField
              value={field.value}
              options={routeOptions}
              onChange={field.onChange}
              placeholder={t("dispatcherArea.dataMgmt.directionModal.routePlaceholder")}
            />
          )}
        />
      </div>

      <InputWithLabel
        label={t("dispatcherArea.dataMgmt.directionModal.placeLabel")}
        placeholder={t("dispatcherArea.dataMgmt.directionModal.placePlaceholder")}
        {...register("place")}
      />

      <div className={styles.row}>
        <div className={styles.fieldWithLabel}>
          <span className={styles.fieldLabel}>
            {t("dispatcherArea.dataMgmt.directionModal.departureTime")}
          </span>
          <Controller
            control={control}
            name="departureTime"
            render={({ field }) => (
              <SelectField
                value={field.value}
                options={timeOptions}
                onChange={field.onChange}
                placeholder="00:00"
              />
            )}
          />
        </div>

        <InputWithLabel
          label={t("dispatcherArea.dataMgmt.directionModal.arrivalTime")}
          placeholder="00:00"
          {...register("arrivalTime")}
        />

        <InputWithLabel
          label={t("dispatcherArea.dataMgmt.directionModal.priceLabel")}
          placeholder={t("dispatcherArea.dataMgmt.directionModal.pricePlaceholder")}
          {...register("price")}
        />
      </div>
    </AdminModalFrame>
  );
}
