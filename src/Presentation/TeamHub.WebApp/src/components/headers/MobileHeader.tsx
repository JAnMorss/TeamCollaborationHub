import { Menu } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"

type Props = {
    setIsSidePanelOpen: Dispatch<SetStateAction<boolean>>
}

export default function MobileHeader({ setIsSidePanelOpen }: Props) {
  return (
    <div className="w-full h-16 p-4 bg-background sticky top-0 xs:hidden flex gap-8 justify-end z-1001">
        <button onClick={() => setIsSidePanelOpen(true)}>
            <Menu />
        </button>
    </div>
  )
}