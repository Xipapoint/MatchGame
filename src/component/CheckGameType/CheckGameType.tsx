import { memo } from "react"
import { Props as LabelProps } from './Label/Label'
import Input, {Props as InputProps } from './Input/Input'
import Label from "./Label/Label";
type Props = LabelProps & InputProps & {
    onChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void
    labelText: string
}
const CheckGameType: React.FC<Props> = ({checked, onChangeInput, type = "checkbox", id, htmlFor, labelText}) => {
    return (
        <div>
            <Label htmlFor={htmlFor}>{labelText}</Label>
            <Input
                type={type}
                id={id}
                checked={checked}
                onChange={onChangeInput}
            />
      </div>
    )
}

export default memo(CheckGameType)