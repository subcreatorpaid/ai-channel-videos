# Copies every finished video (and its thumbnail) from GitHub Releases to this PC, one folder per video.
# No Claude needed: right-click > "Run with PowerShell" (or: powershell -ExecutionPolicy Bypass -File get_videos.ps1).
# Default folder: Downloads\ai-channel-videos. New or re-rendered files are downloaded; unchanged ones are skipped.
param([string]$Out = "$env:USERPROFILE\Downloads\ai-channel-videos")

$repo = "subcreatorpaid/ai-channel-videos"
$ProgressPreference = "SilentlyContinue"
$rels = @(); $page = 1
do {
    $batch = Invoke-RestMethod "https://api.github.com/repos/$repo/releases?per_page=100&page=$page"
    $rels += $batch; $page++
} while ($batch.Count -eq 100)
$new = 0
foreach ($rel in $rels) {
    if ($rel.tag_name -notlike "video-*") { continue }   # previews (360p) stay on GitHub
    $slug = $rel.tag_name.Substring(6)
    $dir = Join-Path $Out $slug
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    foreach ($a in $rel.assets) {
        $dest = Join-Path $dir $a.name
        if ((Test-Path $dest) -and ((Get-Item $dest).Length -eq $a.size)) { continue }
        Invoke-WebRequest $a.browser_download_url -OutFile $dest
        Write-Host "got $slug $($a.name)"; $new++
    }
}
Write-Host "Done: $new new file(s) in $Out"
