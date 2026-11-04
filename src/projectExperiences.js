const experiences = {
  OMS: {
    en: {
      walkthrough: {
        intro: 'Explore the storefront from finding a game to reviewing a cart.',
        steps: [
          {
            id: 'discover',
            title: 'Find a game',
            instruction: 'Search for a title in “Search games…” or choose Steam, Epic Games or Origin.',
            expectation: 'The catalog changes to match the search and selected platform.',
            imageSrc: '/screenshots/dgkeys.webp',
            imageLabel: 'DGKeys storefront and platform filters',
          },
          {
            id: 'inspect',
            title: 'Inspect the details',
            instruction: 'Open a game card and compare its description, price, discount and available stock.',
            expectation: 'A product page brings the information needed to choose a game into one place.',
            imageSrc: '/screenshots/dgkeys/product-details.webp',
            imageLabel: 'DGKeys product details',
          },
          {
            id: 'cart',
            title: 'Review your cart',
            instruction: 'Choose “Add to cart”, open the cart and use + / − to change the quantity. Remove the test item when finished.',
            expectation: 'The item count and estimated total update with the quantity. You can complete this walkthrough without placing an order.',
            imageSrc: '/screenshots/dgkeys/cart.webp',
            imageLabel: 'DGKeys cart and quantity controls',
          },
        ],
        note: 'The cart is kept in this browser. The repository README explains how to run the API and database for a complete local demo.',
      },
      architecture: {
        intro: 'The browser presents the store; the API owns account checks, pricing and stock reservation.',
        nodes: [
          { id: 'browser', label: 'Storefront', technology: 'React · Vite', description: 'Loads products over HTTP and keeps the browsing cart in localStorage. Checkout sends product IDs and quantities to the API; the browser does not decide the final order price.' },
          { id: 'api', label: 'Commerce API', technology: 'Go · Gin · GORM', description: 'Authenticates requests, reads current account roles and status, validates quantities and prices the order. It locks product rows in ID order before reserving stock.' },
          { id: 'database', label: 'Order & stock data', technology: 'PostgreSQL', description: 'Stores accounts, products and orders. Stock updates and the new pending order share one transaction so failed writes or a failed commit do not become a successful checkout response.' },
        ],
        connections: [
          { from: 'browser', to: 'api', label: 'HTTP requests · JWT for account actions' },
          { from: 'api', to: 'database', label: 'GORM queries · checkout transaction' },
        ],
        note: 'Checkout reserves stock and creates a pending order. Payment confirmation and key delivery are currently manual.',
        evidence: [
          { label: 'Frontend product & cart flow', href: 'https://github.com/sing198/OMS/blob/main/oms-frontend/src/pages/Cart.jsx' },
          { label: 'Checkout transaction', href: 'https://github.com/sing198/OMS/blob/main/oms-backend/orders.go' },
          { label: 'API & account checks', href: 'https://github.com/sing198/OMS/blob/main/oms-backend/main.go' },
        ],
      },
    },
    th: {
      walkthrough: {
        intro: 'ลองหน้าร้านตั้งแต่ค้นหาเกม ไปจนถึงตรวจรายการในตะกร้า',
        steps: [
          {
            id: 'discover',
            title: 'ค้นหาเกมที่สนใจ',
            instruction: 'ค้นหาชื่อเกมใน “Search games…” หรือเลือกแพลตฟอร์ม Steam, Epic Games หรือ Origin',
            expectation: 'รายการเกมเปลี่ยนตามคำค้นและแพลตฟอร์มที่เลือก',
            imageSrc: '/screenshots/dgkeys.webp',
            imageLabel: 'หน้าร้าน DGKeys และตัวกรองแพลตฟอร์ม',
          },
          {
            id: 'inspect',
            title: 'ดูข้อมูลก่อนเลือก',
            instruction: 'เปิดการ์ดเกม แล้วดูคำอธิบาย ราคา ส่วนลด และจำนวนสินค้าที่เหลือ',
            expectation: 'หน้ารายละเอียดรวมข้อมูลที่ใช้ตัดสินใจเลือกเกมไว้ในที่เดียว',
            imageSrc: '/screenshots/dgkeys/product-details.webp',
            imageLabel: 'หน้ารายละเอียดสินค้า DGKeys',
          },
          {
            id: 'cart',
            title: 'ตรวจรายการในตะกร้า',
            instruction: 'กด “เพิ่มลงตะกร้า” เปิดตะกร้า แล้วใช้ + / − เปลี่ยนจำนวน เมื่อลองเสร็จให้ลบรายการทดลอง',
            expectation: 'จำนวนสินค้าและยอดรวมเปลี่ยนตามที่เลือก ลองขั้นตอนนี้จบได้โดยไม่ต้องสร้างคำสั่งซื้อ',
            imageSrc: '/screenshots/dgkeys/cart.webp',
            imageLabel: 'ตะกร้า DGKeys และปุ่มเปลี่ยนจำนวน',
          },
        ],
        note: 'ตะกร้าเก็บอยู่ในเบราว์เซอร์นี้ README ใน repo มีวิธีรัน API และฐานข้อมูลสำหรับลองระบบในเครื่อง',
      },
      architecture: {
        intro: 'เบราว์เซอร์แสดงหน้าร้าน ส่วน API ตรวจบัญชี คำนวณราคา และจองสต็อก',
        nodes: [
          { id: 'browser', label: 'หน้าร้าน', technology: 'React · Vite', description: 'โหลดสินค้าผ่าน HTTP และเก็บตะกร้าใน localStorage เมื่อ Checkout จะส่ง ID สินค้าและจำนวนไปให้ API โดยไม่ได้ใช้ราคาจากเบราว์เซอร์เป็นราคาสุดท้ายของคำสั่งซื้อ' },
          { id: 'api', label: 'API ร้านค้า', technology: 'Go · Gin · GORM', description: 'ยืนยันตัวตน ตรวจสิทธิ์และสถานะบัญชีปัจจุบัน ตรวจจำนวน และคำนวณราคาคำสั่งซื้อ ล็อกแถวสินค้าตามลำดับ ID ก่อนจองสต็อก' },
          { id: 'database', label: 'ข้อมูลคำสั่งซื้อและสต็อก', technology: 'PostgreSQL', description: 'เก็บบัญชี สินค้า และคำสั่งซื้อ การปรับสต็อกกับการสร้างคำสั่งซื้อ pending อยู่ใน transaction เดียว หากบันทึกหรือ commit ล้มเหลว API จะไม่ตอบว่าคำสั่งซื้อสำเร็จ' },
        ],
        connections: [
          { from: 'browser', to: 'api', label: 'HTTP · ใช้ JWT เมื่อต้องตรวจบัญชี' },
          { from: 'api', to: 'database', label: 'GORM · transaction สำหรับ Checkout' },
        ],
        note: 'Checkout จองสต็อกและสร้างคำสั่งซื้อ pending ปัจจุบันยังยืนยันการชำระเงินและส่งคีย์ด้วยคน',
        evidence: [
          { label: 'โค้ดตะกร้าและสินค้า', href: 'https://github.com/sing198/OMS/blob/main/oms-frontend/src/pages/Cart.jsx' },
          { label: 'Transaction ของ Checkout', href: 'https://github.com/sing198/OMS/blob/main/oms-backend/orders.go' },
          { label: 'API และการตรวจบัญชี', href: 'https://github.com/sing198/OMS/blob/main/oms-backend/main.go' },
        ],
      },
    },
  },
  'co-board': {
    en: {
      walkthrough: {
        intro: 'Try creating work, changing its view and seeing an update across two tabs.',
        steps: [
          {
            id: 'create',
            title: 'Create your first task',
            instruction: 'Choose “Try a demo — no sign-up” to open your own sample board. Use “New task” to add a task named “Portfolio test”.',
            expectation: 'A separate guest board opens with sample tasks, and your new task appears alongside them.',
            imageSrc: '/screenshots/co-board/board.webp',
            imageLabel: 'co-board Kanban board and New task control',
          },
          {
            id: 'view',
            title: 'See the same work differently',
            instruction: 'Choose “Table” above the board and find “Portfolio test”. Try its status selector, then return to “Kanban”.',
            expectation: 'The table and Kanban show the same task. Changing status in the table moves it to the matching Kanban column.',
            imageSrc: '/screenshots/co-board/board-list.webp',
            imageLabel: 'co-board Table view with per-task status controls',
          },
          {
            id: 'sync',
            title: 'Watch an update across tabs',
            instruction: 'Open the same board URL in a second tab. In the first tab, move the test task to another column while both tabs are connected.',
            expectation: 'The move appears in the second tab without refreshing. On the current source version, save feedback follows the server confirmation.',
            imageSrc: '/screenshots/co-board/board.webp',
            imageLabel: 'co-board Kanban board: connected tabs share task updates',
          },
        ],
        note: 'These steps match the current repository. Guest boards are for temporary testing; the README includes local setup if the hosted backend is unavailable.',
      },
      architecture: {
        intro: 'Follow a task move from the browser to storage and back to connected teammates.',
        nodes: [
          { id: 'browser', label: 'Connected boards', technology: 'React · TypeScript', description: 'Loads board state over HTTP and sends mutations over WebSocket with request IDs. It displays an optimistic update, then matches server events to confirm the save or reloads authoritative state after rejection.' },
          { id: 'api', label: 'Board server', technology: 'Go · Gin · WebSocket', description: 'Checks board permissions, validates the event and writes through GORM. After a successful write, the hub broadcasts the event to clients in the board room. Field patches can reject stale edits to the same field.' },
          { id: 'database', label: 'Persistent board data', technology: 'SQLite / PostgreSQL · GORM', description: 'Stores boards, tasks, members, dates and relationships. Configuration selects PostgreSQL or local SQLite; reconnecting clients fetch current database state.' },
          { id: 'redis', label: 'Optional event relay', technology: 'Redis Pub/Sub', description: 'Relays board mutation events between backend instances. It does not store durable task data or make process-local presence and WebSocket tickets work across instances. One backend instance is the currently validated setup.' },
        ],
        connections: [
          { from: 'browser', to: 'api', label: 'HTTP state · WebSocket mutations & confirmations' },
          { from: 'api', to: 'database', label: 'GORM reads & writes' },
          { from: 'api', to: 'redis', label: 'Optional Pub/Sub for board events' },
        ],
        note: 'Redis is optional for one local backend. There is no durable offline queue; reconnect fetches server state, and an uncertain save needs review before retrying.',
        evidence: [
          { label: 'Browser connection & mutations', href: 'https://github.com/sing198/co-board/blob/main/frontend/src/useWebSocket.ts' },
          { label: 'Server validation & writes', href: 'https://github.com/sing198/co-board/blob/main/backend/client.go' },
          { label: 'Board rooms & event relay', href: 'https://github.com/sing198/co-board/blob/main/backend/hub.go' },
        ],
      },
    },
    th: {
      walkthrough: {
        intro: 'ลองสร้างงาน เปลี่ยนมุมมอง และดูการอัปเดตพร้อมกันสองแท็บ',
        steps: [
          {
            id: 'create',
            title: 'สร้างงานแรกของคุณ',
            instruction: 'กด “Try a demo — no sign-up” เพื่อเปิดบอร์ดตัวอย่างของตัวเอง แล้วใช้ “New task” เพิ่มงานชื่อ “Portfolio test”',
            expectation: 'ระบบสร้างบอร์ด Guest แยกพร้อมงานตัวอย่าง และงานใหม่ของคุณจะปรากฏในบอร์ด',
            imageSrc: '/screenshots/co-board/board.webp',
            imageLabel: 'บอร์ด Kanban ของ co-board และปุ่ม New task',
          },
          {
            id: 'view',
            title: 'ดูงานเดียวกันอีกมุม',
            instruction: 'เลือก “Table” ด้านบนบอร์ด แล้วหางาน “Portfolio test” ลองเปลี่ยนสถานะจากตัวเลือกในแถว จากนั้นกลับไป “Kanban”',
            expectation: 'ตารางและ Kanban ใช้ข้อมูลงานเดียวกัน สถานะที่เปลี่ยนในตารางทำให้งานย้ายไปคอลัมน์เดียวกันใน Kanban',
            imageSrc: '/screenshots/co-board/board-list.webp',
            imageLabel: 'มุมมอง Table ของ co-board พร้อมตัวเลือกสถานะงาน',
          },
          {
            id: 'sync',
            title: 'ดูการซิงค์ข้ามแท็บ',
            instruction: 'เปิด URL ของบอร์ดเดิมในแท็บที่สอง แล้วเลื่อนงานทดลองไปอีกคอลัมน์ในแท็บแรก ขณะที่ทั้งสองแท็บเชื่อมต่ออยู่',
            expectation: 'งานย้ายตามในแท็บที่สองโดยไม่ต้องรีเฟรช ใน source ปัจจุบัน สถานะการบันทึกจะอัปเดตหลังเซิร์ฟเวอร์ยืนยัน',
            imageSrc: '/screenshots/co-board/board.webp',
            imageLabel: 'บอร์ด Kanban ของ co-board: แท็บที่เชื่อมต่อรับการเปลี่ยนแปลงงานร่วมกัน',
          },
        ],
        note: 'ขั้นตอนนี้ตรงกับ repo ปัจจุบัน บอร์ด Guest ใช้สำหรับทดลองชั่วคราว หาก Back-end ที่โฮสต์ไม่พร้อมใช้งาน README มีวิธีรันในเครื่อง',
      },
      architecture: {
        intro: 'ตามการย้ายงานจากเบราว์เซอร์ ไปบันทึกข้อมูล แล้วส่งกลับไปยังเพื่อนร่วมทีม',
        nodes: [
          { id: 'browser', label: 'บอร์ดที่เชื่อมต่อ', technology: 'React · TypeScript', description: 'โหลดข้อมูลบอร์ดผ่าน HTTP และส่งการเปลี่ยนแปลงผ่าน WebSocket พร้อม request ID หน้าจออัปเดตทันที แล้วจับคู่ event จากเซิร์ฟเวอร์เพื่อยืนยันการบันทึก หรือโหลดข้อมูลจริงใหม่เมื่อถูกปฏิเสธ' },
          { id: 'api', label: 'เซิร์ฟเวอร์บอร์ด', technology: 'Go · Gin · WebSocket', description: 'ตรวจสิทธิ์ในบอร์ด ตรวจ event และบันทึกผ่าน GORM หลังเขียนสำเร็จ hub จะส่ง event ไปยังคนในห้องบอร์ด การแก้ทีละฟิลด์ช่วยปฏิเสธการเขียนทับฟิลด์เดียวกันจากข้อมูลเก่า' },
          { id: 'database', label: 'ข้อมูลบอร์ดถาวร', technology: 'SQLite / PostgreSQL · GORM', description: 'เก็บบอร์ด งาน สมาชิก วันที่ และความสัมพันธ์ โดยเลือก PostgreSQL หรือ SQLite ในเครื่องตามการตั้งค่า เมื่อเชื่อมต่อใหม่ เบราว์เซอร์จะโหลดสถานะปัจจุบันจากฐานข้อมูล' },
          { id: 'redis', label: 'ตัวส่งต่อ event ทางเลือก', technology: 'Redis Pub/Sub', description: 'ส่งต่อ event การเปลี่ยนแปลงบอร์ดระหว่าง Back-end หลาย instance ไม่ได้เก็บข้อมูลงานถาวร และยังไม่ทำให้ presence กับ WebSocket ticket ที่เก็บใน process ใช้ข้าม instance ได้ รูปแบบที่ตรวจสอบปัจจุบันใช้ Back-end เดียว' },
        ],
        connections: [
          { from: 'browser', to: 'api', label: 'HTTP โหลดข้อมูล · WebSocket ส่งและยืนยันการแก้ไข' },
          { from: 'api', to: 'database', label: 'อ่านและเขียนผ่าน GORM' },
          { from: 'api', to: 'redis', label: 'Pub/Sub สำหรับส่ง event (ทางเลือก)' },
        ],
        note: 'Back-end เดียวในเครื่องไม่จำเป็นต้องใช้ Redis ยังไม่มีคิวออฟไลน์ถาวร เมื่อเชื่อมต่อใหม่จะโหลดข้อมูลจากเซิร์ฟเวอร์ และต้องตรวจผลการบันทึกที่ไม่แน่ชัดก่อนลองส่งซ้ำ',
        evidence: [
          { label: 'การเชื่อมต่อและแก้ข้อมูลฝั่งเบราว์เซอร์', href: 'https://github.com/sing198/co-board/blob/main/frontend/src/useWebSocket.ts' },
          { label: 'การตรวจและบันทึกฝั่งเซิร์ฟเวอร์', href: 'https://github.com/sing198/co-board/blob/main/backend/client.go' },
          { label: 'ห้องบอร์ดและการส่งต่อ event', href: 'https://github.com/sing198/co-board/blob/main/backend/hub.go' },
        ],
      },
    },
  },
  land: {
    en: {
      walkthrough: {
        intro: 'Explore public parcel information through a map, search and satellite view.',
        steps: [
          {
            id: 'map',
            title: 'Explore the map',
            instruction: 'Pan or zoom the map, then click a parcel polygon or marker to open its summary.',
            expectation: 'The popup connects a location with its parcel number and available land information.',
            imageSrc: '/screenshots/land/Admin_Home_Right.webp',
            imageLabel: 'Community Land Management map, shown in an admin session',
          },
          {
            id: 'search',
            title: 'Find a parcel by number',
            instruction: 'Open the public search page and choose a sample parcel such as “SPK-001”, or enter a parcel number.',
            expectation: 'The result brings together the parcel area, location and land use while masking personal identifiers.',
            imageSrc: '/screenshots/land/Legal Officer Home_Right.webp',
            imageLabel: 'Community Land Management workspace, shown in an administrative officer session',
          },
          {
            id: 'layer',
            title: 'Change the map layer',
            instruction: 'Return to the map and choose “ดาวเทียม” (Satellite), then “แผนที่ถนน” (Road map).',
            expectation: 'The background changes between satellite imagery and roads while the parcel overlays remain.',
            imageSrc: '/screenshots/land/Land Reform Officer_Home_Right.webp',
            imageLabel: 'Community Land Management map controls, shown in a land reform officer session',
          },
        ],
        note: 'Map and search routes are public in the current source. Full parcel records require an officer role; local setup and mock accounts are in the README. The images show officer sessions.',
      },
      architecture: {
        intro: 'Parcel records come from the API; Leaflet combines them with an independent base map.',
        nodes: [
          { id: 'browser', label: 'Map & officer workspace', technology: 'Vue 3 · Bulma · Leaflet · Pinia', description: 'Displays parcels as polygons or markers and switches between road and satellite layers. Vue routes and role-based auth support 4 user groups (Citizens, Land Reform Officers, Administrative Officers, and Admin).' },
          { id: 'api', label: 'Land records API', technology: 'Node.js · Express · REST API', description: 'Authenticates officer sessions via JWT, verifies role permissions, and validates input. Services manage transactions across 17 database tables; public search responses mask citizen national IDs.' },
          { id: 'database', label: 'Community records', technology: 'MariaDB (alro_land)', description: 'Relational schema storing parcels across 14 alleys (Soi 0–13), GIS coordinates, citizen-heir relationships, land use (rubber, orchard, livestock), deeds/photos, and audit logs.' },
          { id: 'tiles', label: 'Base map imagery', technology: 'OpenStreetMap · Esri', description: 'Provides road or satellite tiles directly to Leaflet in the browser. These tiles provide geographic context; parcel and community records are served by the project API.' },
        ],
        connections: [
          { from: 'browser', to: 'api', label: 'HTTP API · JWT for officer routes' },
          { from: 'api', to: 'database', label: 'Parameterized SQL queries' },
          { from: 'browser', to: 'tiles', label: 'Road & satellite tile requests' },
        ],
        evidence: [
          { label: 'Map layers & parcel rendering', href: 'https://github.com/sing198/land/blob/master/frontend/src/components/map/GisMap.vue' },
          { label: 'Public & officer routes', href: 'https://github.com/sing198/land/blob/master/frontend/src/router/index.js' },
          { label: 'Backend structure & local setup', href: 'https://github.com/sing198/land#readme' },
        ],
      },
    },
    th: {
      walkthrough: {
        intro: 'ดูข้อมูลแปลงที่ดินผ่านแผนที่ การค้นหา และภาพดาวเทียม',
        steps: [
          {
            id: 'map',
            title: 'สำรวจตำแหน่งบนแผนที่',
            instruction: 'เลื่อนหรือซูมแผนที่ แล้วคลิกพื้นที่แปลงหรือหมุดเพื่อเปิดข้อมูลสรุป',
            expectation: 'Popup เชื่อมตำแหน่งบนแผนที่กับเลขแปลงและข้อมูลที่ดินที่มีอยู่',
            imageSrc: '/screenshots/land/Admin_Home_Right.webp',
            imageLabel: 'แผนที่ Community Land Management ใน session ผู้ดูแลระบบ',
          },
          {
            id: 'search',
            title: 'ค้นหาด้วยเลขแปลง',
            instruction: 'เปิดหน้าสืบค้นสำหรับประชาชน เลือกตัวอย่าง “SPK-001” หรือกรอกเลขแปลงที่ต้องการ',
            expectation: 'ผลค้นหารวมเนื้อที่ ที่ตั้ง และการใช้ประโยชน์ พร้อมปกปิดเลขระบุตัวบุคคล',
            imageSrc: '/screenshots/land/Legal Officer Home_Right.webp',
            imageLabel: 'หน้าระบบ Community Land Management ใน session เจ้าหน้าที่งานธุรการ',
          },
          {
            id: 'layer',
            title: 'เปลี่ยนชั้นแผนที่',
            instruction: 'กลับไปหน้าแผนที่ แล้วเลือก “ดาวเทียม” จากนั้นสลับกลับเป็น “แผนที่ถนน”',
            expectation: 'ภาพพื้นหลังสลับระหว่างดาวเทียมกับถนน โดยยังแสดงตำแหน่งแปลงที่ดินอยู่',
            imageSrc: '/screenshots/land/Land Reform Officer_Home_Right.webp',
            imageLabel: 'แผนที่และปุ่มควบคุม Community Land Management ใน session เจ้าหน้าที่โครงการปฏิรูปที่ดิน',
          },
        ],
        note: 'Source ปัจจุบันเปิดแผนที่และหน้าสืบค้นให้ประชาชน รายละเอียดแปลงเต็มต้องใช้สิทธิ์เจ้าหน้าที่ README มีวิธีรันและบัญชีจำลองในเครื่อง ส่วนภาพประกอบถ่ายจาก session เจ้าหน้าที่',
      },
      architecture: {
        intro: 'ข้อมูลแปลงมาจาก API ส่วน Leaflet รวมตำแหน่งแปลงกับภาพแผนที่พื้นหลัง',
        nodes: [
          { id: 'browser', label: 'แผนที่และหน้าจอเจ้าหน้าที่', technology: 'Vue 3 · Bulma · Leaflet · Pinia', description: 'แสดงแปลงเป็นพื้นที่หรือหมุด และสลับแผนที่ถนนกับดาวเทียม Vue routes และระบบสิทธิ์ RBAC รองรับผู้ใช้ 4 กลุ่ม (ราษฎร, เจ้าหน้าที่ปฏิรูปที่ดิน, เจ้าหน้าที่ธุรการ และผู้ดูแลระบบ)' },
          { id: 'api', label: 'API ข้อมูลที่ดิน', technology: 'Node.js · Express · REST API', description: 'ยืนยันตัวตนเจ้าหน้าที่ด้วย JWT ตรวจสิทธิ์ตามบทบาท และจัดการ Transaction เชื่อมโยงข้อมูลแปลง ราษฎร ทายาท ภาพถ่ายที่อยู่อาศัย และบันทึกประวัติการแก้ไข โดยผลค้นหาสาธารณะปกปิดเลขบัตรประชาชน' },
          { id: 'database', label: 'ทะเบียนชุมชน', technology: 'MariaDB (alro_land)', description: 'ฐานข้อมูลเชิงสัมพันธ์ 17 ตาราง เก็บแปลงที่ดิน 14 ซอย (ซอย 0–13), พิกัด GIS, เครือญาติราษฎร-ทายาท, สถิติการใช้ประโยชน์ (สวนยาง ผลไม้ ปศุสัตว์), เอกสาร ส.ป.ก. 4-01 และประวัติ Audit Log' },
          { id: 'tiles', label: 'ภาพแผนที่พื้นหลัง', technology: 'OpenStreetMap · Esri', description: 'ส่งภาพแผนที่ถนนหรือดาวเทียมให้ Leaflet ในเบราว์เซอร์โดยตรง ใช้เป็นบริบทของพื้นที่ ส่วนข้อมูลแปลงและทะเบียนชุมชนมาจาก API ของโปรเจกต์' },
        ],
        connections: [
          { from: 'browser', to: 'api', label: 'HTTP API · JWT สำหรับเจ้าหน้าที่' },
          { from: 'api', to: 'database', label: 'Parameterized SQL' },
          { from: 'browser', to: 'tiles', label: 'โหลดภาพถนนและดาวเทียม' },
        ],
        evidence: [
          { label: 'ชั้นแผนที่และการแสดงแปลง', href: 'https://github.com/sing198/land/blob/master/frontend/src/components/map/GisMap.vue' },
          { label: 'Routes ประชาชนและเจ้าหน้าที่', href: 'https://github.com/sing198/land/blob/master/frontend/src/router/index.js' },
          { label: 'โครงสร้าง Back-end และวิธีรัน', href: 'https://github.com/sing198/land#readme' },
        ],
      },
    },
  },
}

export function getProjectExperience(repo, lang) {
  const project = experiences[repo]
  return project ? (project[lang] || project.en) : null
}
