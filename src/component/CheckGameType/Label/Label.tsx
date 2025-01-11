import React, { memo } from "react"
export type Props = React.LabelHTMLAttributes<HTMLLabelElement>
const Label: React.FC<Props> = ({...props}) => {
    return (
        <label {...props}/>
    )
}
export default memo(Label)