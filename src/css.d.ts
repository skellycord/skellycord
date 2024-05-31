declare module "*.css" {
    const options: {
        edit: (css: string) => void;
        revert: () => void;
    };
    export default options;
}