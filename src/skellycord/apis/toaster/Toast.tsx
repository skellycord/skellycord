import { getViaProps } from "@skellycord/webpack";
import { React, megaModule } from "@skellycord/webpack/common";
import { HTMLAttributes } from "react";
import { ToastData } from ".";

export interface ToastOptions {
    title: string;
    description?: string;
    img?: string;
    onClick?: () => void;
    duration?: number;
}

enum OpenCycle {
    INIT,
    VISIBLE,
    CLOSING
}

export let TOAST_ACTIVE = false;

export default function Toast({ id, title, description = "", img = "", onClick, duration = 5e3 }: ToastData) {
    TOAST_ACTIVE = true;
    const { Text } = megaModule;

    const [ open, setOpen ] = React.useState(false);

    // const doohickey = React.use();
    
    React.useEffect(() => {
        setTimeout(() => setOpen(true), 15);

        setTimeout(() => {
            setOpen(false);

            document.body.querySelector(`#skellycord-toast-${id}`)?.remove?.();
            TOAST_ACTIVE = false;
        }, duration);
    }, []);

    const textStyle: HTMLAttributes<HTMLBaseElement>["style"] = {
        marginLeft: img !== "" ? "55px" : "10px"
    };

    return <div 
        id={`skellycord-toast-${id}`}
        className="SCToaster"
        style={{ opacity: open ? 1 : 0 }} 
        onClick={(e) => { 
            setTimeout(() => {
                e?.currentTarget?.remove();
                TOAST_ACTIVE = false;
            }, 1e3);
            if (open) onClick?.();

            setOpen(false);
        }} 
    >
        { img ? <img src={img} /> : null }
        <Text style={textStyle} variant="text-md/semibold" className="text title">{ title }</Text>
        { description ? <Text style={textStyle} variant="text-sm/normal" className="text">{ description }</Text> : null }
    </div>;
}