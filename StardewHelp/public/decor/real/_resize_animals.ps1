Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName PresentationCore
Add-Type -AssemblyName WindowsBase

$base = $PSScriptRoot

function Convert-ToPngFromAny {
  param([string]$input,[string]$output)
  $inPath = Join-Path $base $input
  $outPath = Join-Path $base $output
  $fileUri = 'file:///' + (($inPath -replace '\\','/') -replace ' ','%20')
  $uri = [System.Uri]::new($fileUri)
  $frame = [System.Windows.Media.Imaging.BitmapFrame]::Create($uri)
  $enc = New-Object System.Windows.Media.Imaging.PngBitmapEncoder
  $enc.Frames.Add($frame)
  $fs = [System.IO.File]::Open($outPath,[System.IO.FileMode]::Create,[System.IO.FileAccess]::Write,[System.IO.FileShare]::None)
  $enc.Save($fs)
  $fs.Close()
}

function Build-SpriteCard {
  param(
    [string]$sourcePng,
    [string]$outputPng,
    [double]$scale
  )

  $srcPath = Join-Path $base $sourcePng
  $dstPath = Join-Path $base $outputPng

  $src = [System.Drawing.Bitmap]::new($srcPath)
  try {
    $minX = $src.Width
    $minY = $src.Height
    $maxX = -1
    $maxY = -1

    for ($y = 0; $y -lt $src.Height; $y++) {
      for ($x = 0; $x -lt $src.Width; $x++) {
        $p = $src.GetPixel($x, $y)
        if ($p.R -lt 18 -and $p.G -lt 18 -and $p.B -lt 18) {
          $src.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, $p.R, $p.G, $p.B))
        }
      }
    }

    for ($y = 0; $y -lt $src.Height; $y++) {
      for ($x = 0; $x -lt $src.Width; $x++) {
        $p = $src.GetPixel($x, $y)
        if ($p.A -gt 10) {
          if ($x -lt $minX) { $minX = $x }
          if ($y -lt $minY) { $minY = $y }
          if ($x -gt $maxX) { $maxX = $x }
          if ($y -gt $maxY) { $maxY = $y }
        }
      }
    }

    if ($maxX -lt $minX -or $maxY -lt $minY) {
      throw "No se detectaron pixeles del sprite en $sourcePng"
    }

    $pad = 2
    $minX = [Math]::Max(0, $minX - $pad)
    $minY = [Math]::Max(0, $minY - $pad)
    $maxX = [Math]::Min($src.Width - 1, $maxX + $pad)
    $maxY = [Math]::Min($src.Height - 1, $maxY + $pad)

    $cropW = $maxX - $minX + 1
    $cropH = $maxY - $minY + 1

    $cropRect = [System.Drawing.Rectangle]::new($minX, $minY, $cropW, $cropH)
    $crop = $src.Clone($cropRect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    try {
      $canvasW = 800
      $canvasH = 600
      $dst = [System.Drawing.Bitmap]::new($canvasW, $canvasH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
      try {
        $g = [System.Drawing.Graphics]::FromImage($dst)
        try {
          $g.Clear([System.Drawing.Color]::Transparent)
          $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
          $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
          $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None

          $maxW = [int]([Math]::Round($canvasW * $scale))
          $maxH = [int]([Math]::Round($canvasH * $scale))

          $ratio = $cropW / [double]$cropH
          $boxRatio = $maxW / [double]$maxH

          if ($ratio -gt $boxRatio) {
            $drawW = $maxW
            $drawH = [int]([Math]::Round($maxW / $ratio))
          } else {
            $drawH = $maxH
            $drawW = [int]([Math]::Round($maxH * $ratio))
          }

          $x = [int](($canvasW - $drawW) / 2)
          $y = [int](($canvasH - $drawH) / 2)

          $g.DrawImage($crop, [System.Drawing.Rectangle]::new($x, $y, $drawW, $drawH))
        }
        finally {
          $g.Dispose()
        }

        $dst.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)
      }
      finally {
        $dst.Dispose()
      }
    }
    finally {
      $crop.Dispose()
    }
  }
  finally {
    $src.Dispose()
  }
}

Convert-ToPngFromAny -input '31cb9f8971db3d7.webp' -output '_cow_src.png'
Convert-ToPngFromAny -input 'my-first-try-for-a-pixelart-of-the-chicken-let-me-know-what-v0-ow1tqzici6u21.png' -output '_chicken_src.png'

Build-SpriteCard -sourcePng '_cow_src.png' -outputPng 'cow.png' -scale 0.62
Build-SpriteCard -sourcePng '_chicken_src.png' -outputPng 'chicken.png' -scale 0.58

Remove-Item -LiteralPath (Join-Path $base '_cow_src.png'), (Join-Path $base '_chicken_src.png') -Force
Write-Host 'Sprites regenerados: cow.png, chicken.png'
