# Función para verificar si un comando existe
function Test-CommandExists {
    param ($command)
    $oldPreference = $ErrorActionPreference
    $ErrorActionPreference = 'stop'
    try { if (Get-Command $command) { return $true } }
    catch { return $false }
    finally { $ErrorActionPreference = $oldPreference }
}

# Función para verificar si PostgreSQL está instalado y corriendo
function Test-PostgreSQL {
    if (-not (Test-CommandExists 'psql')) {
        Write-Host "PostgreSQL no está instalado o no está en el PATH" -ForegroundColor Red
        return $false
    }
    
    try {
        $result = psql -U postgres -c "SELECT version();" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "PostgreSQL está corriendo correctamente" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-Host "Error al conectar con PostgreSQL: $_" -ForegroundColor Red
        return $false
    }
}

# Función para crear la base de datos si no existe
function Initialize-Database {
    try {
        $dbExists = psql -U postgres -lqt | findstr "sguy_mon"
        if (-not $dbExists) {
            Write-Host "Creando base de datos sguy_mon..." -ForegroundColor Yellow
            psql -U postgres -c "CREATE DATABASE sguy_mon;"
            Write-Host "Base de datos creada correctamente" -ForegroundColor Green
        }
        else {
            Write-Host "La base de datos sguy_mon ya existe" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "Error al crear la base de datos: $_" -ForegroundColor Red
        exit 1
    }
}

# Función para instalar dependencias
function Install-Dependencies {
    param (
        [string]$path,
        [string]$name
    )
    Write-Host "`nInstalando dependencias de $name..." -ForegroundColor Yellow
    Set-Location -Path $path
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error al instalar dependencias de $name" -ForegroundColor Red
        exit 1
    }
    Write-Host "Dependencias de $name instaladas correctamente" -ForegroundColor Green
}

# Función para iniciar un proceso
function Start-ProcessWithErrorHandling {
    param (
        [string]$command,
        [string]$name
    )
    Write-Host "`nIniciando $name..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $command
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error al iniciar $name" -ForegroundColor Red
        exit 1
    }
    Write-Host "$name iniciado correctamente" -ForegroundColor Green
}

# Script principal
Write-Host "Iniciando proceso de reinicio..." -ForegroundColor Cyan

# Verificar PostgreSQL
if (-not (Test-PostgreSQL)) {
    Write-Host "Por favor, asegúrate de que PostgreSQL esté instalado y corriendo" -ForegroundColor Red
    exit 1
}

# Inicializar base de datos
Initialize-Database

# Detener procesos de Node.js existentes
Write-Host "`nDeteniendo procesos de Node.js existentes..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null

# Instalar dependencias del servidor
Install-Dependencies -path "server" -name "servidor"

# Reiniciar base de datos
Write-Host "`nReiniciando base de datos..." -ForegroundColor Yellow
Set-Location -Path "server"
npm run db:reset
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error al reiniciar la base de datos" -ForegroundColor Red
    exit 1
}

# Iniciar servidor
Start-ProcessWithErrorHandling -command "npm run dev" -name "servidor"

# Instalar dependencias del cliente
Install-Dependencies -path "../client" -name "cliente"

# Iniciar cliente
Start-ProcessWithErrorHandling -command "npm run dev" -name "cliente"

Write-Host "`nProceso completado. Servidor y cliente iniciados." -ForegroundColor Cyan
Write-Host "Servidor: http://localhost:4000" -ForegroundColor Cyan
Write-Host "Cliente: http://localhost:3000" -ForegroundColor Cyan 