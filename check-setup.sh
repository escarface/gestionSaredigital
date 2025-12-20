#!/bin/bash

# =====================================================
# Script de Verificación - Supabase Setup
# =====================================================
# Este script verifica que todo está configurado correctamente
# Uso: chmod +x check-setup.sh && ./check-setup.sh
# =====================================================

echo "🔍 Verificando configuración de Supabase..."
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de errores
ERRORS=0

# =====================================================
# 1. Verificar archivo .env.local
# =====================================================
echo "📄 Verificando archivo .env.local..."

if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ Archivo .env.local no encontrado${NC}"
    echo "   👉 Crea uno desde .env.example"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ Archivo .env.local existe${NC}"
    
    # Verificar que tenga las variables necesarias
    if grep -q "VITE_SUPABASE_URL=" .env.local; then
        if grep -q "VITE_SUPABASE_URL=https://tu-supabase" .env.local; then
            echo -e "${YELLOW}⚠️  VITE_SUPABASE_URL aún tiene valor por defecto${NC}"
            echo "   👉 Reemplaza con tu URL real de Supabase"
            ERRORS=$((ERRORS + 1))
        else
            echo -e "${GREEN}✅ VITE_SUPABASE_URL configurado${NC}"
        fi
    else
        echo -e "${RED}❌ VITE_SUPABASE_URL no encontrado en .env.local${NC}"
        ERRORS=$((ERRORS + 1))
    fi
    
    if grep -q "VITE_SUPABASE_ANON_KEY=" .env.local; then
        if grep -q "VITE_SUPABASE_ANON_KEY=tu-supabase-anon-key" .env.local; then
            echo -e "${YELLOW}⚠️  VITE_SUPABASE_ANON_KEY aún tiene valor por defecto${NC}"
            echo "   👉 Reemplaza con tu ANON KEY real"
            ERRORS=$((ERRORS + 1))
        else
            echo -e "${GREEN}✅ VITE_SUPABASE_ANON_KEY configurado${NC}"
        fi
    else
        echo -e "${RED}❌ VITE_SUPABASE_ANON_KEY no encontrado en .env.local${NC}"
        ERRORS=$((ERRORS + 1))
    fi
fi

echo ""

# =====================================================
# 2. Verificar node_modules
# =====================================================
echo "📦 Verificando dependencias..."

if [ ! -d "node_modules" ]; then
    echo -e "${RED}❌ node_modules no encontrado${NC}"
    echo "   👉 Ejecuta: npm install"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ node_modules existe${NC}"
fi

if [ -d "node_modules/@supabase/supabase-js" ]; then
    echo -e "${GREEN}✅ @supabase/supabase-js instalado${NC}"
else
    echo -e "${RED}❌ @supabase/supabase-js no encontrado${NC}"
    echo "   👉 Ejecuta: npm install @supabase/supabase-js"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# =====================================================
# 3. Verificar archivos importantes
# =====================================================
echo "📁 Verificando archivos del proyecto..."

FILES=(
    "services/supabase.ts"
    "types/supabase.ts"
    "supabase-schema.sql"
    "supabase-seed-data.sql"
    "SUPABASE_SETUP.md"
    "vite-env.d.ts"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file no encontrado${NC}"
        ERRORS=$((ERRORS + 1))
    fi
done

echo ""

# =====================================================
# 4. Verificar que Vite está configurado
# =====================================================
echo "⚙️  Verificando configuración de Vite..."

if grep -q "vite/client" tsconfig.json; then
    echo -e "${GREEN}✅ tsconfig.json tiene tipos de Vite${NC}"
else
    echo -e "${YELLOW}⚠️  tsconfig.json podría no tener tipos de Vite${NC}"
fi

echo ""

# =====================================================
# Resumen
# =====================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✨ ¡Todo listo! Configuración correcta${NC}"
    echo ""
    echo "📋 Próximos pasos:"
    echo "   1. Asegúrate de que Supabase está corriendo en Coolify"
    echo "   2. Ejecuta el schema SQL en Supabase Dashboard"
    echo "   3. Ejecuta: npm run dev"
    echo "   4. Crea tu primera cuenta en la app"
else
    echo -e "${RED}❌ Se encontraron $ERRORS problemas${NC}"
    echo ""
    echo "📚 Consulta SUPABASE_SETUP.md para instrucciones detalladas"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
