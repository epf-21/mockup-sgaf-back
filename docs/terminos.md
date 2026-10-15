DESARROLLO E IMPLEMENTACION DEL SISTEMA DE GESTION DE
ACTIVOS FIJOS DE LA UNIVERSIDAD MAYOR DE SAN SIMON (UMSS)

TERMINOS DE REFERENCIA (TDR)

1. Antecedentes

La Universidad Mayor de San Simón (UMSS) posee una amplia variedad de activos fijos, que
incluyen muebles, edificaciones, terrenos, semovientes y otros. La gestión de estos activos se
ha  vuelto  cada  vez  más  complejo,  a  pesar  de  contar  con  un sistema desarrollado en Oracle
Forms  y  Reports  10g,  que  se  ejecuta  mediante  applets  de  Java  en el navegador del cliente.
Esta tecnología, actualmente obsoleta, limita la incorporación de nuevos requerimientos, como
la  generación  de  códigos  de  barras  o  QR  y  el  uso  de  dispositivos  móviles  en  trabajos  de
campo.

Actualmente,  tenemos  extensiones  desarrolladas  en  otras  tecnologías  y  lenguajes  de
programación;  sin  embargo,  estas  permanecen  aisladas  del  sistema  principal,  lo  que  afecta
tanto su accesibilidad como la seguridad de la información.

En este contexto, surge la necesidad de modernizar el control de inventarios con el desarrollo
de un nuevo sistema de gestión y control de activos fijos que este acorde a los requerimientos
actuales de la unidad de Activos Fijos.

2. Objetivo General

Implementar una solución integral de software para el registro, control, seguimiento físico y
contable de los activos fijos de la UMSS.

3. Objetivos Especíﬁcos

●  Registro y Catalogación: Alta de activos con campos para código único de

identificación, marca, modelo, serie, ubicación y responsable.

●  Control de Movimientos: Gestión de asignaciones, transferencias entre unidades, bajas

y enajenación o descarte.

●  Cálculo Financiero: Automatización de depreciaciones (bajo normativas del país).
●

Inventario Físico: Soporte para toma de inventarios mediante tecnologías de captura
(códigos de barras y/o QR).

●  Reportes y Alertas: Generación de estados financieros de activos, reportes de seguros

y alertas de mantenimiento preventivo y otros.

4. Alcance del Sistema

●  Plataforma: Aplicación web, interfaz de usuario responsivo optimizado para pantallas

pequeñas y modo offline para la realización de trabajo de campo.

●  Seguridad: Acceso con credenciales seguras, autenticación con doble factor (2FA),

roles de usuario, logs de auditoría y encriptación de contraseñas.

●

Integración: Capacidad de conectarse con el sistema contable, delegar la autenticación
a un sistema de gestión de identidades centralizado y capacidad de conectarse con el
sistema de recursos humanos, todo lo anterior basado en servicios web (API REST).

●  Escalabilidad: Soporte para el crecimiento en volumen de activos y usuarios

concurrentes.

5. Descripción de los módulos de sistema

5.1 Módulo de Autenticación y Control de Roles

El propósito de este módulo es fortalecer la seguridad y el control administrativo del sistema.

Autenticación de Usuarios:

●

●

Ingreso mediante credenciales seguras (usuario y contraseña) con políticas de
Autenticación de Doble Factor (2FA) para roles administrativos.
Integración con un sistema de gestión de identidades y accesos (ej. keycloak) para
inicio de sesión único (SSO).

Gestión de Roles (RBAC):

●  Administrador: Acceso total al sistema, configuración de parámetros y gestión de

usuarios y roles.

●  Supervisor: Permisos para verificar y aprobar altas, bajas y movimientos físicos.
●  Operador de inventario (Inventariador): Permisos para altas, bajas y movimientos

físicos, sin acceso a edición de valores contables.

●  Contador/Auditor: Acceso a módulos de depreciación, reportes financieros y consulta,

con restricción de edición de datos.

●  Responsable de un activo (Consulta): Capacidad de ver solo los activos asignados a su

cargo.

Seguridad y Auditoría:

●  Logs de Actividad: Registro histórico (pista de auditoría) que detalle qué usuario hizo

qué cambio, en qué fecha y desde qué IP.

●  Gestión de Sesiones: Cierre automático por inactividad al cabo de un tiempo

determinado.

5.2 Módulo de Registro y Catalogación de Activos

Catálogos de configuración

El sistema debe permitir configurar catálogos de configuración antes de registrar activos

●  Clasificación por Grupos (Codificador): Definición de categorías (Ej: Vehículos, Equipos
de Computación, etc.) asociadas a una tasa de depreciación, una cuenta contable y
vida útil.

●  Catálogo de Centros de Costo (Objeto de gasto): Vinculación de cada activo a la

unidad organizacional que asume su gasto.

●  Catálogo de Ubicaciones Físicas: Estructura de varios niveles (Ej: Campus > Edificio >

Piso > Oficina/Ambiente).

Ficha Técnica del Activo (Campos Obligatorios)

Al dar de alta un bien, el sistema debe solicitar y validar

●  Código Único (NIA/NIM): Asignación de un ID correlativo o carga de un código

patrimonial preexistente.

●  Datos de Identificación: Marca, modelo, número de serie, etc.
●  Datos de Adquisición: Número de factura, fecha de compra y valor original de

adquisición.

●  Estado Físico Inicial: (Excelente, Muy Bueno, Bueno, Regular, Malo).
●  Responsable: Asignación inicial del funcionario a cargo del bien.

Etiquetado y Codificación

●  Generación de Códigos de Barras/QR: El sistema debe generar automáticamente la

etiqueta para imprimir tras el registro.

●  Soporte Multiformato: Compatibilidad con impresoras térmicas de etiquetas (Zebra,

Honeywell, etc.).

Gestión de Componentes (Activos Compuestos)

●  Relación del Activo y sus Componentes: Capacidad de registrar un activo principal (ej.
un Computador) y asociarle componentes que tienen su propia marca, modelo y serie
(ej. discos duros, memorias, monitor), pero que se mueven y deprecian con el equipo
principal.

Integración con Gestión Documental

●  Desde la misma ficha de registro, el usuario debe poder adjuntar la factura escaneada

o el acta de recepción (vinculando este módulo con el de administración de
documentos definido).

5.3 Módulo de Control de Movimientos y Traslados

Tipos de Movimientos

El sistema debe permitir gestionar diferentes flujos de cambio de estado:

●  Asignaciones: Entrega de un activo a un funcionario (uso individual).
●  Transferencias/Traslados: Cambio del activo entre oficinas o centros de costo.
●  Devoluciones: Retorno del activo al almacén o bodega central (ej. cuando un empleado

fallece o renuncia).

●  Salidas Temporales: Registro de bienes que salen de la institución para mantenimiento

externo, reparación o préstamo, con una fecha de retorno prevista.

Flujo de Movimiento de un Activo

Para evitar movimientos no autorizados, el sistema debe seguir un proceso de validación:

●  Solicitud: El usuario o unidad requirente solicita el traslado.
●  Autorización: Un encargado de activos fijos aprueba el movimiento.
●  Ejecución en Campo: El inventariador confirma el traslado físico mediante la lectura del

código QR/Barras (vinculado a la Hoja de Ruta).

●  Aceptación de Custodia: El nuevo responsable debe confirmar la recepción del bien

(mediante una firma en un formulario de recepción).

Generación de Formulario de Entrega/Recepción

Cada vez que un activo cambia de manos, el sistema debe emitir un documento legal:

●  Formulario de Entrega/Recepción: Documento PDF generado automáticamente con los

datos del activo, el entregador y el receptor.

●  Firmas: Espacio para firmas.
●  Archivo: El formulario escaneado (firmado) se vincula al Módulo de Administración de

Documentos del activo correspondiente.

Historial de Trazabilidad (Log de Movimientos)

●  Línea de Tiempo: Cada activo debe tener una bitácora donde se visualice
cronológicamente: Quién lo tuvo > En qué fecha > En qué ubicación.

●  Auditabilidad: El sistema debe impedir borrar el historial de movimientos; solo se

permiten nuevos registros para mantener la integridad de la auditoría.

Alertas y Notificaciones

●  Aviso de Recepción Pendiente: Notificación al supervisor si un activo fue trasladado

pero el nuevo responsable aún no ha aceptado la custodia.

●  Vencimiento de Salidas Temporales: Alerta cuando un activo enviado a mantenimiento

no ha retornado en el plazo establecido.

5.4. Módulo de Cálculo Financiero (Cierre de Gestión)

Este módulo debe ser el nexo entre el control físico y la contabilidad oficial. Su objetivo es
transformar la vida física del bien en valores monetarios precisos.

Gestión de Valores Base

●  Valor de Adquisición: Registro del costo histórico del bien (incluyendo gastos de

instalación o fletes si corresponde).

●  Valor Residual: Definición del valor mínimo que tendrá el activo al final de su vida útil

(generalmente un valor simbólico de 1, según normativa del país).

●  Valor Neto: Cálculo automático en tiempo real del valor actual del bien (Valor de

Adquisición - Depreciación Acumulada).

Procesamiento de Depreciación Anual

●  Depreciación Lineal: Cálculo mediante el método de línea recta basado en la fórmula:

(Valor de Adquisición - Valor Residual) / Vida Útil.

●  Revalorizaciones: Si se actualiza el valor del activo, el sistema debe calcular la

depreciación futura basándose en el nuevo valor contable neto.

●  Cierre de Ejercicio a fin de gestión: Función que congela los datos al último día del año

fiscal para procesar el gasto de la gestión.

●  Ejecución Masiva: El sistema debe permitir el cálculo de todos los activos de forma
simultánea al cierre del ejercicio fiscal (31 de diciembre o según corresponda).

●  Prorrateo de Altas: Para activos comprados durante la gestión, el sistema debe calcular
la depreciación proporcional por los meses (o días) transcurridos desde su alta hasta el
cierre (ej. si se compró en junio, deprecia 7/12 del gasto anual).

●  Gestión de Activos Totalmente Depreciados: Identificación automática de bienes que

alcanzan su valor residual o "valor 1" para que el sistema deje de calcular depreciación
en la siguiente gestión, manteniéndolos activos solo para control de inventario o sean
revalorizados.

●  Histórico de Cierres: Registro inalterable de los cálculos de depreciación de gestiones

pasadas para auditorías.

●  Simulación de Cierre: Función para realizar una pre-depreciación antes del cierre real,

permitiendo al área contable verificar datos.

●  Control de Bajas: Cálculo de la depreciación acumulada hasta la fecha exacta de la

baja dentro de la gestión para determinar la utilidad o pérdida en venta/retiro.

Actualización de Valores

●  Ajuste por Inflación: el sistema debe permitir cargar UFVs para actualizar el valor bruto

antes de calcular la depreciación de la gestión.

●  Historial de Actualizaciones: Registro de cuánto del valor del activo corresponde al

costo original y cuánto al ajuste por inflación.

Reportes de Auditoría Financiera

●  Cuadro de Movimiento de Activos Fijos: Reporte maestro requerido por auditores que
muestra el saldo inicial, altas, bajas, ajustes, depreciación de la gestión, depreciación
acumulada y saldo final (valor neto).

●  Activos Totalmente Depreciados: Listado de bienes que siguen en uso, pero ya no

afectan los resultados financieros (valor neto = valor residual).

5.5. Módulo de Inventario Físico (Toma de Datos)

Este módulo es el que conecta la realidad física de los almacenes y oficinas con los registros
del sistema. Su objetivo es validar que lo que dice la contabilidad realmente existe y está en el
lugar correcto.

Planificación de Inventarios

●  Apertura de Procesos: Capacidad de crear "Eventos de Inventario" (Ej: Inventario

2026).

●  Definición de Alcance: Selección de qué se va a inventariar (por ubicación, por tipo de

activo o por centro de costo).

●  Ordenes de trabajo (hojas de ruta): Capacidad del administrador para crear órdenes de
trabajo agrupando activos por ubicación geográfica, edificio, piso o centro de costo.

●  Asignación de Tareas: Mediante las hojas de ruta a usuarios específicos

(inventariadores), asignando fechas de inicio y fin previstas.

Captura de Datos en Campo

●  Lectura de Identificadores: Soporte para el escaneo de códigos de Barras o QR

mediante dispositivos móviles o colectores de datos (escáner).

●  Registro de Atributos Críticos: Durante la toma, el inventariador debe confirmar o

actualizar:

o  Estado físico (Excelente, Muy Bueno, Bueno, Malo, Regular, Chatarra).
o  Ubicación real (validación contra la ubicación teórica).
o  Custodio o responsable actual.

●  Captura de Evidencia: Obligatoriedad de tomar al menos una fotografía del activo y su

placa de identificación para validar su existencia.

●  Modo Offline: Capacidad de captura de datos en áreas sin conexión a internet y

sincronización posterior.

Hallazgos y Novedades

●  Escaneo de etiquetas: para verificar que el bien se encuentra con el responsable y la

unidad asignado.

●  Captura fotográfica: para evidenciar el estado del bien o etiquetas dañadas, etc.
●  Registro de geolocalización (GPS): para validar que el escaneo de etiquetas ha sido

realizado en el sitio.

●  Gestión de Novedades: Opción para registrar hallazgos no programados (activos
sobrantes, faltantes, bienes en mal estado o activos trasladados sin autorización).
●  Monitoreo en Tiempo Real: Tablero de control (dashboard) para que el supervisor vea

el avance porcentual de cada hoja de ruta.

Conciliación y Cierre (Rol Supervisor)

●  Panel de Comparación: Interfaz que muestra en paralelo: Dato en Sistema vs Dato de

Campo.

●  Panel de Revisión: Interfaz donde el supervisor recibe las hojas de ruta finalizadas para

revisar las diferencias detectadas (sobrantes, faltantes o cambios de estado).

●  Validación de Diferencias: El supervisor debe analizar los sobrantes y faltantes antes

de dar por cerrado el inventario.

●  Ajuste Manual de inventario: Capacidad para que el supervisor corrija errores de

digitación del inventariador antes del cierre definitivo de la hoja de ruta.

●  Gestión de Discrepancias: Herramientas para marcar activos como "No Localizados" o

"Pendientes de Re-verificación" si los datos de campo no coinciden con las
expectativas contables.

●  Aprobación de Cambios: El supervisor debe autorizar individualmente o en bloque las
actualizaciones de ubicación, responsable o estado físico recolectadas en campo.

●  Flujo de Cierre: El sistema no actualizará el registro principal del activo hasta que la

hoja de ruta tenga el estado "Cerrada y Conciliada" por el supervisor.

●  Acta de Cierre: Generación de un informe final de inventario que detalla el % de
efectividad, bienes hallados, bajas propuestas por mal estado y faltantes para
investigación.

●  Reporte de Diferencias: Generación automática de un informe comparativo entre el

"Stock Teórico" (sistema) vs. "Stock Real" (campo).

5.6. Módulo de Reportes y Consultas

Este módulo es la herramienta de salida de información para la toma de decisiones. Debe ser
capaz de transformar los datos operativos en reportes ejecutivos, contables y de auditoría, con
la capacidad de exportar la información para su uso externo.

Reportes Contables y Financieros (Cierre de Gestión)

●  Cuadro de Movimiento de Activos Fijos: Reporte detallado por cuenta contable que

muestra: Saldo Inicial + Altas - Bajas +/- Ajustes = Saldo Final.

●  Detalle de Depreciación Anual (Balance): Informe que desglosa el cálculo lineal

aplicado a cada activo al cierre del ejercicio, ideal para respaldar el asiento contable.

●  Reporte de Valor Neto en Libros: Listado de activos con su valor de adquisición,

depreciación acumulada y valor residual actual.

●  Reporte de Activos Totalmente Depreciados: Listado de bienes con valor neto cero o

valor residual mínimo que aún permanecen en servicio.

Reportes de Control e Inventario

●  Reporte de Faltantes y Sobrantes: Resultado directo de la conciliación del supervisor,

detallando las diferencias encontradas tras la toma física.

●  Reporte de Asignaciones por Custodio: Listado de todos los bienes bajo la

responsabilidad de un funcionario específico.

●  Historial de Trazabilidad por Activo: Informe cronológico de todos los movimientos,

cambios de estado y reparaciones que ha tenido un bien desde su alta.

●  Reporte de Ubicación Física: Inventario detallado por campus, edificio, piso o ambiente.

Reportes de Gestión de Campo

●  Cumplimiento de Hojas de Ruta: Porcentaje de ejecución de las tareas asignadas a los

inventariadores.

●  Estado de Conservación: Resumen estadístico del estado físico de los activos (ej: 50%

Bueno, 20% Regular, 15% Excelente, 10% Muy Bueno, 5% Malo).

●  Reporte de Documentos Vencidos: Alerta sobre garantías, seguros o manuales que
requieren renovación o atención (vinculado al módulo de Gestión Documental).

Dashboards (Tableros de Control Visual)

●  Resumen Ejecutivo: Gráficos de torta o barras que muestran la inversión total en

activos por categoría.

●  Alertas Críticas: Indicadores visuales de activos no localizados o pendientes de

conciliación.

Capacidades de Exportación y Personalización

●  Formatos de Salida: Todos los reportes deben poder exportarse a Excel (XLSX), PDF y

CSV.

●  Filtros Dinámicos: Capacidad de filtrar cualquier reporte por rango de fechas, categoría,

centro de costo, responsable o estado.

●  Generador de Consultas Ad-hoc: Interfaz sencilla para que el usuario administrativo
cree listados personalizados seleccionando las columnas que desea visualizar.

5.7. Módulo de Gestión Documental y Archivo Digital

Para asegurar que el sistema no solo registre datos, sino también el respaldo legal y físico de
cada bien, el módulo de Administración de Documentos debe incluir lo siguiente

●  Repositorio Centralizado: Almacenamiento de archivos digitales asociados a cada

activo (PDF, JPG, PNG).

●  Tipología Documental: Capacidad para clasificar y adjuntar documentos específicos por

cada etapa del ciclo de vida:

o  Adquisición: Facturas de compra, pólizas de importación, órdenes de compra,

etc.

o  Operación: Manuales de usuario, certificados de garantía, pólizas de seguro y

registros de mantenimiento.

o  Asignación: Actas de entrega-recepción con firma.
o  Baja: Actas de descarte, certificados de donación o reportes de pérdida/robo.

●  Visualización y Descarga: Visor de documentos integrado para consulta rápida sin

●

necesidad de descarga previa.
Indexación y Búsqueda: Búsqueda rápida de documentos por número de activo, serie o
rango de fechas.

6. Reglas o Condiciones

●  Calculo financiero al cierre de la gestión fiscal (31 de diciembre).
●  Fórmula para el cálculo de la depreciación anual de un activo (Depreciación Anual =

(Valor de Adquisición - Valor Residual) / Vida Útil).

●  Prorrateo de la depreciación para altas y revalúos de activos, el cálculo de la

depreciación es proporcional a los meses transcurridos desde su alta hasta el cierre (ej.
si se compró en junio, deprecia 7/12 del gasto anual)

●  Valor residual, es práctica común en el país dejar valor residual de 1 (o valor

simbólico), para mantener el activo en uso una vez depreciado el 100% de su valor.
●  Ajuste por inflación, se actualiza el valor bruto del activo con los valores de las UFVs
antes de calcular la depreciación de la gestión (aunque por decisión del Consejo
Técnico Nacional de Auditoria y Contabilidad, se encuentra suspendida el ajuste por
inflación desde diciembre 2020).

7. Entregables

●  Documento de análisis de requerimientos, diseño del sistema y de la base de datos.
●  Software instalado y configurado en ambiente de producción.
●  Manuales de usuario y técnico.
●  Plan de capacitación para el personal administrativo.


