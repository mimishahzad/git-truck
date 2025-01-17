/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{tsx,html}"], plugins: [
        require("@catppuccin/tailwindcss")({
            // prefix to use, e.g. `text-pink` becomes `text-ctp-pink`.
            // default is `false`, which means no prefix
            prefix: "ctp",
            // which flavour of colours to use by default, in the `:root`
            defaultFlavour: "mocha",
        }),
    ], theme: {
        extend: {
            animation: {
                "hide-initially": "0s 1s linear forwards hide_initially",
                blink: "1s linear infinite blink",
                "stroke-pulse": "1s ease-in-out infinite stroke_pulse",
            },
            inset: {
                "half-screen": "50vh",
            },
            fontFamily: {
                mono: ["MonoLisa Variable", "monospace"],
            },
            backgroundImage: {
                "arrow": "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23212529'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e\")"
            }
        },
    },
};
