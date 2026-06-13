import { PrismaClient, SkillCategory, ToolCategory } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Admin user
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@2024!', 12)
  await prisma.user.upsert({
    where: { email: 'joanivymwangi@gmail.com' },
    update: {},
    create: { email: 'joanivymwangi@gmail.com', password: hashedPassword, name: 'Joan Mwangi', role: 'SUPER_ADMIN' },
  })
  console.log('✅ Admin user')

  // Profile
  await prisma.profile.deleteMany()
  await prisma.profile.create({
    data: {
      name: 'Joan Mwangi',
      title: ['Procurement Officer', 'Sales Executive', 'Customer Service Professional', 'Logistics Specialist'],
      summary: "I'm a proactive and adaptable professional with a strong background in sales, customer service, administrative support, and logistics. I have built a track record of delivering exceptional customer experiences, resolving issues promptly, and consistently surpassing sales targets. I bring a people-first approach, excellent communication skills, and strong attention to detail. I thrive in dynamic environments and take pride in helping businesses grow by building trust with customers.",
      email: 'joanivymwangi@gmail.com', phone: '+254719440407', location: 'Nakuru, Kenya',
      whatsappNumber: '+254719440407', isPublished: true,
    },
  })
  console.log('✅ Profile')

  // Experience
  await prisma.experience.deleteMany()
  await prisma.experience.createMany({
    data: [
      { company: 'Outspan Hospital', role: 'Procurement Officer', startDate: new Date('2026-01-01'), isCurrent: true, location: 'Kenya', achievements: ['Procurement Planning','Supplier Evaluation','Contract Negotiation','Procurement Documentation','Inventory Management','Warehouse Coordination','Logistics Coordination','Regulatory Compliance','Procurement Reporting'], order: 1, isPublished: true },
      { company: 'Airtel Kenya', role: 'Sales Executive', startDate: new Date('2025-01-01'), endDate: new Date('2025-12-31'), isCurrent: false, location: 'Kenya', achievements: ['Agent Recruitment','Distribution Channel Management','Territory Mapping','Route Planning','Market Expansion','Relationship Management','Sales Growth','Product Visibility','Market Intelligence','Sales Reporting'], order: 2, isPublished: true },
    ],
  })
  console.log('✅ Experience')

  // Education
  await prisma.education.deleteMany()
  await prisma.education.createMany({
    data: [
      { institution: 'Kenya Institute of Supply Examination Board', degree: 'Certified Procurement and Supply Professional of Kenya (CPSP-K)', field: 'Procurement & Supply', startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31'), order: 1, isPublished: true },
      { institution: 'Kabarak University', degree: "Bachelor's Degree", field: 'Procurement and Logistics', startDate: new Date('2019-01-01'), endDate: new Date('2023-12-31'), order: 2, isPublished: true },
    ],
  })
  console.log('✅ Education')

  // Certifications
  await prisma.certification.deleteMany()
  await prisma.certification.create({
    data: { name: 'Certified Procurement and Supply Professional of Kenya', issuer: 'Kenya Institute of Supply Examination Board', issueDate: new Date('2024-12-01'), order: 1, isPublished: true },
  })
  console.log('✅ Certifications')

  // Skills
  await prisma.skill.deleteMany()
  await prisma.skill.createMany({
    data: [
      { name: 'Procurement Management',       category: SkillCategory.CORE, proficiency: 95, order: 1, isPublished: true },
      { name: 'Supply Chain Logistics',        category: SkillCategory.CORE, proficiency: 90, order: 2, isPublished: true },
      { name: 'Contract Negotiation',          category: SkillCategory.CORE, proficiency: 88, order: 3, isPublished: true },
      { name: 'Sales & Business Development',  category: SkillCategory.CORE, proficiency: 92, order: 4, isPublished: true },
      { name: 'Customer Service',              category: SkillCategory.CORE, proficiency: 95, order: 5, isPublished: true },
      { name: 'Inventory Management',          category: SkillCategory.CORE, proficiency: 88, order: 6, isPublished: true },
      { name: 'Customer Relationship Mgmt',    category: SkillCategory.SOFT, proficiency: 95, order: 1, isPublished: true },
      { name: 'Complaint Resolution',          category: SkillCategory.SOFT, proficiency: 93, order: 2, isPublished: true },
      { name: 'Analytical Thinking',           category: SkillCategory.SOFT, proficiency: 88, order: 3, isPublished: true },
      { name: 'Problem Solving',               category: SkillCategory.SOFT, proficiency: 90, order: 4, isPublished: true },
      { name: 'Time Management',               category: SkillCategory.SOFT, proficiency: 92, order: 5, isPublished: true },
      { name: 'Verbal Communication',          category: SkillCategory.SOFT, proficiency: 95, order: 6, isPublished: true },
      { name: 'Written Communication',         category: SkillCategory.SOFT, proficiency: 90, order: 7, isPublished: true },
      { name: 'Organisational Skills',         category: SkillCategory.SOFT, proficiency: 92, order: 8, isPublished: true },
      { name: 'Administrative Support',        category: SkillCategory.SOFT, proficiency: 88, order: 9, isPublished: true },
    ],
  })
  console.log('✅ Skills')

  // Tools
  await prisma.tool.deleteMany()
  await prisma.tool.createMany({
    data: [
      { name: 'Zendesk',           category: ToolCategory.CRM_SUPPORT,        order: 1, isPublished: true },
      { name: 'HubSpot',           category: ToolCategory.CRM_SUPPORT,        order: 2, isPublished: true },
      { name: 'Freshdesk',         category: ToolCategory.CRM_SUPPORT,        order: 3, isPublished: true },
      { name: 'Microsoft Office',  category: ToolCategory.PRODUCTIVITY,       order: 1, isPublished: true },
      { name: 'Microsoft Excel',   category: ToolCategory.PRODUCTIVITY,       order: 2, isPublished: true },
      { name: 'Microsoft Word',    category: ToolCategory.PRODUCTIVITY,       order: 3, isPublished: true },
      { name: 'PowerPoint',        category: ToolCategory.PRODUCTIVITY,       order: 4, isPublished: true },
      { name: 'Google Workspace',  category: ToolCategory.PRODUCTIVITY,       order: 5, isPublished: true },
      { name: 'Trello',            category: ToolCategory.PROJECT_MANAGEMENT, order: 1, isPublished: true },
      { name: 'ClickUp',           category: ToolCategory.PROJECT_MANAGEMENT, order: 2, isPublished: true },
      { name: 'Zoom',              category: ToolCategory.COMMUNICATION,      order: 1, isPublished: true },
      { name: 'Slack',             category: ToolCategory.COMMUNICATION,      order: 2, isPublished: true },
      { name: 'Microsoft Teams',   category: ToolCategory.COMMUNICATION,      order: 3, isPublished: true },
      { name: 'Google Meet',       category: ToolCategory.COMMUNICATION,      order: 4, isPublished: true },
      { name: 'QuickBooks',        category: ToolCategory.ERP_ACCOUNTING,     order: 1, isPublished: true },
      { name: 'SAP',               category: ToolCategory.ERP_ACCOUNTING,     order: 2, isPublished: true },
      { name: 'POS Systems',       category: ToolCategory.ERP_ACCOUNTING,     order: 3, isPublished: true },
    ],
  })
  console.log('✅ Tools')

  // Projects (sample — replace with real ones via admin)
  await prisma.project.deleteMany()
  await prisma.project.createMany({
    data: [
      {
        title: 'Hospital Procurement Overhaul',
        description: 'Led end-to-end restructuring of procurement processes at Outspan Hospital, implementing a supplier evaluation framework that reduced costs by 15% and improved lead times.',
        category: 'Procurement', client: 'Outspan Hospital',
        tags: ['procurement', 'supplier management', 'cost reduction', 'healthcare'],
        isFeatured: true, order: 1, isPublished: true,
      },
      {
        title: 'Airtel Kenya Sales Expansion',
        description: 'Managed distribution channel expansion across Nakuru region, recruiting 40+ agents and achieving 120% of quarterly sales targets through strategic territory mapping.',
        category: 'Sales', client: 'Airtel Kenya',
        tags: ['sales', 'distribution', 'territory management', 'telecom'],
        isFeatured: true, order: 2, isPublished: true,
      },
    ],
  })
  console.log('✅ Projects')

  // Site settings
  await prisma.siteSettings.deleteMany()
  await prisma.siteSettings.createMany({
    data: [
      { key: 'site_title',          value: 'Joan Mwangi | Procurement Officer',                description: 'Main site title' },
      { key: 'analytics_enabled',   value: 'false',                                           description: 'Enable analytics' },
      { key: 'contact_notify',      value: 'true',                                            description: 'Email on contact form submission' },
      { key: 'maintenance_mode',    value: 'false',                                           description: 'Maintenance mode' },
    ],
  })
  console.log('✅ Site settings')

  console.log('\n🎉 Seed complete!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Admin login:')
  console.log('  Email:    joanivymwangi@gmail.com')
  console.log(`  Password: ${process.env.ADMIN_PASSWORD || 'Admin@2024!'}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main().catch(console.error).finally(() => prisma.$disconnect())
