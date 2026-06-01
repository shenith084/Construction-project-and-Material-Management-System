import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import Project from '@/models/Project';
import Material from '@/models/Material';
import Worker from '@/models/Worker';
import Supplier from '@/models/Supplier';
import Contact from '@/models/Contact';
import Assignment from '@/models/Assignment';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}

// POST /api/auth/seed-data - seeds full demo data (safe to re-run)
export async function POST() {
  try {
    await connectDB();

    // ── Admin ──────────────────────────────────────────────
    let admin = await Admin.findOne({ email: 'admin@construction.com' });
    if (!admin) {
      admin = await Admin.create({
        name: 'System Admin',
        email: 'admin@construction.com',
        password: 'admin123456',
        role: 'admin',
      });
    }

    // ── Suppliers ──────────────────────────────────────────
    const supplierCount = await Supplier.countDocuments();
    let suppliers = [];
    if (supplierCount === 0) {
      suppliers = await Supplier.insertMany([
        {
          companyName: 'SteelPro Lanka',
          contactPerson: 'Rohan Perera',
          email: 'rohan@steelpro.lk',
          phone: '+94 77 123 4567',
          address: '45 Industrial Zone, Colombo 15',
          materials: ['Steel Bars', 'Steel Pipes', 'Wire Mesh'],
          status: 'Active',
          website: 'https://steelpro.lk',
          notes: 'Preferred supplier for structural steel',
        },
        {
          companyName: 'CementWorld',
          contactPerson: 'Dilani Silva',
          email: 'dilani@cementworld.lk',
          phone: '+94 71 234 5678',
          address: '12 Factory Road, Gampaha',
          materials: ['Cement', 'Sand', 'Lime'],
          status: 'Active',
          website: '',
          notes: 'Bulk cement supplier - delivers island-wide',
        },
        {
          companyName: 'AggregatesPlus',
          contactPerson: 'Nuwan Fernando',
          email: 'nuwan@aggregatesplus.lk',
          phone: '+94 76 345 6789',
          address: '78 Quarry Road, Kurunegala',
          materials: ['Gravel', 'Sand', 'Crushed Stone'],
          status: 'Active',
          website: '',
          notes: 'Reliable aggregate supplier in North Western Province',
        },
      ]);
    } else {
      suppliers = await Supplier.find().limit(3);
    }

    // ── Projects ───────────────────────────────────────────
    const projectCount = await Project.countDocuments();
    let projects = [];
    if (projectCount === 0) {
      projects = await Project.insertMany([
        {
          title: 'Colombo Skyrise Tower',
          description: 'A 40-storey luxury residential tower in the heart of Colombo, featuring premium apartments and commercial spaces.',
          location: 'Colombo 03, Western Province',
          startDate: new Date('2025-01-15'),
          endDate: new Date('2027-06-30'),
          budget: 850000000,
          spent: 320000000,
          status: 'Active',
          progress: 38,
          manager: 'Asanka Jayawardena',
          milestones: [
            { title: 'Foundation Complete', targetDate: new Date('2025-06-01'), completed: true },
            { title: 'Structure up to 20th Floor', targetDate: new Date('2026-03-01'), completed: false },
            { title: 'Rooftop Complete', targetDate: new Date('2026-12-01'), completed: false },
          ],
        },
        {
          title: 'Galle Highway Bridge Extension',
          description: 'Widening and extension of the Southern Expressway bridge crossing over Bentota river.',
          location: 'Bentota, Southern Province',
          startDate: new Date('2024-09-01'),
          endDate: new Date('2026-03-31'),
          budget: 450000000,
          spent: 398000000,
          status: 'Active',
          progress: 88,
          manager: 'Priya Ranasinghe',
          milestones: [
            { title: 'Piling Works', targetDate: new Date('2024-12-01'), completed: true },
            { title: 'Deck Construction', targetDate: new Date('2025-09-01'), completed: true },
            { title: 'Road Surface & Finishing', targetDate: new Date('2026-03-01'), completed: false },
          ],
        },
        {
          title: 'Kandy Smart Hospital',
          description: 'State-of-the-art public hospital with 500 beds, OPD block, ICU wing, and helipad.',
          location: 'Peradeniya, Central Province',
          startDate: new Date('2025-03-01'),
          endDate: new Date('2028-12-31'),
          budget: 1200000000,
          spent: 85000000,
          status: 'Active',
          progress: 7,
          manager: 'Chamara Bandara',
          milestones: [
            { title: 'Site Clearing & Levelling', targetDate: new Date('2025-05-01'), completed: true },
            { title: 'Foundation Works', targetDate: new Date('2025-12-01'), completed: false },
          ],
        },
        {
          title: 'Negombo Waterfront Resort',
          description: 'Luxury beachfront resort with 120 rooms, spa, infinity pool, and conference facilities.',
          location: 'Negombo, Western Province',
          startDate: new Date('2024-06-01'),
          endDate: new Date('2025-12-31'),
          budget: 320000000,
          spent: 320000000,
          status: 'Completed',
          progress: 100,
          manager: 'Sampath Wickramasinghe',
          milestones: [
            { title: 'Structure Complete', targetDate: new Date('2024-11-01'), completed: true },
            { title: 'Interior Finishing', targetDate: new Date('2025-08-01'), completed: true },
            { title: 'Handover', targetDate: new Date('2025-12-01'), completed: true },
          ],
        },
        {
          title: 'Jaffna IT Park Phase 1',
          description: 'Modern IT hub with co-working spaces, data center, and innovation labs to boost the Northern economy.',
          location: 'Jaffna, Northern Province',
          startDate: new Date('2026-02-01'),
          endDate: new Date('2027-08-31'),
          budget: 280000000,
          spent: 0,
          status: 'Planning',
          progress: 0,
          manager: 'Kavitha Navaratnam',
          milestones: [
            { title: 'Design Approval', targetDate: new Date('2026-01-15'), completed: false },
            { title: 'Ground Breaking', targetDate: new Date('2026-03-01'), completed: false },
          ],
        },
      ]);
    } else {
      projects = await Project.find().limit(5);
    }

    // ── Workers ────────────────────────────────────────────
    const workerCount = await Worker.countDocuments();
    let workers = [];
    if (workerCount === 0) {
      workers = await Worker.insertMany([
        {
          name: 'Sunil Rajapaksa',
          email: 'sunil.rajapaksa@work.lk',
          phone: '+94 77 111 2233',
          role: 'Site Engineer',
          skills: ['Structural Engineering', 'AutoCAD', 'Project Planning'],
          dailyWage: 12000,
          status: 'Active',
          assignedProject: projects[0]?._id || null,
          address: '22/A Temple Road, Kelaniya',
          joinDate: new Date('2024-03-01'),
          emergencyContact: '+94 71 999 8877',
        },
        {
          name: 'Nimal Senarathne',
          email: 'nimal.senarathne@work.lk',
          phone: '+94 76 222 3344',
          role: 'Mason',
          skills: ['Brickwork', 'Plastering', 'Tiling'],
          dailyWage: 4500,
          status: 'Active',
          assignedProject: projects[0]?._id || null,
          address: '5 Old Road, Gampaha',
          joinDate: new Date('2024-01-15'),
          emergencyContact: '+94 77 888 7766',
        },
        {
          name: 'Kumari Dissanayake',
          email: 'kumari.dissanayake@work.lk',
          phone: '+94 71 333 4455',
          role: 'Quantity Surveyor',
          skills: ['Cost Estimation', 'BOQ Preparation', 'Procurement'],
          dailyWage: 9000,
          status: 'Active',
          assignedProject: projects[1]?._id || null,
          address: '7 Flower Avenue, Colombo 07',
          joinDate: new Date('2024-02-20'),
          emergencyContact: '+94 72 777 6655',
        },
        {
          name: 'Saman Wijesinghe',
          email: 'saman.wijesinghe@work.lk',
          phone: '+94 70 444 5566',
          role: 'Electrician',
          skills: ['Wiring', 'Panel Installation', 'Solar Setup'],
          dailyWage: 5500,
          status: 'Active',
          assignedProject: projects[2]?._id || null,
          address: '10 Station Road, Kandy',
          joinDate: new Date('2024-04-01'),
          emergencyContact: '+94 76 666 5544',
        },
        {
          name: 'Pradeep Kariyawasam',
          email: 'pradeep.kw@work.lk',
          phone: '+94 75 555 6677',
          role: 'Carpenter',
          skills: ['Formwork', 'Shuttering', 'Furniture'],
          dailyWage: 4800,
          status: 'Inactive',
          assignedProject: null,
          address: '34 Cross Street, Matara',
          joinDate: new Date('2023-11-01'),
          emergencyContact: '+94 70 555 4433',
        },
        {
          name: 'Amara Perumal',
          email: 'amara.perumal@work.lk',
          phone: '+94 77 666 7788',
          role: 'Plumber',
          skills: ['Water Lines', 'Drainage', 'Sanitary Fittings'],
          dailyWage: 5000,
          status: 'Active',
          assignedProject: projects[2]?._id || null,
          address: '15 North Street, Jaffna',
          joinDate: new Date('2024-05-10'),
          emergencyContact: '+94 71 444 3322',
        },
      ]);
    } else {
      workers = await Worker.find().limit(6);
    }

    // ── Materials ──────────────────────────────────────────
    const materialCount = await Material.countDocuments();
    if (materialCount === 0) {
      await Material.insertMany([
        {
          name: 'Portland Cement OPC 53',
          category: 'Binding Materials',
          unit: 'Bag (50kg)',
          stockQuantity: 5000,
          usedQuantity: 1200,
          unitPrice: 1350,
          supplier: suppliers[1]?._id || null,
          description: 'Ordinary Portland Cement 53 grade for structural concrete',
          reorderLevel: 500,
        },
        {
          name: 'TMT Steel Bar 16mm',
          category: 'Steel & Metal',
          unit: 'kg',
          stockQuantity: 25000,
          usedQuantity: 12000,
          unitPrice: 185,
          supplier: suppliers[0]?._id || null,
          description: 'Thermo Mechanically Treated reinforcement bars 16mm diameter',
          reorderLevel: 2000,
        },
        {
          name: 'River Sand (Washed)',
          category: 'Aggregates',
          unit: 'm³',
          stockQuantity: 800,
          usedQuantity: 520,
          unitPrice: 12000,
          supplier: suppliers[2]?._id || null,
          description: 'Washed river sand for concrete and plastering',
          reorderLevel: 100,
        },
        {
          name: '20mm Crushed Granite',
          category: 'Aggregates',
          unit: 'm³',
          stockQuantity: 600,
          usedQuantity: 580,
          unitPrice: 9500,
          supplier: suppliers[2]?._id || null,
          description: 'Crushed granite coarse aggregate for concrete works',
          reorderLevel: 80,
        },
        {
          name: 'Wire Mesh BRC A142',
          category: 'Steel & Metal',
          unit: 'Sheet',
          stockQuantity: 300,
          usedQuantity: 290,
          unitPrice: 3800,
          supplier: suppliers[0]?._id || null,
          description: 'Welded wire fabric for slab reinforcement',
          reorderLevel: 50,
        },
        {
          name: 'AAC Blocks 200mm',
          category: 'Masonry',
          unit: 'Piece',
          stockQuantity: 8000,
          usedQuantity: 2100,
          unitPrice: 145,
          supplier: null,
          description: 'Autoclaved Aerated Concrete blocks for partition walls',
          reorderLevel: 1000,
        },
        {
          name: 'PVC Pipe 110mm (SWR)',
          category: 'Plumbing',
          unit: 'm',
          stockQuantity: 1200,
          usedQuantity: 480,
          unitPrice: 380,
          supplier: null,
          description: 'Soil, Waste and Rain water PVC pipes 110mm',
          reorderLevel: 200,
        },
        {
          name: 'Electrical Cable 2.5mm²',
          category: 'Electrical',
          unit: 'm',
          stockQuantity: 5000,
          usedQuantity: 1800,
          unitPrice: 120,
          supplier: null,
          description: 'Twin and earth PVC insulated cable for power circuits',
          reorderLevel: 500,
        },
      ]);
    }

    // ── Assignments ────────────────────────────────────────
    const assignmentCount = await Assignment.countDocuments();
    if (assignmentCount === 0 && workers.length >= 4 && projects.length >= 3) {
      await Assignment.insertMany([
        {
          project: projects[0]._id,
          worker: workers[0]._id,
          role: 'Lead Site Engineer',
          status: 'Active',
          notes: 'Responsible for daily progress monitoring',
        },
        {
          project: projects[0]._id,
          worker: workers[1]._id,
          role: 'Head Mason',
          status: 'Active',
          notes: 'Oversees all masonry works on site',
        },
        {
          project: projects[1]._id,
          worker: workers[2]._id,
          role: 'Quantity Surveyor',
          status: 'Active',
          notes: 'Managing BOQ and procurement for bridge project',
        },
        {
          project: projects[2]._id,
          worker: workers[3]._id,
          role: 'Electrical Lead',
          status: 'Active',
          notes: 'Hospital electrical installations',
        },
      ]);
    }

    // ── Contacts ───────────────────────────────────────────
    const contactCount = await Contact.countDocuments();
    if (contactCount === 0) {
      await Contact.insertMany([
        {
          name: 'Harsha Gunawardena',
          email: 'harsha.g@example.com',
          phone: '+94 77 987 6543',
          subject: 'Project Inquiry - Office Building',
          message: 'We are planning a 5-storey office building in Nugegoda. Could you provide a feasibility assessment and cost estimate?',
          status: 'New',
        },
        {
          name: 'Thanuja Wickramasinghe',
          email: 'thanuja@gmail.com',
          phone: '+94 71 876 5432',
          subject: 'Supplier Partnership Request',
          message: 'We are a ceramic tiles supplier interested in partnering with your construction projects. Please let us know your material requirements.',
          status: 'Read',
        },
        {
          name: 'Lalith Mendis',
          email: 'lalith.mendis@gov.lk',
          phone: '+94 11 234 5678',
          subject: 'Government Tender – Road Rehabilitation',
          message: 'We would like to invite your company to bid on the upcoming road rehabilitation project in Sabaragamuwa Province.',
          status: 'Replied',
        },
      ]);
    }

    return NextResponse.json({
      message: '✅ Database seeded successfully!',
      summary: {
        admin: 'admin@construction.com / admin123456',
        projects: await Project.countDocuments(),
        materials: await Material.countDocuments(),
        workers: await Worker.countDocuments(),
        suppliers: await Supplier.countDocuments(),
        contacts: await Contact.countDocuments(),
        assignments: await Assignment.countDocuments(),
      },
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Seed failed: ' + error.message }, { status: 500, headers: CORS_HEADERS });
  }
}
