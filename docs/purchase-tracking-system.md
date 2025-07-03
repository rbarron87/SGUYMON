# Sistema de Seguimiento de Compras de Insumos

## Descripción General

Este sistema proporciona rastreabilidad completa del proceso de compras de insumos, desde la creación de listas BOM (Bill of Materials) hasta la recepción de materiales, permitiendo el seguimiento de cada código GIA a través de todo el ciclo de compras.

## Arquitectura del Sistema

### Entidades Principales

1. **GIACode**: Códigos únicos que identifican cada insumo
2. **Equipment**: Equipos que tienen listas BOM asociadas
3. **BOM**: Listas de materiales (Bill of Materials) asociadas a equipos
4. **BOMItem**: Items individuales de una lista BOM
5. **Supplier**: Proveedores que suministran los insumos
6. **PurchaseRequest**: Solicitudes de compra generadas por suministros
7. **PurchaseOrder**: Órdenes de compra enviadas a proveedores
8. **StockMovement**: Control de movimientos de inventario

## Diagrama de Flujo del Proceso

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Procesos      │    │   Equipos       │    │   Listas BOM    │
│   (Ingeniería)  │───▶│   (Código)      │───▶│   (Versiones)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Códigos GIA   │◀───│   BOM Items     │◀───│   BOM Items     │
│   (Insumos)     │    │   (Cantidades)  │    │   (Cantidades)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Proveedores   │◀───│   SupplierGIA   │◀───│   Códigos GIA   │
│   (Catálogo)    │    │   (Relación)    │    │   (Disponibles) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Suministros   │───▶│   Purchase      │───▶│   Purchase      │
│   (Consolidación)│   │   Request       │    │   Request Items │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Órdenes de    │◀───│   Purchase      │◀───│   Purchase      │
│   Compra        │    │   Order         │    │   Order Items   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Recepción     │───▶│   Stock         │───▶│   Inventario    │
│   de Materiales │    │   Movement      │    │   Actualizado   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Flujo Detallado del Proceso

### 1. Creación de Listas BOM
- Los procesos de ingeniería crean listas BOM para equipos específicos
- Cada lista BOM contiene múltiples códigos GIA con cantidades requeridas
- Las listas BOM pueden tener versiones para control de cambios

### 2. Consolidación por Suministros
- Suministros consolida las listas BOM de diferentes equipos
- Genera solicitudes de compra agrupando códigos GIA similares
- Asigna proveedores preferidos según catálogo SupplierGIA

### 3. Generación de Solicitudes de Compra
- Se crean solicitudes de compra con items específicos
- Cada item está vinculado a un código GIA y opcionalmente a un BOM Item
- Se establecen prioridades y fechas requeridas

### 4. Creación de Órdenes de Compra
- Las solicitudes aprobadas se convierten en órdenes de compra
- Se envían a proveedores específicos
- Se establecen precios, cantidades y fechas de entrega

### 5. Seguimiento y Recepción
- Se monitorea el estado de cada orden
- Al recibir materiales, se actualiza el inventario
- Se registran movimientos de stock automáticamente

## Rastreabilidad Completa

### Para cada código GIA se puede rastrear:
1. **Origen**: ¿De qué lista BOM proviene?
2. **Equipo**: ¿Para qué equipo se requiere?
3. **Proyecto**: ¿A qué proyecto pertenece?
4. **Solicitud**: ¿Qué solicitud de compra lo incluye?
5. **Orden**: ¿Qué orden de compra lo adquiere?
6. **Proveedor**: ¿Quién lo suministra?
7. **Estado**: ¿Cuál es el estado actual?
8. **Inventario**: ¿Cuánto stock hay disponible?

### Consultas de Rastreabilidad

```sql
-- Rastrear un código GIA específico
SELECT 
    g.code as gia_code,
    g.description,
    b.name as bom_name,
    e.name as equipment_name,
    p.projectName,
    pr.requestNumber,
    po.orderNumber,
    s.name as supplier_name,
    poi.status as order_status,
    g.currentStock
FROM GIACodes g
LEFT JOIN BOMItems bi ON g.id = bi.giaCodeId
LEFT JOIN BOMs b ON bi.bomId = b.id
LEFT JOIN Equipments e ON b.equipmentId = e.id
LEFT JOIN Projects p ON b.projectId = p.id
LEFT JOIN PurchaseRequestItems pri ON g.id = pri.giaCodeId
LEFT JOIN PurchaseRequests pr ON pri.purchaseRequestId = pr.id
LEFT JOIN PurchaseOrderItems poi ON pri.id = poi.purchaseRequestItemId
LEFT JOIN PurchaseOrders po ON poi.purchaseOrderId = po.id
LEFT JOIN Suppliers s ON po.supplierId = s.id
WHERE g.code = 'GIA-001';
```

## Estados del Sistema

### Estados de BOM
- `draft`: Borrador
- `active`: Activa
- `obsolete`: Obsoleta
- `archived`: Archivada

### Estados de Solicitud de Compra
- `draft`: Borrador
- `pending_approval`: Pendiente de aprobación
- `approved`: Aprobada
- `sent_to_supplier`: Enviada al proveedor
- `quoted`: Cotizada
- `ordered`: Ordenada
- `received`: Recibida
- `cancelled`: Cancelada

### Estados de Orden de Compra
- `draft`: Borrador
- `sent`: Enviada
- `confirmed`: Confirmada
- `in_production`: En producción
- `shipped`: Enviada
- `delivered`: Entregada
- `cancelled`: Cancelada

## Beneficios del Sistema

1. **Rastreabilidad Completa**: Cada código GIA puede ser rastreado desde su origen hasta su destino
2. **Control de Versiones**: Las listas BOM mantienen historial de cambios
3. **Gestión de Proveedores**: Catálogo de proveedores por código GIA
4. **Control de Inventario**: Movimientos automáticos de stock
5. **Reportes**: Informes detallados de estado de compras
6. **Alertas**: Notificaciones de retrasos o problemas
7. **Análisis**: Datos para optimización de procesos

## Configuración Inicial

### Datos Maestros Requeridos
1. **Códigos GIA**: Catálogo completo de insumos
2. **Proveedores**: Información de proveedores
3. **Equipos**: Lista de equipos de la empresa
4. **Proyectos**: Proyectos activos
5. **SupplierGIA**: Relación proveedor-código GIA

### Procesos de Negocio
1. **Aprobación de BOM**: Flujo de aprobación de listas
2. **Aprobación de Compras**: Flujo de aprobación de solicitudes
3. **Recepción**: Proceso de recepción de materiales
4. **Control de Calidad**: Verificación de materiales recibidos 