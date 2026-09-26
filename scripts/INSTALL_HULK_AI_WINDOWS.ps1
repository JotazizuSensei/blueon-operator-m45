$ErrorActionPreference = "Stop"

Write-Host "=== HULK AI setup ==="

$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$CodexHome = Join-Path $env:USERPROFILE ".codex"
$HulkHome = Join-Path $env:USERPROFILE "HULK"
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

New-Item -ItemType Directory -Force -Path $CodexHome | Out-Null
New-Item -ItemType Directory -Force -Path $HulkHome | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $HulkHome "handoffs") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $HulkHome "logs") | Out-Null

# Install/update Codex CLI if npm is available.
if (Get-Command npm -ErrorAction SilentlyContinue) {
    if (-not (Get-Command codex -ErrorAction SilentlyContinue)) {
        Write-Host "Installing Codex CLI..."
        npm install -g @openai/codex
    } else {
        Write-Host "Codex CLI already installed."
    }
} else {
    Write-Warning "npm was not found. Codex CLI install skipped."
}

# Global lean instructions.
$GlobalAgents = Join-Path $CodexHome "AGENTS.md"
if (Test-Path $GlobalAgents) {
    Copy-Item $GlobalAgents "$GlobalAgents.backup-$Timestamp"
}
Copy-Item (Join-Path $RepoRoot "AGENTS.md") $GlobalAgents -Force

# User Codex defaults. Existing config is backed up first.
$UserConfig = Join-Path $CodexHome "config.toml"
if (Test-Path $UserConfig) {
    Copy-Item $UserConfig "$UserConfig.backup-$Timestamp"
}
Copy-Item (Join-Path $RepoRoot ".codex\config.toml") $UserConfig -Force

[Environment]::SetEnvironmentVariable("HULK_HOME", $HulkHome, "User")

Write-Host ""
Write-Host "HULK lean Codex defaults installed."
Write-Host "Backups, if any, are in $CodexHome with timestamp $Timestamp."
Write-Host ""
Write-Host "Next checks:"
Write-Host "  codex --version"
Write-Host "  codex --login"
Write-Host "  then in Codex: /status"
Write-Host ""
Write-Host "API fallback activates only after OPENAI_API_KEY is configured."
