import styles from "./PopularRoutesTitle.module.css";

type Props = {
  children: string;
  className?: string;
};

export default function PopularRoutesTitle({ children, className }: Props) {
  return <h2 className={className ?? styles.title}>{children}</h2>;
}
