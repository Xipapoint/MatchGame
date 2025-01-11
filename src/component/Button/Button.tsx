import React, { memo } from "react"
import styles from './button.module.scss'
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isStart: boolean
}

const Button: React.FC<Props> = ({onClick, isStart, disabled, style, ...props }) => {
  return (
    <button
    className={styles.button}
    onClick={onClick}
    style={{
        backgroundColor: isStart ? "#73ef73" : undefined,
        ...style,
      }}
    disabled={disabled}
    {...props}
  />
  )
}

export default memo(Button)
