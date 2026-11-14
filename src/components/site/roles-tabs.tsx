"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const roles = [
  { name: "Surgeon", note: "At the console. Eyes in the 3D viewer, hands on the controls." },
  { name: "Scrub nurse", note: "Sterile, by the patient. Watches the wall monitor from 6 feet." },
  { name: "Circulating nurse", note: "Walks the room. Answers alerts and runs recording." },
  { name: "Biomed engineer", note: "At the machine, before or after surgery. Finds hardware faults." },
]

/* Role buttons over a drawing (Surgical Console, users and environment):
   choosing a role lights that person in the drawing and shows its short
   note. shadcn/ui Tabs: arrow keys, Home and End move between roles. The
   look comes from .roles in article.css. */
export function RolesTabs({ room }: { room: React.ReactNode }) {
  const [value, setValue] = useState(0)
  return (
    <Tabs
      unstyled
      value={value}
      onValueChange={(v) => setValue(Number(v))}
      className="roles"
      data-roles=""
    >
      <TabsList unstyled activateOnFocus className="roles__tabs" aria-label="Roles">
        {roles.map((r, i) => (
          <TabsTrigger unstyled key={r.name} value={i} id={`role-tab-${i}`}>
            {r.name}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="roles__stage">
        <figure className="room" data-selected={String(value)}>
          {room}
        </figure>
        <div className="roles__notes">
          {roles.map((r, i) => (
            <TabsContent unstyled keepMounted key={r.name} value={i} className="roles__note" render={<p />}>
              {r.note}
            </TabsContent>
          ))}
        </div>
      </div>
    </Tabs>
  )
}
