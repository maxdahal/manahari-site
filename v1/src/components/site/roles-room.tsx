/* The operating room drawn from above: the console, table, machine and the
   four people. RolesTabs lights the chosen person. */
export function RolesRoom() {
  return (
    <>
      <svg viewBox="0 0 460 300" role="img" aria-label="Room diagram: the wall monitor at the top, the console at the lower left, the patient table in the middle and the machine on the right, with a dot for each role.">{" "}<g className="room__areas">{" "}<rect x="140" y="14" width="180" height="30" rx="6" />{" "}<rect x="24" y="186" width="110" height="88" rx="6" />{" "}<rect x="176" y="110" width="120" height="80" rx="6" />{" "}<rect x="356" y="56" width="80" height="70" rx="6" />{" "}</g>{" "}<g className="room__labels">{" "}<text x="230" y="34">Wall monitor</text>{" "}<text x="79" y="235">Console</text>{" "}<text x="236" y="155">Table</text>{" "}<text x="396" y="96">Machine</text>{" "}</g>{" "}<g className="room__people">{" "}<circle className="person" data-role="0" cx="79" cy="214" r="8" />{" "}<circle className="person" data-role="1" cx="236" cy="132" r="8" />{" "}<circle className="person" data-role="2" cx="350" cy="216" r="8" />{" "}<circle className="person" data-role="3" cx="405" cy="110" r="8" />{" "}</g>{" "}</svg>
    </>
  )
}
