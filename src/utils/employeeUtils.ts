import { User } from "@/types/employee";

/**
 * Format tanggal ke format Indonesia
 */
export const formatDateIndonesia = (date: string | Date | null): string => {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '-';
  
  return dateObj.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Hitung lama bekerja dari tanggal mulai
 */
export const calculateWorkDuration = (startDate: string | Date | null): string => {
  if (!startDate) return '-';
  
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  
  if (isNaN(start.getTime())) return '-';
  
  const now = new Date();
  const diffTime = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);
  
  if (years > 0 && months > 0) {
    return `${years} tahun ${months} bulan`;
  } else if (years > 0) {
    return `${years} tahun`;
  } else if (months > 0) {
    return `${months} bulan`;
  } else {
    return `${diffDays} hari`;
  }
};

/**
 * Hitung usia dari tanggal lahir
 */
export const calculateAge = (birthDate: string | Date | null): string => {
  if (!birthDate) return '-';
  
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  
  if (isNaN(birth.getTime())) return '-';
  
  const now = new Date();
  const age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    return `${age - 1} tahun`;
  }
  
  return `${age} tahun`;
};

/**
 * Export data karyawan ke CSV
 */
export const exportEmployeeToCSV = (user: User): void => {
  const csvData = [
    ['Field', 'Value'],
    ['Nama Lengkap', user.fullName || ''],
    ['Email', user.email || ''],
    ['No. HP', user.phoneNumber || ''],
    ['NIK', user.nationalId || ''],
    ['Tempat Lahir', user.placeOfBirth || ''],    ['Tanggal Lahir', formatDateIndonesia(user.dateOfBirth || null)],
    ['Usia', calculateAge(user.dateOfBirth || null)],
    ['Jenis Kelamin', user.gender || ''],
    ['Alamat', user.address || ''],
    ['Posisi', user.position || ''],
    ['Tipe Kerja', user.employmentType || ''],    ['Tanggal Mulai Kerja', formatDateIndonesia(user.startDate || null)],
    ['Lama Bekerja', calculateWorkDuration(user.startDate || null)],
    ['Status Aktif', user.isActive ? 'Aktif' : 'Tidak Aktif'],
    ['Divisi', user.division?.name || ''],
    ['Business Unit', user.division?.businessUnit?.name || ''],
    ['Nama Ayah', user.fatherName || ''],
    ['Nama Ibu', user.motherName || ''],
    ['Status Pernikahan', user.maritalStatus || ''],
    ['Nama Pasangan', user.spouseName || ''],
    ['Golongan Darah', user.bloodType || ''],
    ['Tinggi Badan', user.height ? `${user.height} cm` : ''],
    ['Berat Badan', user.weight ? `${user.weight} kg` : ''],
    ['Nama Bank', user.bankName || ''],
    ['No. Rekening', user.bankAccountNumber || ''],
    ['Nama Rekening', user.bankAccountName || ''],
    ['Kontak Darurat', user.emergencyContactName || ''],
    ['Hubungan Kontak Darurat', user.emergencyContactRelation || ''],
    ['No. HP Kontak Darurat', user.emergencyContactPhone || ''],
  ];

  // Tambahkan data pendidikan formal
  if (user.formalEducations && user.formalEducations.length > 0) {
    csvData.push(['=== PENDIDIKAN FORMAL ===', '']);
    user.formalEducations.forEach((edu, index) => {
      csvData.push([`Pendidikan ${index + 1} - Jenjang`, edu.level || '']);
      csvData.push([`Pendidikan ${index + 1} - Sekolah`, edu.schoolName || '']);
      csvData.push([`Pendidikan ${index + 1} - Jurusan`, edu.major || '']);
      csvData.push([`Pendidikan ${index + 1} - Tahun Lulus`, edu.yearGraduate?.toString() || '']);
    });
  }

  // Tambahkan data pendidikan non-formal
  if (user.nonFormalEducations && user.nonFormalEducations.length > 0) {
    csvData.push(['=== PENDIDIKAN NON-FORMAL ===', '']);
    user.nonFormalEducations.forEach((edu, index) => {
      csvData.push([`Pelatihan ${index + 1} - Nama`, edu.name || '']);
      csvData.push([`Pelatihan ${index + 1} - Institusi`, edu.institution || '']);
      csvData.push([`Pelatihan ${index + 1} - Tahun`, edu.year?.toString() || '']);
    });
  }

  // Convert to CSV string
  const csvContent = csvData
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  // Download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `data_karyawan_${user.fullName || user.username}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export data karyawan ke JSON
 */
export const exportEmployeeToJSON = (user: User): void => {
  const jsonData = {
    personalInfo: {
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      nationalId: user.nationalId,
      placeOfBirth: user.placeOfBirth,
      dateOfBirth: user.dateOfBirth,
      age: calculateAge(user.dateOfBirth || null),
      gender: user.gender,
      address: user.address,
    },
    employment: {
      position: user.position,
      employmentType: user.employmentType,
      startDate: user.startDate,
      workDuration: calculateWorkDuration(user.startDate || null),
      isActive: user.isActive,
      division: user.division?.name,
      businessUnit: user.division?.businessUnit?.name,
    },
    family: {
      fatherName: user.fatherName,
      motherName: user.motherName,
      maritalStatus: user.maritalStatus,
      spouseName: user.spouseName,
      childrenNames: user.childrenNames,
    },
    health: {
      bloodType: user.bloodType,
      height: user.height,
      weight: user.weight,
      medicalHistory: user.medicalHistory,
      allergies: user.allergies,
    },
    banking: {
      bankName: user.bankName,
      bankAccountNumber: user.bankAccountNumber,
      bankAccountName: user.bankAccountName,
    },
    emergency: {
      contactName: user.emergencyContactName,
      contactRelation: user.emergencyContactRelation,
      contactPhone: user.emergencyContactPhone,
    },
    education: {
      formal: user.formalEducations,
      nonFormal: user.nonFormalEducations,
    },
    skills: user.skills,
    interests: user.interests,
    languages: user.languages,
    socialMedia: {
      instagram: user.instagram,
      facebook: user.facebook,
      twitter: user.twitter,
      linkedin: user.linkedin,
      tiktok: user.tiktok,
    },
    exportedAt: new Date().toISOString(),
  };

  const jsonString = JSON.stringify(jsonData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `data_karyawan_${user.fullName || user.username}_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Share data karyawan
 */
export const shareEmployee = async (user: User): Promise<void> => {
  const shareData = {
    title: `Profil Karyawan - ${user.fullName || user.username}`,
    text: `Lihat profil karyawan ${user.fullName || user.username} di ConnectiViz`,
    url: window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (error) {
      console.log('Error sharing:', error);
      // Fallback to copying to clipboard
      copyToClipboard(window.location.href);
    }
  } else {
    // Fallback to copying to clipboard
    copyToClipboard(window.location.href);
  }
};

/**
 * Copy text to clipboard
 */
const copyToClipboard = (text: string): void => {
  navigator.clipboard.writeText(text).then(() => {
    // You can add a toast notification here
    console.log('Link copied to clipboard');
  });
};

/**
 * Export data karyawan ke PDF menggunakan jsPDF
 */
export const exportEmployeeToPDF = async (user: User): Promise<void> => {
  try {
    // Dynamic import jsPDF untuk menghindari SSR issues
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Add autoTable method to pdf instance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (pdf as any).autoTable = autoTable;
    
    // Title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Employee Profile Report', 20, 20);
    
    // Employee name
    pdf.setFontSize(16);
    pdf.text(user.fullName || user.username || 'Unknown Employee', 20, 35);
    
    let yPosition = 50;
    
    // Personal Information Section
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Personal Information', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    const personalData = [
      ['Full Name', user.fullName || ''],
      ['Username', user.username || ''],
      ['Email', user.email || ''],
      ['Phone Number', user.phoneNumber || ''],
      ['National ID', user.nationalId || ''],
      ['Place of Birth', user.placeOfBirth || ''],      ['Date of Birth', formatDateIndonesia(user.dateOfBirth || null)],
      ['Age', calculateAge(user.dateOfBirth || null)],
      ['Gender', user.gender || ''],
      ['Address', user.address || ''],
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (pdf as any).autoTable({
      startY: yPosition,
      head: [['Field', 'Value']],
      body: personalData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 110 }
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    yPosition = (pdf as any).lastAutoTable.finalY + 15;

    // Employment Information Section
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Employment Information', 20, yPosition);
    yPosition += 10;

    const employmentData = [
      ['Position', user.position || ''],
      ['Job Title', user.jobTitle || ''],
      ['Job Level', user.jobLevel?.toString() || ''],
      ['Employment Type', user.employmentType || ''],      ['Start Date', formatDateIndonesia(user.startDate || null)],
      ['Work Duration', calculateWorkDuration(user.startDate || null)],
      ['Is Active', user.isActive ? 'Active' : 'Inactive'],
      ['Division', user.division?.name || ''],
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (pdf as any).autoTable({
      startY: yPosition,
      head: [['Field', 'Value']],
      body: employmentData,
      theme: 'grid',
      headStyles: { fillColor: [39, 174, 96] },
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 110 }
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    yPosition = (pdf as any).lastAutoTable.finalY + 15;

    // Family Information (if exists)
    if (user.motherName || user.fatherName || user.maritalStatus) {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Family Information', 20, yPosition);
      yPosition += 10;

      const familyData = [
        ['Father Name', user.fatherName || ''],
        ['Mother Name', user.motherName || ''],
        ['Marital Status', user.maritalStatus || ''],
        ['Spouse Name', user.spouseName || ''],
        ['Children Names', user.childrenNames?.join(', ') || ''],
      ].filter(([, value]) => value !== '');

      if (familyData.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (pdf as any).autoTable({
          startY: yPosition,
          head: [['Field', 'Value']],
          body: familyData,
          theme: 'grid',
          headStyles: { fillColor: [155, 89, 182] },
          margin: { left: 20, right: 20 },
          columnStyles: {
            0: { cellWidth: 60 },
            1: { cellWidth: 110 }
          }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        yPosition = (pdf as any).lastAutoTable.finalY + 15;
      }
    }

    // Skills and Interests (if exists)
    if (user.skills?.length || user.interests?.length || user.languages?.length) {
      if (yPosition > 220) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Skills & Interests', 20, yPosition);
      yPosition += 10;

      const skillsData = [
        ['Skills', user.skills?.join(', ') || ''],
        ['Interests', user.interests?.join(', ') || ''],
        ['Languages', user.languages?.join(', ') || ''],
      ].filter(([, value]) => value !== '');

      if (skillsData.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (pdf as any).autoTable({
          startY: yPosition,
          head: [['Category', 'Details']],
          body: skillsData,
          theme: 'grid',
          headStyles: { fillColor: [230, 126, 34] },
          margin: { left: 20, right: 20 },
          columnStyles: {
            0: { cellWidth: 60 },
            1: { cellWidth: 110 }
          }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        yPosition = (pdf as any).lastAutoTable.finalY + 15;
      }
    }    // Footer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pageCount = (pdf as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        `Generated on ${new Date().toLocaleDateString('id-ID')} - Page ${i} of ${pageCount}`,
        20,
        pdf.internal.pageSize.height - 10
      );
    }

    // Save the PDF
    const fileName = `employee_profile_${user.fullName || user.username}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};
