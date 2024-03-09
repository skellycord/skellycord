declare module "*.css" {
    const options: {
        edit: (css: string) => void;
        revert: () => void;
    };
    export default options;
}

declare module "*.module.css" {
    const classes: { [className: string]: string };
    export default classes;
}