Set-Location $PSScriptRoot
Add-Type -AssemblyName System.Drawing

function New-CardImage {
  param(
    [string]$InputFile,
    [string]$OutputFile,
    [bool]$TrimDark = $false
  )

  $src = [System.Drawing.Bitmap]::new($InputFile)
  try {
    $cropX = 0; $cropY = 0; $cropW = $src.Width; $cropH = $src.Height

    if ($TrimDark) {
      $minX = $src.Width; $minY = $src.Height; $maxX = -1; $maxY = -1
      for ($y = 0; $y -lt $src.Height; $y++) {
        for ($x = 0; $x -lt $src.Width; $x++) {
          $p = $src.GetPixel($x, $y)
          if ($p.A -gt 20 -and ($p.R -gt 24 -or $p.G -gt 24 -or $p.B -gt 24)) {
            if ($x -lt $minX) { $minX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -gt $maxY) { $maxY = $y }
          }
        }
      }
      if ($maxX -ge $minX -and $maxY -ge $minY) {
        $padX = [int](($maxX - $minX + 1) * 0.08)
        $padY = [int](($maxY - $minY + 1) * 0.08)
        $cropX = [Math]::Max(0, $minX - $padX)
        $cropY = [Math]::Max(0, $minY - $padY)
        $cropW = [Math]::Min($src.Width - $cropX, ($maxX - $minX + 1) + ($padX * 2))
        $cropH = [Math]::Min($src.Height - $cropY, ($maxY - $minY + 1) + ($padY * 2))
      }
    }

    $targetRatio = 4.0 / 3.0
    $ratio = $cropW / [double]$cropH
    if ($ratio -gt $targetRatio) {
      $newW = [int]([Math]::Round($cropH * $targetRatio))
      $cropX += [int](($cropW - $newW) / 2)
      $cropW = $newW
    } elseif ($ratio -lt $targetRatio) {
      $newH = [int]([Math]::Round($cropW / $targetRatio))
      $cropY += [int](($cropH - $newH) / 2)
      $cropH = $newH
    }

    $dst = [System.Drawing.Bitmap]::new(800, 600)
    try {
      $g = [System.Drawing.Graphics]::FromImage($dst)
      try {
        $g.Clear([System.Drawing.Color]::Black)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighSpeed

        $destRect = [System.Drawing.Rectangle]::new(0, 0, 800, 600)
        $srcRect = [System.Drawing.Rectangle]::new($cropX, $cropY, $cropW, $cropH)
        $g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
      }
      finally {
        $g.Dispose()
      }
      $dst.Save($OutputFile, [System.Drawing.Imaging.ImageFormat]::Png)
      Write-Host "Generado $OutputFile"
    }
    finally {
      $dst.Dispose()
    }
  }
  finally {
    $src.Dispose()
  }
}

New-CardImage -InputFile "31cb9f8971db3d7.webp" -OutputFile "cow.png" -TrimDark $true
New-CardImage -InputFile "my-first-try-for-a-pixelart-of-the-chicken-let-me-know-what-v0-ow1tqzici6u21.png" -OutputFile "chicken.png" -TrimDark $true
New-CardImage -InputFile "Gallinero.png" -OutputFile "barn.png"
New-CardImage -InputFile "Cultivos.png" -OutputFile "crops.png"
New-CardImage -InputFile "frutas.png" -OutputFile "fruits.png"
New-CardImage -InputFile "Cosechaavender.png" -OutputFile "harvest.png"
