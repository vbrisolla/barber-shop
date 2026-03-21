import { PrismaClient, Role, AppointmentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Hash passwords
  const adminHash = await bcrypt.hash('admin123', 10);
  const barberHash = await bcrypt.hash('barber123', 10);
  const clientHash = await bcrypt.hash('client123', 10);

  // Create admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@barbearia.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@barbearia.com',
      passwordHash: adminHash,
      role: Role.ADMIN,
    },
  });
  console.log(`Admin created: ${admin.email}`);

  // Create barber users
  const barberUser1 = await prisma.user.upsert({
    where: { email: 'joao@barbearia.com' },
    update: {},
    create: {
      name: 'João Silva',
      email: 'joao@barbearia.com',
      passwordHash: barberHash,
      role: Role.BARBER,
    },
  });

  const barberUser2 = await prisma.user.upsert({
    where: { email: 'pedro@barbearia.com' },
    update: {},
    create: {
      name: 'Pedro Santos',
      email: 'pedro@barbearia.com',
      passwordHash: barberHash,
      role: Role.BARBER,
    },
  });

  // Create barber profiles
  const barber1 = await prisma.barber.upsert({
    where: { userId: barberUser1.id },
    update: { avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face' },
    create: {
      userId: barberUser1.id,
      bio: 'Especialista em cortes modernos e degradê. 10 anos de experiência.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    },
  });

  const barber2 = await prisma.barber.upsert({
    where: { userId: barberUser2.id },
    update: { avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face' },
    create: {
      userId: barberUser2.id,
      bio: 'Mestre em barba e bigode. Técnicas clássicas e contemporâneas.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    },
  });

  // Create new barber users
  const barberUser3 = await prisma.user.upsert({
    where: { email: 'marcos@barbearia.com' },
    update: {},
    create: {
      name: 'Marcos Oliveira',
      email: 'marcos@barbearia.com',
      passwordHash: barberHash,
      role: Role.BARBER,
    },
  });

  const barberUser4 = await prisma.user.upsert({
    where: { email: 'rafael@barbearia.com' },
    update: {},
    create: {
      name: 'Rafael Lima',
      email: 'rafael@barbearia.com',
      passwordHash: barberHash,
      role: Role.BARBER,
    },
  });

  const barberUser5 = await prisma.user.upsert({
    where: { email: 'andre@barbearia.com' },
    update: {},
    create: {
      name: 'André Souza',
      email: 'andre@barbearia.com',
      passwordHash: barberHash,
      role: Role.BARBER,
    },
  });

  const barber3 = await prisma.barber.upsert({
    where: { userId: barberUser3.id },
    update: { avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face' },
    create: {
      userId: barberUser3.id,
      bio: 'Especialista em degradê e cortes modernos. Apaixonado por tendências internacionais de barbearia.',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    },
  });

  const barber4 = await prisma.barber.upsert({
    where: { userId: barberUser4.id },
    update: { avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face' },
    create: {
      userId: barberUser4.id,
      bio: 'Barbeiro tradicional com 8 anos de experiência. Referência em barba completa e tratamentos capilares.',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    },
  });

  const barber5 = await prisma.barber.upsert({
    where: { userId: barberUser5.id },
    update: { avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face' },
    create: {
      userId: barberUser5.id,
      bio: 'Versátil e criativo, domina cortes clássicos e modernos. Especialidade em atender todos os estilos.',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face',
    },
  });

  console.log(`Barbers created: ${barberUser1.name}, ${barberUser2.name}, ${barberUser3.name}, ${barberUser4.name}, ${barberUser5.name}`);

  // Create services
  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: 'service-1' },
      update: {},
      create: {
        id: 'service-1',
        name: 'Corte Simples',
        description: 'Corte de cabelo tradicional com tesoura ou máquina.',
        durationMinutes: 30,
        price: 35.0,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-2' },
      update: {},
      create: {
        id: 'service-2',
        name: 'Corte + Barba',
        description: 'Corte completo e aparar ou fazer a barba.',
        durationMinutes: 60,
        price: 65.0,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-3' },
      update: {},
      create: {
        id: 'service-3',
        name: 'Barba Completa',
        description: 'Barba completa com toalha quente e produtos premium.',
        durationMinutes: 45,
        price: 45.0,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-4' },
      update: {},
      create: {
        id: 'service-4',
        name: 'Degradê',
        description: 'Corte degradê com acabamento perfeito.',
        durationMinutes: 45,
        price: 50.0,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-5' },
      update: {},
      create: {
        id: 'service-5',
        name: 'Pacote Premium',
        description: 'Corte + Barba + Hidratação capilar.',
        durationMinutes: 90,
        price: 95.0,
      },
    }),
  ]);

  console.log(`Services created: ${services.length}`);

  // Associate services with barbers
  await Promise.all(
    services.map((service) =>
      prisma.barberService.upsert({
        where: { barberId_serviceId: { barberId: barber1.id, serviceId: service.id } },
        update: {},
        create: { barberId: barber1.id, serviceId: service.id },
      })
    )
  );

  await Promise.all(
    services.map((service) =>
      prisma.barberService.upsert({
        where: { barberId_serviceId: { barberId: barber2.id, serviceId: service.id } },
        update: {},
        create: { barberId: barber2.id, serviceId: service.id },
      })
    )
  );

  // barber3: Corte Simples, Corte+Barba, Degradê
  await Promise.all(
    ['service-1', 'service-2', 'service-4'].map((serviceId) =>
      prisma.barberService.upsert({
        where: { barberId_serviceId: { barberId: barber3.id, serviceId } },
        update: {},
        create: { barberId: barber3.id, serviceId },
      })
    )
  );

  // barber4: Corte Simples, Barba Completa, Pacote Premium
  await Promise.all(
    ['service-1', 'service-3', 'service-5'].map((serviceId) =>
      prisma.barberService.upsert({
        where: { barberId_serviceId: { barberId: barber4.id, serviceId } },
        update: {},
        create: { barberId: barber4.id, serviceId },
      })
    )
  );

  // barber5: Corte Simples, Corte+Barba, Barba Completa, Degradê
  await Promise.all(
    ['service-1', 'service-2', 'service-3', 'service-4'].map((serviceId) =>
      prisma.barberService.upsert({
        where: { barberId_serviceId: { barberId: barber5.id, serviceId } },
        update: {},
        create: { barberId: barber5.id, serviceId },
      })
    )
  );

  // Create availability (Mon-Sat, 09:00-18:00)
  const days = [1, 2, 3, 4, 5, 6]; // Monday to Saturday
  await Promise.all(
    days.map((day) =>
      prisma.barberAvailability.upsert({
        where: { barberId_dayOfWeek: { barberId: barber1.id, dayOfWeek: day } },
        update: {},
        create: {
          barberId: barber1.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '18:00',
        },
      })
    )
  );

  await Promise.all(
    days.map((day) =>
      prisma.barberAvailability.upsert({
        where: { barberId_dayOfWeek: { barberId: barber2.id, dayOfWeek: day } },
        update: {},
        create: {
          barberId: barber2.id,
          dayOfWeek: day,
          startTime: '10:00',
          endTime: '19:00',
        },
      })
    )
  );

  await Promise.all(
    days.map((day) =>
      prisma.barberAvailability.upsert({
        where: { barberId_dayOfWeek: { barberId: barber3.id, dayOfWeek: day } },
        update: {},
        create: {
          barberId: barber3.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '18:00',
        },
      })
    )
  );

  await Promise.all(
    days.map((day) =>
      prisma.barberAvailability.upsert({
        where: { barberId_dayOfWeek: { barberId: barber4.id, dayOfWeek: day } },
        update: {},
        create: {
          barberId: barber4.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '18:00',
        },
      })
    )
  );

  await Promise.all(
    days.map((day) =>
      prisma.barberAvailability.upsert({
        where: { barberId_dayOfWeek: { barberId: barber5.id, dayOfWeek: day } },
        update: {},
        create: {
          barberId: barber5.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '18:00',
        },
      })
    )
  );

  // Create client users
  const clientUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'carlos@email.com' },
      update: {},
      create: { name: 'Carlos Oliveira', email: 'carlos@email.com', passwordHash: clientHash, role: Role.CLIENT },
    }),
    prisma.user.upsert({
      where: { email: 'lucas@email.com' },
      update: {},
      create: { name: 'Lucas Ferreira', email: 'lucas@email.com', passwordHash: clientHash, role: Role.CLIENT },
    }),
    prisma.user.upsert({
      where: { email: 'rafael@email.com' },
      update: {},
      create: { name: 'Rafael Costa', email: 'rafael@email.com', passwordHash: clientHash, role: Role.CLIENT },
    }),
  ]);

  // Create 10 appointments in the future
  const now = new Date();
  const appointmentData = [
    { clientIdx: 0, barberIdx: 0, serviceIdx: 0, daysAhead: 1, hour: 9, status: AppointmentStatus.CONFIRMED },
    { clientIdx: 1, barberIdx: 0, serviceIdx: 1, daysAhead: 1, hour: 11, status: AppointmentStatus.PENDING },
    { clientIdx: 2, barberIdx: 1, serviceIdx: 2, daysAhead: 1, hour: 10, status: AppointmentStatus.CONFIRMED },
    { clientIdx: 0, barberIdx: 1, serviceIdx: 3, daysAhead: 2, hour: 14, status: AppointmentStatus.PENDING },
    { clientIdx: 1, barberIdx: 0, serviceIdx: 4, daysAhead: 2, hour: 16, status: AppointmentStatus.CONFIRMED },
    { clientIdx: 2, barberIdx: 0, serviceIdx: 0, daysAhead: 3, hour: 9, status: AppointmentStatus.PENDING },
    { clientIdx: 0, barberIdx: 1, serviceIdx: 1, daysAhead: 3, hour: 11, status: AppointmentStatus.CONFIRMED },
    { clientIdx: 1, barberIdx: 1, serviceIdx: 2, daysAhead: 4, hour: 13, status: AppointmentStatus.PENDING },
    { clientIdx: 2, barberIdx: 0, serviceIdx: 3, daysAhead: 5, hour: 15, status: AppointmentStatus.CONFIRMED },
    { clientIdx: 0, barberIdx: 1, serviceIdx: 4, daysAhead: 6, hour: 10, status: AppointmentStatus.PENDING },
  ];

  const barbers = [barber1, barber2, barber3, barber4, barber5];

  for (const appt of appointmentData) {
    const scheduledAt = new Date(now);
    scheduledAt.setDate(scheduledAt.getDate() + appt.daysAhead);
    scheduledAt.setHours(appt.hour, 0, 0, 0);

    await prisma.appointment.create({
      data: {
        clientId: clientUsers[appt.clientIdx].id,
        barberId: barbers[appt.barberIdx].id,
        serviceId: services[appt.serviceIdx].id,
        scheduledAt,
        status: appt.status,
      },
    });
  }

  console.log('10 appointments created');
  console.log('\nSeed completed successfully!');
  console.log('\nCredentials:');
  console.log('  Admin:   admin@barbearia.com / admin123');
  console.log('  Barber1: joao@barbearia.com / barber123');
  console.log('  Barber2: pedro@barbearia.com / barber123');
  console.log('  Barber3: marcos@barbearia.com / barber123');
  console.log('  Barber4: rafael@barbearia.com / barber123');
  console.log('  Barber5: andre@barbearia.com / barber123');
  console.log('  Client:  carlos@email.com / client123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
