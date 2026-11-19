import type { CaseStudy } from "./types";

const I = (src: string, w: number, h: number, alt: string) => ({ src: `/images/${src}`, w, h, alt });

/* Generated from the published v1 case studies, word for word. Images that
   v1 drew in HTML are the captures in /images/v1. */

const SurgicalConsole: CaseStudy = {
  "slug": "surgical-console",
  "title": "Luna Surgical Console",
  "heading": "Luna Surgical Console",
  "short": "UX design at Karl Storz. Three projects for Luna, a robotic surgery console: arm identity, a gallery with a video editor, and live annotation.",
  "glance": {"role": "UX Design Intern, Karl Storz (Summer 2026, 3 months)", "domain": "Medical robotics, high-stakes surgical software", "impact": ">50% less task time in exploratory prototype tests"},
  "problem": "A surgery team had one second to understand a screen. Scrub nurses could not see what the surgeon pointed at.",
  "part": "I designed three fixes for a surgical console: arm identity, a gallery with a video editor, and live annotation.",
  "metrics": [
    {
      "value": ">50%",
      "label": "Less task-completion time in exploratory usability testing"
    },
    {
      "value": "30+",
      "label": "Workflow screens restructured"
    },
    {
      "value": "100+",
      "label": "Figma components refined"
    }
  ],
  "caveat": "A working prototype built for Luna, a surgical robot’s operating system. The >50% comes from exploratory tests of the prototype with five engineers and an intern. To follow NDA and privacy rules, I redrew the screens, changed the arm colors and hid clinical data.",
  "spec": [
    {
      "label": "Product",
      "value": "Luna robotic surgical console software"
    },
    {
      "label": "Organization",
      "value": "Karl Storz / Asensus Surgical"
    },
    {
      "label": "Role",
      "value": "UX Design Intern"
    },
    {
      "label": "Timeline",
      "value": "May to August 2026"
    },
    {
      "label": "Tools",
      "value": "Figma, Interactive Prototype"
    },
    {
      "label": "Team",
      "value": "My design mentor, my clinical supervisor, and the software and clinical engineering teams"
    },
    {
      "label": "Scope",
      "value": "Live video editor, console dashboard, case setup and the component system"
    }
  ],
  "sections": [
    {
      "id": "action",
      "stage": "TL;DR",
      "title": "At a glance",
      "blocks": [
        {
          "type": "list",
          "items": [
            "I split the work into three projects: arm identity, a gallery with a video editor, and live annotation.",
            "I phased them as crawl, walk, run, so engineering could ship each step instead of waiting for one large redesign.",
            "I wrote the component rules first: one alert scale (green running, amber warning, red error, grey inactive), with every state shown by color, word and icon together.",
            "Each arm kept its own color as a thin bar. The wall monitor showed only the video and the surgeon’s marks, and pins got numbers so they could be called out by voice.",
            "Annotation took six versions before it became a named mode with a clear way out.",
            "I mapped the voice-assisted workflows, restructured 30+ workflow screens, refined 100+ Figma components, and built the prototype."
          ]
        }
      ]
    },
    {
      "id": "situation",
      "stage": "Define",
      "title": "The situation",
      "blocks": [
        {
          "type": "p",
          "text": "A robotic surgery console had been in development for 8 years. In the operating room, nobody shared one picture of what was happening. Nurses could not tell which robotic arm needed help, residents had to scrub through an hour of footage to find one moment, and scrub nurses at the wall monitor could not see what the surgeon was pointing at."
        }
      ]
    },
    {
      "id": "the-problems",
      "stage": "Define",
      "title": "The problems",
      "blocks": [
        {
          "type": "pairs",
          "items": [
            {
              "term": "Which arm is it?",
              "text": "The arm was only a number. A nurse had to match it to a real arm in the room. Success: the right person knows which arm, and what to do."
            },
            {
              "term": "Where is that moment?",
              "text": "The old editor worked on still images only. A resident had to scrub through an hour of footage. Success: find one moment without scrubbing."
            },
            {
              "term": "What is the surgeon pointing at?",
              "text": "Scrub nurses at the wall monitor could not see it. The surgeon’s hands stayed on the controls. Success: a mark reaches the main screen within a second."
            }
          ]
        },
        {
          "type": "p",
          "text": "Before this project, staff dealt with high click counts, long screen setup, machine calibration delays and frequent look-aways from the surgical field."
        },
        {
          "type": "gallery",
          "items": [
            {
              "src": "/images/v1/surgical-console-01.webp",
              "w": 672,
              "h": 222,
              "alt": "Wireframe of the old alerts list: every message looks the same and names an arm by number. The arms stand beside it, and a dashed line asks which one is arm 2.",
              "caption": "Project 1 · Every message looked the same."
            },
            {
              "src": "/images/v1/surgical-console-02.webp",
              "w": 672,
              "h": 378,
              "alt": "Wireframe of the old gallery: a grid of six still images with filter chips along the top.",
              "caption": "Project 2 · Still images with filter chips on top."
            },
            {
              "src": "/images/v1/surgical-console-03.webp",
              "w": 672,
              "h": 378,
              "alt": "Wireframe of the old image editor: a still image on the left, a tools and segments panel on the right, and action buttons along the top.",
              "caption": "Project 2 · An editor with still images only."
            }
          ],
          "cols": 3
        },
        {
          "type": "p",
          "text": "The old screens showed real patient video, so I redrew them as wireframes. Project 3 had no old screen: the old design had no way to mark the live video."
        }
      ]
    },
    {
      "id": "task",
      "stage": "Define",
      "title": "Reframing the goal",
      "blocks": [
        {
          "type": "p",
          "text": "The brief asked for video annotation tools. I reframed the goal: help everyone in the room share an understanding of what the surgeon sees, without making the surgeon look away from the 3D viewer."
        },
        {
          "type": "p",
          "text": "A surgeon looks at the console for about a second at a time, so every action had to feel instant."
        }
      ]
    },
    {
      "id": "scope",
      "stage": "Define",
      "title": "Scope trade-offs",
      "blocks": [
        {
          "type": "p",
          "text": "I focused on real operating room problems. These ideas waited:"
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Post-operative AI analytics",
              "text": "I left video analysis after surgery for later, to focus on fast, real-time controls during live procedures."
            },
            {
              "term": "3D anatomical reconstruction",
              "text": "I left 3D rendering out to keep the main video feed at a high frame rate."
            },
            {
              "term": "Scope agreement",
              "text": "My design mentor, my clinical supervisor and I put usability during surgery, situational awareness and safety ahead of post-case features."
            }
          ]
        }
      ]
    },
    {
      "id": "three-projects",
      "stage": "Define",
      "title": "Three projects",
      "blocks": [
        {
          "type": "figure",
          "img": {
            "src": "/images/v1/surgical-console-04.webp",
            "w": 2080,
            "h": 396,
            "alt": "Diagram: the three projects as three tiles, an arm color bar, a gallery with a play button, and a tablet sending marks to a screen"
          },
          "caption": ""
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Arm identity",
              "text": "A color bar shows which arm has an error or warning."
            },
            {
              "term": "Gallery and video editor",
              "text": "A gallery named by procedure step, and a video editor."
            },
            {
              "term": "Live annotation",
              "text": "Marks made on a tablet appear on the main screen."
            }
          ]
        }
      ]
    },
    {
      "id": "users-and-environment",
      "stage": "Research",
      "title": "Roles in the operating room",
      "blocks": [
        {
          "type": "p",
          "text": "I designed for four roles standing in four different places in the room."
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Surgeon",
              "text": "At the console. Eyes in the 3D viewer, hands on the controls. Needs to mark, measure and capture anatomy in seconds without breaking focus."
            },
            {
              "term": "Scrub nurse",
              "text": "Sterile, by the patient. Watches the wall monitor from 6 feet. Needs to see instantly what the surgeon points to, without reading small labels."
            },
            {
              "term": "Circulating nurse",
              "text": "Walks the room, unsterile. Handles equipment alerts, recording states, patient privacy and case records."
            },
            {
              "term": "Biomed engineer",
              "text": "At the machine, before or after surgery. Reviews system logs and module states."
            }
          ]
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Key insight",
              "text": "Only the biomed engineer has time to read dense text. The other three rely on one-second glances."
            }
          ]
        },
        {
          "type": "h3",
          "text": "Environment constraints"
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Bright endoscope feed",
              "text": "Warm interface colors looked like anatomy."
            },
            {
              "term": "Brief, fragmented attention",
              "text": "Surgeons looked for only a second at a time."
            },
            {
              "term": "Safety alerts first",
              "text": "Machine safety warnings beat every other message."
            }
          ]
        }
      ]
    },
    {
      "id": "constraints",
      "stage": "Research",
      "title": "Constraints",
      "blocks": [
        {
          "type": "figure",
          "img": {
            "src": "/images/v1/surgical-console-05.webp",
            "w": 968,
            "h": 396,
            "alt": "Diagram: a surgeon looks at the screen for one second"
          },
          "caption": ""
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Tight timelines",
              "text": "In development for 8 years, so requirements had to move quickly."
            },
            {
              "term": "Many stakeholders to align",
              "text": "Surgeons, engineers, PMs and executive leadership."
            },
            {
              "term": "The operating room",
              "text": "Screen distance, lighting, gloves and noise."
            }
          ]
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "The core constraint",
              "text": "Surgeons glanced at it for one second, so every action had to feel instant. The operating room is dim, the endoscope feed is bright, and machine safety warnings, such as robotic arm force limits, outrank everything else on screen in every mode. Every UI element had to stay out of the anatomy’s way."
            }
          ]
        }
      ]
    },
    {
      "id": "the-product",
      "stage": "Research",
      "title": "The product",
      "blocks": [
        {
          "type": "figure",
          "img": {
            "src": "/images/v1/surgical-console-06.webp",
            "w": 2080,
            "h": 802,
            "alt": "Top view of the system: a patient on the table with robotic arms around them, each arm with its own screen, and one central unit with the main controls."
          },
          "caption": "The system around the patient, drawn as an illustration. Robotic arms surround the patient and each has its own screen. One central unit holds the main controls."
        },
        {
          "type": "figure",
          "img": {
            "src": "/images/v1/surgical-console-07.webp",
            "w": 2080,
            "h": 774,
            "alt": "Wireframe of the console: a primary display with the anatomy view, a secondary touch display, two handles with arm color LEDs, and a wall monitor that shows the live video and marks only."
          },
          "caption": "The console, redrawn as a wireframe. The wall monitor showed only the live video and the marks."
        }
      ]
    },
    {
      "id": "strategy",
      "stage": "Plan",
      "title": "Crawl, walk, run",
      "blocks": [
        {
          "type": "figure",
          "img": {
            "src": "/images/v1/surgical-console-09.webp",
            "w": 968,
            "h": 380,
            "alt": "Diagram: three steps rising from Crawl to Walk to Run"
          },
          "caption": ""
        },
        {
          "type": "p",
          "text": "Engineering had limited time, so I did not plan one huge redesign. I chose three steps:"
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Fit into the old layouts",
              "text": "I added basic capture, pin, and measure tools to the old editor."
            },
            {
              "term": "Rebuild with components",
              "text": "I made annotation its own mode and used the new console grid."
            },
            {
              "term": "Use the same rules everywhere",
              "text": "I used one alert scale and one component library in the editor, gallery, and service screens."
            }
          ]
        }
      ]
    },
    {
      "id": "vision-principles",
      "stage": "Plan",
      "title": "Vision & principles",
      "blocks": [
        {
          "type": "figure",
          "img": {
            "src": "/images/v1/surgical-console-10.webp",
            "w": 968,
            "h": 556,
            "alt": "Diagram: six principles around the goal, designing for confidence"
          },
          "caption": ""
        },
        {
          "type": "p",
          "text": "The team’s main goal was “designing for confidence.” Six principles came from it."
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Informed control",
              "text": "You can tell what the system did and will do."
            },
            {
              "term": "Trust and reliability",
              "text": "The same tap gives the same result."
            },
            {
              "term": "Situational awareness",
              "text": "The anatomy matters most."
            },
            {
              "term": "Extensibility",
              "text": "Components first, so one color scale works everywhere."
            },
            {
              "term": "Clarity",
              "text": "Every mode is named and has a way out."
            },
            {
              "term": "Familiarity",
              "text": "Controls people already know."
            }
          ]
        }
      ]
    },
    {
      "id": "lo-fi-sketches",
      "stage": "Plan",
      "title": "Early wireframes",
      "blocks": [
        {
          "type": "gallery",
          "items": [
            {
              "src": "/images/v1/surgical-console-11.webp",
              "w": 672,
              "h": 420,
              "alt": "Sketch A: a warning label with L and force limit sits next to the instrument on the video.",
              "caption": "A · Warning on the picture. A label with L or R sat next to the instrument. Kept."
            },
            {
              "src": "/images/v1/surgical-console-12.webp",
              "w": 672,
              "h": 420,
              "alt": "Sketch B: the whole arm panel is filled with the arm color, and the error dot is red.",
              "caption": "B · Arm color as a fill. The whole panel took the arm color. Dropped, because it hid the state."
            },
            {
              "src": "/images/v1/surgical-console-13.webp",
              "w": 672,
              "h": 420,
              "alt": "Sketch C: the arm color is a bar along the top edge of the panel. The state shows as a dot and a word.",
              "caption": "C · Color bar, dot and word. Color showed identity. The dot and the word showed state. Kept."
            }
          ],
          "cols": 3
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Direction A · Controls around the feed",
              "text": "I placed controls around the video. Kept: warnings attached directly to the robotic arms."
            },
            {
              "term": "Direction B · Keep the feed clear",
              "text": "I kept the video uncluttered. Kept: measurement numbers shown directly on the video."
            }
          ]
        }
      ]
    },
    {
      "id": "component-system",
      "stage": "Design",
      "title": "Component system",
      "blocks": [
        {
          "type": "p",
          "text": "I wrote the component rules first, so every screen looks and acts the same."
        },
        {
          "type": "figure",
          "img": {
            "src": "/images/console-13-9e8502df90.svg",
            "w": 980,
            "h": 440,
            "alt": "Three states, Running, Warning and Error, each shown by color, by word, by icon, and by all three together"
          },
          "caption": "Each state shown by color, by word, by icon, and by all three together."
        },
        {
          "type": "gallery",
          "items": [
            {
              "src": "/images/console-02-6d4cfe0c27.svg",
              "w": 112,
              "h": 204,
              "alt": "Draw tool",
              "caption": "Draw"
            },
            {
              "src": "/images/console-03-4174205457.svg",
              "w": 112,
              "h": 204,
              "alt": "Pin tool",
              "caption": "Pin"
            },
            {
              "src": "/images/console-04-dfcdaea043.svg",
              "w": 112,
              "h": 204,
              "alt": "Measure tool",
              "caption": "Measure"
            },
            {
              "src": "/images/console-06-0898b212a4.svg",
              "w": 112,
              "h": 204,
              "alt": "Notes tool",
              "caption": "Notes"
            },
            {
              "src": "/images/console-07-4432b6d695.svg",
              "w": 112,
              "h": 204,
              "alt": "Redo action",
              "caption": "Redo"
            },
            {
              "src": "/images/console-08-844bd38853.svg",
              "w": 112,
              "h": 204,
              "alt": "Screenshot action",
              "caption": "Screenshot"
            },
            {
              "src": "/images/console-09-0240aff6ec.svg",
              "w": 112,
              "h": 204,
              "alt": "Clear all action",
              "caption": "Clear all"
            },
            {
              "src": "/images/console-10-6ae6d92f1e.svg",
              "w": 112,
              "h": 196,
              "alt": "Delete action",
              "caption": "Delete"
            },
            {
              "src": "/images/console-11-edf12b671a.svg",
              "w": 112,
              "h": 204,
              "alt": "Duplicate action",
              "caption": "Duplicate"
            },
            {
              "src": "/images/console-12-f1b48348ab.svg",
              "w": 112,
              "h": 204,
              "alt": "Fullscreen action",
              "caption": "Fullscreen"
            }
          ],
          "cols": 5
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "One alert scale",
              "text": "Green running, amber warning, red error, grey inactive. Cyan only for selection."
            },
            {
              "term": "Arms keep their own color",
              "text": "Shown only as a thin bar on top of the panel. The colors on this page (lavender, sand, pine and pink) are stand-ins: I changed the real arm colors for privacy."
            },
            {
              "term": "Tools versus actions",
              "text": "An active tool is a solid block; actions stay outlines. Only Delete is red."
            },
            {
              "term": "Saying it three ways",
              "text": "Color, word and icon together, for color-blind staff."
            }
          ]
        }
      ]
    },
    {
      "id": "project-1-arm-identity",
      "stage": "Design",
      "title": "Project 1 · Arm identity",
      "blocks": [
        {
          "type": "p",
          "text": "I kept each arm’s own color, shown only as a bar along the top of the panel."
        },
        {
          "type": "p",
          "text": "The state shows as a dot and a word: Running, Warning, Error or Inactive."
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Instead of",
              "text": "Filling the panel with the arm color. It hid which arm it was and what it was doing."
            }
          ]
        },
        {
          "type": "figure",
          "img": {
            "src": "/images/console-26-279be3c21e.webp",
            "w": 1600,
            "h": 900,
            "alt": "The instruments panel with the arm color as a bar along the top"
          },
          "caption": "Instruments panel: the arm color showed as a plain bar along the top."
        }
      ]
    },
    {
      "id": "arm-sandbox",
      "stage": "Design",
      "title": "Arm sandbox",
      "blocks": [
        {
          "type": "h3",
          "text": "Find the arm that needs help"
        },
        {
          "type": "p",
          "text": "Each arm has its own color, and you get one second. Switch between the designs I tested, from the old number-only panels to the final design, and set each arm’s state. Then take the glance test: the screen shows for one second, and you pick the arm that needs help."
        },
        {
          "type": "armpanel"
        }
      ]
    },
    {
      "id": "project-2-gallery-and-video-editor",
      "stage": "Design",
      "title": "Project 2 · Gallery and video editor",
      "blocks": [
        {
          "type": "figure",
          "img": {
            "src": "/images/console-18-bceb1fb1ce.webp",
            "w": 1280,
            "h": 720,
            "alt": "The new editor with numbered pins, a 3.27 cm measurement, a timeline and a tool bar"
          },
          "caption": "The new editor. Pins carried numbers, the measurement sat on the video, and tools lived in one bottom bar under a timeline."
        },
        {
          "type": "gallery",
          "items": [
            {
              "src": "/images/v1/surgical-console-14.webp",
              "w": 1024,
              "h": 582,
              "alt": "Wireframe of the new gallery: procedures on the left, one filter track with All, Images and Videos, and a grid of cards named by procedure step.",
              "caption": "Gallery. Cards named by procedure step, with one filter track."
            },
            {
              "src": "/images/v1/surgical-console-15.webp",
              "w": 1024,
              "h": 582,
              "alt": "Wireframe of the new video editor: live video with a recording badge and timer, a timeline with recorded stretches in red and pins in cyan, a tool bar, and a navigation sidebar.",
              "caption": "Video editor. A timeline under the video, and one labeled bar of tools."
            }
          ],
          "cols": 2
        },
        {
          "type": "decisions",
          "items": [
            {
              "title": "The editor handled video",
              "text": "A timeline marks recordings and pins.",
              "instead": "still images only."
            },
            {
              "title": "One labeled tool bar",
              "text": "Every tool in one bottom bar, each with a word.",
              "instead": "a side panel of icon tabs."
            },
            {
              "title": "One gallery filter",
              "text": "All, Images and Videos share one track.",
              "instead": "separate filter chips."
            },
            {
              "title": "Recording changed the screen",
              "text": "A red Stop, and the markup tools dim.",
              "instead": "a state that looked like any other."
            }
          ]
        },
        {
          "type": "gallery",
          "items": [
            {
              "src": "/images/console-19-cc6b761fa7.webp",
              "w": 1280,
              "h": 720,
              "alt": "The recording state with a red REC badge and a Stop button",
              "caption": "Recording. The first control became a red Stop, and the markup tools dimmed."
            },
            {
              "src": "/images/console-20-5fb9ae48d8.webp",
              "w": 1280,
              "h": 720,
              "alt": "The new gallery with a procedures list and All, Images and Videos tabs",
              "caption": "The new gallery. Procedures by date on the left, one track for All, Images and Videos."
            }
          ],
          "cols": 2
        },
        {
          "type": "gallery",
          "items": [
            {
              "src": "/images/console-23-efa1ebb08d.webp",
              "w": 1600,
              "h": 900,
              "alt": "Gallery, all media",
              "caption": "All"
            },
            {
              "src": "/images/console-24-662d520da5.webp",
              "w": 1600,
              "h": 900,
              "alt": "Gallery, images",
              "caption": "Images"
            },
            {
              "src": "/images/console-25-76b1a46dd1.webp",
              "w": 1600,
              "h": 900,
              "alt": "Gallery, videos",
              "caption": "Videos"
            }
          ],
          "cols": 3
        },
        {
          "type": "gallery",
          "items": [
            {
              "src": "/images/console-14-53d587ef8d.svg",
              "w": 453,
              "h": 290,
              "alt": "Gallery tab",
              "caption": "Gallery tab"
            },
            {
              "src": "/images/console-15-f1c113985a.svg",
              "w": 428,
              "h": 202,
              "alt": "Screenshots panel",
              "caption": "Screenshots panel"
            },
            {
              "src": "/images/console-16-cec2e33647.svg",
              "w": 428,
              "h": 244,
              "alt": "Captures panel opened as a grid of saved images",
              "caption": "Captures panel"
            },
            {
              "src": "/images/console-17-79778c49b0.svg",
              "w": 426,
              "h": 604,
              "alt": "Media popup",
              "caption": "Media popup"
            }
          ],
          "cols": 5
        }
      ]
    },
    {
      "id": "inside-the-video-editor",
      "stage": "Design",
      "title": "Inside the video editor",
      "blocks": [
        {
          "type": "p",
          "text": "I placed each region by how often people look at it and reach for it: the live video, marks and action ribbon all the time; status and timeline sometimes; menus rarely."
        },
        {
          "type": "p",
          "text": "I named six regions on the editor screen, so designers, software engineers and clinical specialists could talk about it without confusion:"
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Global Header",
              "text": "Breadcrumbs and short-lived system notices. Never moves or flashes."
            },
            {
              "term": "Central Workspace",
              "text": "The endoscope feed. Nothing permanent ever sits on top of the surgical picture."
            },
            {
              "term": "Action Ribbon",
              "text": "Tools along the bottom that change with the mode, sized for gloved hands."
            },
            {
              "term": "Quick Access Tray",
              "text": "Captures panel showing saved stills and clips."
            },
            {
              "term": "Nav Sidebar",
              "text": "Switches whole views (gallery, instruments) without affecting the current frame."
            },
            {
              "term": "Global Footer",
              "text": "The case timeline: elapsed time, with captures and pins marked in color."
            }
          ]
        },
        {
          "type": "figure",
          "img": {
            "src": "/images/console-21-d36600b9b3.webp",
            "w": 1920,
            "h": 1080,
            "alt": "The live video editor with a back button and breadcrumb at the top, numbered pins and a measurement on the feed, a timeline below, and one tool bar at the bottom"
          },
          "caption": "The live video editor. The feed sits in the center with no permanent overlays. The timeline and the tool bar sit below it."
        },
        {
          "type": "h3",
          "text": "Five key decisions and what each one replaced"
        },
        {
          "type": "decisions",
          "items": [
            {
              "title": "Annotation became a mode",
              "text": "A tool rail, a cyan border and a banner.",
              "instead": "five tool buttons always on."
            },
            {
              "title": "Captures in a corner player",
              "text": "Saved clips open in the bottom right.",
              "instead": "a drawer that pushed the video off center."
            },
            {
              "title": "The wall monitor shows part of the screen",
              "text": "Only the video and the surgeon’s marks.",
              "instead": "a cluttered copy of the whole screen."
            },
            {
              "title": "Pins got numbers",
              "text": "So a pin can be called out by voice.",
              "instead": "unnumbered pins and a side list."
            },
            {
              "title": "On-demand voice command logs",
              "text": "A quiet voice indicator sits in the system status.",
              "instead": "an audio chime alone. In a noisy room, nobody noticed when speech recognition failed, and people stopped trusting it."
            }
          ]
        },
        {
          "type": "p",
          "text": "Demo session trade-off: I ran a team demo with dummy data to test the command log. A transcript that stayed on screen cluttered the video, so I moved the voice log to the background. People open it from the control panel when they need it."
        },
        {
          "type": "gallery",
          "items": [
            {
              "src": "/images/console-22-4900e38a87.webp",
              "w": 1600,
              "h": 900,
              "alt": "The live video editor while recording, with a red REC badge and timer, a timeline with markers, Stop and Snap, and a controls rail on the right",
              "caption": "Recording on: the markup tools dimmed, so nobody edited by accident while recording."
            },
            {
              "src": "/images/console-27-056df30be1.svg",
              "w": 800,
              "h": 450,
              "alt": "Wireframe of the editor in voice standby: a microphone in the center of the feed and the words Voice standby, Waiting for the wake phrase",
              "caption": "Voice standby: the system was awake and waited for the wake phrase."
            }
          ],
          "cols": 2
        }
      ]
    },
    {
      "id": "annotation-became-a-mode",
      "stage": "Design",
      "title": "Annotation became a mode",
      "blocks": [
        {
          "type": "pairs",
          "items": [
            {
              "term": "Early hypothesis",
              "text": "If surgeons could mark, measure and save images on the live video without looking away, everyone in the room would see what the surgeon saw."
            }
          ]
        },
        {
          "type": "p",
          "text": "Annotation took 6 versions (pills, switches, toggles). I ended with a mode and a check button to exit."
        },
        {
          "type": "versions",
          "items": [
            {
              "tag": "V1",
              "title": "Watch and Annotate segments",
              "text": "Watching is not a mode."
            },
            {
              "tag": "V2",
              "title": "A switch in the toolbar",
              "text": "It looked like one more tool."
            },
            {
              "tag": "V3",
              "title": "A floating glass pill",
              "text": "Too prominent over the video."
            },
            {
              "tag": "V4",
              "title": "Tap the pill again to leave",
              "text": "Leaving needs its own button."
            },
            {
              "tag": "V5",
              "title": "Done with a cross icon",
              "text": "A cross means cancel; Done means keep."
            },
            {
              "tag": "V6",
              "title": "A named mode, ended by a round tick",
              "text": "The current version.",
              "kept": true
            }
          ]
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "What I learned",
              "text": "The real problem was the state. Once I designed the mode, the button was easy."
            }
          ]
        },
        {
          "type": "figure",
          "img": {
            "src": "/images/console-01-7142ae9c81.webp",
            "w": 1600,
            "h": 900,
            "alt": "The live video editor in annotation mode, with numbered pins and a measurement on the feed"
          },
          "caption": "V6 · A mode: the rail slides in, the feed gets a cyan edge, a banner names it, a round tick ends it."
        }
      ]
    },
    {
      "id": "project-3-live-annotation",
      "stage": "Design",
      "title": "Project 3 · Live annotation",
      "blocks": [
        {
          "type": "p",
          "text": "The tablet keeps the tools; only the video and marks go to the main screen."
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Instead of",
              "text": "Mirroring the whole tablet. At six feet, the toolbar was clutter."
            }
          ]
        },
        {
          "type": "figure",
          "img": {
            "src": "/images/v1/surgical-console-16.webp",
            "w": 1008,
            "h": 404,
            "alt": "Wireframe of two screens. A tablet shows the live video with controls and a dashed Edit button that is still to design. A dashed rectangle marks the part that shows on the main screen, which gets the video and the marks only."
          },
          "caption": "The tablet kept the tools and menus. The main screen showed only the video and marks."
        },
        {
          "type": "p",
          "text": "Still to do: an Edit button. I ran out of time, so a dashed placeholder marks where it goes."
        }
      ]
    },
    {
      "id": "safety-and-setup",
      "stage": "Design",
      "title": "Privacy, fail-safes and case setup",
      "blocks": [
        {
          "type": "pairs",
          "items": [
            {
              "term": "Patient information hidden by default",
              "text": "Patient information always stays hidden and shows only when the team needs it."
            },
            {
              "term": "Fail-safe malfunction UI overrides",
              "text": "When a hardware fault or a force limit alert happens, the safety warning takes over the screen right away, above any drawing on the video."
            },
            {
              "term": "Dynamic case setup workflow",
              "text": "Open setup tasks stay as full panels, and finished tasks shrink to one line. Each task shows who owns it, Bedside or Console, so staff can work at the same time. Instead of: same-size cards that made staff wait for each other and read past finished tasks. Setup time became the longest single task, not the sum of all tasks."
            }
          ]
        }
      ]
    },
    {
      "id": "from-wireframe-to-prototype",
      "stage": "Prototype",
      "title": "From wireframe to prototype",
      "blocks": [
        {
          "type": "p",
          "text": "I built a prototype in Figma to check annotation mode, tap target size and how views switch."
        },
        {
          "type": "gallery",
          "items": [
            {
              "src": "/images/console-30-127e4df147.svg",
              "w": 1600,
              "h": 900,
              "alt": "Wireframe of the live video editor",
              "caption": "Wireframe"
            },
            {
              "src": "/images/console-01-7142ae9c81.webp",
              "w": 1600,
              "h": 900,
              "alt": "Prototype of the live video editor in annotation mode",
              "caption": "Prototype"
            }
          ],
          "cols": 2
        },
        {
          "type": "p",
          "text": "I can’t show the prototype because of privacy rules. I am happy to walk through it on a call."
        }
      ]
    },
    {
      "id": "outcome",
      "stage": "Test",
      "title": "Usability testing",
      "blocks": [
        {
          "type": "stats",
          "items": [
            {
              "term": ">50%",
              "text": "less task-completion time in exploratory usability testing"
            },
            {
              "term": "6 of 10",
              "text": "usability rules fixed in my own review of the prototype"
            }
          ]
        },
        {
          "type": "p",
          "text": "I ran exploratory usability tests, moderated and unmoderated, with A/B tests and timed sessions. Task-completion time fell by more than 50%, with fewer steps and fewer errors."
        },
        {
          "type": "p",
          "text": "I tested the prototype with five engineers and an intern."
        },
        {
          "type": "p",
          "text": "These were exploratory tests of a prototype, so the numbers are early signals."
        },
        {
          "type": "p",
          "text": "My main measure was visual cost: how often and how long a surgeon had to look away from the surgical field. In an operating room, clicks and time on page matter little."
        },
        {
          "type": "p",
          "text": "Every engineer who evaluated the voice-assisted interaction preferred it."
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Outcome",
              "text": "My clinical supervisor said the component system and annotation mode could be the basis for future console software."
            }
          ]
        }
      ]
    },
    {
      "id": "heuristic-evaluation",
      "stage": "Test",
      "title": "Heuristic audit",
      "blocks": [
        {
          "type": "figure",
          "img": {
            "src": "/images/v1/surgical-console-17.webp",
            "w": 968,
            "h": 380,
            "alt": "Diagram: ten dots, six filled for fixed and four open"
          },
          "caption": ""
        },
        {
          "type": "checks",
          "items": [
            {
              "tag": "H1",
              "title": "Visibility of System Status",
              "text": "I added 3 cues (a cyan border on the video, a top banner, and a tool rail) so surgeons knew marks were live.",
              "fixed": true
            },
            {
              "tag": "H2",
              "title": "Match Between the System and the Real World",
              "text": "I replaced engineering codes with clinical words. Some system errors still needed a review.",
              "fixed": false
            },
            {
              "tag": "H3",
              "title": "User Control and Freedom",
              "text": "I made a separate mode with a check button to exit, instead of a confusing toggle.",
              "fixed": true
            },
            {
              "tag": "H4",
              "title": "Consistency and Standards",
              "text": "I used the same 4-color alert scale (green, amber, red, grey) on every console view.",
              "fixed": true
            },
            {
              "tag": "H5",
              "title": "Error Prevention",
              "text": "I stopped taps on a tool from leaving a mark on the live surgery video by accident.",
              "fixed": true
            },
            {
              "tag": "H6",
              "title": "Recognition Rather than Recall",
              "text": "I added a word and an icon to every button, so staff did not have to remember.",
              "fixed": true
            },
            {
              "tag": "H7",
              "title": "Flexibility and Efficiency of Use",
              "text": "Keyboard shortcuts worked for expert users. Custom tool presets stayed on the to-do list.",
              "fixed": false
            },
            {
              "tag": "H8",
              "title": "Aesthetic and Minimalist Design",
              "text": "I folded the screen into 3 regions that collapsed. This kept the video clean.",
              "fixed": true
            },
            {
              "tag": "H9",
              "title": "Help Users Recognize, Diagnose, and Recover from Errors",
              "text": "I grouped errors by robotic arm. Repeated error messages still needed to merge into one.",
              "fixed": false
            },
            {
              "tag": "H10",
              "title": "Help and Documentation",
              "text": "Help sat in the settings. I left out a full guided tour, because it could distract people in the operating room.",
              "fixed": false
            }
          ]
        }
      ]
    },
    {
      "id": "all-three-together",
      "stage": "Hand-off",
      "title": "All three together",
      "blocks": [
        {
          "type": "figure",
          "img": {
            "src": "/images/v1/surgical-console-18.webp",
            "w": 968,
            "h": 530,
            "alt": "Diagram: arm identity before, the video editor and live annotation during, the gallery after"
          },
          "caption": ""
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Arm identity",
              "text": "A nurse reads the arm bars and knows which arm needs help."
            },
            {
              "term": "Video editor",
              "text": "The surgeon marks, measures and records on the live feed."
            },
            {
              "term": "Live annotation",
              "text": "Marks from another screen show on the main screen."
            },
            {
              "term": "Gallery",
              "text": "Captures wait there, named by procedure step."
            }
          ]
        },
        {
          "type": "p",
          "text": "I built all three from the same components, the same severity scale and the same arm colors."
        }
      ]
    },
    {
      "id": "what-i-handed-over",
      "stage": "Hand-off",
      "title": "What I handed over",
      "blocks": [
        {
          "type": "figure",
          "img": {
            "src": "/images/v1/surgical-console-19.webp",
            "w": 2080,
            "h": 394,
            "alt": "Diagram: a prototype, a component library and a test plan"
          },
          "caption": ""
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "A working prototype",
              "text": "Working flows for annotation, captures, the corner player, case setup and the gallery."
            },
            {
              "term": "A component library",
              "text": "One alert scale, the rules for using the existing arm colors, and the rules for how buttons act."
            },
            {
              "term": "A test plan",
              "text": "A full test plan with 10 tasks and 9 ideas to test, with look-away frequency as the main measure."
            }
          ]
        }
      ]
    },
    {
      "id": "still-unfinished",
      "stage": "Hand-off",
      "title": "Still to do",
      "blocks": [
        {
          "type": "list",
          "items": [
            "I designed an Undo button that still needs to be built.",
            "Repeated error alerts did not merge into one row.",
            "A medical expert still had to review the clinical words.",
            "Live annotation still needed an Edit button."
          ]
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Biggest usability risk",
              "text": "Repeated error alerts that did not merge into one row."
            }
          ]
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "What I would test next",
              "text": "Next, I would test every version with more stakeholders."
            }
          ]
        }
      ]
    }
  ],
  "takeaways": [
    {
      "title": "Write the reason before drawing",
      "text": "Name the old pattern each choice replaces."
    },
    {
      "title": "Components before full screens",
      "text": "Early alert rules kept four parts consistent."
    },
    {
      "title": "Prototype early",
      "text": "A running prototype caught a tap-through bug."
    },
    {
      "title": "Design system states, not controls",
      "text": "Decide how modes switch before polishing buttons."
    },
    {
      "title": "Familiar beats new when mistakes cost a lot",
      "text": "The corner player worked because people knew it."
    },
    {
      "title": "Test earlier, with rougher designs",
      "text": "Ten minutes with a surgeon beats six versions alone."
    }
  ],
  actions: [{ label: "Play with the arm panels", href: "#arm-sandbox", play: true }, { label: "View wireframes", href: "#lo-fi-sketches" }],
  years: "2026",
  accent: "#13B3B9",
  cover: I("console-01-7142ae9c81.webp", 1600, 900, "The live video editor in annotation mode, with numbered pins and a 3.27 cm measurement on the feed"),
  card: I("console-20-5fb9ae48d8.webp", 1280, 720, "The gallery with procedures by date and All, Images and Videos tabs"),
};

const KuBrand: CaseStudy = {
  "slug": "ku-brand",
  "title": "KU Brand",
  "heading": "KU Brand",
  "short": "Research, design and frontend for the University of Kansas brand site, part of a campus-wide rebrand across websites serving 50,000+ users. Traffic across ku.edu grew 30% after launch, a team result.",
  "glance": {"role": "UX Designer & Front-End Developer", "domain": "Design systems, university web platform (80K+ daily visitors)", "impact": "Live WCAG contrast sandbox; color, type and spacing tokens"},
  "problem": "KU refreshed its identity, and its brand site had to catch up. People struggled to find guidelines and assets on the old site.",
  "metrics": [
    {
      "value": "+30%",
      "label": "Traffic across ku.edu after launch (a team result)"
    },
    {
      "value": "80K+",
      "label": "Daily visitors across KU’s websites"
    }
  ],
  "caveat": "A new brand site for KU communicators and campus partners, live at brand.ku.edu. The traffic numbers are a team result of the campus-wide rebrand, not mine alone.",
  "spec": [
    {
      "label": "Organization",
      "value": "University of Kansas"
    },
    {
      "label": "Role",
      "value": "UX Designer / Front-End Developer. I co-led the design of the brand website."
    },
    {
      "label": "Timeline",
      "value": "Jan 2023 to Apr 2024"
    },
    {
      "label": "Methods",
      "value": "Interviews, focus groups, A/B tests of early concepts, information architecture, frontend build"
    },
    {
      "label": "Team",
      "value": "30+ content designers, marketers and developers"
    },
    {
      "label": "Tools",
      "value": "Figma, HTML, CSS, JavaScript, Drupal"
    }
  ],
  "sections": [
    {
      "id": "my-contribution",
      "stage": "TL;DR",
      "title": "My contribution",
      "blocks": [
        {
          "type": "h3",
          "text": "What I did"
        },
        {
          "type": "list",
          "items": [
            "Co-led the design of the brand website",
            "Interviewed Kansans, alumni, students and staff",
            "Mapped and grouped the content",
            "Designed and built the pages (HTML, CSS, JavaScript)",
            "Built frontend components in Drupal with the web teams"
          ]
        },
        {
          "type": "h3",
          "text": "The team and others"
        },
        {
          "type": "list",
          "items": [
            "A team of 30+ content designers, marketers and developers"
          ]
        }
      ]
    },
    {
      "id": "the-problem",
      "stage": "Problem",
      "title": "The problem",
      "blocks": [
        {
          "type": "pairs",
          "items": [
            {
              "term": "An outdated site",
              "text": "The old brand site did not match the new identity."
            },
            {
              "term": "Hard to find things",
              "text": "KU Communicators had trouble finding clear guidelines and updated assets."
            }
          ]
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Goal",
              "text": "Build a brand site that reflects the new identity and makes guidelines and assets easy to find."
            }
          ]
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Problem statement",
              "text": "How might we rebuild the KU brand site so campus communicators can find guidelines and assets without asking for help?"
            }
          ]
        }
      ]
    },
    {
      "id": "user-interviews",
      "stage": "Research",
      "title": "Interviews and focus groups",
      "blocks": [
        {
          "type": "split",
          "text": "I talked with Kansans, alumni, students, faculty and staff about identity and traditions, then looked for patterns.",
          "img": {
            "src": "/images/ku-brand-02-b29a48186b.webp",
            "w": 570,
            "h": 407,
            "alt": "Kansans walking together through the Flint Hills prairie"
          },
          "caption": "Photo from the KU Brand Center. It shows the Kansas people and places the interviews were about."
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Short talks beat long surveys",
              "text": "Small-group conversations showed where people got stuck finding assets more clearly than surveys did."
            },
            {
              "term": "Pushback on early concepts",
              "text": "Some early concepts got pushback on tone and clutter, which led to layout fixes."
            }
          ]
        }
      ]
    },
    {
      "id": "what-didn-t-work",
      "stage": "Research",
      "title": "What people told us",
      "blocks": [
        {
          "type": "pairs",
          "items": [
            {
              "term": "Surveys lacked depth",
              "text": "Many people rushed through them."
            },
            {
              "term": "People liked the old brand",
              "text": "Many preferred the old fonts, colors and logo: status quo bias and the mere exposure effect."
            }
          ]
        }
      ]
    },
    {
      "id": "information-architecture",
      "stage": "Architecture",
      "title": "Information architecture",
      "blocks": [
        {
          "type": "p",
          "text": "I mapped the content people needed most, grouped the guidelines, and turned brand rules into components."
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Four core sections",
              "text": "Brand Strategy, Visual Identity (logos, color and type), Web Components, and Downloads."
            },
            {
              "term": "Download cards",
              "text": "Each file got a clear card with its formats (SVG, PNG, EPS) and its usage rules."
            },
            {
              "term": "Live color and type",
              "text": "Interactive color swatch cards and live typography previews, right in the brand site."
            }
          ]
        }
      ]
    },
    {
      "id": "new-identity",
      "stage": "Architecture",
      "title": "New identity",
      "blocks": [
        {
          "type": "figure",
          "img": {
            "src": "/images/v1/ku-brand-01.webp",
            "w": 968,
            "h": 312,
            "alt": "Abstract graphic in KU blue, crimson and yellow, with a tower, a grid and simple shapes"
          },
          "caption": "This graphic shows the core elements in the brand colors."
        },
        {
          "type": "p",
          "text": "The refreshed brand became one digital system for logos, colors, type and spacing."
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Visual system updates",
              "text": "A tighter type scale, spacing and color tokens."
            },
            {
              "term": "Making the brand easy to use",
              "text": "Content grouped naturally; outdated sections cleaned up."
            }
          ]
        }
      ]
    },
    {
      "id": "the-new-platform",
      "stage": "Architecture",
      "title": "The new platform",
      "blocks": [
        {
          "type": "p",
          "text": "“Towering Toward the Blue”, from KU’s Alma Mater, became the brand platform. We checked each design choice against it."
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Bold and clear",
              "text": "Strong type, a visible grid and wide space."
            },
            {
              "term": "Confident and warm",
              "text": "Active voice; words like climb, soar and build."
            },
            {
              "term": "Proud of Kansas",
              "text": "Real campus photos and familiar colors."
            }
          ]
        }
      ]
    },
    {
      "id": "design-system-decisions",
      "stage": "Architecture",
      "title": "Design system decisions",
      "blocks": [
        {
          "type": "pairs",
          "items": [
            {
              "term": "Keep the two core colors",
              "text": "Kansas Blue #0051ba and Crimson #e8000d."
            },
            {
              "term": "Name every color",
              "text": "Plain names like Night, Lake and Sky."
            },
            {
              "term": "Never rely on color alone",
              "text": "Every pairing passed a WCAG contrast check."
            },
            {
              "term": "Pick type by job",
              "text": "Roc Grotesk and Moret for headlines; Gotham Narrow or Freight Text for body."
            },
            {
              "term": "Use the grid and frames",
              "text": "Square grid units, Fire holding boxes, Lake pinpoints."
            },
            {
              "term": "Write in the brand voice",
              "text": "Active voice, present or future tense."
            }
          ]
        }
      ]
    },
    {
      "id": "color-sandbox",
      "stage": "Architecture",
      "title": "Color sandbox",
      "blocks": [
        {
          "type": "h3",
          "text": "Try the KU color system yourself"
        },
        {
          "type": "p",
          "text": "Pick any two of the 17 brand colors, or one of the 8 pairs from the system, and see whether it passes the same contrast check we used."
        },
        {
          "type": "kusandbox"
        }
      ]
    },
    {
      "id": "low-fi-to-high-fi",
      "stage": "Design",
      "title": "Low-fi to high-fi",
      "blocks": [
        {
          "type": "p",
          "text": "I added detail one layer at a time, keeping early steps grey so we discussed structure before color."
        },
        {
          "type": "split",
          "text": "Boxes and labels only: the order and size of each block.",
          "title": "1 · Boxes only",
          "img": {
            "src": "/images/v1/ku-brand-02.webp",
            "w": 1008,
            "h": 1008,
            "alt": "Boxes-only sketch of the Brand Center home page"
          },
          "caption": "Step 1. Structure only."
        },
        {
          "type": "split",
          "text": "Real navigation, headings and copy, to check the hierarchy.",
          "title": "2 · Grey wireframe",
          "img": {
            "src": "/images/v1/ku-brand-03.webp",
            "w": 1008,
            "h": 1102,
            "alt": "Wireframe of the Brand Center home page"
          },
          "caption": "Step 2. Real content, still grey.",
          "flip": true
        },
        {
          "type": "split",
          "text": "The holding box and pinpoints from the brand frame.",
          "title": "3 · Brand frame",
          "img": {
            "src": "/images/v1/ku-brand-04.webp",
            "w": 1008,
            "h": 1102,
            "alt": "Wireframe of the Brand Center home page with the red holding box and blue pinpoints"
          },
          "caption": "Step 3. The red box and blue dots mark the holding box and pinpoints."
        },
        {
          "type": "split",
          "text": "Photos and brand color, checked against the grey versions.",
          "title": "4 · High fidelity",
          "img": {
            "src": "/images/v1/ku-brand-05.webp",
            "w": 1008,
            "h": 1102,
            "alt": "High-fidelity version of the Brand Center home page"
          },
          "caption": "Step 4. Photos and color.",
          "flip": true
        },
        {
          "type": "h3",
          "text": "The same steps on two more pages"
        },
        {
          "type": "p",
          "text": "The same steps for the guideline and downloads pages."
        },
        {
          "type": "gallery",
          "items": [
            {
              "src": "/images/v1/ku-brand-06.webp",
              "w": 1024,
              "h": 1056,
              "alt": "Wireframe of a guideline page for color palettes",
              "caption": "Guideline page. A side menu keeps people oriented. Swatches come first, then pairings to use and avoid."
            },
            {
              "src": "/images/v1/ku-brand-07.webp",
              "w": 1024,
              "h": 1056,
              "alt": "Wireframe of the downloads page",
              "caption": "Downloads page. Filters on top, one card per file, and a path to request an official mark."
            }
          ],
          "cols": 2
        }
      ]
    },
    {
      "id": "bringing-it-together",
      "stage": "Design",
      "title": "Bringing it together",
      "blocks": [
        {
          "type": "p",
          "text": "With other designers and a developer, I built the logos, type, color tokens and spacing into every page."
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Typography",
              "text": "One type scale for every page."
            },
            {
              "term": "Color tokens",
              "text": "Cleaned up and named."
            },
            {
              "term": "Spacing rules",
              "text": "Tighter and more even."
            }
          ]
        }
      ]
    },
    {
      "id": "testing",
      "stage": "Test & launch",
      "title": "Testing",
      "blocks": [
        {
          "type": "p",
          "text": "Small focus groups tried early layouts and the old site. Their feedback shaped the hierarchy and the wording."
        },
        {
          "type": "p",
          "text": "Focus groups and A/B tests flagged tone, priority and confusing layouts."
        },
        {
          "type": "list",
          "items": [
            "We changed the tone of the copy.",
            "We changed the order of importance on the pages.",
            "We simplified the layouts that confused people."
          ]
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Clean in Figma, hard to use",
              "text": "Real people found some of these layouts confusing."
            }
          ]
        }
      ]
    },
    {
      "id": "the-new-brand-system",
      "stage": "Test & launch",
      "title": "Launch",
      "blocks": [
        {
          "type": "figure",
          "img": {
            "src": "/images/ku-brand-01-ff9ed1298f.webp",
            "w": 2200,
            "h": 942,
            "alt": "The KU Brand Center home page hero, with the Campanile against the sky and the brand grid over it"
          },
          "caption": ""
        },
        {
          "type": "p",
          "text": "Traffic across ku.edu grew 30% after launch. KU’s websites serve 50,000+ users and reach 80,000+ daily visitors."
        },
        {
          "type": "link",
          "text": "Visit brand.ku.edu",
          "href": "https://brand.ku.edu"
        }
      ]
    }
  ],
  "takeaways": [
    {
      "title": "Test outside the design tool",
      "text": "Layouts that look clean in Figma can feel hard to use for real people."
    },
    {
      "title": "Short conversations beat surveys",
      "text": "Small talks gave clearer insights; people rushed through long surveys."
    },
    {
      "title": "Keep early wireframes grey",
      "text": "So we discussed structure before color."
    },
    {
      "title": "Name things plainly",
      "text": "Plain color names, like Night, Lake and Sky, so everyone used the same words."
    }
  ],
  "part": "I talked with Kansans about what KU meant to them, then helped turn the new identity into a design system and a brand site for campus partners.",
  actions: [{ label: "Play with KU colors", href: "#color-sandbox", play: true }, { label: "Visit brand.ku.edu", href: "https://brand.ku.edu" }],
  years: "2023 to 2024",
  accent: "#0051BA",
  cover: I("ku-brand-01-ff9ed1298f.webp", 2200, 942, "The KU Brand Center home page hero, with the Campanile against the sky and the brand grid over it"),
  card: I("card-ku-brand.webp", 2000, 856, "The Campanile against a blue sky inside the KU brand grid"),
};

const Asians: CaseStudy = {
  "slug": "asians",
  "title": "Asian’s",
  "heading": "Asian’s",
  "short": "Volunteer UX research and design for a Berkeley restaurant: a mobile ordering app guests can use without talking.",
  "problem": "A small family restaurant had no online ordering, and language barriers led to wrong orders. We listened to guests and staff, sketched five early concepts and built a prototype. We tested it with at least ten guests. Then the pandemic closed the restaurant before we built the app.",
  "metrics": [
    {
      "value": "~50",
      "label": "People surveyed"
    },
    {
      "value": "10+",
      "label": "Guests tested the prototype"
    }
  ],
  "caveat": "I built an interactive prototype in Adobe XD. The restaurant closed in the pandemic before the app was built.",
  "spec": [
    {
      "label": "Organization",
      "value": "Asian’s (Berkeley, CA)"
    },
    {
      "label": "Outcome",
      "value": "A prototype for ordering without talking, to stop wrong orders caused by language barriers."
    },
    {
      "label": "Role",
      "value": "UX Researcher & Designer, project lead"
    },
    {
      "label": "Timeline",
      "value": "Fall 2021 to Spring 2022"
    },
    {
      "label": "Methods",
      "value": "Survey (about 50 answers), interviews, card sorting, usability testing"
    },
    {
      "label": "Team",
      "value": "Me, a UX researcher, and a visual designer"
    },
    {
      "label": "Tools",
      "value": "Adobe XD, InVision, Google Forms, Adobe Illustrator"
    },
    {
      "label": "Scope",
      "value": "A mobile ordering app guests can use without talking."
    }
  ],
  "sections": [
    {
      "id": "my-contribution",
      "stage": "TL;DR",
      "title": "My contribution",
      "blocks": [
        {
          "type": "h3",
          "text": "What I did"
        },
        {
          "type": "list",
          "items": [
            "Led the project and the team",
            "Ran the survey and interviews",
            "Built and tested the prototype with 10+ guests",
            "Cut checkout to a simple 2-step confirmation with saved payment methods"
          ]
        },
        {
          "type": "h3",
          "text": "The team and others"
        },
        {
          "type": "list",
          "items": [
            "A UX researcher and a visual designer helped with surveys"
          ]
        }
      ]
    },
    {
      "id": "the-problem",
      "stage": "Problem",
      "title": "The problem",
      "blocks": [
        {
          "type": "pairs",
          "items": [
            {
              "term": "Mix-ups happened often",
              "text": "Staff said miscommunication with customers happened often."
            },
            {
              "term": "Already ordering online elsewhere",
              "text": "Many guests used online ordering elsewhere and said it would make ordering here much easier."
            }
          ]
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "A guest said",
              "text": "“I’d like to order online because the owner doesn’t speak English, and I’ve gotten the wrong order several times.”"
            }
          ]
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "The core constraint",
              "text": "Many guests are not comfortable ordering aloud in English, so the app had to work without talking."
            }
          ]
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Problem statement",
              "text": "How might we create a simple mobile ordering app so guests can customize and place orders accurately, without worrying about language?"
            }
          ]
        }
      ]
    },
    {
      "id": "survey",
      "stage": "Research",
      "title": "Survey",
      "blocks": [
        {
          "type": "p",
          "text": "About 50 answers from a short Google Form. Each one led to a design choice."
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "90% want an app",
              "text": "So: a simple, clear ordering flow."
            },
            {
              "term": "77% are fine with English only",
              "text": "So: a language selector, for the rest."
            },
            {
              "term": "100% want popular dishes",
              "text": "So: a Popular Items section."
            },
            {
              "term": "70% like loyalty rewards",
              "text": "So: a loyalty badge and credits."
            }
          ]
        }
      ]
    },
    {
      "id": "what-guests-needed",
      "stage": "Research",
      "title": "Persona and needs",
      "blocks": [
        {
          "type": "h3",
          "text": "Persona: Emma"
        },
        {
          "type": "p",
          "text": "I created Emma, a non-native English speaker. She loves the restaurant but avoids ordering by phone or in person because of the language barrier."
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Favorites",
              "text": "Regular guests want to reorder the same dishes fast."
            },
            {
              "term": "Clear, fair prices",
              "text": "Guests on a budget need to see what they will pay."
            },
            {
              "term": "Easy categories",
              "text": "Food should be simple to browse, without reading long lists."
            },
            {
              "term": "VIP badge and rewards",
              "text": "Regular guests like to feel recognized for coming back."
            }
          ]
        }
      ]
    },
    {
      "id": "card-sorting",
      "stage": "Research",
      "title": "Card sorting",
      "blocks": [
        {
          "type": "p",
          "text": "Card sorting showed four groups. Each became a section of the Menu screen."
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Browse the menu",
              "text": "Popular dishes, categories, search, favorites."
            },
            {
              "term": "Rewards",
              "text": "VIP badge, credit, promo code, invites."
            },
            {
              "term": "My account",
              "text": "Payment, cards, order history, settings."
            },
            {
              "term": "Help",
              "text": "Help center, about us, contact."
            }
          ]
        }
      ]
    },
    {
      "id": "information-architecture",
      "stage": "Research",
      "title": "Information architecture",
      "blocks": [
        {
          "type": "p",
          "text": "Here is how the app is organized."
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Get started",
              "text": "Splash screen, welcome screen, language selector, sign up, log in."
            },
            {
              "term": "Ordering flow",
              "text": "Menu → Cart → Confirm Order → Payment"
            }
          ]
        }
      ]
    },
    {
      "id": "early-sketches",
      "stage": "Concepts",
      "title": "Early sketches",
      "blocks": [
        {
          "type": "p",
          "text": "I sketched five very different concepts and showed them to people."
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "A · Photo grid",
              "text": "Fast to browse, but hid prices."
            },
            {
              "term": "B · Category list",
              "text": "Clear like a paper menu, but plain."
            },
            {
              "term": "C · Popular first",
              "text": "Answered the survey’s ask for recommendations."
            },
            {
              "term": "D · Language first",
              "text": "For guests who struggle with English."
            },
            {
              "term": "E · Guided steps",
              "text": "Almost no reading, but more taps."
            }
          ]
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Why familiar patterns",
              "text": "Guests preferred the simplest, most direct option. The final design built on C, Popular first."
            }
          ]
        }
      ]
    },
    {
      "id": "paper-sketches",
      "stage": "Concepts",
      "title": "Paper sketches",
      "blocks": [
        {
          "type": "split",
          "text": "Then I sketched the full flow on paper: splash screen, onboarding, sign up, login, a home screen and a profile.",
          "img": {
            "src": "/images/asians-03-75cd6c1585.webp",
            "w": 1200,
            "h": 1247,
            "alt": "Pencil sketches of six app screens"
          },
          "caption": "My paper sketches of the core screens."
        }
      ]
    },
    {
      "id": "low-fidelity-wireframes",
      "stage": "Concepts",
      "title": "Low-fidelity wireframes",
      "blocks": [
        {
          "type": "p",
          "text": "I mapped every core flow in InVision, from sign up to checkout."
        },
        {
          "type": "figure",
          "img": {
            "src": "/images/asians-04-2b3903cca9.webp",
            "w": 2200,
            "h": 1261,
            "alt": "InVision low-fidelity wireframes of the full app flow"
          },
          "caption": "Low-fidelity wireframes in InVision. The orange blocks mark the main actions."
        }
      ]
    },
    {
      "id": "key-decisions",
      "stage": "Design",
      "title": "Key design decisions",
      "blocks": [
        {
          "type": "decisions",
          "items": [
            {
              "title": "One-tap language selector",
              "text": "A language toggle on the first screen, so guests can switch language right away."
            },
            {
              "title": "Popular items up top",
              "text": "Top-rated dishes lead the menu, so new guests decide quickly."
            },
            {
              "title": "Two-step checkout",
              "text": "Confirm, then pay with a saved payment method. No long forms."
            }
          ]
        }
      ]
    },
    {
      "id": "design-system",
      "stage": "Design",
      "title": "Design system",
      "blocks": [
        {
          "type": "p",
          "text": "There was no brand kit, so I built a small system. Orange became the action color: bright, warm and appetizing."
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Colors",
              "text": "Orange #FF5200, light orange #FE724C, pink red #FB2D52, green #00B46E, lime #93BC2D, charcoal #272727."
            },
            {
              "term": "Type",
              "text": "Herculanum for the logo and splash; Poppins for headings and body."
            }
          ]
        },
        {
          "type": "split",
          "text": "I looked at food ordering apps with clean layouts and large food photos.",
          "img": {
            "src": "/images/asians-05-0943b9706e.webp",
            "w": 900,
            "h": 1390,
            "alt": "Moodboard of food ordering app screens"
          },
          "caption": "Inspiration from food ordering apps.",
          "flip": true
        }
      ]
    },
    {
      "id": "high-fidelity",
      "stage": "Design",
      "title": "High fidelity",
      "blocks": [
        {
          "type": "p",
          "text": "Orange marks the main actions; a green header keeps the address and cart in view."
        },
        {
          "type": "figure",
          "img": {
            "src": "/images/asians-06-f207029491.webp",
            "w": 1682,
            "h": 937,
            "alt": "High-fidelity screens of the Asian’s app"
          },
          "caption": "The full flow in high fidelity."
        },
        {
          "type": "figure",
          "img": {
            "src": "/images/asians-07-c40b497de9.webp",
            "w": 1600,
            "h": 675,
            "alt": "Tilted high-fidelity screens on an orange background"
          },
          "caption": "Screens from sign up to the home menu."
        }
      ]
    },
    {
      "id": "sketch-to-design",
      "stage": "Design",
      "title": "Sketch to design",
      "blocks": [
        {
          "type": "p",
          "text": "See how each screen changed from paper sketch to wireframe to final design."
        },
        {
          "type": "h3",
          "text": "Splash"
        },
        {
          "type": "p",
          "text": "The sketch showed only the logo. The final added an orange letter and a short tap hint."
        },
        {
          "type": "gallery",
          "items": [
            {
              "src": "/images/asians-08-1be2b366c1.webp",
              "w": 266,
              "h": 520,
              "alt": "Splash paper sketch",
              "caption": "Paper sketch"
            },
            {
              "src": "/images/asians-09-3466da1ce6.webp",
              "w": 297,
              "h": 520,
              "alt": "Splash wireframe",
              "caption": "Wireframe"
            },
            {
              "src": "/images/asians-10-ea541e63fc.webp",
              "w": 384,
              "h": 798,
              "alt": "Splash high-fidelity screen",
              "caption": "Final design"
            }
          ],
          "cols": 3
        },
        {
          "type": "h3",
          "text": "Onboarding"
        },
        {
          "type": "p",
          "text": "The sketch had an image box and one line. The final added an illustration, a tagline, page dots and a Skip button."
        },
        {
          "type": "gallery",
          "items": [
            {
              "src": "/images/asians-11-3a3f97d8dd.webp",
              "w": 262,
              "h": 520,
              "alt": "Onboarding paper sketch",
              "caption": "Paper sketch"
            },
            {
              "src": "/images/asians-12-293b9baf06.webp",
              "w": 296,
              "h": 520,
              "alt": "Onboarding wireframe",
              "caption": "Wireframe"
            },
            {
              "src": "/images/asians-13-b4f4814452.webp",
              "w": 390,
              "h": 798,
              "alt": "Onboarding high-fidelity screen",
              "caption": "Final design"
            }
          ],
          "cols": 3
        },
        {
          "type": "h3",
          "text": "Sign up"
        },
        {
          "type": "p",
          "text": "The sketch had three fields and a button. The final added clear labels, an orange sign up button, and Facebook and Google options."
        },
        {
          "type": "gallery",
          "items": [
            {
              "src": "/images/asians-14-5189ad6e83.webp",
              "w": 270,
              "h": 520,
              "alt": "Sign up paper sketch",
              "caption": "Paper sketch"
            },
            {
              "src": "/images/asians-15-f427d73b27.webp",
              "w": 292,
              "h": 520,
              "alt": "Sign up wireframe",
              "caption": "Wireframe"
            },
            {
              "src": "/images/asians-16-d488cc30b4.webp",
              "w": 387,
              "h": 798,
              "alt": "Sign up high-fidelity screen",
              "caption": "Final design"
            }
          ],
          "cols": 3
        },
        {
          "type": "h3",
          "text": "Login"
        },
        {
          "type": "p",
          "text": "The sketch had two fields. The final reused the sign up pattern and added Forgot password and social login."
        },
        {
          "type": "gallery",
          "items": [
            {
              "src": "/images/asians-17-f753d64808.webp",
              "w": 262,
              "h": 520,
              "alt": "Login paper sketch",
              "caption": "Paper sketch"
            },
            {
              "src": "/images/asians-18-3eb366dd2a.webp",
              "w": 296,
              "h": 520,
              "alt": "Login wireframe",
              "caption": "Wireframe"
            },
            {
              "src": "/images/asians-19-801cb6f5a1.webp",
              "w": 390,
              "h": 798,
              "alt": "Login high-fidelity screen",
              "caption": "Final design"
            }
          ],
          "cols": 3
        },
        {
          "type": "h3",
          "text": "Home"
        },
        {
          "type": "p",
          "text": "The sketch had a popular row and a dish list. The final added a green header with the address, categories, prices, ratings and add buttons."
        },
        {
          "type": "gallery",
          "items": [
            {
              "src": "/images/asians-20-d9acb58c8b.webp",
              "w": 258,
              "h": 520,
              "alt": "Home paper sketch",
              "caption": "Paper sketch"
            },
            {
              "src": "/images/asians-21-7826a489b9.webp",
              "w": 298,
              "h": 520,
              "alt": "Home wireframe",
              "caption": "Wireframe"
            },
            {
              "src": "/images/asians-22-2937d5f56f.webp",
              "w": 384,
              "h": 798,
              "alt": "Home high-fidelity screen",
              "caption": "Final design"
            }
          ],
          "cols": 3
        },
        {
          "type": "h3",
          "text": "Profile"
        },
        {
          "type": "p",
          "text": "The sketch had a name and a menu list. The final added a photo, a badge and menu icons."
        },
        {
          "type": "gallery",
          "items": [
            {
              "src": "/images/asians-23-8950a618d7.webp",
              "w": 266,
              "h": 520,
              "alt": "Profile paper sketch",
              "caption": "Paper sketch"
            },
            {
              "src": "/images/asians-24-4e225fd653.webp",
              "w": 298,
              "h": 520,
              "alt": "Profile wireframe",
              "caption": "Wireframe"
            },
            {
              "src": "/images/asians-25-ab60ef16b2.webp",
              "w": 384,
              "h": 792,
              "alt": "Profile high-fidelity screen",
              "caption": "Final design"
            }
          ],
          "cols": 3
        }
      ]
    },
    {
      "id": "a-b-testing",
      "stage": "Test",
      "title": "A/B testing",
      "blocks": [
        {
          "type": "p",
          "text": "For each key screen I drew four versions and asked testers which they could use fastest."
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Home",
              "text": "Category rows, chips, search first, or a featured dish."
            },
            {
              "term": "Sign up",
              "text": "Three fields, social below, social first, or one question at a time."
            },
            {
              "term": "Onboarding",
              "text": "Image and Skip, full image, three steps, or text only."
            },
            {
              "term": "Checkout",
              "text": "Items, totals, payment first, or one page."
            }
          ]
        },
        {
          "type": "p",
          "text": "Testers also liked the warm color palette."
        }
      ]
    },
    {
      "id": "prototype",
      "stage": "Test",
      "title": "Prototype",
      "blocks": [
        {
          "type": "p",
          "text": "I built the high-fidelity screens into a clickable Adobe XD prototype, so testers could try a real order start to finish."
        },
        {
          "type": "link",
          "text": "Try the prototype",
          "href": "https://xd.adobe.com/view/b17983ec-566c-45c2-9c0c-a748f80b1719-e42a/?fullscreen"
        }
      ]
    },
    {
      "id": "usability-testing",
      "stage": "Test",
      "title": "Usability testing",
      "blocks": [
        {
          "type": "pairs",
          "items": [
            {
              "term": "A welcome screen",
              "text": "Testers wanted a friendly introduction before the menu."
            },
            {
              "term": "Address at the top",
              "text": "Testers liked seeing the address at the top of the screen."
            }
          ]
        }
      ]
    },
    {
      "id": "still-unfinished",
      "stage": "Test",
      "title": "Still unfinished",
      "blocks": [
        {
          "type": "p",
          "text": "The app never launched, so I could not measure orders or mistakes. Testing gave early signals only."
        }
      ]
    }
  ],
  "takeaways": [
    {
      "title": "Start with user research",
      "text": "A short survey of about 50 people influenced every major screen."
    },
    {
      "title": "Design from what people say",
      "text": "Language, recommendations and rewards came from guests, not my guesses."
    }
  ],
  "part": "I led a volunteer team to design an ordering app.",
  actions: [{ label: "Try the prototype", href: "https://xd.adobe.com/view/b17983ec-566c-45c2-9c0c-a748f80b1719-e42a/?fullscreen" }],
  years: "2021 to 2022",
  accent: "#FF5200",
  cover: I("asians-07-c40b497de9.webp", 1600, 675, "Tilted high-fidelity screens of the Asian’s app on an orange background"),
};

const Esri: CaseStudy = {
  "slug": "esri",
  "title": "Esri Calcite",
  "heading": "Calcite Design System Documentation",
  "short": "UI/UX design and front-end internship at Esri: an internal documentation website for the Calcite Design System, for designers and developers.",
  "glance": {"role": "UI/UX Design & Front-End Intern", "domain": "Developer tooling, design system documentation", "impact": "50%+ better content discoverability for 20+ designers and developers"},
  "problem": "Esri’s designers and developers had no single website to check how a component behaves, how to use it, or what code to copy.",
  "metrics": [
    {
      "value": "50%+",
      "label": "Improvement in content discoverability"
    },
    {
      "value": "20+",
      "label": "Designers and developers"
    }
  ],
  "caveat": "The 50%+ compares the new pages with the previous documentation, which was plain HTML with little cleanup. To follow privacy and NDA rules, I generalized internal metrics and unreleased component specs.",
  "spec": [
    {
      "label": "Product",
      "value": "Calcite Design System Documentation Site"
    },
    {
      "label": "Organization",
      "value": "Esri (Redlands, CA · Remote)"
    },
    {
      "label": "Role",
      "value": "UI/UX Design & Front-End Intern"
    },
    {
      "label": "Timeline",
      "value": "Summer 2021 (3 months)"
    },
    {
      "label": "Team",
      "value": "I worked daily with 20+ UI/UX designers and front-end engineers"
    }
  ],
  "sections": [
    {
      "id": "the-challenge",
      "stage": "Problem & context",
      "title": "The challenge",
      "blocks": [
        {
          "type": "p",
          "text": "During my internship, the Calcite Design System was changing fast on GitHub and in Figma."
        },
        {
          "type": "p",
          "text": "But designers and developers had no single website to check component behavior, usage rules and code snippets."
        },
        {
          "type": "p",
          "text": "With no single place to look, people spent extra time checking specs, and teams built the same components differently across web and mobile products."
        },
        {
          "type": "figure",
          "img": {
            "src": "/images/v1/esri-02.webp",
            "w": 968,
            "h": 466,
            "alt": "Diagram: separate sources on GitHub and Figma become one documentation site"
          },
          "caption": ""
        }
      ]
    },
    {
      "id": "audience",
      "stage": "Problem & context",
      "title": "Target audience & team dynamics",
      "blocks": [
        {
          "type": "p",
          "text": "The documentation had two audiences with different goals:"
        },
        {
          "type": "figure",
          "img": {
            "src": "/images/v1/esri-03.webp",
            "w": 968,
            "h": 424,
            "alt": "Diagram: two readers, UI/UX designers who want visuals and front-end engineers who want code"
          },
          "caption": ""
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "UI/UX designers",
              "text": "Need visual examples, variant states, layout rules, do’s and don’ts, and accessibility guidance, so products look consistent."
            },
            {
              "term": "Front-end engineers",
              "text": "Need property tables, exact HTML, CSS and JavaScript snippets, and API details, without clutter."
            }
          ]
        },
        {
          "type": "p",
          "text": "Before the site, developers struggled to find answers. They copied outdated component code or asked senior engineers."
        }
      ]
    },
    {
      "id": "core-constraint",
      "stage": "Problem & context",
      "title": "The core constraint",
      "blocks": [
        {
          "type": "pairs",
          "items": [
            {
              "term": "The core constraint",
              "text": "The documentation had to serve designers and engineers without making either group read what they didn’t need."
            }
          ]
        },
        {
          "type": "figure",
          "img": {
            "src": "/images/v1/esri-04.webp",
            "w": 968,
            "h": 416,
            "alt": "Diagram: designers and developers both read one documentation page"
          },
          "caption": ""
        },
        {
          "type": "p",
          "text": "It also had to stay easy to maintain as the design system grew."
        }
      ]
    },
    {
      "id": "crawl-walk-run",
      "stage": "Goals & phased execution strategy",
      "title": "Crawl, walk, run",
      "blocks": [
        {
          "type": "p",
          "text": "I had a three-month internship, so I worked in three steps:"
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Crawl (audit & structure)",
              "text": "I audited the Calcite components on GitHub and in Figma and listed the gaps, inconsistencies and missing guidelines across 40+ front-end pages."
            },
            {
              "term": "Walk (layout & component mechanics)",
              "text": "I designed the page layouts in Figma, with a clear hierarchy that kept visual guidance apart from code specs."
            },
            {
              "term": "Run (build & launch)",
              "text": "I built the responsive site in HTML, CSS and JavaScript, and wrote a hand-off guide for the design team."
            }
          ]
        }
      ]
    },
    {
      "id": "four-regions",
      "stage": "System architecture & information layout",
      "title": "Four clear regions",
      "blocks": [
        {
          "type": "p",
          "text": "To make each component page easy to scan, I split it into four regions:"
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Header & interactive preview",
              "text": "Component title, description, live interactive preview, and quick status tags."
            },
            {
              "term": "Usage guidelines (do’s & don’ts)",
              "text": "Examples of right and wrong layout, spacing and color."
            },
            {
              "term": "Component API & properties",
              "text": "Tables of props, slots, events and default values for developers."
            },
            {
              "term": "Code snippets & examples",
              "text": "HTML and JavaScript blocks people can copy straight into their code."
            }
          ]
        }
      ]
    },
    {
      "id": "decision-1",
      "stage": "Key design decisions & technical execution",
      "title": "Decision 1: Separating design guidance from code specs",
      "blocks": [
        {
          "type": "pairs",
          "items": [
            {
              "term": "What I did",
              "text": "I gave each component page two views. Designers scanned visual rules and variants; developers switched straight to specs and code."
            },
            {
              "term": "What it replaced",
              "text": "One long page that mixed code and visual guidelines, so everyone scrolled past what they didn’t need."
            }
          ]
        },
        {
          "type": "figure",
          "img": {
            "src": "/images/v1/esri-06.webp",
            "w": 1008,
            "h": 380,
            "alt": "Diagram: one component page with a Design view and a Code view to switch between"
          },
          "caption": ""
        }
      ]
    },
    {
      "id": "decision-2",
      "stage": "Key design decisions & technical execution",
      "title": "Decision 2: Show the rules, don’t describe them",
      "blocks": [
        {
          "type": "pairs",
          "items": [
            {
              "term": "What I did",
              "text": "I added side-by-side “Do” (green) and “Don’t” (red) cards, each with a short note on one rule."
            },
            {
              "term": "What it replaced",
              "text": "Paragraphs that described visual mistakes instead of showing them."
            }
          ]
        },
        {
          "type": "figure",
          "img": {
            "src": "/images/v1/esri-07.webp",
            "w": 1008,
            "h": 380,
            "alt": "Diagram: a Do card with a green check and a Don’t card with a red cross"
          },
          "caption": ""
        }
      ]
    },
    {
      "id": "decision-api",
      "stage": "Key design decisions & technical execution",
      "title": "Decision 3: Matching Figma names to code",
      "blocks": [
        {
          "type": "pairs",
          "items": [
            {
              "term": "What I did",
              "text": "Figma component properties and the Web Component prop names didn’t match. I worked with the engineering leads so every Figma variant name matched its code prop, one to one."
            }
          ]
        }
      ]
    },
    {
      "id": "decision-4",
      "stage": "Key design decisions & technical execution",
      "title": "Decision 4: Live previews and copyable code",
      "blocks": [
        {
          "type": "pairs",
          "items": [
            {
              "term": "What I did",
              "text": "I built live component previews with one-click copy buttons for the code."
            },
            {
              "term": "What it replaced",
              "text": "Screenshots of code that developers had to retype by hand."
            },
            {
              "term": "Governance and deprecation",
              "text": "I added badges that flag deprecated props, version updates and WCAG fallback styles."
            }
          ]
        },
        {
          "type": "figure",
          "img": {
            "src": "/images/v1/esri-08.webp",
            "w": 1008,
            "h": 380,
            "alt": "Diagram: a code snippet with a Copy button"
          },
          "caption": ""
        }
      ]
    },
    {
      "id": "usability-testing",
      "stage": "Testing, discoverability & results",
      "title": "Usability testing & iterative feedback",
      "blocks": [
        {
          "type": "p",
          "text": "I reviewed mockups and ran A/B tests with designers and developers, then refined the navigation and page layouts."
        },
        {
          "type": "figure",
          "img": {
            "src": "/images/v1/esri-09.webp",
            "w": 968,
            "h": 380,
            "alt": "Diagram: two page layouts, A and B, compared"
          },
          "caption": ""
        }
      ]
    },
    {
      "id": "measured-impact",
      "stage": "Testing, discoverability & results",
      "title": "Measured impact",
      "blocks": [
        {
          "type": "pairs",
          "items": [
            {
              "term": "50%+ improvement in content discoverability",
              "text": "Reorganized pages and a clearer hierarchy helped people find specs and code snippets much faster."
            }
          ]
        }
      ]
    }
  ],
  "takeaways": [
    {
      "title": "Internal documentation is a product",
      "text": "When I gave an internal tool the same care as a public product, designers and engineers saved real time."
    },
    {
      "title": "Design for dual audiences",
      "text": "Designers and developers read documentation differently. Pages that serve both, without clutter, are the ones that get used."
    },
    {
      "title": "Build for evolution",
      "text": "A flexible page template made it easy to add new components as the system grew."
    }
  ],
  "part": "I maintained the team’s internal documentation: 40+ front-end pages that bring the already-built Calcite components together in one place.",
  years: "2021",
  accent: "#007AC2",
  cover: I("card-esri.png", 1080, 694, "The four regions of a Calcite component documentation page"),
};

/* Luminary: still in development and under NDA, so the screens are our own
   low-fi wireframes (public/images/luminary-*.svg), labelled as illustrations. */
const Luminary: CaseStudy = {
  "slug": "luminary",
  "title": "Luminary",
  "heading": "Luminary Campus Navigation",
  "short": "UX design for Luminary, an AppTeamCarolina iOS app that helps students find accessible routes around the UNC Chapel Hill campus.",
  "glance": {"role": "UX Designer, AppTeamCarolina", "domain": "Accessible campus navigation, iOS", "impact": "Accessible routing tested in 50+ student sessions"},
  "problem": "Commercial map apps miss what students with mobility needs care about on campus: working elevators, steep slopes, accessible entrances and construction detours.",
  "metrics": [
    {
      "value": "50+",
      "label": "Student usability testing sessions"
    }
  ],
  "caveat": "Luminary is still in development, so I can’t show its screens. The wireframes on this page are my own illustrations of the flows, not the shipped design.",
  "spec": [
    {
      "label": "Product",
      "value": "Luminary iOS app (AppTeamCarolina)"
    },
    {
      "label": "Organization",
      "value": "University of North Carolina at Chapel Hill"
    },
    {
      "label": "Role",
      "value": "UX Designer"
    },
    {
      "label": "Timeline",
      "value": "September 2025 to May 2026"
    },
    {
      "label": "Team",
      "value": "Collaborating with iOS developers and product leads"
    },
    {
      "label": "Scope",
      "value": "Accessible routing, user research, usability testing, iOS interface design"
    },
    {
      "label": "Tools",
      "value": "Figma"
    }
  ],
  "sections": [
    {
      "id": "problem",
      "stage": "Problem",
      "title": "Problem and accessibility scope",
      "blocks": [
        {
          "type": "p",
          "text": "Getting around a large campus like UNC Chapel Hill is hard for new students, and harder for students with mobility impairments, temporary injuries or visual disabilities."
        },
        {
          "type": "p",
          "text": "Commercial map apps like Google Maps miss campus details that decide whether a route works: working elevators, steep slopes, accessible building entrances and temporary construction detours."
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Problem statement",
              "text": "How might we give students real-time, accessible campus navigation that accounts for mobility needs, elevator outages and steep slopes?"
            }
          ]
        }
      ]
    },
    {
      "id": "research",
      "stage": "Research",
      "title": "User research and usability testing",
      "blocks": [
        {
          "type": "p",
          "text": "I ran semi-structured interviews and more than 50 student usability testing sessions at locations across campus."
        },
        {
          "type": "pairs",
          "items": [
            {
              "term": "Unannounced obstacles",
              "text": "Students using wheelchairs or crutches often ran into stairs nobody warned them about, or building elevators that were out of service."
            },
            {
              "term": "Hidden entrances",
              "text": "First-year students struggled to find accessible building entrances in the short time between classes."
            }
          ]
        }
      ]
    },
    {
      "id": "phases",
      "stage": "Design",
      "title": "Phased strategy and route architecture",
      "blocks": [
        {
          "type": "pairs",
          "items": [
            {
              "term": "Phase 1 · Route filtering",
              "text": "Accessible route toggles: Wheelchair Accessible, Avoid Steep Slopes and Indoor Elevator Access."
            },
            {
              "term": "Phase 2 · Map interface",
              "text": "Map overlays with elevation markers and pins for accessible entrances."
            },
            {
              "term": "Phase 3 · Turn by turn",
              "text": "Accessible turn-by-turn cards with audio and VoiceOver support."
            }
          ]
        }
      ]
    },
    {
      "id": "decisions",
      "stage": "Design",
      "title": "Key design decisions",
      "blocks": [
        {
          "type": "decisions",
          "items": [
            {
              "title": "Rerouting around obstacles",
              "text": "When someone reports an elevator outage or a construction barrier, a banner appears and the route recalculates on its own."
            },
            {
              "title": "Slope before you walk",
              "text": "A route elevation graph flags steep inclines before students set off."
            },
            {
              "title": "High-contrast direction cards",
              "text": "Large, high-contrast cards that stay readable in bright sunlight and work with one hand."
            }
          ]
        }
      ]
    },
    {
      "id": "wireframes",
      "stage": "Design",
      "title": "Illustrative wireframes",
      "blocks": [
        {
          "type": "p",
          "text": "Because of the NDA, I drew these low-fidelity wireframes myself to show how the flows work. They are not Luminary’s real screens."
        },
        {
          "type": "gallery",
          "cols": 4,
          "items": [
            {
              "src": "/images/luminary-routes.svg",
              "w": 408,
              "h": 788,
              "alt": "Wireframe of route options: a destination field and toggles for wheelchair accessible, avoid steep slopes and indoor elevator access",
              "caption": "Illustrative wireframe. Route options."
            },
            {
              "src": "/images/luminary-map.svg",
              "w": 408,
              "h": 788,
              "alt": "Wireframe of a campus map with a route and pins marking step-free entrances",
              "caption": "Illustrative wireframe. Map with accessible entrances."
            },
            {
              "src": "/images/luminary-reroute.svg",
              "w": 408,
              "h": 788,
              "alt": "Wireframe of an elevator outage banner over a new route, with a slope graph below",
              "caption": "Illustrative wireframe. Outage reroute and slope graph."
            },
            {
              "src": "/images/luminary-turn.svg",
              "w": 408,
              "h": 788,
              "alt": "Wireframe of a large, high-contrast turn-by-turn card",
              "caption": "Illustrative wireframe. Turn-by-turn card."
            }
          ]
        }
      ]
    },
    {
      "id": "testing",
      "stage": "Test",
      "title": "Testing",
      "blocks": [
        {
          "type": "p",
          "text": "I measured navigation task completion across 50+ student sessions, looking at how fast students picked a route and whether they avoided detours."
        },
        {
          "type": "p",
          "text": "I then refined the user flows and prototypes, and built reusable design-system components and variants that cut interaction steps."
        }
      ]
    }
  ],
  "takeaways": [
    {
      "title": "Accessibility helps everyone",
      "text": "Designing for mobility needs made navigation clearer for all students, including those carrying heavy equipment or walking in bad weather."
    },
    {
      "title": "Real-time accuracy builds trust",
      "text": "A navigation app is only as reliable as its live data. Clear warnings for construction barriers built long-term trust."
    }
  ],
  "part": "I designed accessible routing for a campus navigation app and tested it in 50+ student sessions.",
  actions: [{ label: "View wireframes", href: "#wireframes" }],
  years: "2025 to 2026",
  accent: "#4B9CD3",
  cover: I("luminary-cover.svg", 1080, 694, "Three illustrative wireframes of Luminary: route options, a campus map and a turn card"),
  card: I("luminary-cover-dark.svg", 1080, 694, "Three illustrative wireframes of Luminary: route options, a campus map and a turn card"),
};

export const cases: CaseStudy[] = [SurgicalConsole, Luminary, KuBrand, Asians, Esri];
export const getCase = (slug: string) => cases.find((c) => c.slug === slug);
