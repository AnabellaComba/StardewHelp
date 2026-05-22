Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName PresentationCore

$base = 'C:\Users\annco\Documents\ProyectosAnnie\StardewValley\StardewHelp\StardewHelp\public\decor\real'
$cowWebp = Join-Path $base '31cb9f8971db3d7.webp'
$cowTemp = Join-Path $base '_cow_src.png'
$chickenSrc = Join-Path $base 'my-first-try-for-a-pixelart-of-the-chicken-let-me-know-what-v0-ow1tqzici6u21.png'

$fileUri = 'file:///' + (($cowWebp -replace '\\', '/') -replace ' ', '%20')
$uri = [System.Uri]::new($fileUri)
$frame = [System.Windows.Media.Imaging.BitmapFrame]::Create($uri)
$enc = [System.Windows.Media.Imaging.PngBitmapEncoder]::new()
$enc.Frames.Add($frame)
$fs = [System.IO.File]::Open($cowTemp, [System.IO.FileMode]::Create, [System.IO.FileAccess]::Write, [System.IO.FileShare]::None)
$enc.Save($fs)
$fs.Close()

function Build-Sprite {
  param([string]$srcPath,[string]$dstPath,[double]$scale)

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
      throw 'Sprite vacio'
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
      $dst = [System.Drawing.Bitmap]::new(800, 600, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
      try {
        $g = [System.Drawing.Graphics]::FromImage($dst)
        try {
          $g.Clear([System.Drawing.Color]::Transparent)
          $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
          $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
          $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None

          $maxW = [int]([Math]::Round(800 * $scale))
          $maxH = [int]([Math]::Round(600 * $scale))
          $ratio = $cropW / [double]$cropH
          $box = $maxW / [double]$maxH

          if ($ratio -gt $box) {
            $drawW = $maxW
            $drawH = [int]([Math]::Round($maxW / $ratio))
          } else {
            $drawH = $maxH
            $drawW = [int]([Math]::Round($maxH * $ratio))
          }

          $x = [int]((800 - $drawW) / 2)
          $y = [int]((600 - $drawH) / 2)
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

Build-Sprite -srcPath $cowTemp -dstPath (Join-Path $base 'cow.png') -scale 0.62
Build-Sprite -srcPath $chickenSrc -dstPath (Join-Path $base 'chicken.png') -scale 0.58

Remove-Item -LiteralPath $cowTemp -Force
Write-Host 'OK resized cow/chicken'
