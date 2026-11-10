#!/usr/bin/env python3
"""Monday stats report with no Claude: public YouTube numbers -> brain/stats/<date>.md + brain/goals.json "latest".

Needs secret YT_API_KEY (YouTube Data API key) and the channel id in repo variable YT_CHANNEL_ID (or brain/status.json -> channel.id).
Only real numbers are written; if the key or id is missing the report says "not connected" (never estimated).
Watch hours, CTR and average view duration are private (YouTube Analytics, OAuth): the analytics-review role reads them from
vidIQ or YouTube Studio screenshots and writes them into brain/goals.json by hand.
"""
import datetime as dt, json, os, pathlib, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
today = dt.date.today().isoformat()


def get(url):
    with urllib.request.urlopen(url, timeout=60) as r: return json.load(r)


def main():
    key = os.environ.get("YT_API_KEY")
    st = json.loads((ROOT / "brain/status.json").read_text())
    cid = os.environ.get("YT_CHANNEL_ID") or (st.get("channel") or {}).get("id")
    goals_p = ROOT / "brain/goals.json"; goals = json.loads(goals_p.read_text())
    lines = [f"# Weekly stats {today}", ""]
    if not key or not cid:
        lines.append("YouTube: not connected (needs secret YT_API_KEY and variable YT_CHANNEL_ID).")
    else:
        base = "https://www.googleapis.com/youtube/v3/"
        ch = get(f"{base}channels?part=statistics,contentDetails&id={cid}&key={key}")["items"][0]
        s = ch["statistics"]; subs = int(s.get("subscriberCount", 0)); views = int(s.get("viewCount", 0))
        uploads = ch["contentDetails"]["relatedPlaylists"]["uploads"]
        items = get(f"{base}playlistItems?part=contentDetails&maxResults=10&playlistId={uploads}&key={key}").get("items", [])
        ids = ",".join(i["contentDetails"]["videoId"] for i in items)
        vids = get(f"{base}videos?part=statistics,snippet&id={ids}&key={key}").get("items", []) if ids else []
        lines += [f"- Subscribers: {subs:,}", f"- Total views: {views:,}", f"- Videos: {s.get('videoCount')}", "", "| Video | Published | Views | Likes | Comments |", "|---|---|---|---|---|"]
        for v in vids:
            vs = v["statistics"]
            lines.append(f"| {v['snippet']['title']} | {v['snippet']['publishedAt'][:10]} | {vs.get('viewCount', 0)} | {vs.get('likeCount', 0)} | {vs.get('commentCount', 0)} |")
        goals["latest"].update({"date": today, "subscribers": subs, "views_total": views})
        goals.setdefault("history", []).append({"date": today, "subscribers": subs, "views_total": views})
        goals_p.write_text(json.dumps(goals, indent=2) + "\n")
    out = ROOT / f"brain/stats/{today}.md"; out.parent.mkdir(exist_ok=True)
    out.write_text("\n".join(lines) + "\n"); print("\n".join(lines))


if __name__ == "__main__":
    main()
