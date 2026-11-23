import { getProjectExperience } from './projectExperiences'

const projectDetails = {
  'bangkok-commute-map': {
    gallery: [
      { src: '/screenshots/bangkok-commute-map/demo.mp4', poster: '/screenshots/bangkok-commute-map.webp', video: true, label: { en: '25s Interactive Demo', th: 'เดโมการใช้งานจริง 25 วินาที' }, width: 1024, height: 704 },
      { src: '/screenshots/bangkok-commute-map.webp', label: { en: 'Commute Zones & Redis HIT', th: 'โซนเวลาเดินทางและ Redis HIT' }, width: 1024, height: 640 },
      { src: '/screenshots/bangkok-commute-map/compare.webp', label: { en: '3-Location True-Cost Comparison', th: 'เปรียบเทียบค่าครองชีพรวม 3 ทำเล' }, width: 1024, height: 640 },
    ],
    caseStudy: {
      en: {
        role: 'Solo full-stack developer: Go/Gin API, PostGIS spatial schema, Dijkstra transit engine, Upstash Redis cache, React/TypeScript + Leaflet UI.',
        challenge: 'Straight-line radius search fails in Bangkok because real commute times and monthly costs depend on BTS/MRT/ARL connectivity, interchange penalties, separate-operator fares, BTS extension surcharges, and first/last-mile access.',
        decisions: [
          { title: 'Combine PostGIS GIST spatial indexing with an in-memory Go transit graph', detail: 'Use PostGIS KNN (<->) on GEOGRAPHY(Point, 4326) to locate the 3 nearest stations to any office pin and ST_DWithin to filter listings in real meters, paired with a Go Dijkstra engine across 79 stations and 166 directed edges modeling Thai fare rules and transfer penalties (+3 min same-operator at Siam/Tao Poon, +6–7 min cross-system with separate tickets).' },
          { title: 'Rank and compare locations by True Monthly Cost', detail: 'Compute rent + round-trip rail fare + motorcycle taxi feeder cost (when beyond max walk distance) across configurable office days (e.g. 12-day hybrid vs 22-day full-time), plus monthly commute hours for 2–3 side-by-side locations.' },
          { title: 'Region-pinned Upstash Redis caching with coordinate quantization', detail: 'Round office coordinates to ~100m precision to increase hit rate, pin Vercel Functions to Singapore (sin1) beside Supabase PostGIS & Upstash Redis (cutting latency from ~2.2s cross-region to ~11–25 ms on HIT), expose X-Cache and X-Query-Time-Ms in the UI, and degrade cleanly when Redis is unavailable.' },
        ],
        outcome: 'Deployed live on Vercel Services (sin1 Singapore: React Vite UI + Go/Gin API) backed by Supabase PostGIS (79 stations, 183 real Bangkok condos & apartments from OpenStreetMap + curated landmarks, free OSM office place search) and Upstash Redis (~11–25 ms cache HIT vs ~27–53 ms PostGIS MISS). GitHub Actions CI runs transit fare/transfer unit tests plus real PostGIS & Redis integration tests with race detection and seed idempotency verification.',
        evidence: [
          { label: 'PostGIS & Redis CI in GitHub Actions', href: 'https://github.com/sing198/bangkok-commute-map/actions' },
          { label: 'Dijkstra routing & Thai fare engine (Go)', href: 'https://github.com/sing198/bangkok-commute-map/blob/main/backend/internal/transit/graph.go' },
          { label: 'PostGIS KNN & ST_DWithin spatial queries', href: 'https://github.com/sing198/bangkok-commute-map/blob/main/backend/internal/commute/repository.go' },
          { label: 'Transit fare & transfer unit tests', href: 'https://github.com/sing198/bangkok-commute-map/blob/main/backend/internal/transit/graph_test.go' },
          { label: 'PostGIS & Redis integration tests', href: 'https://github.com/sing198/bangkok-commute-map/blob/main/backend/internal/commute/service_integration_test.go' },
        ],
        limits: 'Building names and coordinates come from OpenStreetMap and curated Bangkok landmarks, while monthly rents are market-reference estimates for demo stability. A next step is integrating live rental listing feeds.',
      },
      th: {
        role: 'พัฒนาคนเดียวทั้งระบบ: Go/Gin API, PostGIS Spatial DB, กราฟ Dijkstra คำนวณเส้นทางรถไฟฟ้า, Upstash Redis Cache และ React/TypeScript + Leaflet',
        challenge: 'การค้นหาที่พักในกรุงเทพฯ แบบรัศมีวงกลมไม่ตรงกับความจริง เพราะเวลาและค่าใช้จ่ายขึ้นอยู่กับโครงข่าย BTS/MRT/ARL จุดเปลี่ยนสาย ค่าโดยสารแยกค่าย ส่วนต่อขยาย และระยะเดินถึงสถานี',
        decisions: [
          { title: 'ผสาน PostGIS GIST Index เข้ากับ Transit Graph (Dijkstra) ใน Go', detail: 'ใช้ PostGIS KNN (<->) บน GEOGRAPHY(Point, 4326) หาสถานีใกล้ออฟฟิศ 3 แห่งแรก และ ST_DWithin กรองที่พักเป็นเมตรจริง ร่วมกับ Dijkstra ใน Go บน 79 สถานี 166 เส้นเชื่อมที่คิดเวลาเปลี่ยนสาย (+3 นาทีในค่ายเดียวที่สยาม/เตาปูน, +6–7 นาทีข้ามค่ายพร้อมคิดค่าโดยสารแยกใบ) และส่วนต่อขยาย BTS (+15฿ cap 62฿)' },
          { title: 'จัดอันดับและเปรียบเทียบด้วย “ค่าครองชีพรวมจริงต่อเดือน”', detail: 'คำนวณค่าเช่า + ค่ารถไฟฟ้าไป-กลับ + ค่าวินมอเตอร์ไซค์อัตโนมัติเมื่อเกินระยะเดิน ตามจำนวนวันเข้าออฟฟิศ (เช่น Hybrid 12 วัน หรือ 22 วัน) พร้อมหน้าเทียบ 2–3 ทำเลข้างกันให้เห็นส่วนต่างเงินและชั่วโมงเดินทางต่อเดือน' },
          { title: 'แคชด้วย Upstash Redis แบบ Coordinate Quantization + ปักหมุด Region sin1', detail: 'ปัดพิกัดออฟฟิศความละเอียด ~100 เมตรเพื่อเพิ่ม Cache Hit Rate ปักหมุด Vercel Functions ไว้ที่สิงคโปร์ (sin1) คู่กับ Supabase PostGIS และ Upstash Redis ลดเวลาตอบกลับจาก ~2.2 วิ เหลือ ~11–25 ms เมื่อ HIT พร้อมแสดง header X-Cache บนหน้าจอและ fallback สู่ PostGIS ได้โดยไม่ล่ม' },
        ],
        outcome: 'Deploy ใช้งานจริงบน Vercel Services (sin1 สิงคโปร์: React UI + Go/Gin API) เชื่อมต่อ Supabase PostGIS (79 สถานี, 183 คอนโดและอพาร์ตเมนต์จริงใน กทม. จาก OpenStreetMap + ชุด Curated พร้อมช่องค้นหาสถานที่ด้วย OSM ฟรี) และ Upstash Redis (HIT ~11–25 ms / PostGIS MISS ~27–53 ms) พร้อม GitHub Actions CI ที่รัน Unit Test กฎค่าโดยสาร/จุดเปลี่ยนสาย และ Integration Test บน PostGIS + Redis จริงพร้อม -race',
        evidence: [
          { label: 'ผลทดสอบ PostGIS & Redis บน GitHub Actions', href: 'https://github.com/sing198/bangkok-commute-map/actions' },
          { label: 'โค้ด Dijkstra และสูตรค่าโดยสาร BTS/MRT/ARL', href: 'https://github.com/sing198/bangkok-commute-map/blob/main/backend/internal/transit/graph.go' },
          { label: 'โค้ด PostGIS KNN และ ST_DWithin', href: 'https://github.com/sing198/bangkok-commute-map/blob/main/backend/internal/commute/repository.go' },
          { label: 'Unit Tests สูตรค่าโดยสารและจุดเปลี่ยนสาย', href: 'https://github.com/sing198/bangkok-commute-map/blob/main/backend/internal/transit/graph_test.go' },
          { label: 'Integration Tests บน PostGIS และ Redis', href: 'https://github.com/sing198/bangkok-commute-map/blob/main/backend/internal/commute/service_integration_test.go' },
        ],
        limits: 'ชื่อและพิกัดอาคารเป็นข้อมูลจริงจาก OpenStreetMap และคอนโดหลักใน กทม. ส่วนราคาเช่าเป็นค่าประเมินอ้างอิงตลาดเพื่อให้เดโมเสถียร ขั้นต่อไปสามารถเชื่อมต่อแหล่งประกาศเช่าห้องจริงเพิ่มเติมได้',
      },
    },
  },
  OMS: {
    gallery: [
      { src: '/screenshots/dgkeys.webp', label: { en: 'Storefront', th: 'หน้าร้าน' }, width: 1192, height: 946 },
    ],
    caseStudy: {
      en: {
        challenge: 'Keep stock and key delivery consistent when buyers compete for the same item, the payment webhook retries, or a reservation expires.',
        decisions: [
          { title: 'Reserve stock in one transaction', detail: 'Combine duplicate cart items, lock product rows in ID order, and reserve stock within one database transaction.' },
          { title: 'Record payment and deliver keys together', detail: 'Verify the signed sandbox event and the order total, then save the event and demo keys in one transaction. Payment and expiry lock the same order row so a late event cannot issue keys after the stock is released.' },
          { title: 'Check current account permissions', detail: 'Read account status and roles from the database on authenticated requests, so bans and role changes apply to existing sessions.' },
        ],
        outcome: 'PostgreSQL 16 tests passed locally and in GitHub Actions. One of 50 concurrent buyers reserved the last key. Three deliveries of the same signed webhook preserved the keys and stock. When payment arrived after the deadline, the reservation released stock once and no keys were issued.',
        evidence: [
          { label: 'PostgreSQL results in GitHub Actions', href: 'https://github.com/sing198/OMS/actions/runs/44230022330/job/134552486500' },
          { label: 'Checkout and reservation expiry', href: 'https://github.com/sing198/OMS/blob/36ca44d76495bc65880dbaceec342784f024a51c/oms-backend/orders.go' },
          { label: 'Signed webhook and key delivery', href: 'https://github.com/sing198/OMS/blob/36ca44d76495bc65880dbaceec342784f024a51c/oms-backend/payments.go' },
          { label: 'PostgreSQL checkout tests', href: 'https://github.com/sing198/OMS/blob/36ca44d76495bc65880dbaceec342784f024a51c/oms-backend/checkout_integration_test.go' },
          { label: 'PostgreSQL payment tests', href: 'https://github.com/sing198/OMS/blob/36ca44d76495bc65880dbaceec342784f024a51c/oms-backend/payment_integration_test.go' },
        ],
        limits: 'The local sandbox uses simulated payments and generated demo keys. A next step is integrating a payment provider and handling refunds.',
      },
      th: {
        challenge: 'รักษาความถูกต้องของสต็อกและการส่งคีย์ เมื่อหลายคนแย่งซื้อสินค้าชิ้นเดียวกัน เมื่อ webhook ส่งซ้ำ หรือเมื่อหมดเวลาจอง',
        decisions: [
          { title: 'จองสต็อกภายใน transaction เดียว', detail: 'รวมรายการสินค้าซ้ำ ล็อกแถวสินค้าตามลำดับ ID และจองสต็อกภายใน transaction เดียว' },
          { title: 'บันทึกผลชำระเงินพร้อมส่งคีย์', detail: 'ตรวจลายเซ็นของ event จำลองและยอดคำสั่งซื้อก่อนบันทึก event กับคีย์ทดสอบใน transaction เดียว การชำระเงินและงานคืนสต็อกล็อกแถวคำสั่งซื้อเดียวกัน จึงไม่ออกคีย์จาก event ที่มาหลังคืนสต็อก' },
          { title: 'ตรวจสิทธิ์บัญชีจากข้อมูลปัจจุบัน', detail: 'ตรวจสถานะบัญชีและสิทธิ์จากฐานข้อมูลทุกคำขอที่ยืนยันตัวตน เพื่อให้การระงับบัญชีหรือเปลี่ยนสิทธิ์มีผลกับ session ที่ใช้อยู่' },
        ],
        outcome: 'เทสต์ PostgreSQL 16 ผ่านทั้งในเครื่องและ GitHub Actions ผู้ซื้อ 50 คนแย่งคีย์สุดท้ายแล้วจองได้คนเดียว ส่ง webhook เดิม 3 ครั้งแล้วคีย์กับสต็อกไม่เปลี่ยน เมื่อผลชำระเงินมาหลังหมดเวลาจอง ระบบคืนสต็อกครั้งเดียวและไม่ออกคีย์',
        evidence: [
          { label: 'ผลทดสอบ PostgreSQL ใน GitHub Actions', href: 'https://github.com/sing198/OMS/actions/runs/44230022330/job/134552486500' },
          { label: 'โค้ด Checkout และการคืนสต็อก', href: 'https://github.com/sing198/OMS/blob/36ca44d76495bc65880dbaceec342784f024a51c/oms-backend/orders.go' },
          { label: 'โค้ดตรวจลายเซ็น webhook และส่งคีย์', href: 'https://github.com/sing198/OMS/blob/36ca44d76495bc65880dbaceec342784f024a51c/oms-backend/payments.go' },
          { label: 'เทสต์ Checkout บน PostgreSQL', href: 'https://github.com/sing198/OMS/blob/36ca44d76495bc65880dbaceec342784f024a51c/oms-backend/checkout_integration_test.go' },
          { label: 'เทสต์ชำระเงินบน PostgreSQL', href: 'https://github.com/sing198/OMS/blob/36ca44d76495bc65880dbaceec342784f024a51c/oms-backend/payment_integration_test.go' },
        ],
        limits: 'เดโมในเครื่องใช้การชำระเงินจำลองและคีย์ทดสอบ ขั้นต่อไปคือเชื่อมผู้ให้บริการชำระเงินและรองรับการคืนเงิน',
      },
    },
  },
  'co-board': {
    gallery: [
      { src: '/screenshots/co-board/realtime-sync.mp4', poster: '/screenshots/co-board.webp', video: true, label: { en: 'Real-time sync (2 tabs)', th: 'ซิงค์แบบเรียลไทม์ (2 แท็บ)' }, width: 1280, height: 776 },
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
        outcome: 'Delivered a responsive web application that speeds up parcel lookups to under 5 seconds and centralizes SPK 4-01 deeds and housing photos. The dashboard shows land use and encroachment statistics, with Excel and CSV export.',
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
        outcome: 'ส่งมอบเว็บแอปที่ค้นหาข้อมูลแปลงได้ภายใน 5 วินาที และรวมเอกสาร ส.ป.ก. 4-01 กับภาพถ่ายที่อยู่อาศัยไว้ในระบบเดียว แดชบอร์ดสรุปสถิติการใช้ที่ดินและการบุกรุก พร้อมส่งออกรายงานเป็น Excel และ CSV เพื่อส่งต่อให้ ส.ป.ก.',
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
