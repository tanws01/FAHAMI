# ============================================================
#  FAHAMI local server (PowerShell, zero dependencies)
#  Serves this folder over http:// so the app can fetch live
#  DOSM Open Data. Uses .NET HttpListener — no Python or Node needed.
#  Windows PowerShell 5.1 (built in) is enough.
# ============================================================
$ErrorActionPreference = "Stop"
$port = 5273
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".htm"  = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "text/javascript; charset=utf-8"
  ".mjs"  = "text/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".gif"  = "image/gif"
  ".ico"  = "image/x-icon"
  ".webp" = "image/webp"
  ".woff" = "font/woff"
  ".woff2"= "font/woff2"
  ".txt"  = "text/plain; charset=utf-8"
  ".map"  = "application/json; charset=utf-8"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try {
  $listener.Start()
} catch {
  Write-Host ""
  Write-Host "  [!] Could not start the server on port $port."
  Write-Host "      Another program may be using it. Close it, or edit `$port in serve.ps1."
  Write-Host ""
  Read-Host "Press Enter to exit"
  exit 1
}

Write-Host ""
Write-Host "  FAHAMI  is now running at:   http://localhost:$port"
Write-Host "  Open that URL in your browser. Press Ctrl+C here to stop."
Write-Host ""

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $req = $context.Request
    $res = $context.Response
    try {
      # Map the request path to a file under $root, guarding against traversal.
      $rel = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath).TrimStart("/")
      if ($rel -eq "") { $rel = "index.html" }
      $rel = $rel -replace "/", "\"
      $full = [System.IO.Path]::GetFullPath((Join-Path $root $rel))

      if (-not $full.StartsWith([System.IO.Path]::GetFullPath($root))) {
        $res.StatusCode = 403
      } elseif (Test-Path $full -PathType Container) {
        $full = Join-Path $full "index.html"
        if (-not (Test-Path $full)) { $res.StatusCode = 404 }
      }

      if ($res.StatusCode -ne 403 -and (Test-Path $full -PathType Leaf)) {
        $bytes = [System.IO.File]::ReadAllBytes($full)
        $ext = [System.IO.Path]::GetExtension($full).ToLower()
        $ct = $mime[$ext]; if (-not $ct) { $ct = "application/octet-stream" }
        $res.ContentType = $ct
        # Never cache during local development, so edits always show on refresh.
        $res.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
        Write-Host ("  200  /{0}" -f ($rel -replace '\\','/'))
      } elseif ($res.StatusCode -ne 403) {
        $res.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: /$rel")
        $res.OutputStream.Write($msg, 0, $msg.Length)
        Write-Host ("  404  /{0}" -f ($rel -replace '\\','/'))
      }
    } catch {
      $res.StatusCode = 500
    } finally {
      $res.OutputStream.Close()
    }
  }
} finally {
  $listener.Stop()
}
