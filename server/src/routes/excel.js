const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const router = express.Router();

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['.xlsx', '.xls'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos Excel (.xlsx, .xls)'), false);
    }
  }
});

// Ruta para subir archivo Excel
router.post('/upload', upload.single('excelFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convertir Excel a JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Aquí puedes procesar los datos como necesites
    // Por ejemplo, guardarlos en la base de datos
    
    res.json({
      message: 'Archivo procesado exitosamente',
      data: jsonData,
      rows: jsonData.length
    });
    
  } catch (error) {
    console.error('Error procesando archivo Excel:', error);
    res.status(500).json({ error: 'Error procesando el archivo Excel' });
  }
});

// Ruta para descargar datos como Excel
router.get('/download', async (req, res) => {
  try {
    // Ejemplo de datos (reemplaza con datos reales de tu base de datos)
    const data = [
      { id: 1, nombre: 'Proyecto 1', estado: 'Activo', fecha: '2024-01-01' },
      { id: 2, nombre: 'Proyecto 2', estado: 'Pendiente', fecha: '2024-01-02' },
      { id: 3, nombre: 'Proyecto 3', estado: 'Completado', fecha: '2024-01-03' }
    ];

    // Crear workbook y worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Agregar worksheet al workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

    // Configurar headers para descarga
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=datos.xlsx');

    // Escribir el archivo al response
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.send(buffer);

  } catch (error) {
    console.error('Error generando archivo Excel:', error);
    res.status(500).json({ error: 'Error generando el archivo Excel' });
  }
});

// Ruta para descargar datos específicos (por ejemplo, tareas)
router.get('/download/tasks', async (req, res) => {
  try {
    // Aquí deberías obtener los datos de tu base de datos
    // Por ahora usamos datos de ejemplo
    const tasks = [
      { id: 1, titulo: 'Tarea 1', descripcion: 'Descripción 1', estado: 'Pendiente', prioridad: 'Alta' },
      { id: 2, titulo: 'Tarea 2', descripcion: 'Descripción 2', estado: 'En Progreso', prioridad: 'Media' },
      { id: 3, titulo: 'Tarea 3', descripcion: 'Descripción 3', estado: 'Completada', prioridad: 'Baja' }
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(tasks);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tareas');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=tareas.xlsx');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.send(buffer);

  } catch (error) {
    console.error('Error generando archivo de tareas:', error);
    res.status(500).json({ error: 'Error generando el archivo de tareas' });
  }
});

module.exports = router; 