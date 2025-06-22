const { sequelize } = require('../models');
const { Client, Project, Typology, Fase, Stage, Task, Designer, Planning } = require('../models');

// Función para generar un número aleatorio entre min y max
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Función para generar una fecha aleatoria entre start y end
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Función para generar un nombre aleatorio
const randomName = (prefix) => `${prefix}-${Math.random().toString(36).substring(7)}`;

async function seed() {
  try {
    // Limpiar la base de datos
    await sequelize.sync({ force: true });
    console.log('Base de datos limpiada');

    // Crear Clientes
    const clients = await Promise.all([
      Client.create({ name: 'Cliente A', email: 'clienteA@example.com', phone: '123-456-7890', address: 'Dirección A' }),
      Client.create({ name: 'Cliente B', email: 'clienteB@example.com', phone: '098-765-4321', address: 'Dirección B' }),
      Client.create({ name: 'Cliente C', email: 'clienteC@example.com', phone: '555-555-5555', address: 'Dirección C' })
    ]);
    console.log('Clientes creados');

    // Crear Proyectos
    const projects = [];
    for (const client of clients) {
      for (let i = 0; i < 2; i++) {
        projects.push(await Project.create({
          clientId: client.id,
          projectNumber: `PRJ-${random(1000, 9999)}`,
          projectName: `Proyecto ${client.name} ${i + 1}`,
          projectManager: `Manager ${random(1, 5)}`
        }));
      }
    }
    console.log('Proyectos creados');

    // Crear Tipologías
    const typologies = await Promise.all([
      Typology.create({ 
        name: 'Residencial', 
        DM: 10, DE: 10, IA: 10, EP: 10, PA: 10, 
        BL: 10, AFM: 10, AFE: 10, EN: 20 
      }),
      Typology.create({ 
        name: 'Comercial', 
        DM: 15, DE: 15, IA: 10, EP: 10, PA: 10, 
        BL: 10, AFM: 10, AFE: 10, EN: 10 
      }),
      Typology.create({ 
        name: 'Industrial', 
        DM: 20, DE: 20, IA: 10, EP: 10, PA: 10, 
        BL: 10, AFM: 10, AFE: 5, EN: 5 
      })
    ]);
    console.log('Tipologías creadas');

    // Crear Fases para cada proyecto
    const fases = [];
    for (const project of projects) {
      const faseNames = ['Diseño Conceptual', 'Diseño Preliminar', 'Diseño Final', 'Construcción'];
      for (let i = 0; i < faseNames.length; i++) {
        fases.push(await Fase.create({
          projectId: project.id,
          name: faseNames[i],
          targetDate: randomDate(new Date(2024, 0, 1), new Date(2024, 11, 31))
        }));
      }
    }
    console.log('Fases creadas');

    // Crear Stages para cada fase
    const stages = [];
    for (const fase of fases) {
      const stageNames = ['Inicio', 'Desarrollo', 'Revisión', 'Finalización'];
      for (let i = 0; i < stageNames.length; i++) {
        stages.push(await Stage.create({
          projectId: fase.projectId,
          name: stageNames[i],
          targetDate: randomDate(new Date(2024, 0, 1), new Date(2024, 11, 31))
        }));
      }
    }
    console.log('Stages creados');

    // Crear Diseñadores
    const designers = await Promise.all([
      Designer.create({ name: 'Diseñador 1', email: 'd1@example.com', dailyHours: 8, available: true }),
      Designer.create({ name: 'Diseñador 2', email: 'd2@example.com', dailyHours: 8, available: true }),
      Designer.create({ name: 'Diseñador 3', email: 'd3@example.com', dailyHours: 8, available: true }),
      Designer.create({ name: 'Diseñador 4', email: 'd4@example.com', dailyHours: 8, available: true }),
      Designer.create({ name: 'Diseñador 5', email: 'd5@example.com', dailyHours: 8, available: true })
    ]);
    console.log('Diseñadores creados');

    // Crear Tareas para cada stage
    const tasks = [];
    for (const stage of stages) {
      const taskCount = random(3, 6);
      for (let i = 0; i < taskCount; i++) {
        tasks.push(await Task.create({
          projectId: stage.projectId,
          typologyId: typologies[random(0, typologies.length - 1)].id,
          faseId: stage.projectId,
          stageId: stage.id,
          name: `Tarea ${i + 1} - ${stage.name}`,
          productiveValue: random(10, 100),
          targetDate: randomDate(new Date(2024, 0, 1), new Date(2024, 11, 31))
        }));
      }
    }
    console.log('Tareas creadas');

    // Crear Planning para cada tarea
    const plannings = [];
    for (const task of tasks) {
      const designer = designers[random(0, designers.length - 1)];
      const startDate = new Date(2024, 0, 1);
      const endDate = new Date(2024, 11, 31);
      
      // Crear planning para cada semana del año
      for (let i = 0; i < 52; i++) {
        const weekDate = new Date(startDate);
        weekDate.setDate(startDate.getDate() + (i * 7));
        
        if (weekDate <= endDate) {
          plannings.push(await Planning.create({
            taskId: task.id,
            designerId: designer.id,
            week: weekDate,
            plannedProgress: random(0, 100)
          }));
        }
      }
    }
    console.log('Plannings creados');

    console.log('Seed completado exitosamente');
  } catch (error) {
    console.error('Error en el seed:', error);
  } finally {
    process.exit();
  }
}

seed(); 