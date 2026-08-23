import { Request, Response, NextFunction } from 'express';
import { clinicStore } from '../services/store';

export function handleApiRoutes(req: Request, res: Response, next: NextFunction) {
  const url = req.url || '';

  if (!url.startsWith('/api')) {
    return next();
  }

  // Set JSON headers and CORS
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Clinic-API-Key, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 1. Health check
    if (url === '/api/n8n/health' && req.method === 'GET') {
      const stats = clinicStore.getQuickStats();
      const settings = clinicStore.getSettings();
      return res.status(200).json({
        status: 'online',
        system: 'Dental Clinic Management System - نظام عيادة الأسنان',
        n8nWebhookEnabled: settings.enableOutgoingWebhook,
        apiKeyValid: !!settings.apiKey,
        quickStats: stats,
      });
    }

    // 2. Services list (for AI agent & workflow extraction)
    if ((url.startsWith('/api/n8n/services') || url.startsWith('/api/services')) && req.method === 'GET') {
      const urlObj = new URL(url, 'http://localhost');
      const isCsv = urlObj.pathname.endsWith('/csv') || urlObj.searchParams.get('format') === 'csv';
      const onlyActive = urlObj.searchParams.get('active') !== 'false';
      const categoryFilter = urlObj.searchParams.get('category');
      
      let services = clinicStore.getServices();
      if (onlyActive) {
        services = services.filter((s) => s.isActive);
      }
      if (categoryFilter) {
        services = services.filter((s) => s.category.toLowerCase() === categoryFilter.toLowerCase());
      }

      // If CSV format requested for direct spreadsheet or table import
      if (isCsv) {
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'inline; filename="clinic-services.csv"');
        const header = 'id,name,category,price,durationMinutes,description,isActive\n';
        const rows = services
          .map((s) =>
            `"${s.id}","${(s.name || '').replace(/"/g, '""')}","${(s.category || '').replace(/"/g, '""')}",${s.price},${s.durationMinutes},"${(s.description || '').replace(/"/g, '""')}",${s.isActive}`
          )
          .join('\n');
        return res.status(200).send('\uFEFF' + header + rows);
      }

      // If n8n specific endpoint requested with wrapper
      if (url.startsWith('/api/n8n/services') && urlObj.searchParams.get('format') !== 'flat' && urlObj.searchParams.get('format') !== 'table') {
        return res.status(200).json({
          success: true,
          count: services.length,
          timestamp: new Date().toISOString(),
          services: services.map((s) => ({
            id: s.id,
            name: s.name,
            category: s.category,
            price: s.price,
            durationMinutes: s.durationMinutes,
            description: s.description,
            isActive: s.isActive,
          })),
        });
      }

      // Default for /api/services (returns raw flat array, ideal for n8n table/item lists)
      return res.status(200).json(
        services.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category,
          price: s.price,
          durationMinutes: s.durationMinutes,
          description: s.description,
          isActive: s.isActive,
        }))
      );
    }

    // 3. Doctors list
    if (url.startsWith('/api/n8n/doctors') && req.method === 'GET') {
      const doctors = clinicStore.getDoctors().filter((d) => d.isActive);
      return res.status(200).json({
        success: true,
        count: doctors.length,
        doctors: doctors.map((d) => ({
          id: d.id,
          name: d.name,
          specialization: d.specialization,
          room: d.room,
          workingDays: d.workingDays,
        })),
      });
    }

    // 4. Available slots for a date
    if (url.startsWith('/api/n8n/available-slots') && req.method === 'GET') {
      const allAppointments = clinicStore.getAppointments();
      const queryDate = req.query?.date as string || new Date().toISOString().split('T')[0];
      const bookedTimes = allAppointments
        .filter((a) => a.date === queryDate && a.status !== 'cancelled')
        .map((a) => a.time);

      const standardSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
      ];

      const availableSlots = standardSlots.filter((slot) => !bookedTimes.includes(slot));

      return res.status(200).json({
        success: true,
        date: queryDate,
        bookedTimes,
        availableSlots,
      });
    }

    // 5. Register patient
    if (url === '/api/n8n/patient-register' && req.method === 'POST') {
      const body = req.body || {};
      if (!body.name || !body.phone) {
        return res.status(400).json({ success: false, message: 'اسم المريض ورقم الهاتف مطلوبين (name & phone are required)' });
      }

      const result = clinicStore.aiRegisterPatient({
        name: body.name,
        phone: body.phone,
        age: body.age ? parseInt(body.age, 10) : undefined,
        gender: body.gender,
        notes: body.notes,
      });

      return res.status(200).json(result);
    }

    // 6. Book appointment
    if (url === '/api/n8n/book-appointment' && req.method === 'POST') {
      const body = req.body || {};
      if (!body.patientPhone || !body.date || !body.time) {
        return res.status(400).json({
          success: false,
          message: 'رقم الهاتف، التاريخ، والتوقيت مطلوبين (patientPhone, date, time are required)',
        });
      }

      const result = clinicStore.aiBookAppointment({
        patientPhone: body.patientPhone,
        patientName: body.patientName,
        doctorId: body.doctorId,
        serviceId: body.serviceId,
        date: body.date,
        time: body.time,
        notes: body.notes,
      });

      return res.status(200).json(result);
    }

    // 7. Confirm appointment
    if (url === '/api/n8n/confirm-appointment' && req.method === 'POST') {
      const body = req.body || {};
      const result = clinicStore.aiConfirmAppointment({
        appointmentId: body.appointmentId,
        patientPhone: body.patientPhone,
      });

      return res.status(result.success ? 200 : 404).json(result);
    }

    // 8. Generic incoming webhook
    if (url === '/api/n8n/incoming' && req.method === 'POST') {
      const body = req.body || {};
      clinicStore.addWebhookLog({
        type: 'incoming',
        endpoint: '/api/n8n/incoming',
        action: 'استلام حمولة عامة من n8n',
        status: 'success',
        payload: body,
        response: { received: true, timestamp: new Date().toISOString() },
      });

      return res.status(200).json({
        success: true,
        message: 'تم استقبال البيانات من n8n بنجاح',
        timestamp: new Date().toISOString(),
      });
    }

    // 9. Data queries (for app frontend / external sync & workflows)
    if (url.startsWith('/api/patients') && req.method === 'GET') {
      return res.status(200).json(clinicStore.getPatients());
    }

    if (url.startsWith('/api/appointments') && req.method === 'GET') {
      return res.status(200).json(clinicStore.getAppointments());
    }

    if (url.startsWith('/api/doctors') && req.method === 'GET') {
      return res.status(200).json(clinicStore.getDoctors());
    }

    if (url.startsWith('/api/visits') && req.method === 'GET') {
      return res.status(200).json(clinicStore.getVisits());
    }

    if (url.startsWith('/api/stats') && req.method === 'GET') {
      return res.status(200).json(clinicStore.getQuickStats());
    }

    return res.status(404).json({ success: false, message: 'المسار المطلوب غير موجود في واجهة API' });
  } catch (err: any) {
    console.error('API Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'خطأ غير متوقع في خادم العيادة' });
  }
}
