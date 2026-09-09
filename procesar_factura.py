#!/usr/bin/env python3
"""
Procesa una factura FEL de COCLÉ, S.A. (PDF multipágina) y genera:
  - <salida>/factura_items.csv   : una fila por línea de la factura
  - <salida>/factura_tabulada.xlsx : hojas Detalle / Resumen / Por código
  - un reporte de validación por consola (código de salida 1 si algo no cuadra)

Uso:
    python procesar_factura.py factura.pdf [carpeta_de_salida]

Requiere: pdfplumber, openpyxl
"""

import csv
import os
import sys
from collections import OrderedDict

import pdfplumber
from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

# ---------------------------------------------------------------- geometría
# Límites horizontales de las columnas, en puntos PDF (página carta, 612 pt).
# Obtenidos midiendo las posiciones reales de las palabras en el documento.
COL_CANTIDAD = (0, 65)
COL_CODIGO = (65, 105)
COL_DESCRIP = (105, 295)
COL_ORIGEN = (295, 360)
COL_UEQ = (360, 460)
X_PRECIO_MIN = 460      # a partir de aquí van los dos importes
X_CORTE_IMPORTES = 540  # P.Unitario termina antes; P.Total termina después

GAP_NUEVA_FILA = 9.0    # separación vertical que indica un ítem nuevo
GAP_MISMA_LINEA = 2.0   # tolerancia para considerar dos palabras del mismo renglón


def num(s):
    """'$1,234.56' -> 1234.56 ; '' -> None"""
    s = (s or '').replace('$', '').replace(',', '').strip()
    return float(s) if s else None


def agrupar(valores, tol):
    """Agrupa coordenadas cercanas en listas contiguas."""
    grupos = []
    for v in sorted(valores):
        if grupos and v - grupos[-1][-1] <= tol:
            grupos[-1].append(v)
        else:
            grupos.append([v])
    return grupos


# ---------------------------------------------------------------- extracción
def extraer(pdf_path):
    filas, subtotales = [], []

    with pdfplumber.open(pdf_path) as pdf:
        for pno, page in enumerate(pdf.pages, 1):
            palabras = page.extract_words()

            # ventana vertical de la tabla: bajo el encabezado, sobre el pie
            enc = [w for w in palabras if w['text'] == 'CANTIDAD']
            if not enc:
                continue
            y0 = max(w['bottom'] for w in enc) + 1
            pies = [w['top'] for w in palabras
                    if w['text'] in ('Sub-Total', 'ORIGEN:') or w['text'].startswith('------')]
            y1 = min(pies) - 1 if pies else page.height

            cuerpo = [w for w in palabras if y0 < w['top'] < y1]

            # renglones de la columna descripción -> bloques (= ítems)
            desc_w = [w for w in cuerpo if COL_DESCRIP[0] < w['x0'] < COL_DESCRIP[1]]
            renglones = [g[0] for g in agrupar({round(w['top'], 1) for w in desc_w}, 1.5)]

            bloques = []
            for t in renglones:
                if bloques and t - bloques[-1][-1] < GAP_NUEVA_FILA:
                    bloques[-1].append(t)
                else:
                    bloques.append([t])

            for blq in bloques:
                sel = [w for w in cuerpo if blq[0] - 2.5 <= w['top'] <= blq[-1] + 6.0]

                # ordenar por renglón visual y luego de izquierda a derecha
                lineas = agrupar({round(w['top'], 1) for w in sel}, GAP_MISMA_LINEA)

                def nlinea(w):
                    for i, g in enumerate(lineas):
                        if round(w['top'], 1) in g:
                            return i
                    return 99

                ordenado = sorted(sel, key=lambda w: (nlinea(w), w['x0']))

                def col(rango):
                    return [w for w in ordenado if rango[0] <= w['x0'] < rango[1]]

                # la marca del producto se dibuja en una capa aparte: el orden
                # por (renglón, x) la devuelve a su lugar al inicio del texto
                origen_pegado, texto = '', []
                for w in col(COL_DESCRIP):
                    if 'Origen:' in w['text']:
                        # descripción larga: la última palabra quedó pegada a
                        # la columna Origen y pdfplumber las leyó como una sola
                        izq, der = w['text'].split('Origen:', 1)
                        texto.append(izq)
                        origen_pegado = der
                    else:
                        texto.append(w['text'])

                origen = ' '.join(w['text'] for w in col(COL_ORIGEN))
                origen = origen.replace('Origen:', '').strip() or origen_pegado.strip()

                pu = [w for w in ordenado
                      if w['x0'] >= X_PRECIO_MIN and w['x1'] <= X_CORTE_IMPORTES]
                pt = [w for w in ordenado if w['x1'] > X_CORTE_IMPORTES]

                codigo = ' '.join(w['text'] for w in col(COL_CODIGO))
                filas.append({
                    'pagina': pno,
                    'codigo': codigo,
                    'descripcion': ' '.join(' '.join(texto).split()),
                    'origen': '' if origen == '0' else origen,
                    'u_eq': num(' '.join(w['text'] for w in col(COL_UEQ)).replace('U eq:', '')),
                    'cantidad': num(' '.join(w['text'] for w in col(COL_CANTIDAD))),
                    'p_unitario': num(' '.join(w['text'] for w in pu)),
                    'p_total': num(' '.join(w['text'] for w in pt)),
                    'tipo': 'CARGO' if codigo in ('FLETE', 'SEGURO') else 'PRODUCTO',
                })

            # subtotal acumulado impreso al pie de cada página (control)
            st = [w for w in palabras if w['text'] == 'Sub-Total']
            if st:
                v = [w for w in palabras
                     if abs(w['top'] - st[0]['top']) < 3 and w['x1'] > X_CORTE_IMPORTES]
                if v:
                    subtotales.append((pno, num(v[-1]['text'])))

    return filas, subtotales


# ---------------------------------------------------------------- validación
def validar(filas, subtotales, declarado_total=None, declarado_unidades=None):
    problemas = []

    for f in filas:
        if f['p_total'] is None or not f['descripcion']:
            problemas.append(f"Línea sin importe o sin descripción (pág. {f['pagina']}, cód. {f['codigo']})")
        if f['cantidad'] and f['p_unitario']:
            esperado = round(f['cantidad'] * f['p_unitario'], 2)
            if abs(esperado - f['p_total']) > 0.02:
                problemas.append(f"Cant.×P.U. ≠ P.Total en cód. {f['codigo']}: {esperado} vs {f['p_total']}")

    acumulado = 0.0
    por_pagina = {}
    for f in filas:
        por_pagina[f['pagina']] = por_pagina.get(f['pagina'], 0) + f['p_total']
    for pno, declarado in subtotales:
        acumulado = sum(v for p, v in por_pagina.items() if p <= pno)
        if abs(acumulado - declarado) > 0.02:
            problemas.append(f"Subtotal acumulado pág. {pno}: calculado {acumulado:.2f} vs impreso {declarado:.2f}")

    total = round(sum(f['p_total'] for f in filas), 2)
    unidades = sum(f['cantidad'] for f in filas if f['cantidad'])

    if declarado_total is not None and abs(total - declarado_total) > 0.02:
        problemas.append(f"Total: calculado {total} vs declarado {declarado_total}")
    if declarado_unidades is not None and abs(unidades - declarado_unidades) > 0.02:
        problemas.append(f"Unidades: calculadas {unidades} vs declaradas {declarado_unidades}")

    return total, unidades, problemas


# ---------------------------------------------------------------- salidas
CAMPOS = ['pagina', 'codigo', 'descripcion', 'origen', 'u_eq',
          'cantidad', 'p_unitario', 'p_total', 'tipo']


def escribir_csv(filas, ruta):
    # utf-8-sig para que Excel en Windows respete los acentos
    with open(ruta, 'w', newline='', encoding='utf-8-sig') as fh:
        w = csv.DictWriter(fh, fieldnames=CAMPOS)
        w.writeheader()
        w.writerows(filas)


def escribir_xlsx(filas, ruta, total_declarado=None, unidades_declaradas=None):
    ARIAL, MONEY, QTY = 'Arial', '$#,##0.00', '#,##0.00'
    base = Font(name=ARIAL, size=10)
    negrita = Font(name=ARIAL, size=10, bold=True)
    enc_font = Font(name=ARIAL, size=10, bold=True, color='FFFFFF')
    enc_fill = PatternFill('solid', fgColor='1F3864')
    linea = Border(bottom=Side(style='thin', color='BFBFBF'))

    wb = Workbook()

    # ---- Detalle
    ws = wb.active
    ws.title = 'Detalle'
    cab = ['#', 'Pág.', 'Código', 'Descripción', 'Origen', 'U eq.', 'Cantidad',
           'P. Unitario', 'P. Total (factura)', 'Verificación (Cant.×P.U.)', 'Dif.', 'Tipo']
    ws.append(cab)
    for c in range(1, len(cab) + 1):
        cel = ws.cell(1, c)
        cel.font, cel.fill = enc_font, enc_fill
        cel.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)

    for i, f in enumerate(filas, start=1):
        r = i + 1
        vals = [i, f['pagina'], f['codigo'], f['descripcion'], f['origen'],
                f['u_eq'], f['cantidad'], f['p_unitario'], f['p_total']]
        for c, v in enumerate(vals, start=1):
            ws.cell(r, c, v)
        ws.cell(r, 10, f'=IF(OR(G{r}="",H{r}=""),"",ROUND(G{r}*H{r},2))')
        ws.cell(r, 11, f'=IF(J{r}="","",ROUND(I{r}-J{r},2))')
        ws.cell(r, 12, f['tipo'])
        for c in range(1, 13):
            ws.cell(r, c).font = base
            ws.cell(r, c).border = linea
        for c in (6, 7):
            ws.cell(r, c).number_format = QTY
        for c in (8, 9, 10, 11):
            ws.cell(r, c).number_format = MONEY

    ult = len(filas) + 1
    tr = ult + 1
    ws.cell(tr, 4, 'TOTAL FACTURA').font = negrita
    for c, form in ((7, f'=SUM(G2:G{ult})'), (9, f'=SUM(I2:I{ult})'),
                    (10, f'=SUM(J2:J{ult})'), (11, f'=SUM(K2:K{ult})')):
        cel = ws.cell(tr, c, form)
        cel.font = negrita
        cel.number_format = QTY if c == 7 else MONEY
    ws.cell(tr + 1, 4, f'Extraído de {os.path.basename(ruta)} · fuente: PDF de la factura.').font = \
        Font(name=ARIAL, size=9, italic=True)

    for c, ancho in zip(range(1, 13), [5, 6, 11, 62, 14, 8, 11, 12, 15, 16, 9, 11]):
        ws.column_dimensions[get_column_letter(c)].width = ancho
    ws.freeze_panes = 'D2'
    ws.auto_filter.ref = f'A1:L{ult}'

    # ---- Resumen
    rs = wb.create_sheet('Resumen')
    for c, ancho in zip('ABCDE', [34, 30, 16, 16, 16]):
        rs.column_dimensions[c].width = ancho

    def put(r, a, b=None, bold=False, fmt=None):
        rs.cell(r, 1, a).font = Font(name=ARIAL, size=10, bold=bold)
        if b is not None:
            cel = rs.cell(r, 2, b)
            cel.font = Font(name=ARIAL, size=10, bold=bold)
            if fmt:
                cel.number_format = fmt

    r = 1
    put(r, 'CONTROL DE LA EXTRACCIÓN', bold=True); r += 1
    put(r, 'Líneas de producto', f'=COUNTIF(Detalle!L2:L{ult},"PRODUCTO")'); r += 1
    put(r, 'Líneas de cargo (flete/seguro)', f'=COUNTIF(Detalle!L2:L{ult},"CARGO")'); r += 1
    put(r, 'Unidades totales', f'=SUM(Detalle!G2:G{ult})', fmt='#,##0.00'); r += 1
    if unidades_declaradas:
        put(r, 'Unidades declaradas en factura', unidades_declaradas, fmt='#,##0.00'); r += 1
    put(r, 'Importe total extraído', f'=SUM(Detalle!I2:I{ult})', fmt=MONEY); r += 1
    if total_declarado:
        put(r, 'Importe total declarado', total_declarado, fmt=MONEY); r += 1
        put(r, 'Diferencia', f'=ROUND(B{r-2}-B{r-1},2)', fmt=MONEY); r += 1
    put(r, 'Mercancía (sin flete ni seguro)',
        f'=SUMIF(Detalle!L2:L{ult},"PRODUCTO",Detalle!I2:I{ult})', fmt=MONEY); r += 1
    put(r, 'Flete', f'=SUMIF(Detalle!C2:C{ult},"FLETE",Detalle!I2:I{ult})', fmt=MONEY); r += 1
    put(r, 'Seguro', f'=SUMIF(Detalle!C2:C{ult},"SEGURO",Detalle!I2:I{ult})', fmt=MONEY); r += 2

    put(r, 'DESGLOSE POR ORIGEN', bold=True); r += 1
    for j, h in enumerate(['Origen', 'Líneas', 'Unidades', 'Importe', '% del total'], start=1):
        cel = rs.cell(r, j, h)
        cel.font, cel.fill = enc_font, enc_fill
        cel.alignment = Alignment(horizontal='center')
    ini = r + 1
    r += 1
    for o in sorted({f['origen'] for f in filas if f['origen']}):
        rs.cell(r, 1, o).font = base
        rs.cell(r, 2, f'=COUNTIF(Detalle!E2:E{ult},A{r})').font = base
        rs.cell(r, 3, f'=SUMIF(Detalle!E2:E{ult},A{r},Detalle!G2:G{ult})').font = base
        rs.cell(r, 4, f'=SUMIF(Detalle!E2:E{ult},A{r},Detalle!I2:I{ult})').font = base
        rs.cell(r, 5, f'=D{r}/SUM(Detalle!I2:I{ult})').font = base
        rs.cell(r, 3).number_format = '#,##0'
        rs.cell(r, 4).number_format = MONEY
        rs.cell(r, 5).number_format = '0.0%'
        r += 1
    rs.cell(r, 1, 'Flete y seguro').font = Font(name=ARIAL, size=10, italic=True)
    rs.cell(r, 4, f'=SUMIF(Detalle!L2:L{ult},"CARGO",Detalle!I2:I{ult})').number_format = MONEY
    rs.cell(r, 5, f'=D{r}/SUM(Detalle!I2:I{ult})').number_format = '0.0%'
    r += 1
    rs.cell(r, 1, 'TOTAL').font = negrita
    for c, form in ((2, f'=SUM(B{ini}:B{r-2})'), (3, f'=SUM(C{ini}:C{r-2})'),
                    (4, f'=SUM(D{ini}:D{r-1})')):
        cel = rs.cell(r, c, form)
        cel.font = negrita
        cel.number_format = '#,##0' if c == 3 else (MONEY if c == 4 else 'General')

    # ---- Por código (consolida códigos repetidos)
    pc = wb.create_sheet('Por código')
    agg = OrderedDict()
    for f in filas:
        if f['tipo'] == 'PRODUCTO':
            agg.setdefault(f['codigo'], {'desc': f['descripcion'], 'n': 0})
            agg[f['codigo']]['n'] += 1
    pc.append(['Código', 'Descripción', 'Líneas en factura', 'Unidades', 'Importe'])
    for c in range(1, 6):
        cel = pc.cell(1, c)
        cel.font, cel.fill = enc_font, enc_fill
        cel.alignment = Alignment(horizontal='center')
    r = 2
    for cod, v in agg.items():
        pc.cell(r, 1, cod).font = base
        pc.cell(r, 2, v['desc']).font = base
        pc.cell(r, 3, v['n']).font = base
        pc.cell(r, 4, f'=SUMIF(Detalle!C2:C{ult},A{r},Detalle!G2:G{ult})').font = base
        pc.cell(r, 5, f'=SUMIF(Detalle!C2:C{ult},A{r},Detalle!I2:I{ult})').font = base
        pc.cell(r, 4).number_format = '#,##0'
        pc.cell(r, 5).number_format = MONEY
        r += 1
    pc.cell(r, 2, 'TOTAL MERCANCÍA').font = negrita
    pc.cell(r, 4, f'=SUM(D2:D{r-1})').font = negrita
    pc.cell(r, 5, f'=SUM(E2:E{r-1})').font = negrita
    pc.cell(r, 4).number_format = '#,##0'
    pc.cell(r, 5).number_format = MONEY
    for c, ancho in zip(range(1, 6), [12, 62, 16, 12, 14]):
        pc.column_dimensions[get_column_letter(c)].width = ancho
    pc.freeze_panes = 'A2'
    pc.auto_filter.ref = f'A1:E{r-1}'

    wb.save(ruta)


# ---------------------------------------------------------------- principal
def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 2

    pdf_path = sys.argv[1]
    salida = sys.argv[2] if len(sys.argv) > 2 else '.'
    os.makedirs(salida, exist_ok=True)

    # Totales impresos en la última página; ajústalos si procesas otra factura.
    TOTAL_DECLARADO = 34432.71
    UNIDADES_DECLARADAS = 22093.00

    filas, subtotales = extraer(pdf_path)
    total, unidades, problemas = validar(filas, subtotales,
                                         TOTAL_DECLARADO, UNIDADES_DECLARADAS)

    csv_path = os.path.join(salida, 'factura_items.csv')
    xlsx_path = os.path.join(salida, 'factura_tabulada.xlsx')
    escribir_csv(filas, csv_path)
    escribir_xlsx(filas, xlsx_path, TOTAL_DECLARADO, UNIDADES_DECLARADAS)

    print(f'Líneas extraídas : {len(filas)} '
          f"({sum(1 for f in filas if f['tipo'] == 'PRODUCTO')} productos, "
          f"{sum(1 for f in filas if f['tipo'] == 'CARGO')} cargos)")
    print(f'Importe total    : {total:,.2f}')
    print(f'Unidades         : {unidades:,.2f}')
    print(f'Subtotales de página verificados: {len(subtotales)}')
    print(f'CSV  -> {csv_path}')
    print(f'XLSX -> {xlsx_path}')

    if problemas:
        print(f'\n*** {len(problemas)} PROBLEMA(S) DE VALIDACIÓN ***')
        for p in problemas[:20]:
            print(' -', p)
        return 1

    print('\nValidación OK: importes, unidades y los subtotales por página cuadran.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
