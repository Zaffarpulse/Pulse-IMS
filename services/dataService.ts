
import { InventoryItem, Requisition, RequestStatus, Role, Department, User, Vendor } from '../types';

// FULL Data from CSV
const realUsers: User[] = [
  // --- ADMINS (Sohail, Zaffar, Qurrat, Sobia, Khalid) ---
  { id: 'u1', staffId: '1', name: 'SOHAIL QASIM', role: Role.ADMIN, designation: 'M.D', workDepartment: 'ADMINISTRATIVE', email: 'ZAFFARABASS3@GMAIL.COM', mobile: '7860000097', password: '123', avatar: 'https://ui-avatars.com/api/?name=Sohail+Qasim&background=0D9488&color=fff' },
  { id: 'u10', staffId: '10', name: 'ZAFFAR ABASS RISHI', role: Role.ADMIN, designation: 'MANAGER', workDepartment: 'ADMINISTRATIVE', email: 'ZAFFARABASS3@GMAIL.COM', mobile: '9858703786', password: '123', avatar: 'https://ui-avatars.com/api/?name=Zaffar+Abass&background=0D9488&color=fff' },
  { id: 'u181', staffId: '181', name: 'Qurrat ul ain', role: Role.ADMIN, designation: 'P. R. EXECUTIVE', workDepartment: 'ADMINISTRATIVE', email: 'Qurratulaain345@gmail.com', mobile: '7889646796', password: '123', avatar: 'https://ui-avatars.com/api/?name=Qurrat+Ul+Ain&background=0D9488&color=fff' },
  { id: 'u64', staffId: '64', name: 'Sobia najar', role: Role.ADMIN, designation: 'Front desk', workDepartment: 'ADMINISTRATIVE', email: 'Sobianajar@gmail.com', mobile: '8899201993', password: '123', avatar: 'https://ui-avatars.com/api/?name=Sobia+Najar&background=0D9488&color=fff' },
  { id: 'u51', staffId: '51', name: 'Khalid Hussain Shah', role: Role.ADMIN, designation: 'Accountant', workDepartment: 'ADMINISTRATIVE', email: 'khalidkazmi96@gmail.con', mobile: '9149454223', password: '123', avatar: 'https://ui-avatars.com/api/?name=Khalid+Hussain&background=0D9488&color=fff' },

  // --- STORE INCHARGE (Mohd Shahid) ---
  { id: 'u251', staffId: '251', name: 'Mohd shahid', role: Role.STORE_INCHARGE, department: Department.STORE, designation: 'Nursing staff', workDepartment: 'OPD', email: 'Mohammadshahid5374@gmail.com', mobile: '9149407896', password: '123', avatar: 'https://ui-avatars.com/api/?name=Mohd+Shahid&background=F59E0B&color=fff' },

  // --- MEDICAL INCHARGE (Jhangir Mubarak) ---
  { id: 'u353', staffId: '353', name: 'JHANGIR MUBARAK', role: Role.MEDICAL_INCHARGE, department: Department.MEDICAL, designation: 'Pharmacist', workDepartment: 'PHARMACY', email: 'Jahingirwani252@gmail', mobile: '6006326143', password: '123', avatar: 'https://ui-avatars.com/api/?name=Jhangir+Mubarak&background=2563EB&color=fff' },

  // --- HOUSEKEEPING INCHARGE (Mohd Sarfraz) ---
  { id: 'u90', staffId: '90', name: 'Mohd Sarfraz', role: Role.HK_INCHARGE, department: Department.HOUSEKEEPING, designation: 'Security', workDepartment: 'ADMINISTRATIVE', email: 'Sarfrazahmed@gmail.com', mobile: '6006807212', password: '123', avatar: 'https://ui-avatars.com/api/?name=Mohd+Sarfraz&background=16A34A&color=fff' },
  
  // --- ALLIED INCHARGE (Mohd Sarfraz - Separate Login) ---
  { id: 'u90A', staffId: '90A', name: 'Mohd Sarfraz (Allied)', role: Role.ALLIED_INCHARGE, department: Department.ALLIED, designation: 'Security', workDepartment: 'ADMINISTRATIVE', email: 'Sarfrazahmed@gmail.com', mobile: '6006807212', password: '123', avatar: 'https://ui-avatars.com/api/?name=Mohd+Sarfraz&background=475569&color=fff' },

  // --- STAFF (Full List) ---
  { id: 'u260', staffId: '260', name: 'Rohit sharma', role: Role.STAFF, designation: 'Front desk', workDepartment: 'ADMINISTRATIVE', email: 'Rohitsharma1234452@gmail.con', mobile: '8492926009', password: '123', avatar: 'https://ui-avatars.com/api/?name=Rohit' },
  { id: 'u83', staffId: '83', name: 'Hilal ahmed tak', role: Role.STAFF, designation: 'Supervisor', workDepartment: 'ADMINISTRATIVE', email: 'Hilal.tak489@gmail.com', mobile: '9697197960', password: '123', avatar: 'https://ui-avatars.com/api/?name=Hilal' },
  { id: 'u259', staffId: '259', name: 'SOBIA AKHTER', role: Role.STAFF, designation: 'Front desk', workDepartment: 'ADMINISTRATIVE', email: 'Sobuu18@gmail.com', mobile: '7889874230', password: '123', avatar: 'https://ui-avatars.com/api/?name=Sobia' },
  { id: 'u35', staffId: '35', name: 'Nahida Banoo', role: Role.STAFF, designation: 'Medical staff', workDepartment: 'ADMINISTRATIVE', email: 'Nahidabanoo@gmail.com', mobile: '7889373556', password: '123', avatar: 'https://ui-avatars.com/api/?name=Nahida' },
  { id: 'u8', staffId: '8', name: 'AMEERA KOHLI', role: Role.STAFF, designation: '', workDepartment: 'ADMINISTRATIVE', email: '', mobile: '7006605314', password: '123', avatar: 'https://ui-avatars.com/api/?name=Ameera' },
  { id: 'u197', staffId: '197', name: 'Kirti Sharma', role: Role.STAFF, designation: 'Computer operator', workDepartment: 'AYUSHMAN', email: 'Kirtisharma7051@gmail.com', mobile: '7889387797', password: '123', avatar: 'https://ui-avatars.com/api/?name=Kirti' },
  { id: 'u188', staffId: '188', name: 'Mehboob Iqbal', role: Role.STAFF, designation: 'Computer operator', workDepartment: 'AYUSHMAN', email: 'Mehboobiqbal888@gmail.com', mobile: '9622136025', password: '123', avatar: 'https://ui-avatars.com/api/?name=Mehboob' },
  { id: 'u239', staffId: '239', name: 'Nadshah Banoo', role: Role.STAFF, designation: 'Computer operator', workDepartment: 'AYUSHMAN', email: '.', mobile: '7051903323', password: '123', avatar: 'https://ui-avatars.com/api/?name=Nadshah' },
  { id: 'u276', staffId: '276', name: 'MOHD SAJID', role: Role.STAFF, designation: 'Pentry', workDepartment: 'CANTEEN', email: 'Mohdsajid5051@ Gmail.com', mobile: '9858699344', password: '123', avatar: 'https://ui-avatars.com/api/?name=Mohd' },
  { id: 'u75', staffId: '75', name: 'Ishan Sharma', role: Role.STAFF, designation: 'Dialysis staff', workDepartment: 'DIALYSIS', email: 'Ishanjinr@gmail.com', mobile: '7889715571', password: '123', avatar: 'https://ui-avatars.com/api/?name=Ishan' },
  { id: 'u84', staffId: '84', name: 'Vikar Ahmed Bhat', role: Role.STAFF, designation: 'Dialysis Tech', workDepartment: 'DIALYSIS', email: 'Vickey.butt@icloud.com', mobile: '7889325414', password: '123', avatar: 'https://ui-avatars.com/api/?name=Vikar' },
  { id: 'u147', staffId: '147', name: 'Sajid Hussain', role: Role.STAFF, designation: 'Dialysis Tech', workDepartment: 'DIALYSIS', email: 'Sajidhussain0987@gmail.com', mobile: '8082324902', password: '123', avatar: 'https://ui-avatars.com/api/?name=Sajid' },
  { id: 'u161', staffId: '161', name: 'Daljeet Singh', role: Role.STAFF, designation: 'Dialysis Tech', workDepartment: 'DIALYSIS', email: 'Daljeetsingh2348@gmai.com', mobile: '9906035634', password: '123', avatar: 'https://ui-avatars.com/api/?name=Daljeet' },
  { id: 'u37', staffId: '37', name: 'MARYADA SHEIKH', role: Role.STAFF, designation: 'Nursing staff', workDepartment: 'EMERGENCY', email: 'Maryada346@gmail.com', mobile: '7051322693', password: '123', avatar: 'https://ui-avatars.com/api/?name=Maryada' },
  { id: 'u277', staffId: '277', name: 'REETA DEVI', role: Role.STAFF, designation: 'Nursing staff', workDepartment: 'EMERGENCY', email: '', mobile: '', password: '123', avatar: 'https://ui-avatars.com/api/?name=Reeta' },
  { id: 'u281', staffId: '281', name: 'Rozia kouser', role: Role.STAFF, designation: 'Nursing stafff', workDepartment: 'EMERGENCY', email: 'Roziakoser47@gmail.com', mobile: '6006558353', password: '123', avatar: 'https://ui-avatars.com/api/?name=Rozia' },
  { id: 'u288', staffId: '288', name: 'Aryan mehra', role: Role.STAFF, designation: 'Nursing stafff', workDepartment: 'EMERGENCY', email: 'Aryanmehra8803@gmail.con', mobile: '9797189940', password: '123', avatar: 'https://ui-avatars.com/api/?name=Aryan' },
  { id: 'u20', staffId: '20', name: 'Rubia banoo', role: Role.STAFF, designation: 'Nursing staff', workDepartment: 'EMERGENCY', email: 'Rubiatak2@gmail.com', mobile: '6006118542', password: '123', avatar: 'https://ui-avatars.com/api/?name=Rubia' },
  { id: 'u327', staffId: '327', name: 'Insha Mushtaq', role: Role.STAFF, designation: 'Medical staff', workDepartment: 'EMERGENCY', email: 'inshamushtaq505@gmail.com med', mobile: '8899067274', password: '123', avatar: 'https://ui-avatars.com/api/?name=Insha' },
  { id: 'u248', staffId: '248', name: 'Roxana Tabsum', role: Role.STAFF, designation: 'Nursing staff', workDepartment: 'GENERAL WARD', email: 'Roxanaarzoo@gmail.com', mobile: '7051380839', password: '123', avatar: 'https://ui-avatars.com/api/?name=Roxana' },
  { id: 'u299', staffId: '299', name: 'ZULIFQAR ALI', role: Role.STAFF, designation: 'Nursing staff', workDepartment: 'GENERAL WARD', email: 'Zulifqarali275@gmaul.con', mobile: '9682561969', password: '123', avatar: 'https://ui-avatars.com/api/?name=Zulifqar' },
  { id: 'u300', staffId: '300', name: 'Nadeem ul haq', role: Role.STAFF, designation: 'Nursing staff', workDepartment: 'GENERAL WARD', email: 'Nadeemaly143@gmail.com', mobile: '9086055204', password: '123', avatar: 'https://ui-avatars.com/api/?name=Nadeem' },
  { id: 'u303', staffId: '303', name: 'SUMERA QURESHI', role: Role.STAFF, designation: 'Nursing staff', workDepartment: 'GENERAL WARD', email: 'Sumiraq2021@gmail.com', mobile: '9149665313', password: '123', avatar: 'https://ui-avatars.com/api/?name=Sumera' },
  { id: 'u198', staffId: '198', name: 'Nazma Kouser', role: Role.STAFF, designation: 'Nursing staff', workDepartment: 'GENERAL WARD', email: 'Unknown', mobile: '8082324902', password: '123', avatar: 'https://ui-avatars.com/api/?name=Nazma' },
  { id: 'u322', staffId: '322', name: 'MOHD RAFIQ (G.W)', role: Role.STAFF, designation: 'NURSING STAFF', workDepartment: 'GENERAL WARD', email: 'Mr4692925@gmail.com', mobile: '9541644002', password: '123', avatar: 'https://ui-avatars.com/api/?name=Mohd' },
  { id: 'u297', staffId: '297', name: 'SUJEEL AHMED', role: Role.STAFF, designation: 'Nursing staff', workDepartment: 'ICU', email: 'Sujeel6171@gmail.com', mobile: '8082325035', password: '123', avatar: 'https://ui-avatars.com/api/?name=Sujeel' },
  { id: 'u244', staffId: '244', name: 'Nawaz sharief', role: Role.STAFF, designation: 'Medical staff', workDepartment: 'ICU', email: 'Nawazsharief4722@gmail.con', mobile: '8492891547', password: '123', avatar: 'https://ui-avatars.com/api/?name=Nawaz' },
  { id: 'u22', staffId: '22', name: 'Nagina Akhtar', role: Role.STAFF, designation: 'Nursing staff', workDepartment: 'ICU', email: 'Naginaakhtar36@gmail.com', mobile: '7051192499', password: '123', avatar: 'https://ui-avatars.com/api/?name=Nagina' },
  { id: 'u117', staffId: '117', name: 'Rafia Bhat', role: Role.STAFF, designation: 'Nursing staff', workDepartment: 'ICU', email: '.', mobile: '6006977142', password: '123', avatar: 'https://ui-avatars.com/api/?name=Rafia' },
  { id: 'u305', staffId: '305', name: 'AFADUL HUSSAIN', role: Role.STAFF, designation: 'Lab technician', workDepartment: 'LAB', email: 'Ratherhappy23@gmail.com', mobile: '9103276286', password: '123', avatar: 'https://ui-avatars.com/api/?name=Afadul' },
  { id: 'u79', staffId: '79', name: 'Anil Kumar Sharma', role: Role.STAFF, designation: 'Lab technician', workDepartment: 'LAB', email: 'Anilkumar124@gmail.com', mobile: '8492073941', password: '123', avatar: 'https://ui-avatars.com/api/?name=Anil' },
  { id: 'u201', staffId: '201', name: 'Dr. Mehak Saleem Shah', role: Role.STAFF, designation: 'Doctor', workDepartment: 'MEDICAL OFFICER', email: 'Mehakshah259@gmail.com', mobile: '9596129356', password: '123', avatar: 'https://ui-avatars.com/api/?name=Dr' },
  { id: 'u312', staffId: '312', name: 'Dr. MUKHTAR AHMED', role: Role.STAFF, designation: 'Medical officer', workDepartment: 'MEDICAL OFFICER', email: 'Mukhtarkhan4348@gmail.com', mobile: '7889574955', password: '123', avatar: 'https://ui-avatars.com/api/?name=Dr' },
  { id: 'u11', staffId: '11', name: 'DR.HEENA ANJUM', role: Role.STAFF, designation: 'MEDICAL OFFICER', workDepartment: 'MEDICAL OFFICER', email: '', mobile: '8082287259', password: '123', avatar: 'https://ui-avatars.com/api/?name=Dr.heena' },
  { id: 'u195', staffId: '195', name: 'Raheela akhter', role: Role.STAFF, designation: 'Nursing staff', workDepartment: 'N.I.C.U', email: 'Raheelaakhter702@gmail.com', mobile: '8082847132', password: '123', avatar: 'https://ui-avatars.com/api/?name=Raheela' },
  { id: 'u192', staffId: '192', name: 'Ghulam rasool', role: Role.STAFF, designation: 'Nursing staff', workDepartment: 'N.I.C.U', email: 'Sonumalikramban123@gmail.com', mobile: '8082959441', password: '123', avatar: 'https://ui-avatars.com/api/?name=Ghulam' },
  { id: 'u113', staffId: '113', name: 'Shazia akhtar', role: Role.STAFF, designation: 'Nursing staff', workDepartment: 'N.I.C.U', email: 'Shaziatak380@gmail.com', mobile: '9682610679', password: '123', avatar: 'https://ui-avatars.com/api/?name=Shazia' },
  { id: 'u50', staffId: '50', name: 'Malka Khatoon', role: Role.STAFF, designation: 'Nursing staff', workDepartment: 'N.I.C.U', email: 'Khalidkazmi96@gmail.con', mobile: '9149454223', password: '123', avatar: 'https://ui-avatars.com/api/?name=Malka' },
  { id: 'u98', staffId: '98', name: 'Abdul damaq', role: Role.STAFF, designation: 'N.O Sweeper', workDepartment: 'NO/SWEEPER', email: 'Not', mobile: '8899654304', password: '123', avatar: 'https://ui-avatars.com/api/?name=Abdul' },
  { id: 'u103', staffId: '103', name: 'Kunti devi', role: Role.STAFF, designation: 'Sweeper', workDepartment: 'NO/SWEEPER', email: 'Not available', mobile: '8716837613', password: '123', avatar: 'https://ui-avatars.com/api/?name=Kunti' },
  { id: 'u106', staffId: '106', name: 'Asha Begum', role: Role.STAFF, designation: 'Sweeper', workDepartment: 'NO/SWEEPER', email: 'No', mobile: '9419646649', password: '123', avatar: 'https://ui-avatars.com/api/?name=Asha' },
  { id: 'u163', staffId: '163', name: 'Kamal Hussain', role: Role.STAFF, designation: 'Laundary', workDepartment: 'NO/SWEEPER', email: '.', mobile: '9149416315', password: '123', avatar: 'https://ui-avatars.com/api/?name=Kamal' },
  { id: 'u261', staffId: '261', name: 'Anil goswami', role: Role.STAFF, designation: 'Sweeper', workDepartment: 'NO/SWEEPER', email: 'Un', mobile: 'Un', password: '123', avatar: 'https://ui-avatars.com/api/?name=Anil' },
  { id: 'u214', staffId: '214', name: 'Meena kumari', role: Role.STAFF, designation: '.', workDepartment: 'NO/SWEEPER', email: '.', mobile: '8492906722', password: '123', avatar: 'https://ui-avatars.com/api/?name=Meena' },
  { id: 'u215', staffId: '215', name: 'Surat Alam', role: Role.STAFF, designation: '.', workDepartment: 'NO/SWEEPER', email: '.', mobile: '.', password: '123', avatar: 'https://ui-avatars.com/api/?name=Surat' },
  { id: 'u0', staffId: '0', name: 'REKHA DEVI', role: Role.STAFF, designation: 'NO', workDepartment: 'NO/SWEEPER', email: '', mobile: '9622817951', password: '123', avatar: 'https://ui-avatars.com/api/?name=Rekha' },
  { id: 'u287', staffId: '287', name: 'MUQADES FATIMA', role: Role.STAFF, designation: 'Tellecaller', workDepartment: 'OPD', email: 'muqadusfatima90@gmail.com', mobile: '7780878435', password: '123', avatar: 'https://ui-avatars.com/api/?name=Muqades' },
  { id: 'u286', staffId: '286', name: 'RAFIA NAZ', role: Role.STAFF, designation: 'Nursing staff', workDepartment: 'OPD', email: 'Emanirafya@gmail.com', mobile: '9103128489', password: '123', avatar: 'https://ui-avatars.com/api/?name=Rafia' },
  { id: 'u238', staffId: '238', name: 'Mandeep kour', role: Role.STAFF, designation: 'Nursing staff', workDepartment: 'OPD', email: 'Mandeepkour359@gmail.com', mobile: '7051127028', password: '123', avatar: 'https://ui-avatars.com/api/?name=Mandeep' },
  { id: 'u330', staffId: '330', name: 'Nazmina banoo', role: Role.STAFF, designation: 'Nursing staff', workDepartment: 'OPD', email: 'nazminabanoo8@gmail.com', mobile: '9018986830', password: '123', avatar: 'https://ui-avatars.com/api/?name=Nazmina' },
  { id: 'u291', staffId: '291', name: 'AMJED HUSSAIN', role: Role.STAFF, designation: 'OT TECHNICIAN', workDepartment: 'OPERATION THEATRE', email: 'Amjedhussain105@gmail.com', mobile: '7889735800', password: '123', avatar: 'https://ui-avatars.com/api/?name=Amjed' },
  { id: 'u59', staffId: '59', name: 'Umar akbar mir', role: Role.STAFF, designation: 'OT technician', workDepartment: 'OPERATION THEATRE', email: 'Umarmir0012@gmail.com', mobile: '6006109467', password: '123', avatar: 'https://ui-avatars.com/api/?name=Umar' },
  { id: 'u154', staffId: '154', name: 'Shahid iqbal', role: Role.STAFF, designation: 'Ot technician', workDepartment: 'OPERATION THEATRE', email: 'Syedshahid500@gmail.com', mobile: '9622860390', password: '123', avatar: 'https://ui-avatars.com/api/?name=Shahid' },
  { id: 'u36', staffId: '36', name: 'Ramiz ahmed wani', role: Role.STAFF, designation: 'OT Technician', workDepartment: 'OPERATION THEATRE', email: 'Wanirameez550@gmail.com', mobile: '9596229945', password: '123', avatar: 'https://ui-avatars.com/api/?name=Ramiz' },
  { id: 'u17', staffId: '17', name: 'Anil Kumar', role: Role.STAFF, designation: 'O T Incharge', workDepartment: 'OPERATION THEATRE', email: '.', mobile: '9541941681', password: '123', avatar: 'https://ui-avatars.com/api/?name=Anil' },
  { id: 'u61', staffId: '61', name: 'Mohd Rafi', role: Role.STAFF, designation: '.', workDepartment: 'OPERATION THEATRE', email: '.', mobile: '9906307791', password: '123', avatar: 'https://ui-avatars.com/api/?name=Mohd' },
  { id: 'u169', staffId: '169', name: 'Muzaffer ahmed', role: Role.STAFF, designation: 'Pharmacist', workDepartment: 'PHARMACY', email: 'muzafferahmed2001@gmail.com', mobile: '7051032160', password: '123', avatar: 'https://ui-avatars.com/api/?name=Muzaffer' },
  { id: 'u245', staffId: '245', name: 'Nazia Banoo', role: Role.STAFF, designation: 'Pharmacist', workDepartment: 'PHARMACY', email: 'Nazu113@gmail.com', mobile: '6005681195', password: '123', avatar: 'https://ui-avatars.com/api/?name=Nazia' },
  { id: 'u57', staffId: '57', name: 'Jahangir Nabi', role: Role.STAFF, designation: 'Pharmacist', workDepartment: 'PHARMACY', email: 'Jahangirlone9149@gmail.com', mobile: '9103092669', password: '123', avatar: 'https://ui-avatars.com/api/?name=Jahangir' },
  { id: 'u173', staffId: '173', name: 'Isthafam khan', role: Role.STAFF, designation: 'Medical assistant', workDepartment: 'PHARMACY', email: 'KhanIshhfamkhanmrukm1612@gmail.com', mobile: '9149537603', password: '123', avatar: 'https://ui-avatars.com/api/?name=Isthafam' },
  { id: 'u172', staffId: '172', name: 'Vivek Dogra', role: Role.STAFF, designation: '.', workDepartment: 'PHARMACY', email: '.', mobile: '6006044424', password: '123', avatar: 'https://ui-avatars.com/api/?name=Vivek' },
  { id: 'u124', staffId: '124', name: 'Ahmed Gorsi', role: Role.STAFF, designation: 'Security', workDepartment: 'SECURITY', email: '.', mobile: '9858525001', password: '123', avatar: 'https://ui-avatars.com/api/?name=Ahmed' },
  { id: 'u274', staffId: '274', name: 'Sarfraz Hussain', role: Role.STAFF, designation: 'Security guard', workDepartment: 'SECURITY', email: '.', mobile: '.', password: '123', avatar: 'https://ui-avatars.com/api/?name=Sarfraz' },
  { id: 'u268', staffId: '268', name: 'Yasir Amin', role: Role.STAFF, designation: 'Security guard', workDepartment: 'SECURITY', email: 'Yasiramin493@gmail.com', mobile: '8899028917', password: '123', avatar: 'https://ui-avatars.com/api/?name=Yasir' },
  { id: 'u335', staffId: '335', name: 'Mohd Ajaz', role: Role.STAFF, designation: 'Security guard', workDepartment: 'SECURITY', email: '', mobile: '9541420472', password: '123', avatar: 'https://ui-avatars.com/api/?name=Mohd' },
  { id: 'u55', staffId: '55', name: 'Sabeena akhter', role: Role.STAFF, designation: 'X ray technician', workDepartment: 'XRAY', email: 'Sabeenalatif9@gmail.com', mobile: '9797604564', password: '123', avatar: 'https://ui-avatars.com/api/?name=Sabeena' },
  { id: 'u340', staffId: '340', name: 'Tenzin Ahgmo', role: Role.STAFF, designation: 'Nursing staff', workDepartment: 'EMERGENCY', email: 'Tenzinangmo889@gmil .com', mobile: '8899207188', password: '123', avatar: 'https://ui-avatars.com/api/?name=Tenzin' },
  { id: 'u94', staffId: '94', name: 'Talib Hussain', role: Role.STAFF, designation: 'Supervisor', workDepartment: 'SECURITY', email: '', mobile: '7006428681', password: '123', avatar: 'https://ui-avatars.com/api/?name=Talib' },
  { id: 'u345', staffId: '345', name: 'Nazir ahmed', role: Role.STAFF, designation: 'No', workDepartment: 'NO/SWEEPER', email: '', mobile: '6006819020', password: '123', avatar: 'https://ui-avatars.com/api/?name=Nazir' },
  { id: 'u346', staffId: '346', name: 'DR HUMMA NASEEM', role: Role.STAFF, designation: 'Medical Officer', workDepartment: 'MEDICAL OFFICER', email: 'zargarhuma53@gmail.com', mobile: '7889387706', password: '123', avatar: 'https://ui-avatars.com/api/?name=Dr' },
  { id: 'u349', staffId: '349', name: 'Amina Tabassum', role: Role.STAFF, designation: 'Nursing Staff', workDepartment: 'OPD', email: 'aminatabassum754@gmail.com', mobile: '6005776417', password: '123', avatar: 'https://ui-avatars.com/api/?name=Amina' },
  { id: 'u351', staffId: '351', name: 'Sharafat Hussain', role: Role.STAFF, designation: 'Front Desk Exceutive', workDepartment: 'ADMINISTRATIVE', email: 'maliksharafat69@gmail.com', mobile: '6006345250', password: '123', avatar: 'https://ui-avatars.com/api/?name=Sharafat' },
  { id: 'u354', staffId: '354', name: 'Rekha chib', role: Role.STAFF, designation: 'NO', workDepartment: 'NO/SWEEPER', email: '', mobile: '9797897289', password: '123', avatar: 'https://ui-avatars.com/api/?name=Rekha' },
  { id: 'u356', staffId: '356', name: 'Suman Devi', role: Role.STAFF, designation: 'No', workDepartment: 'NO/SWEEPER', email: '', mobile: '9070763782', password: '123', avatar: 'https://ui-avatars.com/api/?name=Suman' },
  { id: 'u362', staffId: '362', name: 'Kannagi sharma', role: Role.STAFF, designation: 'Medical officer', workDepartment: 'MEDICAL OFFICER', email: 'kanans92@gmail.com', mobile: '9018770427', password: '123', avatar: 'https://ui-avatars.com/api/?name=Kannagi' },
  { id: 'u364', staffId: '364', name: 'Fozia Rashid', role: Role.STAFF, designation: 'Staff nurse', workDepartment: 'N.I.C.U', email: 'foziarashid009@gmail.com', mobile: '8899437207', password: '123', avatar: 'https://ui-avatars.com/api/?name=Fozia' },
  { id: 'u68', staffId: '68', name: 'Karampal Singh', role: Role.STAFF, designation: 'senior nurse staff', workDepartment: 'EMERGENCY', email: 'palkaram090@gmail.com', mobile: '7006941082', password: '123', avatar: 'https://ui-avatars.com/api/?name=Karampal' },
  { id: 'u368', staffId: '368', name: 'Rayaz khan', role: Role.STAFF, designation: 'Security guard', workDepartment: 'SECURITY', email: '', mobile: '8082533478', password: '123', avatar: 'https://ui-avatars.com/api/?name=Rayaz' },
  { id: 'u367', staffId: '367', name: 'Famida banoo', role: Role.STAFF, designation: 'Pharmacist', workDepartment: 'PHARMACY', email: 'FamidaShabir915@gamil.com', mobile: '8899798370', password: '123', avatar: 'https://ui-avatars.com/api/?name=Famida' },
  { id: 'u373', staffId: '373', name: 'Somia Akhter', role: Role.STAFF, designation: 'Tellecaller', workDepartment: 'TELLE-CALLER', email: 'maliksomia47@gmail.com', mobile: '9149748052', password: '123', avatar: 'https://ui-avatars.com/api/?name=Somia' },
  { id: 'u374', staffId: '374', name: 'Mahran ahmed', role: Role.STAFF, designation: 'Nursing Staff', workDepartment: 'GENERAL WARD', email: 'mehranchdry128@gmail.com', mobile: '7051711248', password: '123', avatar: 'https://ui-avatars.com/api/?name=Mahran' },
  { id: 'u376', staffId: '376', name: 'AKHTER ALI SHEIKH', role: Role.STAFF, designation: 'Lab', workDepartment: 'LAB', email: 'sheikhakhterreasi@gmail.com', mobile: '7889637389*', password: '123', avatar: 'https://ui-avatars.com/api/?name=Akhter' },
  { id: 'u377', staffId: '377', name: 'Shahid Bashir', role: Role.STAFF, designation: 'Nursing Officer', workDepartment: 'ICU', email: 'Shahidkhannn26@gmail.com', mobile: '9622176211', password: '123', avatar: 'https://ui-avatars.com/api/?name=Shahid' },
  { id: 'u378', staffId: '378', name: 'Asha devi', role: Role.STAFF, designation: 'No sweper', workDepartment: 'NO/SWEEPER', email: '', mobile: '8713061019', password: '123', avatar: 'https://ui-avatars.com/api/?name=Asha' },
  { id: 'u383', staffId: '383', name: 'Haleema Parveen', role: Role.STAFF, designation: 'Staff Nurse', workDepartment: 'GENERAL WARD', email: 'haleemaparveen08@gmail.com', mobile: '8310748094', password: '123', avatar: 'https://ui-avatars.com/api/?name=Haleema' },
  { id: 'u385', staffId: '385', name: 'Iqra Ayub', role: Role.STAFF, designation: 'Nursing staff', workDepartment: 'ICU', email: 'sheikhiqra834@gmail.com', mobile: '6005989293', password: '123', avatar: 'https://ui-avatars.com/api/?name=Iqra' },
  { id: 'u384', staffId: '384', name: 'Mehvish salam', role: Role.STAFF, designation: 'Nursing Staff', workDepartment: 'ICU', email: 'mk4822268@gmail.com', mobile: '9906509754', password: '123', avatar: 'https://ui-avatars.com/api/?name=Mehvish' },
  { id: 'u388', staffId: '388', name: 'DAVINDER SINGH', role: Role.STAFF, designation: 'DRIVER', workDepartment: 'EMERGENCY', email: 'sp322444@gmail.com', mobile: '9877548981', password: '123', avatar: 'https://ui-avatars.com/api/?name=Davinder' },
  { id: 'u389', staffId: '389', name: 'Sajid hussain', role: Role.STAFF, designation: 'Dialysis Technician', workDepartment: 'DIALYSIS', email: 'sajidjatt1319@gmail.com', mobile: '7889324057', password: '123', avatar: 'https://ui-avatars.com/api/?name=Sajid' },
  { id: 'u391', staffId: '391', name: 'MOHD FAIZAN KHAN', role: Role.STAFF, designation: 'LAB ASSISTANT', workDepartment: 'LAB', email: '', mobile: '9596296731', password: '123', avatar: 'https://ui-avatars.com/api/?name=Mohd' },
  { id: 'u392', staffId: '392', name: 'Jaipreet singh', role: Role.STAFF, designation: 'Digiana', workDepartment: 'OPERATION THEATRE', email: 'jaipreetbali8@gmail.com', mobile: '9906741855', password: '123', avatar: 'https://ui-avatars.com/api/?name=Jaipreet' },
  { id: 'u395', staffId: '395', name: 'Shahid hussain', role: Role.STAFF, designation: 'Opd', workDepartment: 'OPD', email: 'sshahidrather2002@gmail.com', mobile: '9682533661', password: '123', avatar: 'https://ui-avatars.com/api/?name=Shahid' },
  { id: 'u396', staffId: '396', name: 'Zarina koser', role: Role.STAFF, designation: 'BSC nursing', workDepartment: 'TELLE-CALLER', email: 'zarina00966@gmail.com', mobile: '9682330642', password: '123', avatar: 'https://ui-avatars.com/api/?name=Zarina' },
  { id: 'u399', staffId: '399', name: 'Azar mehmood', role: Role.STAFF, designation: 'Learning a good experience', workDepartment: 'OPERATION THEATRE', email: 'azarmanhas167@gmail.com', mobile: '6005225388', password: '123', avatar: 'https://ui-avatars.com/api/?name=Azar' },
  { id: 'u401', staffId: '401', name: 'Anwer sadiq', role: Role.STAFF, designation: 'N o', workDepartment: 'NO/SWEEPER', email: 'naeemkhan@gmail.com', mobile: '8806488227', password: '123', avatar: 'https://ui-avatars.com/api/?name=Anwer' },
  { id: 'u400', staffId: '400', name: 'Abdul monaf', role: Role.STAFF, designation: 'N o', workDepartment: 'NO/SWEEPER', email: '', mobile: '', password: '123', avatar: 'https://ui-avatars.com/api/?name=Abdul' },
  { id: 'u403', staffId: '403', name: 'shivam', role: Role.STAFF, designation: 'IT Department', workDepartment: 'ADMINISTRATIVE', email: 'shivamkumar20182@gmail.com', mobile: '9070589698', password: '123', avatar: 'https://ui-avatars.com/api/?name=Shivam' },
  { id: 'u406', staffId: '406', name: 'Fozia mumtaz', role: Role.STAFF, designation: 'Nurse', workDepartment: 'GENERAL WARD', email: 'mumtazfozia57@gmail.com', mobile: '9596447825', password: '123', avatar: 'https://ui-avatars.com/api/?name=Fozia' },
  { id: 'u407', staffId: '407', name: 'FAIZAN ASHRAF', role: Role.STAFF, designation: 'Bsc nursing', workDepartment: 'GENERAL WARD', email: 'faizanmir6666@gmail.com', mobile: '7780967175', password: '123', avatar: 'https://ui-avatars.com/api/?name=Faizan' },
  { id: 'u408', staffId: '408', name: 'Nazima akhter', role: Role.STAFF, designation: 'Nurse', workDepartment: 'GENERAL WARD', email: 'nazimanazir321@gmail.com', mobile: '7051417806', password: '123', avatar: 'https://ui-avatars.com/api/?name=Nazima' },
  { id: 'u414', staffId: '414', name: 'Urfa javaid', role: Role.STAFF, designation: 'Staff nurse', workDepartment: 'GENERAL WARD', email: 'mehakhamdani0gmail.com', mobile: '8082736635', password: '123', avatar: 'https://ui-avatars.com/api/?name=Urfa' },
  { id: 'u415', staffId: '415', name: 'Mohd Ashfaq', role: Role.STAFF, designation: 'Dialysis', workDepartment: 'DIALYSIS', email: 'ashfaqzarger18@gmail.com', mobile: '7051763890', password: '123', avatar: 'https://ui-avatars.com/api/?name=Mohd' },
  { id: 'u418', staffId: '418', name: 'Ruman fatimah Mir', role: Role.STAFF, designation: 'Dialysis Technician', workDepartment: 'DIALYSIS', email: 'rumanfatimah2003/@gmail.com', mobile: '6006829585', password: '123', avatar: 'https://ui-avatars.com/api/?name=Ruman' },
  { id: 'u419', staffId: '419', name: 'Arfeena Banoo', role: Role.STAFF, designation: 'Front desk executive', workDepartment: 'ADMINISTRATIVE', email: 'Sohilarfeena@gmail.com', mobile: '6005219721', password: '123', avatar: 'https://ui-avatars.com/api/?name=Arfeena' },
  { id: 'u421', staffId: '421', name: 'Safira', role: Role.STAFF, designation: 'N. O', workDepartment: 'NO/SWEEPER', email: '', mobile: '889965505', password: '123', avatar: 'https://ui-avatars.com/api/?name=Safira' },
  { id: 'u426', staffId: '426', name: 'MARYAM', role: Role.STAFF, designation: 'NO', workDepartment: 'NO/SWEEPER', email: '', mobile: '', password: '123', avatar: 'https://ui-avatars.com/api/?name=Maryam' },
  { id: 'u428', staffId: '428', name: 'ANEES UL REHMAN', role: Role.STAFF, designation: 'LABAROTAY ASSISTANT', workDepartment: 'LAB', email: '', mobile: '7780800810', password: '123', avatar: 'https://ui-avatars.com/api/?name=Anees' },
  { id: 'u430', staffId: '430', name: 'SAJID HUSSAIN', role: Role.STAFF, designation: 'Lab technician', workDepartment: 'LAB', email: 'wanisajid526@gmail.com', mobile: '7051763540', password: '123', avatar: 'https://ui-avatars.com/api/?name=Sajid' },
  { id: 'u431', staffId: '431', name: 'Mustafa', role: Role.STAFF, designation: 'N o', workDepartment: 'NO/SWEEPER', email: '', mobile: '9596610301', password: '123', avatar: 'https://ui-avatars.com/api/?name=Mustafa' },
  { id: 'u432', staffId: '432', name: 'Mohammad Suhaib', role: Role.STAFF, designation: 'Pharmacist', workDepartment: 'PHARMACY', email: 'mohammadsuhaib1010@gmail.com', mobile: '8493017566', password: '123', avatar: 'https://ui-avatars.com/api/?name=Mohammad' },
  { id: 'u433', staffId: '433', name: 'AJAZ ALI', role: Role.STAFF, designation: 'Driver', workDepartment: 'SECURITY', email: 'ajazalia659@gmail.com', mobile: '9103272323', password: '123', avatar: 'https://ui-avatars.com/api/?name=Ajaz' },
  { id: 'u434', staffId: '434', name: 'DR MUQADIS MARYAM', role: Role.STAFF, designation: 'MEDICAL OFFICER', workDepartment: 'ADMINISTRATIVE', email: 'muqadasmaryam74@gmail.com', mobile: '7889970563', password: '123', avatar: 'https://ui-avatars.com/api/?name=Dr' },
  { id: 'u435', staffId: '435', name: 'Zeenat fatima', role: Role.STAFF, designation: 'Nursing staff', workDepartment: 'ICU', email: 'Zeenatfatimahqazi@gmail.com', mobile: '9622429394', password: '123', avatar: 'https://ui-avatars.com/api/?name=Zeenat' },
  { id: 'u436', staffId: '436', name: 'Sarita verma', role: Role.STAFF, designation: 'Pulse hospital', workDepartment: 'NO/SWEEPER', email: 'muqadasmaryam74@gmail.com', mobile: '8493815733', password: '123', avatar: 'https://ui-avatars.com/api/?name=Sarita' },
  { id: 'u437', staffId: '437', name: 'Zubair', role: Role.STAFF, designation: 'Pulse hospital', workDepartment: 'NO/SWEEPER', email: 'Zeenatfatimahqazi@gmail.com', mobile: '9796602249', password: '123', avatar: 'https://ui-avatars.com/api/?name=Zubair' },
  { id: 'u438', staffId: '438', name: 'Mohd kousar', role: Role.STAFF, designation: 'Pulse hospital', workDepartment: 'NO/SWEEPER', email: 'muqadasmaryam74@gmail.com', mobile: '', password: '123', avatar: 'https://ui-avatars.com/api/?name=Mohd' },
  { id: 'u439', staffId: '439', name: 'Amjid razaq', role: Role.STAFF, designation: 'Gnm', workDepartment: 'N.I.C.U', email: '', mobile: '7298481998', password: '123', avatar: 'https://ui-avatars.com/api/?name=Amjid' },
  { id: 'u440', staffId: '440', name: 'Deepa Das', role: Role.STAFF, designation: 'Telle Caller', workDepartment: 'TELLE-CALLER', email: 'Jyostnadas245@gmail.com', mobile: '9541696607', password: '123', avatar: 'https://ui-avatars.com/api/?name=Deepa' },
  { id: 'u441', staffId: '441', name: 'Sajan', role: Role.STAFF, designation: 'No', workDepartment: 'NO/SWEEPER', email: '', mobile: '7889598673', password: '123', avatar: 'https://ui-avatars.com/api/?name=Sajan' },
  { id: 'u442', staffId: '442', name: 'Toseef maqsood', role: Role.STAFF, designation: 'Security guard', workDepartment: 'SECURITY', email: 'Toseefkohli@gmail.com', mobile: '97970 48266', password: '123', avatar: 'https://ui-avatars.com/api/?name=Toseef' },
  { id: 'u443', staffId: '443', name: 'Mohd Nareen', role: Role.STAFF, designation: 'Pharmacist', workDepartment: 'PHARMACY', email: 'NAREENMALIK149@GMAIL.COM', mobile: '8082432496', password: '123', avatar: 'https://ui-avatars.com/api/?name=Mohd' },
  { id: 'u444', staffId: '444', name: 'Mohammad Sharif Tantray', role: Role.STAFF, designation: 'Nursing staff', workDepartment: 'OPD', email: 'tantraysharif267@gmail.com', mobile: '7006557070', password: '123', avatar: 'https://ui-avatars.com/api/?name=Mohammad' },
  { id: 'u447', staffId: '447', name: 'Masarat Naz', role: Role.STAFF, designation: 'Lab Technician', workDepartment: 'LAB', email: 'nazmasrat010@gmail.com', mobile: '9103589398', password: '123', avatar: 'https://ui-avatars.com/api/?name=Masarat' },
  { id: 'u448', staffId: '448', name: 'Mudsar Ahmed', role: Role.STAFF, designation: 'Student', workDepartment: 'PHARMACY', email: 'm41187147@gmail.com', mobile: '6006483457', password: '123', avatar: 'https://ui-avatars.com/api/?name=Mudsar' },
  { id: 'u445', staffId: '445', name: 'Khalid mahmood', role: Role.STAFF, designation: 'Nursing staff', workDepartment: 'GENERAL WARD', email: 'khalidmahmood3725@gmail.com', mobile: '9797949011', password: '123', avatar: 'https://ui-avatars.com/api/?name=Khalid' },
  { id: 'u449', staffId: '449', name: 'Sufyan sheikh', role: Role.STAFF, designation: 'Ot technician', workDepartment: 'OPERATION THEATRE', email: 'Ss871331@gamil.com', mobile: '9103118201', password: '123', avatar: 'https://ui-avatars.com/api/?name=Sufyan' },
  { id: 'u450', staffId: '450', name: 'NAJEEB BAHAR', role: Role.STAFF, designation: 'Nursing staff', workDepartment: 'GENERAL WARD', email: 'Najeebbahar123@gmail.com', mobile: '9541926112', password: '123', avatar: 'https://ui-avatars.com/api/?name=Najeeb' },
  { id: 'u451', staffId: '451', name: 'Babar ashraf', role: Role.STAFF, designation: 'Staff nurse', workDepartment: 'ICU', email: 'babarxargar123@gmail.com', mobile: '7051440799', password: '123', avatar: 'https://ui-avatars.com/api/?name=Babar' },
  { id: 'u452', staffId: '452', name: 'Ateeq Ul Rehman malik', role: Role.STAFF, designation: 'OT technician', workDepartment: 'OPERATION THEATRE', email: 'Malikateeq558@gmail.com', mobile: '8899192990', password: '123', avatar: 'https://ui-avatars.com/api/?name=Ateeq' },
  { id: 'u275', staffId: '275', name: 'Shoieb Ali', role: Role.STAFF, designation: 'Security guard', workDepartment: 'SECURITY', email: '.', mobile: '.', password: '123', avatar: 'https://ui-avatars.com/api/?name=Shoieb' },
  { id: 'u344', staffId: '344', name: 'Tahir saleem', role: Role.STAFF, designation: 'Xray technician', workDepartment: 'XRAY', email: 'Tshah9909@gmail.com', mobile: '8899099143', password: '123', avatar: 'https://ui-avatars.com/api/?name=Tahir' },
  { id: 'u220', staffId: '220', name: 'Tahira Anjum', role: Role.STAFF, designation: 'Medical staff', workDepartment: 'N.I.C.U', email: 'Tahiraanjum133@gmail.com', mobile: '7051847996', password: '123', avatar: 'https://ui-avatars.com/api/?name=Tahira' },
  { id: 'u175', staffId: '175', name: 'Yasmeer Ahmed', role: Role.STAFF, designation: 'Ot technician', workDepartment: 'OPERATION THEATRE', email: 'Yasmeerahmed123@gmail.com', mobile: '9086501256', password: '123', avatar: 'https://ui-avatars.com/api/?name=Yasmeer' }
];

const createMockInventory = (): InventoryItem[] => [
  // General Store
  { id: 'i1', name: 'A4 Paper Ream', category: 'Stationery', department: Department.STORE, quantity: 45, unit: 'Pack', minStock: 10, vendor: 'Sunrise Stationery' },
  { id: 'i2', name: 'Ballpoint Pen (Blue)', category: 'Stationery', department: Department.STORE, quantity: 150, unit: 'Pcs', minStock: 50, vendor: 'Sunrise Stationery' },
  { id: 'i3', name: 'Register (200 Pages)', category: 'Stationery', department: Department.STORE, quantity: 80, unit: 'Pcs', minStock: 20 },
  { id: 'i4', name: 'Stapler Pins', category: 'Stationery', department: Department.STORE, quantity: 200, unit: 'Box', minStock: 50 },
  
  // Medical
  { id: 'm1', name: 'Paracetamol 500mg', category: 'Tablet', department: Department.MEDICAL, quantity: 500, unit: 'Strip', minStock: 100, expiryDate: '2025-12-01', batchNumber: 'BAT-001' },
  { id: 'm2', name: 'Surgical Gloves', category: 'Consumables', department: Department.MEDICAL, quantity: 20, unit: 'Box', minStock: 25, expiryDate: '2026-01-15' },
  { id: 'm3', name: 'Ceftriaxone 1g Inj', category: 'Injection', department: Department.MEDICAL, quantity: 40, unit: 'Vial', minStock: 15, expiryDate: '2025-08-20' },
  { id: 'm4', name: 'N95 Mask', category: 'Consumables', department: Department.MEDICAL, quantity: 150, unit: 'Pcs', minStock: 50 },

  // HK
  { id: 'h1', name: 'Floor Cleaner', category: 'Chemicals', department: Department.HOUSEKEEPING, quantity: 15, unit: 'Liters', minStock: 5 },
  { id: 'h2', name: 'Bed Sheet (Single)', category: 'Linen', department: Department.HOUSEKEEPING, quantity: 80, unit: 'Pcs', minStock: 20 },
  { id: 'h3', name: 'Toilet Roll', category: 'Consumables', department: Department.HOUSEKEEPING, quantity: 100, unit: 'Roll', minStock: 30 },
  { id: 'h4', name: 'Hand Wash Refill', category: 'Consumables', department: Department.HOUSEKEEPING, quantity: 10, unit: 'Liters', minStock: 3 },

  // Allied
  { id: 'a1', name: 'Generator Set A', category: 'Machinery', department: Department.ALLIED, quantity: 1, unit: 'Unit', minStock: 1, location: 'Basement', condition: 'Good' },
  { id: 'a2', name: 'Air Conditioner Split 1.5T', category: 'HVAC', department: Department.ALLIED, quantity: 12, unit: 'Unit', minStock: 0, location: 'Ward 1', condition: 'Needs Repair' },
  { id: 'a3', name: 'Wheelchair', category: 'Asset', department: Department.ALLIED, quantity: 8, unit: 'Pcs', minStock: 10, location: 'Lobby', condition: 'Good' },
  { id: 'a4', name: 'Oxygen Cylinder (Empty)', category: 'Gas', department: Department.ALLIED, quantity: 5, unit: 'Cylinder', minStock: 2, location: 'Store', condition: 'Good' }
];

const createMockRequisitions = (): Requisition[] => [
  {
    id: 'r1',
    requestType: 'Issue',
    requesterId: 'u260',
    requesterStaffId: '260',
    requesterName: 'Rohit sharma',
    departmentTarget: Department.STORE,
    itemId: 'i1',
    itemName: 'A4 Paper Ream',
    quantity: 2,
    status: RequestStatus.PENDING_ADMIN,
    dateRequested: new Date().toISOString(),
    logs: [`Request created by Rohit sharma at ${new Date().toLocaleTimeString()}`],
    staffSignature: true
  },
  {
    id: 'r2',
    requestType: 'Repair',
    requesterId: 'u201',
    requesterStaffId: '201',
    requesterName: 'Dr. Mehak Saleem Shah',
    departmentTarget: Department.ALLIED,
    itemName: 'AC Unit - Doctor Room',
    description: 'Leaking water heavily.',
    status: RequestStatus.APPROVED_ADMIN,
    dateRequested: new Date(Date.now() - 86400000).toISOString(),
    dateApproved: new Date().toISOString(),
    adminSignature: true,
    staffSignature: true,
    logs: ['Request created', 'Approved by Admin']
  }
];

const createMockVendors = (): Vendor[] => [
  { id: 'v1', name: 'Sunrise Stationery', contactPerson: 'Rahul Verma', mobile: '9906012345', category: 'Stationery', address: 'Jammu Main Market' },
  { id: 'v2', name: 'MediPlus Pharma Distributors', contactPerson: 'Amit Gupta', mobile: '9419156789', category: 'Medicine', address: 'Gandhi Nagar, Jammu' },
  { id: 'v3', name: 'CleanWell Solutions', contactPerson: 'Priya Sharma', mobile: '9086098765', category: 'Housekeeping', address: 'Bari Brahmana' }
];

class DataService {
  private users: User[];
  private inventory: InventoryItem[];
  private requisitions: Requisition[];
  private vendors: Vendor[];

  constructor() {
    const storedUsers = localStorage.getItem('pulse_users');
    const storedInv = localStorage.getItem('pulse_inventory');
    const storedReqs = localStorage.getItem('pulse_requisitions');
    const storedVendors = localStorage.getItem('pulse_vendors');

    if (storedUsers) {
      const parsedStoredUsers = JSON.parse(storedUsers) as User[];
      this.users = realUsers.map(realUser => {
        const stored = parsedStoredUsers.find(u => u.staffId === realUser.staffId);
        return stored ? { ...realUser, signatureUrl: stored.signatureUrl, password: stored.password, role: stored.role, department: stored.department } : realUser;
      });
      const manualUsers = parsedStoredUsers.filter(u => !realUsers.find(ru => ru.staffId === u.staffId));
      this.users = [...this.users, ...manualUsers];
    } else {
      this.users = realUsers;
    }
    
    this.inventory = storedInv ? JSON.parse(storedInv) : createMockInventory();
    this.requisitions = storedReqs ? JSON.parse(storedReqs) : createMockRequisitions();
    this.vendors = storedVendors ? JSON.parse(storedVendors) : createMockVendors();

    this.saveData();
  }

  private saveData() {
    localStorage.setItem('pulse_users', JSON.stringify(this.users));
    localStorage.setItem('pulse_inventory', JSON.stringify(this.inventory));
    localStorage.setItem('pulse_requisitions', JSON.stringify(this.requisitions));
    localStorage.setItem('pulse_vendors', JSON.stringify(this.vendors));
  }

  // Auth
  authenticate(staffId: string, password: string): User | undefined {
    return this.users.find(u => u.staffId === staffId && u.password === password);
  }

  getUsers() { return this.users; }
  updateUser(updatedUser: User) {
    this.users = this.users.map(u => u.id === updatedUser.id ? updatedUser : u);
    this.saveData();
  }
  addUser(newUser: User) {
    this.users.push(newUser);
    this.saveData();
  }
  deleteUser(userId: string) {
    this.users = this.users.filter(u => u.id !== userId);
    this.saveData();
  }

  // Inventory
  getInventory(department?: Department) {
    if (department) return this.inventory.filter(i => i.department === department);
    return this.inventory;
  }
  updateInventoryItem(item: InventoryItem) {
    this.inventory = this.inventory.map(i => i.id === item.id ? item : i);
    this.saveData();
  }
  addInventoryItem(item: InventoryItem) {
    this.inventory.push(item);
    this.saveData();
  }
  deleteInventoryItem(id: string) {
    this.inventory = this.inventory.filter(i => i.id !== id);
    this.saveData();
  }

  // Requisitions
  getRequisitions(department?: Department, role?: Role, userId?: string) {
    let reqs = [...this.requisitions];
    if (department) {
      reqs = reqs.filter(r => r.departmentTarget === department);
    }
    if (role === Role.STAFF && userId) {
      reqs = reqs.filter(r => r.requesterId === userId);
    } else if (role === Role.ADMIN) {
      // Admin sees everything
    } else if (role && role.includes('Incharge')) {
      // Incharge sees approved issues OR their own procurement requests
      reqs = reqs.filter(r => 
        (r.status !== RequestStatus.PENDING_ADMIN && r.requestType !== 'Procurement') || 
        r.requesterId === userId ||
        (r.requestType === 'Procurement' && r.departmentTarget === department)
      );
    }
    return reqs.sort((a, b) => new Date(b.dateRequested).getTime() - new Date(a.dateRequested).getTime());
  }

  addRequisition(req: Omit<Requisition, 'id' | 'status' | 'logs'>) {
    const newReq: Requisition = {
      ...req,
      id: `R-${Math.floor(Math.random() * 10000)}`,
      status: RequestStatus.PENDING_ADMIN,
      logs: [`Request initiated at ${new Date().toLocaleString()}`],
      staffSignature: true
    };
    this.requisitions.push(newReq);
    this.saveData();
    return newReq;
  }

  updateRequisitionStatus(id: string, newStatus: RequestStatus, actorName: string, role: Role) {
    const req = this.requisitions.find(r => r.id === id);
    if (!req) return;

    req.status = newStatus;
    req.logs.push(`Status changed to ${newStatus} by ${actorName} (${role}) at ${new Date().toLocaleTimeString()}`);
    
    if (newStatus === RequestStatus.APPROVED_ADMIN) {
      req.dateApproved = new Date().toISOString();
      req.adminSignature = true;
    }
    if (newStatus === RequestStatus.ISSUED) {
      req.dateIssued = new Date().toISOString();
      req.inchargeSignature = true;
      if (req.itemId && req.quantity && req.requestType === 'Issue') {
        const item = this.inventory.find(i => i.id === req.itemId);
        if (item) {
          item.quantity -= req.quantity;
          this.updateInventoryItem(item);
        }
      }
      
      // *** AUTOMATED PROCUREMENT STOCK UPDATE ***
      if (req.requestType === 'Procurement' && req.quantity) {
          // Attempt to find existing item to update stock
          // Matching by name and department
          const existingItem = this.inventory.find(i => 
             i.name.toLowerCase() === req.itemName.toLowerCase() && 
             i.department === req.departmentTarget
          );

          if (existingItem) {
             existingItem.quantity += req.quantity;
             this.updateInventoryItem(existingItem);
             req.logs.push(`System: Automatically added ${req.quantity} units to inventory stock.`);
          } else {
             req.logs.push(`System: Item not found in inventory. Stock not automatically updated. Please add manually.`);
          }
      }
    }
    this.saveData();
  }

  // Vendors
  getVendors() { return this.vendors; }
  addVendor(vendor: Vendor) {
    this.vendors.push(vendor);
    this.saveData();
  }
  deleteVendor(id: string) {
    this.vendors = this.vendors.filter(v => v.id !== id);
    this.saveData();
  }

  // Stats
  getStats(department: Department) {
    const deptItems = this.getInventory(department);
    const lowStock = deptItems.filter(i => i.quantity <= i.minStock).length;
    const reqs = this.getRequisitions(department);
    const pending = reqs.filter(r => r.status === RequestStatus.APPROVED_ADMIN && r.requestType === 'Issue').length;
    
    return {
      totalItems: deptItems.length,
      lowStock,
      pendingRequests: pending,
      totalValue: deptItems.reduce((acc, curr) => acc + (curr.quantity * 10), 0)
    };
  }

  getAdminStats() {
    const pendingApprovals = this.requisitions.filter(r => r.status === RequestStatus.PENDING_ADMIN).length;
    return {
      totalUsers: this.users.length,
      totalInventory: this.inventory.length,
      pendingApprovals,
      departments: 4
    };
  }
}

export const dataService = new DataService();
