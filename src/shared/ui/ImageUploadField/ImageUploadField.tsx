"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import styles from "./ImageUploadField.module.css";

type ImageUploadFieldProps = {
  initialUrl?: string;
  addLabel: string;
  changeLabel: string;
  onChange?: (file: File, previewUrl: string) => void;
};

export default function ImageUploadField({
  initialUrl,
  addLabel,
  changeLabel,
  onChange,
}: ImageUploadFieldProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onChange?.(file, url);
    // reset so the same file can be re-selected
    e.target.value = "";
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <div className={styles.wrapper}>
      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={previewUrl} alt="" className={styles.preview} />
      ) : (
        <button type="button" className={styles.placeholder} onClick={openPicker}>
          <Image
            width={24}
            height={24}
            className={styles.cameraIcon}
            src="/icons/photo-camera.svg"
            aria-hidden="true"
            alt={"photo"}
          />
        </button>
      )}

      <button type="button" className={styles.link} onClick={openPicker}>
        {previewUrl ? changeLabel : addLabel}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={handleFileChange}
      />
    </div>
  );
}
