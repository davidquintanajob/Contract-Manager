function simularPuertoConDetalle() {
    // Parámetros
    const capacidad_max = 10000;
    const umbral_rechazo = 7000;
    let inventario = 6500;
    const semanas = 26;
    let rechazos = 0;
    let total_cajas_final = 0;

    // Distribución de cajas del buque
    function getCajasBuque() {
        const rand = Math.random();
        if (rand <= 0.3) return 3500;
        if (rand <= 0.8) return 3000; // 0.3 + 0.5 = 0.8
        return 4500;
    }

    // Cabecera de la tabla
    console.log("Semana | Cajas Buque | Descargó? | Cajas Descargadas | Inventario Antes Demanda | Unidades Solicitadas | Cajas Solicitadas | Cajas Despachadas | Inventario Final");
    console.log("------|------------|----------|------------------|-------------------------|---------------------|------------------|------------------|---------------");

    for (let semana = 1; semana <= semanas; semana++) {
        // Almacenar valores para mostrar
        const inventario_inicial = inventario;
        
        // Evento 1: Llegada del buque
        const cajas_buque = getCajasBuque();
        let descargo = 'Sí';
        let cajas_descargadas = 0;

        // Actividad: Descarga (o rechazo)
        if (inventario <= umbral_rechazo) {
            cajas_descargadas = Math.min(cajas_buque, capacidad_max - inventario);
            inventario += cajas_descargadas;
        } else {
            descargo = 'No';
            rechazos++;
        }

        const inventario_pre_demanda = inventario;

        // Evento 2: Demanda semanal
        const unidades_solicitadas = 8000 + Math.random() * 4000;
        const cajas_solicitadas = Math.ceil(unidades_solicitadas / 4);
        const cajas_despachadas = Math.min(inventario, cajas_solicitadas);
        inventario -= cajas_despachadas;

        // Registrar estado final de la semana
        total_cajas_final += inventario;

        // Mostrar detalles de la semana
        console.log(
            `${semana.toString().padStart(5)} |` +
            `${cajas_buque.toString().padStart(11)} |` +
            `${descargo.padStart(8)} |` +
            `${cajas_descargadas.toString().padStart(17)} |` +
            `${inventario_pre_demanda.toString().padStart(23)} |` +
            `${Math.round(unidades_solicitadas).toString().padStart(20)} |` +
            `${cajas_solicitadas.toString().padStart(17)} |` +
            `${cajas_despachadas.toString().padStart(17)} |` +
            `${inventario.toString().padStart(14)}`
        );
    }

    // Resultados finales
    const prob_rechazo = rechazos / semanas;
    const media_cajas_final = total_cajas_final / semanas;

    console.log("\nRESULTADOS FINALES:");
    console.log(`- Probabilidad de rechazo de buque: ${(prob_rechazo * 100).toFixed(2)}%`);
    console.log(`- Cantidad media de cajas al final de semana: ${media_cajas_final.toFixed(2)}`);
    console.log(`- Total de barcos rechazados: ${rechazos}`);
}

// Ejecutar la simulación con detalle
simularPuertoConDetalle();