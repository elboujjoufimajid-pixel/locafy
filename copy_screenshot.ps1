$src = Get-ChildItem 'C:\Users\Perfect PC\Pictures\Screenshots\' | Where-Object { $_.Name -like '*(418)*' } | Select-Object -First 1
if ($src) {
    Copy-Item -LiteralPath $src.FullName -Destination 'C:\Users\Perfect PC\orientalloc\screenshot418.png'
    Write-Host "Copied: $($src.FullName)"
} else {
    Write-Host "Not found"
}
