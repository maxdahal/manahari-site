import "react"

/* the pages set CSS custom properties inline, e.g. style={{ "--n": "3" }} */
declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined
  }
}
