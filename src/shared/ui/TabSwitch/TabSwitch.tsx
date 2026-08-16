import { useLayoutEffect, useRef, useState } from "react";
import styles from "./TabSwitch.module.css";

type Tab<T extends string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

type Props<T extends string> = {
  tabs: Tab<T>[];
  value: T;
  onChange: (value: T) => void;
};

const TabSwitch = <T extends string>({ tabs, value, onChange }: Props<T>) => {
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const el = btnRefs.current[value];
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
  }, [value]);

  return (
    <div className={styles.container}>
      <div className={styles.pill} style={{ left: pill.left, width: pill.width }} />
      {tabs.map((tab) => (
        <button
          key={tab.value}
          ref={(el) => {
            btnRefs.current[tab.value] = el;
          }}
          type="button"
          className={`${styles.tab} ${value === tab.value ? styles.tabActive : ""}`}
          disabled={tab.disabled}
          onClick={() => onChange(tab.value)}
        >
          <span className={styles.label}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TabSwitch;
