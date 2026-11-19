param(
    [int]$Port = 8080,
    [string]$Root = $PSScriptRoot
)

if ([string]::IsNullOrEmpty($Root)) {
    $Root = (Get-Location).Path
}

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "=================================================" -ForegroundColor Cyan
    Write-Host "  OpenCompilers Hub - Servidor Local Activo" -ForegroundColor Green
    Write-Host "  URL: $prefix" -ForegroundColor Yellow
    Write-Host "  Raiz: $Root" -ForegroundColor DarkGray
    Write-Host "=================================================" -ForegroundColor Cyan
} catch {
    Write-Error "Error al iniciar el servidor en el puerto $($Port): $_"
    exit 1
}

$mimeTypes = @{
    ".html"   = "text/html; charset=utf-8"
    ".htm"    = "text/html; charset=utf-8"
    ".css"    = "text/css; charset=utf-8"
    ".js"     = "application/javascript; charset=utf-8"
    ".json"   = "application/json; charset=utf-8"
    ".svg"    = "image/svg+xml"
    ".png"    = "image/png"
    ".jpg"    = "image/jpeg"
    ".jpeg"   = "image/jpeg"
    ".ico"    = "image/x-icon"
    ".woff"   = "font/woff"
    ".woff2"  = "font/woff2"
    ".ttf"    = "font/ttf"
    ".txt"    = "text/plain; charset=utf-8"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $path = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($path) -or $path -eq "") {
            $path = "index.html"
        }

        # Decodificar URL y resolver ruta
        $decodedPath = [System.Uri]::UnescapeDataString($path)
        $fullPath = [System.IO.Path]::GetFullPath((Join-Path $Root $decodedPath))

        # Evitar Directory Traversal
        if (-not $fullPath.StartsWith($Root, [System.StringComparison]::OrdinalIgnoreCase)) {
            $response.StatusCode = 403
            $bytes = [System.Text.Encoding]::UTF8.GetBytes("403 Forbidden")
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        if (Test-Path $fullPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $response.ContentType = $contentType
            $response.StatusCode = 200

            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")

            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Host "[$([DateTime]::Now.ToString('HH:mm:ss'))] 200 OK: $decodedPath" -ForegroundColor DarkGreen
        } else {
            $response.StatusCode = 404
            $response.ContentType = "text/plain; charset=utf-8"
            $bytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $decodedPath")
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Host "[$([DateTime]::Now.ToString('HH:mm:ss'))] 404 Not Found: $decodedPath" -ForegroundColor Red
        }

        $response.Close()
    }
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
        $listener.Close()
    }
}
