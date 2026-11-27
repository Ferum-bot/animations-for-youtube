// Positions measured on the archived pages, in CSS pixels at an 820 px viewport.
export const captures = {
  discord: {
    source: "https://discordstatus.com/incidents/rdzvjlyq54z1",
    height: 880, focusY: 280, separateCover: false,
    lines: [[378, 480, 252, 18]],
  },
  figma: {
    source: "https://www.figma.com/blog/livegraph-real-time-data-at-scale/",
    height: 850, focusY: 250, separateCover: true,
    lines: [[446, 450, 271, 20]],
  },
  flannel: {
    source: "https://slack.engineering/flannel-an-application-level-edge-cache/",
    height: 1827, focusY: 1227, separateCover: false,
    lines: [[247, 1427, 287, 26]],
  },
  github: {
    source: "https://github.blog/news-insights/company-news/github-availability-report-december-2024/",
    height: 1841, focusY: 1241, separateCover: false,
    lines: [[40, 1441, 236, 21]],
  },
  gitlab: {
    source: "https://gitlab.com/gitlab-com/gl-infra/production/-/issues/7729",
    height: 897, focusY: 297, separateCover: false,
    lines: [[81, 519, 226, 18]],
  },
  grace: {
    source: "https://www.geekwire.com/2017/slacks-julia-grace-lessons-learned-downtime-responsibility-pay-forward/",
    height: 1661, focusY: 1061, separateCover: false,
    lines: [[517, 1261, 254, 24]],
  },
  slack: {
    source: "https://slack-status.com/2017-10-31",
    height: 807, focusY: 207, separateCover: false,
    lines: [[98, 407, 222, 21]],
  },
} as const;
