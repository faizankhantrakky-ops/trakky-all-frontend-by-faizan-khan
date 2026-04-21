'use client'
import { Icon as Ic } from "@iconify/react"

// ------------------------------------------------------

const Icon = ({ onClick, icon, className, height, width, rotate, color, style, ...props }) => {
    return (
        <div
            className={className}
            onClick={onClick}>
            <Ic
                icon={icon}
                {...props}
                className={`h-auto ${color}`}
                height={height}
                width={width}
                rotate={rotate}
                style={style} />
        </div>
    )
}

export default Icon
