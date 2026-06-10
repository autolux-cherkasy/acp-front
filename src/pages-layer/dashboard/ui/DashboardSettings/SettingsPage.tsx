"use client";

import { useForm } from "react-hook-form";
import DashboardPageHeader from "@/src/widgets/AdminComp/ui/Header/DashboardPageHeader";
import styles from "./SettingsPage.module.css";
import { Button, DashboardCard, useI18n } from "@/src/shared";
import InputWithLabel from "@/src/shared/ui/InputWithLabel/InputWithLabel";
import { getCompanyFields, type CompanyForm } from "./types";
import * as Switch from "@radix-ui/react-switch";
import { useState } from "react";

const MOCK_COMPANY: CompanyForm = {
  name: "Автолюкс Черкаси-Плюс",
  phone1: "+38097 480 24 28",
  phone2: "+38093 966 09 40",
  phone3: "+38099 078 20 21",
  email: "busautolux777@gmail.com",
  managerName: "Петренко Сергій Володимирович",
  managerPhone: "+38097 357 25 94",
  managerEmail: "petrenkos_v@gmail.com",
};

const MOCK_TABS = [
  { name: "routes", value: true },
  { name: "fleet", value: false },
  { name: "staff", value: false },
  { name: "cafe", value: false },
] as const;

const DashboardSettingsPage = () => {
  const { t } = useI18n();
  const {
    register,
    formState: { isDirty },
    reset,
  } = useForm<CompanyForm>({ defaultValues: MOCK_COMPANY });

  const [modules, setModules] = useState(
    Object.fromEntries(MOCK_TABS.map((tab) => [tab.name, tab.value])),
  );
  const fields = getCompanyFields(t);

  return (
    <div className={styles.mainContainer}>
      <DashboardPageHeader title={t("dispatcherArea.sidebar.menu.settings")} />

      <div className={styles.infoContainer}>
        <DashboardCard
          className={styles.card}
          title={t("dispatcherArea.settingsCards.company.title")}
        >
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
                onClick={() => {
                  reset();
                }}
                disabled={!isDirty}
              />
              <Button
                text={t("common.actions.save")}
                variant="primary"
                onClick={() => {}}
                disabled={!isDirty}
              />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          className={styles.card}
          style={{ height: "fit-content" }}
          title={t("dispatcherArea.settingsCards.dataAccess.title")}
        >
          <ul className={(styles.inputsContainer, styles.formSection)}>
            {MOCK_TABS.map((tab) => (
              <li key={tab.name} className={styles.modulesItem}>
                <span>{t(`dispatcherArea.settingsCards.dataMgmt.tabs.${tab.name}`)}</span>
                <Switch.Root
                  name={tab.name}
                  checked={modules[tab.name]}
                  className={styles.switchRoot}
                  onCheckedChange={(checked) =>
                    setModules((prev) => ({ ...prev, [tab.name]: checked }))
                  }
                >
                  <Switch.Thumb className={styles.switchThumb} />
                </Switch.Root>
              </li>
            ))}
          </ul>
        </DashboardCard>
      </div>
    </div>
  );
};

export default DashboardSettingsPage;
