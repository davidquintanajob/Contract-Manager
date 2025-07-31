import XLSX from 'xlsx';
import fetch from 'node-fetch';

// Función para convertir fecha serial de Excel a fecha legible
function excelDateToJSDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return new Date(date_info.getUTCFullYear(), date_info.getUTCMonth(), date_info.getUTCDate());
}

const API_URL = 'http://localhost:4000';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsIm5vbWJyZSI6IkRhdmlkIiwibm9tYnJlX3VzdWFyaW8iOiJkYXZpZCIsInJvbCI6IkFkbWluaXN0cmFkb3IiLCJpYXQiOjE3NTI1ODUwNDEsImV4cCI6MTc1MjU5NTg0MX0.ZkSLpEPakhwQw-13_bxIeTDxGkb0OjqDikTktwCZIhM';

// Leer el archivo Excel
const workbook = XLSX.readFile('REGISTRO DE CONTRATOS.xlsx');
const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(firstSheet, { defval: null, header: 1 });
const headers = data[1];
const filasDatos = data.slice(2);

const datosJson = filasDatos.map(fila => {
  const obj = {};
  headers.forEach((col, idx) => {
    let valor = fila[idx];
    // Si es la columna 'Fecha' o 'Vigencia' y es número, convertir a fecha legible
    if ((col === 'Fecha' || col === 'Vigencia') && typeof valor === 'number') {
      const fecha = excelDateToJSDate(valor);
      valor = fecha.toISOString().slice(0, 10);
    }
    obj[col] = valor;
  });
  return obj;
});

const datosFiltrados = datosJson.filter(obj => obj['No Orden'] != null);

// Eliminar procesamiento de la segunda hoja
// Mantener solo datosFiltrados de la primera hoja

// Procesar la segunda hoja igual que la primera
const secondSheet = workbook.Sheets[workbook.SheetNames[1]];
let datosFiltrados2 = [];
if (secondSheet) {
  const data2 = XLSX.utils.sheet_to_json(secondSheet, { defval: null, header: 1 });
  const headers2 = data2[1];
  const filasDatos2 = data2.slice(2);
  const datosJson2 = filasDatos2.map(fila => {
    const obj = {};
    headers2.forEach((col, idx) => {
      let valor = fila[idx];
      if ((col === 'Fecha' || col === 'Fecha ' || col === 'Vigencia') && typeof valor === 'number') {
        const fecha = excelDateToJSDate(valor);
        valor = fecha.toISOString().slice(0, 10);
      }
      obj[col] = valor;
    });
    return obj;
  });
  datosFiltrados2 = datosJson2.filter(obj => obj['No Orden'] != null);
}

// Procesar la tercera hoja (columnas en la fila 1, datos desde la fila 2)
const thirdSheet = workbook.Sheets[workbook.SheetNames[2]];
let datosFiltrados3 = [];
if (thirdSheet) {
  const data3 = XLSX.utils.sheet_to_json(thirdSheet, { defval: null, header: 1 });
  const headers3 = data3[0];
  const filasDatos3 = data3.slice(1);
  const datosJson3 = filasDatos3.map(fila => {
    const obj = {};
    headers3.forEach((col, idx) => {
      let valor = fila[idx];
      if ((col === 'Fecha' || col === 'Fecha ' || col === 'Vigencia') && typeof valor === 'number') {
        const fecha = excelDateToJSDate(valor);
        valor = fecha.toISOString().slice(0, 10);
      }
      obj[col] = valor;
    });
    return obj;
  });
  datosFiltrados3 = datosJson3.filter(obj => obj['No Orden'] != null);
}

async function main() {
  // 1. Obtener entidades de la API
  const entidadesRes = await fetch(`${API_URL}/entidad`, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`
    }
  });
  const entidadesJson = await entidadesRes.json();
  const entidades = entidadesJson.data;

  // 2. Iterar sobre los datos del Excel (solo primera hoja)
  for (const fila of datosFiltrados) {
    const cliente = fila['Cliente'];
    if (!cliente) continue;
    const entidad = entidades.find(e => e.nombre === cliente);
    if (entidad) {
      let id_tipo_contrato = null;
      if (fila['Tipo de Contrato'] === 'Compra y Venta') id_tipo_contrato = 7;
      else if (fila['Tipo de Contrato'] === 'Prestación de Servicios') id_tipo_contrato = 8;
      else if (fila['Tipo de Contrato'] === 'Servicios Informáticos') id_tipo_contrato = 9;
      let num_consecutivo = null;
      if (typeof fila['No Orden'] === 'string') {
        const match = fila['No Orden'].match(/\d+/);
        if (match) num_consecutivo = parseInt(match[0], 10);
      } else if (typeof fila['No Orden'] === 'number') {
        num_consecutivo = fila['No Orden'];
      }
      const body = {
        id_entidad: entidad.id_entidad,
        id_tipo_contrato,
        fecha_inicio: fila['Fecha '] ?? fila['Fecha'],
        fecha_fin: fila['Vigencia'],
        num_consecutivo,
        clasificacion: " "
      };
      try {
        const postRes = await fetch(`${API_URL}/contrato/createContrato`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}`
          },
          body: JSON.stringify(body)
        });
        if (!postRes.ok) {
          const postJson = await postRes.json();
          // Manejo especial para error 400 y mensaje de contrato vigente
          if (postRes.status === 400 && postJson.error && postJson.error.startsWith('Ya existe un contrato vigente')) {
            // 1. Llamar a contrato/filter/1/1
            const filterRes = await fetch(`${API_URL}/contrato/filter/1/1`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
              },
              body: JSON.stringify({
                nombre_entidad: cliente,
                id_tipo_contrato: id_tipo_contrato
              })
            });
            const filterJson = await filterRes.json();
            if (filterJson.data && filterJson.data.length > 0) {
              const idContrato = filterJson.data[0].id_contrato;
              // 2. Llamar a contrato/deleteContrato/{id}
              const deleteRes = await fetch(`${API_URL}/contrato/deleteContrato/${idContrato}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${TOKEN}`
                }
              });
              // 3. Reintentar crear el contrato
              const retryRes = await fetch(`${API_URL}/contrato/createContrato`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${TOKEN}`
                },
                body: JSON.stringify(body)
              });
              if (!retryRes.ok) {
                const retryJson = await retryRes.json();
                console.error(`Error reintentando crear contrato para cliente '${cliente}':`, retryJson);
              }
            } else {
              console.error(`No se encontró contrato vigente para eliminar para cliente '${cliente}'.`);
            }
          } else {
            console.error(`Error creando contrato para cliente '${cliente}':`, postJson);
          }
        }
      } catch (err) {
        console.error(`Error creando contrato para cliente '${cliente}':`, err);
      }
    }
  }

  // Procesar la segunda hoja igual que la primera
  for (const fila of datosFiltrados2) {
    const cliente = fila['Cliente'];
    if (!cliente) continue;
    const entidad = entidades.find(e => e.nombre === cliente);
    if (entidad) {
      let id_tipo_contrato = null;
      if (fila['Tipo de Contrato'] === 'Compra y Venta') id_tipo_contrato = 7;
      else if (fila['Tipo de Contrato'] === 'Prestación de Servicios') id_tipo_contrato = 8;
      else if (fila['Tipo de Contrato'] === 'Servicios Informáticos') id_tipo_contrato = 9;
      let num_consecutivo = null;
      if (typeof fila['No Orden'] === 'string') {
        const match = fila['No Orden'].match(/\d+/);
        if (match) num_consecutivo = parseInt(match[0], 10);
      } else if (typeof fila['No Orden'] === 'number') {
        num_consecutivo = fila['No Orden'];
      }
      const body = {
        id_entidad: entidad.id_entidad,
        id_tipo_contrato,
        fecha_inicio: fila['Fecha '] ?? fila['Fecha'],
        fecha_fin: fila['Vigencia'],
        num_consecutivo,
        clasificacion: " "
      };
      try {
        const postRes = await fetch(`${API_URL}/contrato/createContrato`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}`
          },
          body: JSON.stringify(body)
        });
        if (!postRes.ok) {
          const postJson = await postRes.json();
          if (postRes.status === 400 && postJson.error && postJson.error.startsWith('Ya existe un contrato vigente')) {
            const filterRes = await fetch(`${API_URL}/contrato/filter/1/1`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
              },
              body: JSON.stringify({
                nombre_entidad: cliente,
                id_tipo_contrato: id_tipo_contrato
              })
            });
            const filterJson = await filterRes.json();
            if (filterJson.data && filterJson.data.length > 0) {
              const idContrato = filterJson.data[0].id_contrato;
              const deleteRes = await fetch(`${API_URL}/contrato/deleteContrato/${idContrato}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${TOKEN}`
                }
              });
              const retryRes = await fetch(`${API_URL}/contrato/createContrato`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${TOKEN}`
                },
                body: JSON.stringify(body)
              });
              if (!retryRes.ok) {
                const retryJson = await retryRes.json();
                console.error(`Error reintentando crear contrato para cliente '${cliente}' (página 2):`, retryJson);
              }
            } else {
              console.error(`No se encontró contrato vigente para eliminar para cliente '${cliente}' (página 2).`);
            }
          } else {
            console.error(`Error creando contrato para cliente '${cliente}' (página 2):`, postJson);
          }
        }
      } catch (err) {
        console.error(`Error creando contrato para cliente '${cliente}' (página 2):`, err);
      }
    }
  }

  // Procesar la tercera hoja igual que las anteriores
  for (const fila of datosFiltrados3) {
    const cliente = fila['Cliente'];
    if (!cliente) continue;
    const entidad = entidades.find(e => e.nombre === cliente);
    if (entidad) {
      let id_tipo_contrato = null;
      if (fila['Tipo de Contrato'] === 'Compra y Venta') id_tipo_contrato = 7;
      else if (fila['Tipo de Contrato'] === 'Prestación de Servicios') id_tipo_contrato = 8;
      else if (fila['Tipo de Contrato'] === 'Servicios Informáticos') id_tipo_contrato = 9;
      let num_consecutivo = null;
      if (typeof fila['No Orden'] === 'string') {
        const match = fila['No Orden'].match(/\d+/);
        if (match) num_consecutivo = parseInt(match[0], 10);
      } else if (typeof fila['No Orden'] === 'number') {
        num_consecutivo = fila['No Orden'];
      }
      const body = {
        id_entidad: entidad.id_entidad,
        id_tipo_contrato,
        fecha_inicio: fila['Fecha '] ?? fila['Fecha'],
        fecha_fin: fila['Vigencia'],
        num_consecutivo,
        clasificacion: " "
      };
      try {
        const postRes = await fetch(`${API_URL}/contrato/createContrato`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}`
          },
          body: JSON.stringify(body)
        });
        if (!postRes.ok) {
          const postJson = await postRes.json();
          if (postRes.status === 400 && postJson.error && postJson.error.startsWith('Ya existe un contrato vigente')) {
            const filterRes = await fetch(`${API_URL}/contrato/filter/1/1`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
              },
              body: JSON.stringify({
                nombre_entidad: cliente,
                id_tipo_contrato: id_tipo_contrato
              })
            });
            const filterJson = await filterRes.json();
            if (filterJson.data && filterJson.data.length > 0) {
              const idContrato = filterJson.data[0].id_contrato;
              const deleteRes = await fetch(`${API_URL}/contrato/deleteContrato/${idContrato}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${TOKEN}`
                }
              });
              const retryRes = await fetch(`${API_URL}/contrato/createContrato`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${TOKEN}`
                },
                body: JSON.stringify(body)
              });
              if (!retryRes.ok) {
                const retryJson = await retryRes.json();
                console.error(`Error reintentando crear contrato para cliente '${cliente}' (página 3):`, retryJson);
              }
            } else {
              console.error(`No se encontró contrato vigente para eliminar para cliente '${cliente}' (página 3).`);
            }
          } else {
            console.error(`Error creando contrato para cliente '${cliente}' (página 3):`, postJson);
          }
        }
      } catch (err) {
        console.error(`Error creando contrato para cliente '${cliente}' (página 3):`, err);
      }
    }
  }
}

main();
