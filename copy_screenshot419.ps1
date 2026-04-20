$files = Get-ChildItem 'C:\Users\Perfect PC\Pictures\Screenshots\' | Sort-Object LastWriteTime
$target = $files | Where-Object { $_.Name -like '*(419)*' } | Select-Object -First 1
if (-not $target) { $target = $files | Select-Object -Last 1 }
Copy-Item -LiteralPath $target.FullName -Destination 'C:\Users\Perfect PC\orientalloc\screenshot419.png'
Write-Host "Copied: $($target.Name)"
