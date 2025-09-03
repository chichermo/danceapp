# 📚 Student Import Guide - Heliopsis Dance Academy

## 🎯 **General Description**

This guide will help you import the complete student list from your `.ods` file to the Heliopsis Dance Academy application. The system is designed to handle all student data, guardians, groups and dance levels.

## 📋 **Supported File Format**

### **Accepted Formats:**
- ✅ **CSV (.csv)** - Recommended for bulk import
- ✅ **JSON (.json)** - For structured data
- ⚠️ **Excel (.xlsx, .xls)** - In development (export as CSV)

### **Maximum Size:**
- **10 MB** per file

## 🔄 **Import Process**

### **Step 1: Prepare the File**

#### **Option A: Export from LibreOffice/OpenOffice**
1. Open your `.ods` file in **LibreOffice Calc**
2. Go to **File → Export as → CSV**
3. Select **UTF-8** as encoding
4. Save as `students.csv`

#### **Option B: Export from Google Sheets**
1. Upload your `.ods` file to **Google Sheets**
2. **File → Download → CSV**
3. It will download automatically

#### **Option C: Convert Online**
1. Go to [convertio.co/ods-csv](https://convertio.co/ods-csv/)
2. Upload your `.ods` file
3. Select **CSV** format
4. Download the converted file

### **Step 2: CSV File Structure**

#### **Required Columns:**
```csv
Name,LastName,BirthDate,Gender,Email,Phone,Address,Group,Level
Ana,Garcia,2010-05-15,Female,ana@email.com,+56912345678,Av. Providencia 1234,Mini Ballet,Beginner
Carlos,Rodriguez,2009-08-22,Male,carlos@email.com,+56923456789,Calle Las Condes 567,Teen Hip Hop,Intermediate
```

#### **Optional Columns:**
```csv
Name,LastName,BirthDate,Gender,Email,Phone,Address,Group,Level,Guardian,GuardianPhone,GuardianEmail,Notes
```

### **Step 3: Import in the Application**

1. **Open the** Heliopsis Dance Academy application
2. Go to **Students** in the side menu
3. Click **"Import"** (blue button)
4. **Drag and drop** your CSV file or click to select
5. **Review the results** of the import
6. **Confirm** the import

## 📊 **Data Mapping**

### **Personal Data:**
| CSV Field | Application Field | Description |
|-----------|------------------|-------------|
| `Name` | Name | Student's first name |
| `LastName` | Last Name | Student's last name |
| `BirthDate` | Birth Date | Format: YYYY-MM-DD |
| `Gender` | Gender | Female/Male/Non-binary |

### **Contact Information:**
| CSV Field | Application Field | Description |
|-----------|------------------|-------------|
| `Email` | Email | Student's email address |
| `Phone` | Phone | Phone number with country code |

### **Address:**
| CSV Field | Application Field | Description |
|-----------|------------------|-------------|
| `Address` | Address | Street and number |
| `City` | City | City of residence |
| `Region` | Region | Region or state |
| `PostalCode` | Postal Code | Postal code |

### **Academic Information:**
| CSV Field | Application Field | Description |
|-----------|------------------|-------------|
| `Group` | Dance Groups | Dance group name |
| `Level` | Level | Beginner/Intermediate/Advanced/Expert |
| `Style` | Dance Style | Ballet/Hip Hop/Contemporary/Jazz |

### **Guardian Information:**
| CSV Field | Application Field | Description |
|-----------|------------------|-------------|
| `Guardian` | Guardian Name | Guardian's full name |
| `GuardianPhone` | Guardian Phone | Contact number |
| `GuardianEmail` | Guardian Email | Guardian's email |
| `Relationship` | Relationship | Father/Mother/Tutor/Guardian |

## ⚠️ **Validations and Common Errors**

### **Frequent Errors:**
1. **Incorrect date format**
   - ❌ `15/05/2010`
   - ✅ `2010-05-15`

2. **Phone numbers without country code**
   - ❌ `12345678`
   - ✅ `+56912345678`

3. **Invalid email format**
   - ❌ `ana.email`
   - ✅ `ana@email.com`

4. **Unrecognized levels**
   - ❌ `Principante`
   - ✅ `Beginner`

### **Common Warnings:**
- Empty fields (will be filled with default values)
- Duplicate names (numeric suffix will be added)
- Non-existent groups (will be created automatically)

## 🎭 **Choreography Integration**

Once students are imported, you can:

### **Automatic Selection:**
- ✅ **Filter by dance group**
- ✅ **Filter by experience level**
- ✅ **Filter by student age**
- ✅ **Search by name** in real time

### **Assignment in Choreographies:**
- ✅ **Select specific students**
- ✅ **Create formations** with real names
- ✅ **Synchronize music** with movements
- ✅ **Share** with real students

## 🔧 **Troubleshooting**

### **File doesn't import:**
1. Check the format (must be CSV)
2. Review the size (maximum 10MB)
3. Make sure it has headers
4. Verify the encoding (UTF-8)

### **Missing data:**
1. Check column names
2. Verify there are no extra spaces
3. Make sure dates are in correct format
4. Check that levels are valid

### **Validation errors:**
1. Review email format
2. Verify phone numbers
3. Make sure dates are valid
4. Check that genders are correct

## 📱 **Post-Import Features**

### **Student Management:**
- ✅ **Edit personal information**
- ✅ **Add/remove guardians**
- ✅ **Change dance groups**
- ✅ **Update experience levels**
