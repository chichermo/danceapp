# 📚 Guía de Importación de Estudiantes - Heliopsis Dance Academy

## 🎯 **Descripción General**

Esta guía te ayudará a importar la lista completa de estudiantes desde tu archivo `.ods` a la aplicación de Heliopsis Dance Academy. El sistema está diseñado para manejar todos los datos de estudiantes, apoderados, grupos y niveles de danza.

## 📋 **Formato de Archivo Soportado**

### **Formatos Aceptados:**
- ✅ **CSV (.csv)** - Recomendado para importación masiva
- ✅ **JSON (.json)** - Para datos estructurados
- ⚠️ **Excel (.xlsx, .xls)** - En desarrollo (exporta como CSV)

### **Tamaño Máximo:**
- **10 MB** por archivo

## 🔄 **Proceso de Importación**

### **Paso 1: Preparar el Archivo**

#### **Opción A: Exportar desde LibreOffice/OpenOffice**
1. Abre tu archivo `.ods` en **LibreOffice Calc**
2. Ve a **Archivo → Exportar como → CSV**
3. Selecciona **UTF-8** como codificación
4. Guarda como `estudiantes.csv`

#### **Opción B: Exportar desde Google Sheets**
1. Sube tu archivo `.ods` a **Google Sheets**
2. **Archivo → Descargar → CSV**
3. Se descargará automáticamente

#### **Opción C: Convertir Online**
1. Ve a [convertio.co/ods-csv](https://convertio.co/ods-csv/)
2. Sube tu archivo `.ods`
3. Selecciona formato **CSV**
4. Descarga el archivo convertido

### **Paso 2: Estructura del Archivo CSV**

#### **Columnas Requeridas:**
```csv
Nombre,Apellido,FechaNacimiento,Genero,Email,Telefono,Direccion,Grupo,Nivel
Ana,García,2010-05-15,Femenino,ana@email.com,+56912345678,Av. Providencia 1234,Mini Ballet,Principiante
Carlos,Rodríguez,2009-08-22,Masculino,carlos@email.com,+56923456789,Calle Las Condes 567,Teen Hip Hop,Intermedio
```

#### **Columnas Opcionales:**
```csv
Nombre,Apellido,FechaNacimiento,Genero,Email,Telefono,Direccion,Grupo,Nivel,Apoderado,TelefonoApoderado,EmailApoderado,Notas
```

### **Paso 3: Importar en la Aplicación**

1. **Abre la aplicación** Heliopsis Dance Academy
2. Ve a **Estudiantes** en el menú lateral
3. Haz clic en **"Importar"** (botón azul)
4. **Arrastra y suelta** tu archivo CSV o haz clic para seleccionar
5. **Revisa los resultados** de la importación
6. **Confirma** la importación

## 📊 **Mapeo de Datos**

### **Datos Personales:**
| Campo CSV | Campo Aplicación | Descripción |
|-----------|------------------|-------------|
| `Nombre` | Nombre | Primer nombre del estudiante |
| `Apellido` | Apellido | Apellido del estudiante |
| `FechaNacimiento` | Fecha de Nacimiento | Formato: YYYY-MM-DD |
| `Genero` | Género | Femenino/Masculino/No binario |

### **Información de Contacto:**
| Campo CSV | Campo Aplicación | Descripción |
|-----------|------------------|-------------|
| `Email` | Email | Correo electrónico del estudiante |
| `Telefono` | Teléfono | Número de teléfono con código país |

### **Dirección:**
| Campo CSV | Campo Aplicación | Descripción |
|-----------|------------------|-------------|
| `Direccion` | Dirección | Calle y número |
| `Ciudad` | Ciudad | Ciudad de residencia |
| `Region` | Región | Región o estado |
| `CodigoPostal` | Código Postal | Código postal |

### **Información Académica:**
| Campo CSV | Campo Aplicación | Descripción |
|-----------|------------------|-------------|
| `Grupo` | Grupos de Danza | Nombre del grupo de danza |
| `Nivel` | Nivel | Principiante/Intermedio/Avanzado/Experto |
| `Estilo` | Estilo de Danza | Ballet/Hip Hop/Contemporáneo/Jazz |

### **Información de Apoderados:**
| Campo CSV | Campo Aplicación | Descripción |
|-----------|------------------|-------------|
| `Apoderado` | Nombre del Apoderado | Nombre completo del apoderado |
| `TelefonoApoderado` | Teléfono del Apoderado | Número de contacto |
| `EmailApoderado` | Email del Apoderado | Correo del apoderado |
| `Relacion` | Relación | Padre/Madre/Tutor/Apoderado |

## ⚠️ **Validaciones y Errores Comunes**

### **Errores Frecuentes:**
1. **Formato de fecha incorrecto**
   - ❌ `15/05/2010`
   - ✅ `2010-05-15`

2. **Números de teléfono sin código país**
   - ❌ `12345678`
   - ✅ `+56912345678`

3. **Emails sin formato válido**
   - ❌ `ana.email`
   - ✅ `ana@email.com`

4. **Niveles no reconocidos**
   - ❌ `Principante`
   - ✅ `Principiante`

### **Advertencias Comunes:**
- Campos vacíos (se completarán con valores por defecto)
- Nombres duplicados (se agregará sufijo numérico)
- Grupos no existentes (se crearán automáticamente)

## 🎭 **Integración con Coreografías**

Una vez importados los estudiantes, podrás:

### **Selección Automática:**
- ✅ **Filtrar por grupo** de danza
- ✅ **Filtrar por nivel** de experiencia
- ✅ **Filtrar por edad** del estudiante
- ✅ **Búsqueda por nombre** en tiempo real

### **Asignación en Coreografías:**
- ✅ **Seleccionar estudiantes** específicos
- ✅ **Crear formaciones** con nombres reales
- ✅ **Sincronizar música** con movimientos
- ✅ **Compartir** con estudiantes reales

## 🔧 **Solución de Problemas**

### **El archivo no se importa:**
1. Verifica el formato (debe ser CSV)
2. Revisa el tamaño (máximo 10MB)
3. Asegúrate de que tenga encabezados
4. Verifica la codificación (UTF-8)

### **Datos faltantes:**
1. Revisa los nombres de las columnas
2. Verifica que no haya espacios extra
3. Asegúrate de que las fechas estén en formato correcto
4. Revisa que los niveles sean válidos

### **Errores de validación:**
1. Revisa el formato de emails
2. Verifica los números de teléfono
3. Asegúrate de que las fechas sean válidas
4. Revisa que los géneros sean correctos

## 📱 **Funcionalidades Post-Importación**

### **Gestión de Estudiantes:**
- ✅ **Editar información** personal
- ✅ **Agregar/remover** apoderados
- ✅ **Cambiar grupos** de danza
- ✅ **Actualizar niveles** de experiencia

### **Reportes y Estadísticas:**
- ✅ **Dashboard** con métricas
- ✅ **Asistencia** por estudiante
- ✅ **Progreso** en grupos
- ✅ **Exportación** de datos

### **Comunicación:**
- ✅ **Mensajes** a apoderados
- ✅ **Notificaciones** de clases
- ✅ **Recordatorios** de eventos
- ✅ **Reportes** de progreso

## 🚀 **Próximas Funcionalidades**

### **En Desarrollo:**
- 🔄 **Importación desde Excel** (.xlsx, .xls)
- 🔄 **Sincronización con Google Sheets**
- 🔄 **API para integración externa**
- 🔄 **Backup automático** de datos

### **Planeado:**
- 📅 **Calendario individual** por estudiante
- 📊 **Análisis de progreso** avanzado
- 🎥 **Videos de práctica** personalizados
- 💰 **Gestión de pagos** y cuotas

## 📞 **Soporte Técnico**

### **Si tienes problemas:**
1. **Revisa esta guía** paso a paso
2. **Verifica el formato** de tu archivo
3. **Contacta al equipo** de desarrollo
4. **Proporciona detalles** del error

### **Información útil para reportar:**
- Tipo de archivo original
- Formato de exportación usado
- Mensajes de error específicos
- Capturas de pantalla del problema

---

## 🎯 **Resumen Rápido**

1. **Convierte** tu archivo `.ods` a `.csv`
2. **Verifica** que tenga las columnas correctas
3. **Importa** desde la sección Estudiantes
4. **Revisa** los resultados y corrige errores
5. **¡Disfruta** de tu aplicación con datos reales! 🎭✨

---

*Esta guía se actualiza regularmente. Última actualización: Enero 2024*
