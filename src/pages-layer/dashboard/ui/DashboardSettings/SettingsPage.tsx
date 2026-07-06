"use client";

import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import DashboardPageHeader from "@/src/widgets/AdminComp/ui/Header/DashboardPageHeader";
import styles from "./SettingsPage.module.css";
import { Button, DashboardCard, useI18n } from "@/src/shared";
import InputWithLabel from "@/src/shared/ui/InputWithLabel/InputWithLabel";
import { getCompanyFields, type CompanyForm, type ModulePermissions } from "./types";
import { formatPhone, unformatPhone } from "@/src/shared/lib/formatters";
import * as Switch from "@radix-ui/react-switch";
import {
  useCompanySettingsQuery,
  usePermissionsQuery,
  useUpdateCompanyMutation,
  useUpdatePermissionsMutation,
} from "@/src/entities/dashboard/api/useSettingsQueries";

const MODULE_KEY_MAP: Record<keyof ModulePermissions, string> = {
  routes: "canAccessRoutes",
  fleet: "canAccessFleet",
  staff: "canAccessStaff",
  cafe: "canAccessCafe",
} as const;

const MODULE_NAMES: (keyof ModulePermissions)[] = ["routes", "fleet", "staff", "cafe"];

const DashboardSettingsPage = () => {
  const { t } = useI18n();

  const companyQuery = useCompanySettingsQuery();
  const permissionsQuery = usePermissionsQuery();
  const updateCompanyMutation = useUpdateCompanyMutation();
  const updatePermissionsMutation = useUpdatePermissionsMutation();

  const {
    register,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm<CompanyForm>({
    defaultValues: {
      name: "",
      phone1: "",
      phone2: "",
      phone3: "",
      email: "",
      managerName: "",
      managerPhone: "",
      managerEmail: "",
    },
  });

  useEffect(() => {
    if (companyQuery.data) {
      const d = companyQuery.data;
      reset({
        name: d.name,
        phone1: formatPhone(d.phone1),
        phone2: formatPhone(d.phone2),
        phone3: formatPhone(d.phone3),
        email: d.email,
        managerName: d.managerName,
        managerPhone: formatPhone(d.managerPhone),
        managerEmail: d.managerEmail ?? "",
      });
    }
  }, [companyQuery.data, reset]);

  const modules: ModulePermissions = permissionsQuery.data
    ? {
        routes: permissionsQuery.data.canAccessRoutes,
        fleet: permissionsQuery.data.canAccessFleet,
        staff: permissionsQuery.data.canAccessStaff,
        cafe: permissionsQuery.data.canAccessCafe,
      }
    : { routes: false, fleet: false, staff: false, cafe: false };

  const fields = getCompanyFields(t);
  const isLoading = companyQuery.isPending || permissionsQuery.isPending;
  const isSaving = updateCompanyMutation.isPending;

  const onSubmit: SubmitHandler<CompanyForm> = async (data) => {
    try {
      const payload = {
        ...data,
        phone1: unformatPhone(data.phone1),
        phone2: unformatPhone(data.phone2),
        phone3: unformatPhone(data.phone3),
        managerPhone: unformatPhone(data.managerPhone),
      };
      const updated = await updateCompanyMutation.mutateAsync(payload);
      reset({
        name: updated.name,
        phone1: formatPhone(updated.phone1),
        phone2: formatPhone(updated.phone2),
        phone3: formatPhone(updated.phone3),
        email: updated.email,
        managerName: updated.managerName,
        managerPhone: formatPhone(updated.managerPhone),
        managerEmail: updated.managerEmail ?? "",
      });
    } catch {
    }
  };

  const handleModuleToggle = async (name: keyof ModulePermissions, checked: boolean) => {
    try {
      await updatePermissionsMutation.mutateAsync({
        [MODULE_KEY_MAP[name]]: checked,
      });
    } catch {
    }
  };

  return (
    <div className={styles.mainContainer}>
      <DashboardPageHeader title={t("dispatcherArea.sidebar.menu.settings")} />

      <div className={styles.infoContainer}>
        <DashboardCard
          className={styles.card}
          style={isLoading ? { minHeight: 620 } : undefined}
          title={t("dispatcherArea.settingsCards.company.title")}
        >
          {isLoading ? (
            <div className={styles.inputsContainer}>
              <div className={styles.formSection}>
                <div className={styles.fieldSkeleton} />
                <div className={styles.phoneRow}>
                  <div className={styles.fieldSkeleton} />
                  <div className={styles.fieldSkeleton} />
                  <div className={styles.fieldSkeleton} />
                </div>
                <div className={styles.fieldSkeleton} />
                <div className={styles.fieldSkeleton} />
                <div className={styles.fieldSkeleton} />
                <div className={styles.fieldSkeleton} />
              </div>
              <div className={styles.buttonsCont}>
                <div className={styles.buttonSkeleton} />
                <div className={styles.buttonSkeleton} />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.inputsContainer}>
                <div className={styles.formSection}>
                  {fields.map((config, i) => {
                    if (config.type === "row") {
                      return (
                        <div key={i} className={styles.phoneRow}>
                          {config.fields.map((field) => (
                            <InputWithLabel
                              key={field.key}
                              label={field.label}
                              placeholder={field.placeholder}
                              {...register(field.key)}
                            />
                          ))}
                        </div>
                      );
                    }

                    return (
                      <InputWithLabel
                        key={config.key}
                        label={config.label}
                        placeholder={config.placeholder}
                        {...register(config.key)}
                      />
                    );
                  })}
                </div>

                <div className={styles.buttonsCont}>
                  <Button
                    text={t("common.actions.cancel")}
                    variant="secondary"
                    type="button"
                    onClick={() => reset()}
                    disabled={!isDirty || isSaving}
                  />
                  <Button
                    text={t("common.actions.save")}
                    variant="primary"
                    type="submit"
                    disabled={!isDirty || isSaving}
                  />
                </div>
              </div>
            </form>
          )}
        </DashboardCard>

        <DashboardCard
          className={styles.card}
          style={isLoading ? { minHeight: 280 } : { height: "fit-content" }}
          title={t("dispatcherArea.settingsCards.dataAccess.title")}
        >
          {isLoading ? (
            <ul className={(styles.inputsContainer, styles.formSection)}>
              {MODULE_NAMES.map((name) => (
                <li key={name} className={styles.modulesItem}>
                  <div className={styles.labelSkeleton} />
                  <div className={styles.switchSkeleton} />
                </li>
              ))}
            </ul>
          ) : (
            <ul className={(styles.inputsContainer, styles.formSection)}>
              {MODULE_NAMES.map((name) => (
                <li key={name} className={styles.modulesItem}>
                  <span>{t(`dispatcherArea.dataMgmt.tabs.${name}`)}</span>
                  <Switch.Root
                    name={name}
                    checked={modules[name]}
                    className={styles.switchRoot}
                    disabled={updatePermissionsMutation.isPending}
                    onCheckedChange={(checked) => handleModuleToggle(name, checked)}
                  >
                    <Switch.Thumb className={styles.switchThumb} />
                  </Switch.Root>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>
      </div>
    </div>
  );
};

export default DashboardSettingsPage;
