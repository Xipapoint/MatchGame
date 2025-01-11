import React, { memo } from "react";
import styles from './matchesInout.module.scss'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    onChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const MatchesInput: React.FC<Props> = ({ type, value, onChangeInput, max, disabled, ...props }) => {
  return (
    <input
    className={styles.matchInput}
    type={type}
    value={value}
    onChange={onChangeInput}
    max={max}
    disabled={!!disabled}
    {...props}
  />
  );
};

export default memo(MatchesInput);
