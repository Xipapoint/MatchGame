import { memo } from "react"
export type Props = React.InputHTMLAttributes<HTMLInputElement>
const Input: React.FC<Props> = ({...props}) => {
    return(
        <input {...props}/>
    )
}
export default memo(Input)