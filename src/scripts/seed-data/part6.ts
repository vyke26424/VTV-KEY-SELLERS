// prisma/seed-data/part6.ts

export const productsPart6 = [
  // ================= CATEGORY: SOFTWARE (PHẦN MỀM & WINDOWS) =================
  {
    name: 'Windows 11 Pro', 
    slug: 'windows-11-pro', 
    categorySlug: 'software',
    description: 'Nâng cấp máy tính của bạn với Windows 11 Pro, hệ điều hành mới nhất và tiên tiến nhất từ Microsoft hiện nay. Với giao diện người dùng được thiết kế lại hiện đại, tối giản và mượt mà, Windows 11 Pro không chỉ mang lại vẻ thẩm mỹ mà còn tối ưu hóa hiệu suất làm việc vượt trội. Key kích hoạt bản quyền vĩnh viễn giúp bạn mở khóa toàn bộ các tính năng bảo mật cao cấp như mã hóa dữ liệu BitLocker, môi trường ảo Windows Sandbox để thử nghiệm phần mềm an toàn và các công cụ quản lý từ xa chuyên nghiệp dành cho doanh nghiệp. Sản phẩm hỗ trợ cập nhật trực tiếp từ Microsoft, đảm bảo bạn luôn nhận được các bản vá lỗi và tính năng mới nhất một cách ổn định.',
    thumbnail: 'https://keyoff.net/wp-content/uploads/2021/10/Key-Windows-11-gia-re.jpg',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["windows", "key", "microsoft"],
    aiMetadata: {
      keywords: ["key win 11", "bản quyền windows", "hệ điều hành"],
      features: ["Bản quyền vĩnh viễn", "Update chính hãng", "Kích hoạt online"],
      suitable_for: ["Người dùng PC", "Laptop mới", "Doanh nghiệp"]
    },
    variants: [
      { name: 'Key Pro Vĩnh Viễn', price: 150000, orginalPrice: 180000 },
      { name: 'Key Home Lên Pro', price: 100000, orginalPrice: 200000 }
    ]
  },
  {
    name: 'Office 365 Family', 
    slug: 'office-365', 
    categorySlug: 'software',
    description: 'Office 365 Family là giải pháp làm việc văn phòng và cộng tác toàn diện nhất hiện nay, mang đến cho bạn bộ ứng dụng bản quyền mới nhất bao gồm Word, Excel, PowerPoint, Outlook và OneNote. Gói Family cho phép nâng cấp trực tiếp trên Email cá nhân chính chủ, cung cấp cho mỗi thành viên 1TB lưu trữ đám mây OneDrive để sao lưu ảnh và dữ liệu quan trọng một cách an toàn tuyệt đối. Điểm ưu việt của gói này là khả năng chia sẻ và sử dụng đồng thời trên 5 thiết bị khác nhau cho mỗi người dùng, từ máy tính, máy tính bảng đến điện thoại, cực kỳ phù hợp cho các hộ gia đình hoặc nhóm làm việc nhỏ muốn tối ưu chi phí.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766673865/familyoffice_yefir8.png',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["office", "microsoft", "google-drive"],
    aiMetadata: {
      keywords: ["word", "excel", "powerpoint", "lưu trữ đám mây"],
      features: ["Full bộ Office mới nhất", "1TB OneDrive", "Chia sẻ 5 thiết bị"],
      suitable_for: ["Gia đình", "Sinh viên", "Nhân viên văn phòng"]
    },
    variants: [
      { name: '1 Tháng (Slot)', price: 45000, orginalPrice: 55000 },
      { name: '6 Tháng (Slot)', price: 150000, orginalPrice: 180000 },
      { name: '1 Năm (Slot)', price: 250000, orginalPrice: 300000 }
    ]
  },
  {
    name: 'IDM License Key', 
    slug: 'idm-key', 
    categorySlug: 'software',
    description: 'Internet Download Manager (IDM) là phần mềm hỗ trợ tải xuống hàng đầu thế giới, sở hữu công nghệ chia nhỏ tệp tin thông minh giúp tăng tốc độ download lên gấp 5 lần so với các trình duyệt thông thường. Key bản quyền IDM cho phép bạn tự động bắt link video từ YouTube và hàng ngàn trang web phim ảnh, âm nhạc một cách dễ dàng. Việc sở hữu bản quyền chính hãng không chỉ giúp bạn loại bỏ hoàn toàn các thông báo dùng thử phiền phức mà còn đảm bảo tính ổn định và bảo mật cho hệ thống. Sản phẩm cam kết kích hoạt chính chủ và bảo hành trọn đời, hỗ trợ bạn quản lý danh sách tải xuống một cách khoa học và chuyên nghiệp nhất.',
    thumbnail: 'https://3.bp.blogspot.com/-UlQVjpBhT44/Th3BOsfBGQI/AAAAAAAAAFM/Ww2qhQgqKI8/s1600/Internet_Download_Manager.jpg',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["idm", "key"],
    aiMetadata: {
      keywords: ["tải nhanh", "bắt link video", "download manager"],
      features: ["Tăng tốc download 500%", "Bắt link Youtube/Phim", "Key chính hãng trọn đời"],
      suitable_for: ["Người hay tải phim", "Game thủ"]
    },
    variants: [
      { name: 'Key 1 Năm', price: 220000, orginalPrice: 265000 },
      { name: 'Key Trọn Đời', price: 430000, orginalPrice: 515000 }
    ]
  },
  {
    name: 'Google One 2TB (Family)', 
    slug: 'google-one-2tb', 
    categorySlug: 'software',
    description: 'Mở rộng không gian lưu trữ cho toàn bộ hệ sinh thái Google của bạn với gói Google One 2TB cao cấp. Với dung lượng cực lớn 2000GB, bạn có thể thoải mái sao lưu hàng ngàn bức ảnh chất lượng gốc, video độ phân giải 4K và các tệp tin nặng trên Drive, Gmail và Google Photos mà không bao giờ phải lo lắng về việc đầy bộ nhớ. Tài khoản được nâng cấp chính chủ từ chính email của bạn, đảm bảo tính an toàn và quyền riêng tư tuyệt đối. Đặc biệt, bạn có thể chia sẻ không gian lưu trữ này với các thành viên trong gia đình, giúp mọi người cùng tận hưởng tiện ích lưu trữ đám mây hàng đầu từ Google.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/2295px-Google_Drive_icon_%282020%29.svg.png',
    isHot: false, 
    avgRating: 4.8, 
    keywordNames: ["google-drive", "software"],
    aiMetadata: {
      keywords: ["lưu trữ đám mây", "google photos", "nâng cấp dung lượng"],
      features: ["Dung lượng 2000GB", "Chia sẻ gia đình", "Sao lưu ảnh gốc"],
      suitable_for: ["Người dùng iPhone/Android", "Nhiếp ảnh gia"]
    },
    variants: [
      { name: '1 Tháng', price: 65000, orginalPrice: 79000 },
      { name: '6 Tháng', price: 250000, orginalPrice: 300000 },
      { name: '1 Năm', price: 450000, orginalPrice: 540000 }
    ]
  },
  {
    name: 'JetBrains All Products Pack', 
    slug: 'jetbrains-all-apps', 
    categorySlug: 'software',
    description: 'Bộ công cụ tối thượng dành cho các nhà phát triển phần mềm chuyên nghiệp, gói All Products Pack cung cấp quyền truy cập đầy đủ vào hơn 15 IDE và công cụ lập trình hàng đầu từ JetBrains. Từ IntelliJ IDEA cho Java, PyCharm cho Python đến WebStorm cho JavaScript, mọi công cụ đều được tích hợp trí tuệ nhân tạo để gợi ý code thông minh, kiểm tra lỗi thời gian thực và tối ưu hóa quy trình phát triển dự án. Đây là sự lựa chọn không thể thay thế để tăng tối đa năng suất viết mã, giúp các lập trình viên tập trung vào việc sáng tạo logic thay vì các thao tác thủ công phức tạp.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675187/jet_cdaphk.jpg',
    isHot: false, 
    avgRating: 4.9, 
    keywordNames: ["jetbrains", "software"],
    aiMetadata: {
      keywords: ["công cụ lập trình", "intellij", "pycharm", "webstorm"],
      features: ["Full bộ 15+ IDE", "Gợi ý code thông minh", "Update phiên bản mới nhất"],
      suitable_for: ["Lập trình viên chuyên nghiệp", "Công ty công nghệ"]
    },
    variants: [
      { name: '1 Tháng', price: 150000, orginalPrice: 180000 },
      { name: '6 Tháng', price: 550000, orginalPrice: 660000 },
      { name: '1 Năm (Cá nhân)', price: 950000, orginalPrice: 1140000 }
    ]
  },
  {
    name: 'VMware Workstation Pro 17', 
    slug: 'vmware-workstation-pro', 
    categorySlug: 'software',
    description: 'VMware Workstation Pro 17 là phần mềm ảo hóa mạnh mẽ nhất hiện nay, được thiết kế chuyên biệt cho các kỹ sư hệ thống, lập trình viên và chuyên gia bảo mật. Phần mềm cho phép bạn chạy đồng thời nhiều hệ điều hành khác nhau như các bản phân phối Linux, Windows Server hay các phiên bản Windows cũ trên cùng một máy tính vật lý duy nhất mà không cần khởi động lại. Đây là công cụ lý tưởng để xây dựng môi trường lab thử nghiệm phần mềm, mô phỏng mạng lưới mạng phức tạp hoặc triển khai các ứng dụng trong môi trường cách ly an toàn tuyệt đối.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676228/vmware_j5dcjo.png',
    isHot: false, 
    avgRating: 4.8, 
    keywordNames: ["vmware", "software"],
    aiMetadata: {
      keywords: ["máy ảo vps", "chạy linux trên windows", "test phần mềm"],
      features: ["Chạy nhiều hệ điều hành cùng lúc", "Hỗ trợ ảo hóa mạnh mẽ", "Kết nối mạng máy ảo"],
      suitable_for: ["IT Admin", "DevOps", "Người nghiên cứu bảo mật"]
    },
    variants: [
      { name: 'Key Vĩnh Viễn', price: 250000, orginalPrice: 300000 }
    ]
  },
  {
    name: 'WinRAR License', 
    slug: 'winrar-license-key', 
    categorySlug: 'software',
    description: 'Sở hữu WinRAR bản quyền để trải nghiệm công cụ nén và giải nén tệp tin phổ biến nhất thế giới một cách trọn vẹn. WinRAR hỗ trợ hầu hết các định dạng nén hiện nay như RAR, ZIP, CAB, 7Z với tốc độ xử lý cực nhanh. Việc kích hoạt key bản quyền giúp bạn loại bỏ vĩnh viễn các thông báo yêu cầu mua hàng gây phiền toái mỗi khi mở ứng dụng, đồng thời mở khóa các tính năng bảo mật cao cấp như mã hóa tệp tin với thuật toán mạnh mẽ để bảo vệ dữ liệu khi gửi qua internet. Đây là phần mềm cơ bản nhưng vô cùng thiết yếu cho mọi người dùng máy tính để tối ưu hóa không gian lưu trữ.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/7/70/WinRAR_5.0_icon.png',
    isHot: false, 
    avgRating: 4.7, 
    keywordNames: ["winrar", "software"],
    aiMetadata: {
      keywords: ["nén file", "giải nén rar", "winrar bản quyền"],
      features: ["Xóa thông báo dùng thử", "Nén file cực nhanh", "Mã hóa tệp tin"],
      suitable_for: ["Mọi người dùng máy tính"]
    },
    variants: [
      { name: 'Key Vĩnh Viễn', price: 100000, orginalPrice: 120000 }
    ]
  },
  {
    name: 'CleanMyMac X (Bản Quyền)', 
    slug: 'clean-my-mac-x-key', 
    categorySlug: 'software',
    description: 'CleanMyMac X là giải pháp tối ưu hóa và dọn dẹp hệ thống toàn diện dành riêng cho hệ điều hành macOS. Được thiết kế với giao diện tinh tế và dễ sử dụng, phần mềm giúp bạn quét và loại bỏ hàng chục gigabyte tệp tin rác, tệp đệm và các ứng dụng không cần thiết chỉ sau một cú nhấp chuột. Bên cạnh việc giải phóng dung lượng, CleanMyMac X còn bảo vệ máy Mac của bạn khỏi các loại mã độc (Malware), quản lý các ứng dụng chạy ngầm và tối ưu hóa bộ nhớ RAM, đảm bảo chiếc MacBook hay iMac của bạn luôn hoạt động mượt mà và nhanh chóng như lúc mới khui hộp.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676671/cleanmymac_yrneeh.jpg',
    isHot: false, 
    avgRating: 4.8, 
    keywordNames: ["windows", "key"],
    aiMetadata: {
      keywords: ["tối ưu macos", "dọn rác máy tính", "tăng tốc macbook"],
      features: ["Dọn rác hệ thống thông minh", "Gỡ ứng dụng triệt để", "Quét Malware thời gian thực"],
      suitable_for: ["Người dùng Macbook/iMac", "Thiết kế đồ họa"]
    },
    variants: [
      { name: '1 Tháng', price: 65000, orginalPrice: 79000 },
      { name: '6 Tháng', price: 280000, orginalPrice: 336000 },
      { name: 'Gói 1 Năm / 1 Mac', price: 450000, orginalPrice: 540000 }
    ]
  }
];