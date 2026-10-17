import { getProjectExperience } from './projectExperiences'

const projectDetails = {
  OMS: {
    gallery: [
      { src: '/screenshots/dgkeys.png', label: { en: 'Storefront', th: 'หน้าร้าน' }, width: 1192, height: 946 },
    ],
    caseStudy: {
      en: {
        challenge: 'Keep checkout consistent when multiple customers order the same stock.',
        decisions: [
          { title: 'Reserve stock in one transaction', detail: 'Combine duplicate cart items, lock product rows in ID order, and reserve stock within one database transaction.' },
          { title: 'Check current account permissions', detail: 'Read account status and roles from the database on authenticated requests, so bans and role changes apply to existing sessions.' },
        ],
        outcome: 'The repository includes SQL mock regression tests for invalid quantities, unavailable stock, failed writes or commits, and account permissions. These are inspectable tests; they do not establish real concurrent PostgreSQL behavior.',
        evidence: [
          { label: 'Checkout implementation', href: 'https://github.com/sing198/OMS/blob/main/oms-backend/orders.go' },
          { label: 'Regression tests', href: 'https://github.com/sing198/OMS/blob/main/oms-backend/security_test.go' },
        ],
        limits: 'Checkout creates a pending order. Payment confirmation and key delivery are manual; abandoned stock reservations still need follow-up. The storefront screenshot predates the checkout changes.',
      },
      th: {
        challenge: 'ทำให้ข้อมูลคำสั่งซื้อและสต็อกสอดคล้องกัน เมื่อหลายคนสั่งสินค้าพร้อมกัน',
        decisions: [
          { title: 'จองสต็อกภายใน transaction เดียว', detail: 'รวมรายการสินค้าซ้ำ ล็อกแถวสินค้าตามลำดับ ID และจองสต็อกภายใน transaction เดียว' },
          { title: 'ตรวจสิทธิ์บัญชีจากข้อมูลปัจจุบัน', detail: 'ตรวจสถานะบัญชีและสิทธิ์จากฐานข้อมูลทุกคำขอที่ยืนยันตัวตน เพื่อให้การระงับบัญชีหรือเปลี่ยนสิทธิ์มีผลกับ session ที่ใช้อยู่' },
        ],
        outcome: 'ใน repo มี regression tests ด้วย SQL mock ครอบคลุมจำนวนสินค้าไม่ถูกต้อง สต็อกไม่พอ การบันทึกหรือ commit ล้มเหลว และสิทธิ์บัญชี โดยยังต้องทดสอบการสั่งซื้อพร้อมกันกับ PostgreSQL จริงเพิ่มเติม',
        evidence: [
          { label: 'โค้ด Checkout', href: 'https://github.com/sing198/OMS/blob/main/oms-backend/orders.go' },
          { label: 'Regression tests', href: 'https://github.com/sing198/OMS/blob/main/oms-backend/security_test.go' },
        ],
        limits: 'Checkout สร้างคำสั่งซื้อสถานะ pending ยังตรวจการชำระเงินและส่งคีย์ด้วยคน ส่วนสต็อกที่จองจากคำสั่งซื้อค้างต้องติดตามจัดการ ภาพหน้าร้านถ่ายก่อนการปรับปรุง Checkout',
      },
    },
  },
  'co-board': {
    gallery: [
      { src: '/screenshots/co-board.png', label: { en: 'Workspace', th: 'พื้นที่ทำงาน' }, width: 1274, height: 952 },
      { src: '/screenshots/co-board/board.png', label: { en: 'Kanban', th: 'Kanban' }, width: 1057, height: 1588 },
      { src: '/screenshots/co-board/board-list.png', label: { en: 'Table', th: 'ตาราง' }, width: 1280, height: 800 },
      { src: '/screenshots/co-board/board-calendar.png', label: { en: 'Calendar', th: 'ปฏิทิน' }, width: 1274, height: 1360 },
      { src: '/screenshots/co-board/board-timeline.png', label: { en: 'Timeline', th: 'Timeline' }, width: 1274, height: 910 },
      { src: '/screenshots/co-board/board-mindmap.png', label: { en: 'Mind Map', th: 'Mind Map' }, width: 1274, height: 939 },
      { src: '/screenshots/co-board/board-sprint.png', label: { en: 'Sprint', th: 'Sprint' }, width: 1057, height: 1379 },
    ],
    caseStudy: {
      en: {
        role: 'Full-stack project developed with AI assistance.',
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
        limits: 'The current validated setup uses one backend instance. There is no durable offline queue, and field conflict checks do not provide general merging for every type of edit.',
      },
      th: {
        role: 'โปรเจกต์ Full-stack ที่พัฒนาโดยใช้ AI สนับสนุน',
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
        limits: 'รูปแบบที่ตรวจสอบไว้ใช้ Back-end หนึ่ง instance ยังไม่มีคิวบันทึกงานแบบออฟไลน์ที่คงอยู่ถาวร และการตรวจความขัดแย้งทีละฟิลด์ยังไม่ครอบคลุมการแก้ไขทุกรูปแบบ',
      },
    },
  },
  land: {
    gallery: [
      { src: '/screenshots/land/Admin_Home_Right.png', label: { en: 'Admin', th: 'ผู้ดูแลระบบ' }, width: 2856, height: 1406 },
      { src: '/screenshots/land/Land Reform Officer_Home_Right.png', label: { en: 'Land officer', th: 'เจ้าหน้าที่ที่ดิน' }, width: 2864, height: 1404 },
      { src: '/screenshots/land/Legal Officer Home_Right.png', label: { en: 'Legal officer', th: 'นิติกร' }, width: 2854, height: 1408 },
    ],
    caseStudy: {
      en: {
        challenge: 'Connect parcel locations with community land records through a map, search, and officer workflows.',
        decisions: [
          { title: 'Make the map reusable', detail: 'Use a reusable Leaflet map with land-use colors, parcel detail links, and road or satellite layers.' },
          { title: 'Choose coordinates visually', detail: 'Let officers choose coordinates by clicking the map or dragging a marker, then return the selection to the parcel form.' },
        ],
        outcome: 'Inspect the map component, coordinate picker, and role-aware routes in the source. The README includes setup steps and mock accounts for a local walkthrough.',
        evidence: [
          { label: 'GIS map component', href: 'https://github.com/sing198/land/blob/master/frontend/src/components/map/GisMap.vue' },
          { label: 'Coordinate picker', href: 'https://github.com/sing198/land/blob/master/frontend/src/components/map/CoordinatePickerModal.vue' },
          { label: 'Setup & project scope', href: 'https://github.com/sing198/land#readme' },
        ],
      },
      th: {
        challenge: 'เชื่อมตำแหน่งแปลงที่ดินกับข้อมูลชุมชน ผ่านแผนที่ การค้นหา และหน้าจอทำงานของเจ้าหน้าที่',
        decisions: [
          { title: 'ใช้แผนที่ร่วมกันในหลายหน้าจอ', detail: 'ใช้คอมโพเนนต์แผนที่ Leaflet ร่วมกัน แยกสีตามการใช้ประโยชน์ เชื่อมไปยังรายละเอียดแปลง และสลับแผนที่ถนนหรือดาวเทียม' },
          { title: 'เลือกพิกัดผ่านแผนที่', detail: 'ให้เจ้าหน้าที่เลือกพิกัดด้วยการคลิกแผนที่หรือลากหมุด แล้วส่งพิกัดกลับไปยังฟอร์มแปลงที่ดิน' },
        ],
        outcome: 'ดูคอมโพเนนต์แผนที่ ตัวเลือกพิกัด และ routes ที่กำหนดระดับสิทธิ์ใน source โดย README มีขั้นตอนติดตั้งและบัญชีจำลองสำหรับลองระบบในเครื่อง',
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
