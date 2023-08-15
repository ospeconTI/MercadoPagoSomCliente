import { jsPDF } from "jspdf";
export const getPDFCierre = (listado, nroCierre) => {
    const items = listado.movimientos;
    const resumen = listado.resumen;
    const movimientos = resumen.movimientos;
    const excepcion = resumen.excepcion;
    const recaudacion = resumen.recaudacion;

    const doc = new jsPDF({ unit: "mm" });

    const hoy = new Date();

    doc.setFontSize(7);
    doc.text("Fecha: " + hoy.getDate().toString() + "/" + hoy.getMonth() + 1 + "/" + hoy.getFullYear().toString(), 10, 5);
    doc.setFontSize(14);
    doc.setFont("Helvetica", "normal", "bold");
    const ancho = doc.internal.pageSize.getWidth() / 2;
    doc.text("Listado de Cierre Nro " + nroCierre, ancho, 15, { align: "center" });
    const fuentes = doc.getFontList();
    doc.setFontSize(8);

    let fila = 40;
    let columna = 25;
    const gap = 7;

    const bono = 25;
    const mov = 3;
    const fecha = 10;
    const dni = 8;
    const importe = 19;
    const forma = 3;
    const recauda = 1;

    doc.text("Nro Bono", columna, fila);
    columna += bono + gap;
    doc.text("MOV", columna, fila);
    columna += mov + gap;
    doc.text("Fecha", columna, fila);
    columna += fecha + gap;
    doc.text("DNI", columna, fila);
    columna += dni + gap;
    doc.text("Importe", columna, fila);
    columna += importe + gap;
    doc.text("FP", columna, fila);
    columna += forma + gap;
    doc.text("Recauda", columna, fila);
    columna += recauda + gap;
    doc.setFont("Helvetica", "normal", "normal");
    items.forEach((item) => {
        fila += 5;
        columna = 25;
        const nroBono = item.numero.substring(5, 15);
        const expediente = item.expediente == "" ? item.expediente : "/" + item.expediente;
        doc.text(nroBono + expediente, columna, fila);
        columna += bono + gap;
        doc.text(item.movimiento, columna, fila);
        columna += mov + gap;
        const sfecha = new Date(item.fecha);

        doc.text(sfecha.getDate() + "/" + (sfecha.getMonth() + 1).toString() + "/" + sfecha.getFullYear(), columna, fila);
        columna += fecha + gap;
        doc.text(item.paciente_Documento.toString(), columna, fila);
        columna += dni + gap;
        doc.text(item.importeCaja.toFixed(2), columna, fila, { align: "left" });
        columna += importe + gap;
        doc.text(item.tipoPago, columna, fila);
        columna += forma + gap;
        doc.text(item.recauda, columna, fila);
        columna += recauda + gap;
    });

    fila += 15;
    doc.setFont("Helvetica", "normal", "bold");
    doc.text("Movimientos Exencion", 5, fila);
    doc.setFont("Helvetica", "normal", "normal");
    fila += 5;
    excepcion.forEach((item) => {
        fila += 5;
        doc.text(item.id, 5, fila);
        doc.text(item.cantidad.toString(), 40, fila);
    });

    fila += 15;
    doc.setFont("Helvetica", "normal", "bold");
    doc.text("Movimientos Coseguro", 5, fila);
    doc.setFont("Helvetica", "normal", "normal");

    movimientos.forEach((item) => {
        fila += 5;
        doc.text(item.id, 5, fila);
        doc.text(item.cantidad.toString(), 40, fila);
        doc.text(item.importe.toFixed(2), 60, fila, { align: "right" });
    });

    fila += 15;
    doc.setFont("Helvetica", "normal", "bold");
    doc.text("Movimientos Recaudación", 5, fila);
    doc.setFont("Helvetica", "normal", "normal");

    recaudacion.forEach((item) => {
        fila += 5;
        doc.text(item.id, 5, fila);
        doc.text(item.cantidad.toString(), 40, fila);
        doc.text(item.importe.toFixed(2), 60, fila, { align: "right" });
    });

    fila += 15;
    doc.setFont("Helvetica", "normal", "bold");
    doc.text("TOTALES", 5, fila);
    doc.setFont("Helvetica", "normal", "normal");

    fila += 5;
    doc.text("Importe Total:", 5, fila);

    doc.text(resumen.importeTotal.toFixed(2), 60, fila, { align: "right" });
    fila += 5;
    doc.text("Importe Efectivo", 5, fila);

    doc.text(resumen.efectivo.toFixed(2), 60, fila, { align: "right" });
    fila += 5;
    doc.text("Importe Billetera", 5, fila);
    doc.text(resumen.billetera.toFixed(2), 60, fila, { align: "right" });

    //doc.save("Cierre" + nroCierre);
    return doc;
};
