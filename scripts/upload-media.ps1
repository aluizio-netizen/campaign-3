<#
.SYNOPSIS
  Sincroniza public/media para um bucket S3-compatível (AWS S3 ou Cloudflare R2).

.DESCRIPTION
  Use suas próprias credenciais (este script NÃO inclui segredos).
  Mantém o prefixo "media/" no bucket, casando com NEXT_PUBLIC_MEDIA_BASE_URL.

  Pré-requisito: AWS CLI instalado (winget install Amazon.AWSCLI) e credenciais
  configuradas (aws configure / variáveis de ambiente).

.EXAMPLE
  # AWS S3
  ./scripts/upload-media.ps1 -Bucket meu-bucket

.EXAMPLE
  # Cloudflare R2 (precisa do endpoint da sua conta)
  ./scripts/upload-media.ps1 -Bucket meu-bucket -EndpointUrl "https://<accountid>.r2.cloudflarestorage.com"

.NOTES
  Depois do upload, defina no Render:
    NEXT_PUBLIC_MEDIA_BASE_URL = URL pública do bucket/CDN (ex.: https://cdn.seusite.com)
  de modo que <base>/media/audio/... e <base>/media/pages/... resolvam.
#>
param(
  [Parameter(Mandatory = $true)] [string] $Bucket,
  [string] $EndpointUrl = "",
  [string] $Prefix = "media",
  [string] $CacheControl = "public, max-age=31536000, immutable"
)

$ErrorActionPreference = "Stop"
$src = Join-Path $PSScriptRoot "..\public\media"
if (-not (Test-Path $src)) { throw "Pasta não encontrada: $src" }

$dest = "s3://$Bucket/$Prefix"
$args = @("s3", "sync", $src, $dest, "--cache-control", $CacheControl)
if ($EndpointUrl) { $args += @("--endpoint-url", $EndpointUrl) }

Write-Host "Sincronizando $src -> $dest ..." -ForegroundColor Cyan
& aws @args
Write-Host "Concluído. Configure NEXT_PUBLIC_MEDIA_BASE_URL no Render." -ForegroundColor Green
