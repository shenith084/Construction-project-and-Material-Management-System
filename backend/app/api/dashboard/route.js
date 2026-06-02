import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import Material from '@/models/Material';
import Worker from '@/models/Worker';
import Supplier from '@/models/Supplier';
import Contact from '@/models/Contact';

export async function GET() {
  try {
    await connectDB();

    const [
      totalProjects,
      activeProjects,
      completedProjects,
      totalMaterials,
      lowStockMaterials,
      totalWorkers,
      activeWorkers,
      totalSuppliers,
      newContacts,
      recentProjects,
      projectsByStatus,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: 'Active' }),
      Project.countDocuments({ status: 'Completed' }),
      Material.countDocuments(),
      Material.countDocuments({ status: { $in: ['Low Stock', 'Out of Stock'] } }),
      Worker.countDocuments(),
      Worker.countDocuments({ status: 'Active' }),
      Supplier.countDocuments(),
      Contact.countDocuments({ status: 'New' }),
      Project.find().sort({ createdAt: -1 }).limit(5).select('title status progress budget location'),
      Project.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const totalBudget = await Project.aggregate([
      { $group: { _id: null, total: { $sum: '$budget' } } },
    ]);

    return NextResponse.json({
      stats: {
        totalProjects,
        activeProjects,
        completedProjects,
        totalMaterials,
        lowStockMaterials,
        totalWorkers,
        activeWorkers,
        totalSuppliers,
        newContacts,
        totalBudget: totalBudget[0]?.total || 0,
      },
      recentProjects,
      projectsByStatus,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
