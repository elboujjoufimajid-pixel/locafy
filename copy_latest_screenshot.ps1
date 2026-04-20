$latest = Get-ChildItem 'C:\Users\Perfect PC\Pictures\Screenshots\' | Sort-Object LastWriteTime | Select-Object -Last 1
if ($latest) {
    Copy-Item -LiteralPath $latest.FullName -Destination 'C:\Users\Perfect PC\orientalloc\latest_screenshot.png'
    Write-Host "Copied: $($latest.Name)"
}
