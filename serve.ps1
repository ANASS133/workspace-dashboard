param(
    [ValidateRange(1, 65535)]
    [int]$Port = 8080
)

$serverRoot = [System.IO.Path]::GetFullPath($PSScriptRoot)
$rootBoundary = $serverRoot.TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$Port/")

$mimeTypes = @{
    '.html'        = 'text/html; charset=utf-8'
    '.js'          = 'text/javascript; charset=utf-8'
    '.css'         = 'text/css; charset=utf-8'
    '.json'        = 'application/json; charset=utf-8'
    '.webmanifest' = 'application/manifest+json; charset=utf-8'
    '.svg'         = 'image/svg+xml'
    '.png'         = 'image/png'
    '.ico'         = 'image/x-icon'
}

try {
    $listener.Start()
    Write-Host "Workspace Dashboard is running at http://localhost:$Port" -ForegroundColor Green
    Write-Host 'Press Ctrl+C to stop the server.' -ForegroundColor DarkGray

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        try {
            $relativePath = [System.Uri]::UnescapeDataString($context.Request.Url.AbsolutePath).TrimStart('/')
            if ([string]::IsNullOrWhiteSpace($relativePath)) { $relativePath = 'index.html' }

            $requestedPath = [System.IO.Path]::GetFullPath(
                [System.IO.Path]::Combine($serverRoot, $relativePath.Replace('/', [System.IO.Path]::DirectorySeparatorChar))
            )

            if (-not $requestedPath.StartsWith($rootBoundary, [System.StringComparison]::OrdinalIgnoreCase)) {
                $context.Response.StatusCode = 403
            }
            elseif (-not [System.IO.File]::Exists($requestedPath)) {
                $context.Response.StatusCode = 404
            }
            else {
                $extension = [System.IO.Path]::GetExtension($requestedPath).ToLowerInvariant()
                $contentType = $mimeTypes[$extension]
                if (-not $contentType) { $contentType = 'application/octet-stream' }
                $bytes = [System.IO.File]::ReadAllBytes($requestedPath)
                $context.Response.StatusCode = 200
                $context.Response.ContentType = $contentType
                $context.Response.ContentLength64 = $bytes.Length
                $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
        }
        catch {
            $context.Response.StatusCode = 500
        }
        finally {
            $context.Response.OutputStream.Close()
        }
    }
}
finally {
    if ($listener.IsListening) { $listener.Stop() }
    $listener.Close()
}
