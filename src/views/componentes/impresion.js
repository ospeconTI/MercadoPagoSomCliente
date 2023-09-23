import { jsPDF } from "jspdf";
export const getPDFCierre = (listado, nroCierre) => {
    const items = listado.movimientos;
    const resumen = listado.resumen;
    const movimientos = resumen.movimientos;
    const excepcion = resumen.excepcion;
    const recaudacion = resumen.recaudacion;

    const doc = new jsPDF({ unit: "mm", format: "letter" });

    const hoy = new Date();
    let pagina = 1;
    const ancho = doc.internal.pageSize.getWidth() / 2;
    doc.setFontSize(7);
    doc.text("Fecha: " + hoy.getDate().toString() + "/" + hoy.getMonth() + 1 + "/" + hoy.getFullYear().toString(), 10, 5);
    doc.text("Pagina: " + pagina.toString(), doc.internal.pageSize.getWidth() - 30, 5);
    doc.setFontSize(14);
    doc.setFont("Helvetica", "normal", "bold");

    doc.text("Listado de Cierre Nro " + nroCierre, ancho, 15, { align: "center" });
    const fuentes = doc.getFontList();
    doc.setFontSize(8);

    let fila = 30;
    let columna = 25;
    const gap = 7;

    const bono = 25;
    const mov = 3;
    const fecha = 10;
    const dni = 8;
    const importe = 19;
    const forma = 3;
    const recauda = 1;

    const pageHeight = doc.internal.pageSize.height;

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
        if (fila >= pageHeight) {
            doc.addPage();
            fila = 30;
            columna = 25;
            pagina += 1;
            doc.setFontSize(7);
            doc.text("Fecha: " + hoy.getDate().toString() + "/" + hoy.getMonth() + 1 + "/" + hoy.getFullYear().toString(), 10, 5);
            doc.text("Pagina: " + pagina.toString(), doc.internal.pageSize.getWidth() - 30, 5);
            doc.setFontSize(8);
            doc.setFont("Helvetica", "normal", "bold");
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
            fila += 5;
        }

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

    doc.addPage();
    doc.setFontSize(7);
    doc.text("Fecha: " + hoy.getDate().toString() + "/" + hoy.getMonth() + 1 + "/" + hoy.getFullYear().toString(), 10, 5);
    doc.text("Pagina: " + pagina.toString(), doc.internal.pageSize.getWidth() - 30, 5);
    doc.setFontSize(14);
    doc.setFont("Helvetica", "normal", "bold");

    doc.text("Resumen del Cierre Nro " + nroCierre, ancho, 15, { align: "center" });
    doc.setFontSize(8);
    fila = 25;
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

export const getPDFResumen = (items, desde, hasta, totales) => {
    const doc = new jsPDF({ unit: "mm", orientation: "landscape" });

    const hoy = new Date();

    doc.setFontSize(7);
    doc.text("Fecha: " + hoy.getDate().toString() + "/" + (hoy.getMonth() + 1).toString() + "/" + hoy.getFullYear().toString(), 10, 5);
    doc.setFontSize(14);
    doc.setFont("Helvetica", "normal", "bold");
    const ancho = doc.internal.pageSize.getWidth() / 2;
    doc.text("Resumen de Cierres entre " + new Date(desde).toLocaleDateString() + " y el " + new Date(hasta).toLocaleDateString(), ancho, 15, { align: "center" });
    const fuentes = doc.getFontList();
    doc.setFontSize(8);

    let fila = 30;
    let columna = 10;
    const gap = 7;
    const cierre = 10;
    const fecha = 10;
    const caja = 28;
    const mov = 8;
    const importe = 19;

    doc.text("Nro Cierre", columna, fila);
    columna += cierre + gap;

    doc.text("Fecha", columna, fila);
    columna += fecha + gap;

    doc.text("Caja", columna, fila);
    columna += caja + gap;

    doc.text("MOV", columna, fila);
    columna += mov + gap;

    doc.text("Total", columna, fila);
    columna += importe + gap;

    doc.text("Efectivo", columna, fila);
    columna += importe + gap;

    doc.text("Billetera", columna, fila);
    columna += importe + gap;

    doc.text("Externos", columna, fila);
    columna += mov + gap;

    doc.text("An.Eft", columna, fila);
    columna += mov + gap;

    doc.text("An.Bill", columna, fila);
    columna += mov + gap;

    doc.text("$ Anu Eft", columna, fila);
    columna += importe + gap;

    doc.text("$ Anu Bill", columna, fila);

    doc.setFont("Helvetica", "normal", "normal");
    items.forEach((item) => {
        fila += 5;
        columna = 10;

        doc.text(item.nroCierre.toString(), columna, fila);
        columna += cierre + gap;

        const sfecha = new Date(item.fecha);
        doc.text(sfecha.getDate() + "/" + (sfecha.getMonth() + 1).toString() + "/" + sfecha.getFullYear(), columna, fila);
        columna += fecha + gap;

        doc.text(item.nombre, columna, fila);
        columna += caja + gap;

        doc.text(item.movimientos.toString(), columna, fila);
        columna += mov + gap;

        doc.text(item.total.toFixed(2), columna, fila, { align: "left" });
        columna += importe + gap;

        doc.text(item.efectivo.toFixed(2), columna, fila, { align: "left" });
        columna += importe + gap;

        doc.text(item.billetera.toFixed(2), columna, fila, { align: "left" });
        columna += importe + gap;

        doc.text(item.externos.toString(), columna, fila, { align: "left" });
        columna += mov + gap;

        doc.text(item.anuladosEfectivo.toString(), columna, fila, { align: "left" });
        columna += mov + gap;

        doc.text(item.anuladosBilletera.toString(), columna, fila, { align: "left" });
        columna += mov + gap;

        doc.text(item.importeAnuladosE.toFixed(2), columna, fila, { align: "left" });
        columna += importe + gap;

        doc.text(item.importeAnuladosB.toFixed(2), columna, fila, { align: "left" });
        columna += importe + gap;
    });

    fila += 10;
    doc.setFont("Helvetica", "normal", "bold");
    doc.text("TOTALES", 5, fila);
    columna = 10 + cierre + gap + fecha + gap + caja + gap;
    doc.text(totales.movimientos.toString(), columna, fila);
    columna += mov + gap;
    doc.text(totales.total.toFixed(2), columna, fila, { align: "left" });
    columna += importe + gap;
    doc.text(totales.efectivo.toFixed(2), columna, fila, { align: "left" });
    columna += importe + gap;
    doc.text(totales.billetera.toFixed(2), columna, fila, { align: "left" });
    columna += importe + gap;
    doc.text(totales.externos.toString(), columna, fila, { align: "left" });
    columna += mov + gap;
    doc.text(totales.anuladosE.toString(), columna, fila, { align: "left" });
    columna += mov + gap;
    doc.text(totales.anuladosB.toString(), columna, fila, { align: "left" });
    columna += mov + gap;
    doc.text(totales.anupesosE.toFixed(2), columna, fila, { align: "left" });
    columna += importe + gap;
    doc.text(totales.anupesosB.toFixed(2), columna, fila), { align: "left" };
    columna += importe + gap;

    /*doc.setFont("Helvetica", "normal", "normal");
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
 */
    //doc.save("Cierre" + nroCierre);
    return doc;
};
