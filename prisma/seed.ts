import { PrismaClient, MenuLocation } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🔄 Bắt đầu seed dữ liệu...')

  // ============================================
  // 1. Tạo tài khoản Admin
  // ============================================
  const adminPassword = await bcrypt.hash('123456', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'younista666@gmail.com' },
    update: {},
    create: {
      email: 'younista666@gmail.com',
      name: 'Hà Kỳ Anh',
      passwordHash: adminPassword,
      isAdmin: true,
    },
  })
  console.log(`✅ Admin tạo thành công: ${admin.email}`)

  // ============================================
  // 2. Tạo Hero Sections mẫu
  // ============================================
  const heroSections = await Promise.all([
    prisma.heroSection.upsert({
      where: { id: 'hero-1' },
      update: {},
      create: {
        id: 'hero-1',
        title: 'NeoBóc - Nailbox Thiết Kế Riêng',
        subtitle: 'Khám phá bộ sưu tập nailbox độc đáo, được thiết kế riêng cho bạn.',
        imageUrl: '/images/hero/hero-1.jpg',
        link: '/collections',
        isActive: true,
        displayOrder: 0,
      },
    }),
    prisma.heroSection.upsert({
      where: { id: 'hero-2' },
      update: {},
      create: {
        id: 'hero-2',
        title: 'Mùa Hè Rực Rỡ',
        subtitle: 'Bộ sưu tập nailbox mùa hè với gam màu tươi sáng, nổi bật.',
        imageUrl: '/images/hero/hero-2.jpg',
        link: '/collections/bo-suu-tap-mua-he',
        isActive: true,
        displayOrder: 1,
      },
    }),
    prisma.heroSection.upsert({
      where: { id: 'hero-3' },
      update: {},
      create: {
        id: 'hero-3',
        title: 'Thiết Kế Riêng - Biểu Tượng Cá Nhân',
        subtitle: 'Tạo nên phong cách riêng biệt với thiết kế nailbox theo ý tưởng của bạn.',
        imageUrl: '/images/hero/hero-3.jpg',
        link: '/design-request',
        isActive: true,
        displayOrder: 2,
      },
    }),
  ])
  console.log(`✅ Đã tạo ${heroSections.length} hero sections`)

  // ============================================
  // 3. Tạo Categories mẫu
  // ============================================
  const [catCoBan, catCaoCap, catThietKeRieng, catPhuKien] = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'nailbox-co-ban' },
      update: {},
      create: { name: 'Nailbox Cơ Bản', slug: 'nailbox-co-ban', isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: 'nailbox-cao-cap' },
      update: {},
      create: { name: 'Nailbox Cao Cấp', slug: 'nailbox-cao-cap', isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: 'nailbox-thiet-ke-rieng' },
      update: {},
      create: { name: 'Nailbox Thiết Kế Riêng', slug: 'nailbox-thiet-ke-rieng', isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: 'phukien' },
      update: {},
      create: { name: 'Phụ Kiện', slug: 'phukien', isActive: true },
    }),
  ])
  console.log(`✅ Đã tạo 4 categories`)

  // ============================================
  // 4. Tạo Collections mẫu
  // ============================================
  const [collMuaHe, collMuaThu, collGiangSinh] = await Promise.all([
    prisma.collection.upsert({
      where: { slug: 'bo-suu-tap-mua-he' },
      update: {},
      create: {
        name: 'Bộ Sưu Tập Mùa Hè',
        slug: 'bo-suu-tap-mua-he',
        isActive: true,
      },
    }),
    prisma.collection.upsert({
      where: { slug: 'bo-suu-tap-mua-thu' },
      update: {},
      create: {
        name: 'Bộ Sưu Tập Mùa Thu',
        slug: 'bo-suu-tap-mua-thu',
        isActive: true,
      },
    }),
    prisma.collection.upsert({
      where: { slug: 'bo-suu-tap-giang-sinh' },
      update: {},
      create: {
        name: 'Bộ Sưu Tập Giáng Sinh',
        slug: 'bo-suu-tap-giang-sinh',
        isActive: true,
      },
    }),
  ])
  console.log(`✅ Đã tạo 3 collections`)

  // ============================================
  // 5. Tạo Products mẫu
  // ============================================
  const products = await Promise.all([
    // Nailbox Cơ Bản
    prisma.product.upsert({
      where: { slug: 'nailbox-co-ban-hong' },
      update: {},
      create: {
        name: 'Nailbox Cơ Bản - Hồng Phấn',
        slug: 'nailbox-co-ban-hong',
        description: 'Nailbox cơ bản với tông màu hồng phấn dịu dàng, phù hợp cho mọi dịp.',
        price: 199000,
        originalPrice: 249000,
        salePrice: 199000,
        images: [
          '/images/products/nailbox-co-ban-hong-1.jpg',
          '/images/products/nailbox-co-ban-hong-2.jpg',
        ],
        seoTitle: 'Nailbox Cơ Bản Hồng Phấn | NeoBóc',
        seoDescription: 'Nailbox cơ bản với tông màu hồng phấn dịu dàng, phù hợp cho mọi dịp.',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'nailbox-co-ban-xanh' },
      update: {},
      create: {
        name: 'Nailbox Cơ Bản - Xanh Mint',
        slug: 'nailbox-co-ban-xanh',
        description: 'Nailbox cơ bản với tông màu xanh mint mát mẻ, trẻ trung.',
        price: 199000,
        images: [
          '/images/products/nailbox-co-ban-xanh-1.jpg',
        ],
        seoTitle: 'Nailbox Cơ Bản Xanh Mint | NeoBóc',
        seoDescription: 'Nailbox cơ bản với tông màu xanh mint mát mẻ, trẻ trung.',
        isActive: true,
      },
    }),
    // Nailbox Cao Cấp
    prisma.product.upsert({
      where: { slug: 'nailbox-cao-cap-vang' },
      update: {},
      create: {
        name: 'Nailbox Cao Cấp - Vàng Hoàng Gia',
        slug: 'nailbox-cao-cap-vang',
        description: 'Nailbox cao cấp với thiết kế sang trọng, màu vàng hoàng gia quý phái.',
        price: 499000,
        originalPrice: 599000,
        salePrice: 499000,
        images: [
          '/images/products/nailbox-cao-cap-vang-1.jpg',
          '/images/products/nailbox-cao-cap-vang-2.jpg',
        ],
        seoTitle: 'Nailbox Cao Cấp Vàng Hoàng Gia | NeoBóc',
        seoDescription: 'Nailbox cao cấp với thiết kế sang trọng, màu vàng hoàng gia quý phái.',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'nailbox-cao-cap-bac' },
      update: {},
      create: {
        name: 'Nailbox Cao Cấp - Bạc Luna',
        slug: 'nailbox-cao-cap-bac',
        description: 'Nailbox cao cấp với ánh bạc lấp lánh, thời thượng.',
        price: 549000,
        images: [
          '/images/products/nailbox-cao-cap-bac-1.jpg',
        ],
        seoTitle: 'Nailbox Cao Cấp Bạc Luna | NeoBóc',
        seoDescription: 'Nailbox cao cấp với ánh bạc lấp lánh, thời thượng.',
        isActive: true,
      },
    }),
    // Nailbox Thiết Kế Riêng
    prisma.product.upsert({
      where: { slug: 'nailbox-thiet-ke-rieng-co-ban' },
      update: {},
      create: {
        name: 'Nailbox Thiết Kế Riêng - Cơ Bản',
        slug: 'nailbox-thiet-ke-rieng-co-ban',
        description: 'Thiết kế nailbox hoàn toàn theo ý tưởng của bạn với gói cơ bản.',
        price: 299000,
        images: [
          '/images/products/nailbox-tkr-1.jpg',
        ],
        seoTitle: 'Nailbox Thiết Kế Riêng Gói Cơ Bản | NeoBóc',
        seoDescription: 'Thiết kế nailbox hoàn toàn theo ý tưởng của bạn với gói cơ bản.',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'nailbox-thiet-ke-rieng-cao-cap' },
      update: {},
      create: {
        name: 'Nailbox Thiết Kế Riêng - Cao Cấp',
        slug: 'nailbox-thiet-ke-rieng-cao-cap',
        description: 'Thiết kế nailbox độc đáo với vật liệu cao cấp, kèm tư vấn chuyên nghiệp.',
        price: 699000,
        originalPrice: 799000,
        salePrice: 699000,
        images: [
          '/images/products/nailbox-tkr-cao-cap-1.jpg',
        ],
        seoTitle: 'Nailbox Thiết Kế Riêng Gói Cao Cấp | NeoBóc',
        seoDescription: 'Thiết kế nailbox độc đáo với vật liệu cao cấp, kèm tư vấn chuyên nghiệp.',
        isActive: true,
      },
    }),
    // Phụ Kiện
    prisma.product.upsert({
      where: { slug: 'ke-do-nail-chuyen-dung' },
      update: {},
      create: {
        name: 'Kệ Đỡ Nail Chuyên Dụng',
        slug: 'ke-do-nail-chuyen-dung',
        description: 'Kệ đỡ nail chuyên dụng bằng nhựa cao cấp, có thể điều chỉnh.',
        price: 89000,
        images: [
          '/images/products/ke-do-nail-1.jpg',
        ],
        seoTitle: 'Kệ Đỡ Nail Chuyên Dụng | NeoBóc',
        seoDescription: 'Kệ đỡ nail chuyên dụng bằng nhựa cao cấp, có thể điều chỉnh.',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'hop-luu-tru-nail' },
      update: {},
      create: {
        name: 'Hộp Lưu Trữ Nailbox',
        slug: 'hop-luu-tru-nail',
        description: 'Hộp lưu trữ nailbox bằng vải nhung cao cấp, chống trầy.',
        price: 129000,
        images: [
          '/images/products/hop-luu-tru-1.jpg',
        ],
        seoTitle: 'Hộp Lưu Trữ Nailbox | NeoBóc',
        seoDescription: 'Hộp lưu trữ nailbox bằng vải nhung cao cấp, chống trầy.',
        isActive: true,
      },
    }),
  ])
  console.log(`✅ Đã tạo ${products.length} products`)

  // ============================================
  // 6. Tạo Product Variants mẫu
  // ============================================
  const [prodCoBanHong, prodCoBanXanh, prodCaoCapVang] = products

  await Promise.all([
    // Variants cho Nailbox Cơ Bản - Hồng Phấn
    prisma.productVariant.upsert({
      where: { sku: 'NBH-S' },
      update: {},
      create: {
        sku: 'NBH-S',
        productId: prodCoBanHong.id,
        name: 'Nhỏ (S)',
        image: '/images/products/nailbox-co-ban-hong-1.jpg',
        stock: 20,
      },
    }),
    prisma.productVariant.upsert({
      where: { sku: 'NBH-M' },
      update: {},
      create: {
        sku: 'NBH-M',
        productId: prodCoBanHong.id,
        name: 'Vừa (M)',
        image: '/images/products/nailbox-co-ban-hong-1.jpg',
        stock: 20,
      },
    }),
    prisma.productVariant.upsert({
      where: { sku: 'NBH-L' },
      update: {},
      create: {
        sku: 'NBH-L',
        productId: prodCoBanHong.id,
        name: 'Lớn (L)',
        image: '/images/products/nailbox-co-ban-hong-2.jpg',
        stock: 10,
      },
    }),
    // Variants cho Nailbox Cơ Bản - Xanh Mint
    prisma.productVariant.upsert({
      where: { sku: 'NBM-S' },
      update: {},
      create: {
        sku: 'NBM-S',
        productId: prodCoBanXanh.id,
        name: 'Nhỏ (S)',
        image: '/images/products/nailbox-co-ban-xanh-1.jpg',
        stock: 15,
      },
    }),
    prisma.productVariant.upsert({
      where: { sku: 'NBM-M' },
      update: {},
      create: {
        sku: 'NBM-M',
        productId: prodCoBanXanh.id,
        name: 'Vừa (M)',
        image: '/images/products/nailbox-co-ban-xanh-1.jpg',
        stock: 20,
      },
    }),
    prisma.productVariant.upsert({
      where: { sku: 'NBM-L' },
      update: {},
      create: {
        sku: 'NBM-L',
        productId: prodCoBanXanh.id,
        name: 'Lớn (L)',
        image: '/images/products/nailbox-co-ban-xanh-1.jpg',
        stock: 10,
      },
    }),
    // Variants cho Nailbox Cao Cấp - Vàng Hoàng Gia
    prisma.productVariant.upsert({
      where: { sku: 'NCV-S' },
      update: {},
      create: {
        sku: 'NCV-S',
        productId: prodCaoCapVang.id,
        name: 'Nhỏ (S)',
        image: '/images/products/nailbox-cao-cap-vang-1.jpg',
        stock: 10,
      },
    }),
    prisma.productVariant.upsert({
      where: { sku: 'NCV-M' },
      update: {},
      create: {
        sku: 'NCV-M',
        productId: prodCaoCapVang.id,
        name: 'Vừa (M)',
        image: '/images/products/nailbox-cao-cap-vang-1.jpg',
        stock: 12,
      },
    }),
    prisma.productVariant.upsert({
      where: { sku: 'NCV-L' },
      update: {},
      create: {
        sku: 'NCV-L',
        productId: prodCaoCapVang.id,
        name: 'Lớn (L)',
        image: '/images/products/nailbox-cao-cap-vang-2.jpg',
        stock: 8,
      },
    }),
  ])
  console.log(`✅ Đã tạo 9 product variants`)

  // ============================================
  // 7. Liên kết Products với Categories & Collections
  // ============================================
  await Promise.all([
    // Cơ bản -> Category Cơ Bản
    prisma.categoryProduct.upsert({
      where: { categoryId_productId: { categoryId: catCoBan.id, productId: prodCoBanHong.id } },
      update: {},
      create: { categoryId: catCoBan.id, productId: prodCoBanHong.id },
    }),
    prisma.categoryProduct.upsert({
      where: { categoryId_productId: { categoryId: catCoBan.id, productId: prodCoBanXanh.id } },
      update: {},
      create: { categoryId: catCoBan.id, productId: prodCoBanXanh.id },
    }),
    // Cao cấp -> Category Cao Cấp
    prisma.categoryProduct.upsert({
      where: { categoryId_productId: { categoryId: catCaoCap.id, productId: prodCaoCapVang.id } },
      update: {},
      create: { categoryId: catCaoCap.id, productId: prodCaoCapVang.id },
    }),
    // Thiết kế riêng -> Category Thiết Kế Riêng
    prisma.categoryProduct.upsert({
      where: { categoryId_productId: { categoryId: catThietKeRieng.id, productId: products[4].id } },
      update: {},
      create: { categoryId: catThietKeRieng.id, productId: products[4].id },
    }),
    prisma.categoryProduct.upsert({
      where: { categoryId_productId: { categoryId: catThietKeRieng.id, productId: products[5].id } },
      update: {},
      create: { categoryId: catThietKeRieng.id, productId: products[5].id },
    }),
    // Phụ kiện -> Category Phụ Kiện
    prisma.categoryProduct.upsert({
      where: { categoryId_productId: { categoryId: catPhuKien.id, productId: products[6].id } },
      update: {},
      create: { categoryId: catPhuKien.id, productId: products[6].id },
    }),
    prisma.categoryProduct.upsert({
      where: { categoryId_productId: { categoryId: catPhuKien.id, productId: products[7].id } },
      update: {},
      create: { categoryId: catPhuKien.id, productId: products[7].id },
    }),
  ])

  // Liên kết với Collections
  await Promise.all([
    // Mùa Hè
    prisma.collectionProduct.upsert({
      where: { collectionId_productId: { collectionId: collMuaHe.id, productId: prodCoBanHong.id } },
      update: {},
      create: { collectionId: collMuaHe.id, productId: prodCoBanHong.id },
    }),
    prisma.collectionProduct.upsert({
      where: { collectionId_productId: { collectionId: collMuaHe.id, productId: prodCoBanXanh.id } },
      update: {},
      create: { collectionId: collMuaHe.id, productId: prodCoBanXanh.id },
    }),
    // Mùa Thu
    prisma.collectionProduct.upsert({
      where: { collectionId_productId: { collectionId: collMuaThu.id, productId: prodCaoCapVang.id } },
      update: {},
      create: { collectionId: collMuaThu.id, productId: prodCaoCapVang.id },
    }),
    // Giáng Sinh
    prisma.collectionProduct.upsert({
      where: { collectionId_productId: { collectionId: collGiangSinh.id, productId: products[3].id } },
      update: {},
      create: { collectionId: collGiangSinh.id, productId: products[3].id },
    }),
    prisma.collectionProduct.upsert({
      where: { collectionId_productId: { collectionId: collGiangSinh.id, productId: products[5].id } },
      update: {},
      create: { collectionId: collGiangSinh.id, productId: products[5].id },
    }),
  ])
  console.log(`✅ Đã liên kết products với categories và collections`)

  // ============================================
  // 8. Tạo Shipping Carriers mẫu
  // ============================================
  const carriers = await Promise.all([
    prisma.shippingCarrier.upsert({
      where: { code: 'GHN' },
      update: {},
      create: {
        name: 'Giao Hàng Nhanh',
        code: 'GHN',
        trackingUrlPattern: 'https://track.ghn.vn/?order_code={tracking_code}',
        isActive: true,
      },
    }),
    prisma.shippingCarrier.upsert({
      where: { code: 'GHTK' },
      update: {},
      create: {
        name: 'Giao Hàng Tiết Kiệm',
        code: 'GHTK',
        trackingUrlPattern: 'https://i.ghtk.vn/{tracking_code}',
        isActive: true,
      },
    }),
    prisma.shippingCarrier.upsert({
      where: { code: 'VNPOST' },
      update: {},
      create: {
        name: 'Bưu Điện Việt Nam',
        code: 'VNPOST',
        trackingUrlPattern: 'https://www.vnpost.vn/track?orderCode={tracking_code}',
        isActive: true,
      },
    }),
    prisma.shippingCarrier.upsert({
      where: { code: 'JT' },
      update: {},
      create: {
        name: 'J&T Express',
        code: 'JT',
        trackingUrlPattern: 'https://www.jtexpress.vn/track?tracking_code={tracking_code}',
        isActive: true,
      },
    }),
  ])
  console.log(`✅ Đã tạo ${carriers.length} shipping carriers`)

  // ============================================
  // 9. Tạo Settings mặc định
  // ============================================
  const settings = [
    { key: 'site_name', type: 'string' as const, value: 'NeoBóc' },
    { key: 'site_logo', type: 'string' as const, value: '/images/logo.png' },
    { key: 'seo_default_title', type: 'string' as const, value: 'NeoBóc - Nailbox Thiết Kế Riêng' },
    { key: 'seo_default_description', type: 'string' as const, value: 'Chuyên cung cấp các bộ nailbox thiết kế riêng và có sẵn, chất lượng cao.' },
    { key: 'social_links', type: 'json' as const, value: JSON.stringify([]) },
    { key: 'contact_info', type: 'json' as const, value: JSON.stringify({ email: '', phone: '', address: '' }) },
    { key: 'payment_bank_info', type: 'json' as const, value: JSON.stringify({ bank_name: '', account_number: '', account_holder: '' }) },
  ]

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    })
  }
  console.log(`✅ Đã tạo ${settings.length} settings`)

  // ============================================
  // 10. Tạo Menu mẫu (Header)
  // ============================================
  const headerMenus = [
    { name: 'Trang Chủ', url: '/', location: MenuLocation.header },
    { name: 'Sản Phẩm', url: '/products', location: MenuLocation.header },
    { name: 'Bộ Sưu Tập', url: '/collections', location: MenuLocation.header },
    { name: 'Thiết Kế Riêng', url: '/design-request', location: MenuLocation.header },
  ]

  for (let i = 0; i < headerMenus.length; i++) {
    await prisma.menu.upsert({
      where: { id: `header-menu-${i}` },
      update: {},
      create: {
        id: `header-menu-${i}`,
        name: headerMenus[i].name,
        url: headerMenus[i].url,
        location: headerMenus[i].location,
        displayOrder: i,
        isActive: true,
      },
    })
  }

  // Footer menus
  const footerMenus = [
    { name: 'Về Chúng Tôi', url: '/about', location: MenuLocation.footer },
    { name: 'Chính Sách Đổi Trả', url: '/return-policy', location: MenuLocation.footer },
    { name: 'Liên Hệ', url: '/contact', location: MenuLocation.footer },
  ]

  for (let i = 0; i < footerMenus.length; i++) {
    await prisma.menu.upsert({
      where: { id: `footer-menu-${i}` },
      update: {},
      create: {
        id: `footer-menu-${i}`,
        name: footerMenus[i].name,
        url: footerMenus[i].url,
        location: footerMenus[i].location,
        displayOrder: i,
        isActive: true,
      },
    })
  }
  console.log(`✅ Đã tạo menus`)

  // ============================================
  // 11. Tạo trang nội dung mẫu
  // ============================================
  const pages = [
    {
      name: 'Về Chúng Tôi',
      slug: 'about',
      htmlContent: '<h1>Về NeoBóc</h1><p>NeoBóc là thương hiệu nailbox thiết kế riêng hàng đầu.</p>',
    },
    {
      name: 'Chính Sách Đổi Trả',
      slug: 'return-policy',
      htmlContent: '<h1>Chính Sách Đổi Trả</h1><p>Quý khách có thể đổi trả trong vòng 7 ngày.</p>',
    },
    {
      name: 'Liên Hệ',
      slug: 'contact',
      htmlContent: '<h1>Liên Hệ</h1><p>Hãy liên hệ với chúng tôi qua email: contact@neoboc.com</p>',
    },
  ]

  for (const p of pages) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        htmlContent: p.htmlContent,
        isActive: true,
      },
    })
  }
  console.log(`✅ Đã tạo ${pages.length} pages`)

  console.log('\n🎉 Seed hoàn tất!')
  console.log('\n📋 Thông tin đăng nhập Admin:')
  console.log('   Email:    younista666@gmail.com')
  console.log('   Password: 123456')
  console.log('   Name:     Hà Kỳ Anh')
}

main()
  .catch((e) => {
    console.error('❌ Seed thất bại:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
