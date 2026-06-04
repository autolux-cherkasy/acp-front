"use client";

import { useState } from "react";
import DashboardPageHeader from "@/src/widgets/AdminComp/ui/Header/DashboardPageHeader";
import styles from "./SettingsPage.module.css";
import { Button, DashboardCard, useI18n } from "@/src/shared";
import InputWithLabel from "@/src/shared/ui/InputWithLabel/InputWithLabel";
import { getCompanyFields, type CompanyForm } from "./types";

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

const DashboardSettingsPage = () => {
  const { t } = useI18n();
  const [form, setForm] = useState<CompanyForm>(MOCK_COMPANY);

  function setField(field: keyof CompanyForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

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
                          value={form[field.key]}
                          onChange={(e) => setField(field.key, e.target.value)}
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
                    value={form[config.key]}
                    onChange={(e) => setField(config.key, e.target.value)}
                  />
                );
              })}
            </div>

            <div className={styles.buttonsCont}>
              <Button text={t("common.actions.edit")} variant="secondary" onClick={() => {}} />
              <Button text={t("common.actions.save")} variant="primary" onClick={() => {}} />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          className={styles.card}
          title={t("dispatcherArea.settingsCards.dataAccess.title")}
        >
          <div className={styles.inputsContainer}></div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default DashboardSettingsPage;
