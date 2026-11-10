#!/usr/bin/env python3
"""Build the Control Room page from the brain files.

  python3 dashboard/build.py   -> dashboard/out/index.html  (the secretary publishes it as the Control Room artifact)

Only real data from brain/*.json. Missing numbers show as "no data yet", never invented.
"""
import datetime as dt
import html
import json
import pathlib
from zoneinfo import ZoneInfo

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "dashboard/out"
NOW = dt.datetime.now(ZoneInfo("Europe/London"))
E = lambda s: html.escape(str(s if s is not None else ""), quote=True)  # noqa: E731
STAGES = ["idea", "ok1", "thumb", "ok2", "script", "ok3", "assets", "storyboard", "ok4", "review360", "ok5", "final",
          "upload_ready", "ok6", "uploaded", "reviewed48h", "reviewed7d"]


def J(p):
    try:
        return json.loads((ROOT / p).read_text(encoding="utf-8"))
    except Exception:  # noqa: BLE001
        return {}


status, goals, plan = J("brain/status.json"), J("brain/goals.json"), J("brain/plan.json")
latest = goals.get("latest", {})
logs = sorted((ROOT / "brain/log").glob("20*.md"), reverse=True)[:8]


def num(v, unit=""):
    return f"<b>{E(v)}{unit}</b>" if v is not None else '<b class="na">no data yet</b>'


def progress(v, target):
    pct = 0 if v is None else min(100, round(100 * v / target))
    return f'<div class="bar"><i style="width:{pct}%"></i></div><small>{pct}% of {target:,}</small>'


start, end = goals.get("start", "2026-11-10"), goals.get("deadline", "2027-02-08")
days_left = (dt.date.fromisoformat(end) - NOW.date()).days
today = "".join(f'<li><a href="{E(t.get("link") or "#")}" target="_blank" rel="noopener">{E(t["task"])}</a> <small>{E(t.get("mins", ""))} min</small></li>'
                for t in status.get("today", [])[:3]) or "<li>Nothing today.</li>"
approvals = "".join(f'<li>{E(a["what"])} <small>say: <code>{E(a.get("say", ""))}</code> · since {E(a.get("since", ""))}</small></li>'
                    for a in status.get("approvals", [])) or "<li>Nothing waiting.</li>"
alerts = "".join(f"<li>{E(a.get('text', a))}</li>" for a in status.get("alerts", [])) or "<li>No alerts.</li>"
rows = "".join(f'<tr><td>{E(v.get("slug", ""))}</td><td>{E(v.get("title", ""))}</td><td><span class="chip">{E(v.get("stage", ""))}</span></td>'
               f'<td>{E(v.get("due", ""))}</td></tr>' for v in plan.get("videos", [])) or '<tr><td colspan="4">No videos planned yet.</td></tr>'
log_html = "".join(f"<li>{E(p.read_text(encoding='utf-8').strip())}</li>" for p in logs)
name = (status.get("channel") or {}).get("name") or "AI Channel (working name)"

page = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Control Room</title><style>
:root{{--bg:#F4F4F0;--card:#fff;--ink:#0E1014;--muted:#5F636B;--line:#E2E3E6;--acc:#2F6FEB;}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#0E1014;--card:#171A21;--ink:#F4F4F0;--muted:#9AA0AA;--line:#262A33;--acc:#4F8CFF;}}}}
:root[data-theme="dark"]{{--bg:#0E1014;--card:#171A21;--ink:#F4F4F0;--muted:#9AA0AA;--line:#262A33;--acc:#4F8CFF;}}
body{{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 Inter,system-ui,sans-serif}}
main{{max-width:1100px;margin:0 auto;padding:24px 16px}} h1{{font-size:26px;margin:0 0 4px}} h2{{font-size:16px;margin:0 0 10px}}
.grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;margin-top:16px}}
.card{{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px}} small,.na{{color:var(--muted)}}
.bar{{height:8px;background:var(--line);border-radius:4px;margin:6px 0 2px}} .bar i{{display:block;height:8px;background:var(--acc);border-radius:4px}}
ul{{padding-left:18px;margin:0}} li{{margin:4px 0}} table{{width:100%;border-collapse:collapse}} td{{padding:6px;border-top:1px solid var(--line)}}
.chip{{background:var(--line);border-radius:10px;padding:1px 8px;font-size:12px}} a{{color:var(--acc)}} code{{font-size:12px}}
.overflow{{overflow-x:auto}}
</style></head><body><main>
<h1>Control Room · {E(name)}</h1><small>Updated {NOW:%a %d %b %Y, %H:%M} London · {days_left} days left of 90</small>
<div class="grid">
<section class="card"><h2>Today (max 3)</h2><ul>{today}</ul></section>
<section class="card"><h2>Waiting for your OK</h2><ul>{approvals}</ul></section>
<section class="card"><h2>Goal by {E(end)}</h2>
 <div>Subscribers {num(latest.get("subscribers"))}</div>{progress(latest.get("subscribers"), 1000)}
 <div style="margin-top:8px">Public watch hours {num(latest.get("watch_hours_public"))}</div>{progress(latest.get("watch_hours_public"), 4000)}
 <div style="margin-top:8px"><small>CTR {num(latest.get("ctr_pct"), "%")} · avg view {num(latest.get("avg_view_duration_s"), " s")}</small></div></section>
</div>
<section class="card" style="margin-top:16px"><h2>This week's videos</h2><div class="overflow"><table>{rows}</table></div></section>
<div class="grid"><section class="card"><h2>Alerts</h2><ul>{alerts}</ul></section>
<section class="card"><h2>Recent runs</h2><ul>{log_html}</ul></section></div>
</main></body></html>"""
OUT.mkdir(parents=True, exist_ok=True)
(OUT / "index.html").write_text(page, encoding="utf-8")
print(f"wrote {OUT / 'index.html'}")
