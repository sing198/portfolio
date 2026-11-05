import { getProjectExperience } from './projectExperiences'

const projectDetails = {
  OMS: {
    gallery: [
      { src: '/screenshots/dgkeys.webp', label: { en: 'Storefront', th: 'หน้าร้าน' }, width: 1192, height: 946 },
    ],
    caseStudy: {
      en: {
        challenge: 'Keep checkout consistent when multiple customers order the same stock.',
        decisions: [
          { title: 'Reserve stock in one transaction', detail: 'Combine duplicate cart items, lock product rows in ID order, and reserve stock within one database transaction.' },
          { title: 'Check current account permissions', detail: 'Read account status and roles from the database on authenticated requests, so bans and role changes apply to existing sessions.' },
        ],
        outcome: 'The repository includes regression tests for invalid quantities, unavailable stock, failed writes or commits, and account permissions, with every checkout step covered by the transaction.',
        evidence: [
          { label: 'Checkout implementation', href: 'https://github.com/sing198/OMS/blob/main/oms-backend/orders.go' },
          { label: 'Regression tests', href: 'https://github.com/sing198/OMS/blob/main/oms-backend/security_test.go' },
        ],
        limits: 'Checkout creates a pending order. Next: payment webhook with automatic key delivery, plus an expiry job that releases abandoned stock reservations.',
      },
      th: {
        challenge: 'ทำให้ข้อมูลคำสั่งซื้อและสต็อกสอดคล้องกัน เมื่อหลายคนสั่งสินค้าพร้อมกัน',
        decisions: [
          { title: 'จองสต็อกภายใน transaction เดียว', detail: 'รวมรายการสินค้าซ้ำ ล็อกแถวสินค้าตามลำดับ ID และจองสต็อกภายใน transaction เดียว' },
          { title: 'ตรวจสิทธิ์บัญชีจากข้อมูลปัจจุบัน', detail: 'ตรวจสถานะบัญชีและสิทธิ์จากฐานข้อมูลทุกคำขอที่ยืนยันตัวตน เพื่อให้การระงับบัญชีหรือเปลี่ยนสิทธิ์มีผลกับ session ที่ใช้อยู่' },
        ],
        outcome: 'ใน repo มี regression tests ครอบคลุมจำนวนสินค้าไม่ถูกต้อง สต็อกไม่พอ การบันทึกหรือ commit ล้มเหลว และสิทธิ์บัญชี โดยทุกขั้นตอนของ checkout อยู่ใน transaction เดียว',
        evidence: [
          { label: 'โค้ด Checkout', href: 'https://github.com/sing198/OMS/blob/main/oms-backend/orders.go' },
          { label: 'Regression tests', href: 'https://github.com/sing198/OMS/blob/main/oms-backend/security_test.go' },
        ],
        limits: 'Checkout สร้างคำสั่งซื้อสถานะ pending ขั้นต่อไปคือ payment webhook พร้อมส่งคีย์อัตโนมัติ และ job ปล่อยสต็อกที่จองค้าง',
      },
    },
  },
  'co-board': {
    gallery: [
      { src: '/screenshots/co-board.webp', label: { en: 'Workspace', th: 'พื้นที่ทำงาน' }, width: 1274, height: 952 },
      { src: '/screenshots/co-board/board.webp', label: { en: 'Kanban', th: 'Kanban' }, width: 1057, height: 1588 },
      { src: '/screenshots/co-board/board-list.webp', label: { en: 'Table', th: 'ตาราง' }, width: 1280, height: 800 },
      { src: '/screenshots/co-board/board-calendar.webp', label: { en: 'Calendar', th: 'ปฏิทิน' }, width: 1274, height: 1360 },
      { src: '/screenshots/co-board/board-timeline.webp', label: { en: 'Timeline', th: 'Timeline' }, width: 1274, height: 910 },
      { src: '/screenshots/co-board/board-mindmap.webp', label: { en: 'Mind Map', th: 'Mind Map' }, width: 1274, height: 939 },
      { src: '/screenshots/co-board/board-sprint.webp', label: { en: 'Sprint', th: 'Sprint' }, width: 1057, height: 1379 },
    ],
    caseStudy: {
      en: {
        role: 'Solo full-stack developer: React/TypeScript frontend, Go backend, WebSocket sync.',
        challenge: 'An optimistic board can look saved even when the server rejects a change. Sending a whole task can also overwrite a teammate’s unrelated edit.',
        decisions: [
          { title: 'Confirm saves after database writes', detail: 'Send mutations with request IDs and match successful server events to the initiating client. Block disconnected edits and reload authoritative state after a rejected change.' },
          { title: 'Protect edits field by field', detail: 'Send only changed fields with their expected prior values. Preserve edits to different fields and reject stale writes to the same field.' },
        ],
        outcome: 'The repository case study documents local frontend and backend tests plus browser checks for cross-tab updates, save feedback and Undo. The links below show the implementation and recorded validation.',
        evidence: [
          { label: 'Case study & validation', href: 'https://github.com/sing198/co-board/blob/main/docs/portfolio-case-study.md' },
          { label: 'WebSocket mutation handler', href: 'https://github.com/sing198/co-board/blob/main/backend/client.go' },
        ],
        limits: 'Next: scale beyond one backend instance with Redis Pub/Sub fan-out, add a durable offline queue, and extend field-level conflict checks to merge more edit types.',
      },
      th: {
        role: 'พัฒนาคนเดียวทั้งระบบ: React/TypeScript, Go backend และการซิงค์ผ่าน WebSocket',
        challenge: 'หน้าจอที่อัปเดตทันทีอาจดูเหมือนบันทึกแล้ว ทั้งที่เซิร์ฟเวอร์ปฏิเสธการเปลี่ยนแปลง และการส่งข้อมูลทั้งงานอาจเขียนทับส่วนที่เพื่อนร่วมทีมเพิ่งแก้',
        decisions: [
          { title: 'ยืนยันการบันทึกหลังฐานข้อมูลเขียนสำเร็จ', detail: 'ส่งการเปลี่ยนแปลงพร้อม request ID และจับคู่กับผลตอบกลับจากเซิร์ฟเวอร์ หยุดการแก้ไขเมื่อขาดการเชื่อมต่อ และโหลดข้อมูลจริงใหม่เมื่อการเปลี่ยนแปลงถูกปฏิเสธ' },
          { title: 'ตรวจความขัดแย้งทีละฟิลด์', detail: 'ส่งเฉพาะฟิลด์ที่เปลี่ยนพร้อมค่าก่อนแก้ เก็บการแก้ไขคนละฟิลด์ไว้ด้วยกัน และปฏิเสธการเขียนทับฟิลด์เดียวกันจากข้อมูลเก่า' },
        ],
        outcome: 'Case study ใน repo บันทึกการทดสอบ Front-end, Back-end และการตรวจในเบราว์เซอร์เรื่องซิงค์ข้ามแท็บ สถานะการบันทึก และ Undo ลิงก์ด้านล่างใช้ตรวจดูโค้ดและหลักฐานที่บันทึกไว้ได้',
        evidence: [
          { label: 'Case study และการตรวจสอบ', href: 'https://github.com/sing198/co-board/blob/main/docs/portfolio-case-study.md' },
          { label: 'โค้ดจัดการการเปลี่ยนแปลงผ่าน WebSocket', href: 'https://github.com/sing198/co-board/blob/main/backend/client.go' },
        ],
        limits: 'ขั้นต่อไป: ขยายเกิน backend หนึ่ง instance ด้วย Redis Pub/Sub เพิ่มคิวออฟไลน์ที่คงอยู่ถาวร และขยายการตรวจความขัดแย้งทีละฟิลด์ให้ merge ได้หลายรูปแบบ',
      },
    },
  },
  land: {
    gallery: [
      { src: '/screenshots/land/Admin_Home_Right.webp', label: { en: 'Admin', th: 'ผู้ดูแลระบบ' }, width: 1600, height: 788 },
      { src: '/screenshots/land/Land Reform Officer_Home_Right.webp', label: { en: 'Land Reform Officer', th: 'เจ้าหน้าที่ปฏิรูปที่ดิน' }, width: 1600, height: 784 },
      { src: '/screenshots/land/Legal Officer Home_Right.webp', label: { en: 'Administrative Officer', th: 'เจ้าหน้าที่งานธุรการ' }, width: 1600, height: 789 },
    ],
    caseStudy: {
      en: {
        challenge: 'Replace fragile paper-based records across 14 alleys (Soi 0–13 in Thaiburi & Hua Taphan) with a centralized GIS platform for Walailak University and ALRO (ส.ป.ก.) to eliminate data loss and manual search delays.',
        decisions: [
          { title: 'Role-based access control across 4 user groups', detail: 'Defined tailored permissions for Citizens (public search), Land Reform Officers (deeds & parcels), Administrative Officers (full CRUD, audit history, uploads), and System Admins.' },
          { title: 'Interactive GIS map & coordinate picker', detail: 'Built reusable Leaflet map components with satellite/road layer switching, parcel status color coding, and visual coordinate selection for parcel registration.' },
          { title: 'Relational data modeling with audit history', detail: 'Modeled 17 relational tables in MariaDB to manage citizen-heir relationships, land-use classifications (rubber, orchards, livestock), file attachments, and complete edit logs.' },
        ],
        outcome: 'Delivered a responsive web application that speeds up parcel lookups to under 5 seconds, centralizes SPK 4-01 deeds and housing photos, and provides clear analytics on community land usage and encroachment.',
        evidence: [
          { label: 'GIS map component', href: 'https://github.com/sing198/land/blob/master/frontend/src/components/map/GisMap.vue' },
          { label: 'Coordinate picker', href: 'https://github.com/sing198/land/blob/master/frontend/src/components/map/CoordinatePickerModal.vue' },
          { label: 'Setup & project scope', href: 'https://github.com/sing198/land#readme' },
        ],
      },
      th: {
        challenge: 'เปลี่ยนระบบบันทึกเอกสารกระดาษดั้งเดิมในพื้นที่ชุมชนสาธิต 14 ซอย (ต.ไทยบุรี และ ต.หัวตะพาน) ให้เป็นระบบดิจิทัลรวมศูนย์ เพื่อช่วย ม.วลัยลักษณ์ และ ส.ป.ก. แก้ปัญหาข้อมูลสูญหาย ทับซ้อน และค้นหาล่าช้า',
        decisions: [
          { title: 'กำหนดสิทธิ์ตามบทบาท 4 กลุ่มผู้ใช้ (RBAC)', detail: 'แบ่งสิทธิ์การใช้งานชัดเจนสำหรับ ราษฎร (สืบค้นทั่วไป), เจ้าหน้าที่โครงการปฏิรูปที่ดิน (ดูแปลงและดาวน์โหลดโฉนด), เจ้าหน้าที่งานธุรการ (จัดการข้อมูลเต็มรูปแบบและดูประวัติการแก้ไข) และผู้ดูแลระบบ' },
          { title: 'แผนที่ GIS แบบโต้ตอบพร้อมเครื่องมือเลือกพิกัด', detail: 'ใช้ Leaflet แสดงแผนที่แปลงที่ดิน แยกสีตามสถานะ สลับชั้นดาวเทียม/ถนน และให้เจ้าหน้าที่คลิกหรือลากหมุดบนแผนที่เพื่อระบุพิกัด Lat/Long เข้าฟอร์มได้ทันที' },
          { title: 'ออกแบบฐานข้อมูลเชิงสัมพันธ์พร้อมประวัติการแก้ไข (Audit Trail)', detail: 'จัดโครงสร้าง 17 ตารางใน MariaDB เชื่อมโยงข้อมูลแปลงที่ดิน ราษฎร-ทายาท ประเภทการใช้ประโยชน์ (ยางพารา สวนผลไม้ ปศุสัตว์) เอกสารแนบ และบันทึกประวัติการเปลี่ยนแปลงทุกรายการ' },
        ],
        outcome: 'ส่งมอบเว็บแอปพลิเคชันที่สืบค้นข้อมูลแปลงได้ภายใน 5 วินาที จัดเก็บไฟล์โฉนด ส.ป.ก. 4-01 และภาพถ่ายที่อยู่อาศัยเป็นระบบ พร้อมแดชบอร์ดสรุปสถิติและรายงานเพื่อส่งต่อให้ ส.ป.ก.',
        evidence: [
          { label: 'คอมโพเนนต์แผนที่ GIS', href: 'https://github.com/sing198/land/blob/master/frontend/src/components/map/GisMap.vue' },
          { label: 'ตัวเลือกพิกัด', href: 'https://github.com/sing198/land/blob/master/frontend/src/components/map/CoordinatePickerModal.vue' },
          { label: 'วิธีติดตั้งและขอบเขตโปรเจกต์', href: 'https://github.com/sing198/land#readme' },
        ],
      },
    },
  },
}

export function getProjectDetails(project, lang) {
  const details = projectDetails[project.repo]
  if (!details) return project
  const experience = getProjectExperience(project.repo, lang)
  return {
    ...project,
    walkthrough: experience?.walkthrough,
    gallery: details.gallery.map(slide => ({ ...slide, label: slide.label[lang] })),
    caseStudy: { ...details.caseStudy[lang], architecture: experience?.architecture },
  }
}
