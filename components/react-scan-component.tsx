"use client"
import { JSX, useEffect } from "react"

export function ReactScan(): JSX.Element {
  useEffect(() => {
    import("react-scan").then(({ scan }) => {
      scan({
        enabled: true,
      })
    })
  }, [])

  return <></>
}
